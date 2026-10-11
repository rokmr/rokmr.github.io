// GPU renderer for the live samples. Each particle's [x0, y0, x1, y1, b]
// record is uploaded once per sample draw; the vertex shader computes
//   x_t = lerp(A, B, t) + ((1 − t)·x0 + t·x1)·s
// so a frame is one draw call and no per-particle JavaScript. That lets the
// figure carry 5-10x the samples of the 2-D canvas renderer, which is what
// makes the picture sharp. Rings, arrows and labels stay on a 2-D canvas
// layered on top.
//
// Returns null when WebGL2 is unavailable; the controller then falls back to
// drawing samples on the 2-D canvas.

import type { Geometry } from './geometry';
import { STRIDE, type Particles } from './particles';

export type PointRenderer = {
  setParticles(particles: Particles): void;
  /** Backing-store size in device pixels. */
  resize(width: number, height: number): void;
  draw(g: Geometry, t: number, opacity: number, dpr: number): void;
  /** True once the context is lost; the caller should fall back. */
  readonly lost: boolean;
  destroy(): void;
};

const VERT = `#version 300 es
layout(location = 0) in vec2 a_x0;
layout(location = 1) in vec2 a_x1;
layout(location = 2) in float a_b;
uniform vec2 u_res;     // CSS px
uniform vec2 u_a;       // where p0 is drawn
uniform vec2 u_b;       // where p1 is drawn
uniform float u_s;      // px per normalised unit
uniform float u_t;
uniform float u_size;   // device px
uniform float u_alpha;
out float v_grey;
out float v_alpha;
void main() {
  vec2 p = mix(u_a, u_b, u_t) + mix(a_x0, a_x1, u_t) * u_s;
  vec2 clip = p / u_res * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
  gl_PointSize = u_size;
  // Noise is a flat mid-grey; the picture's own tone comes in with t.
  v_grey = mix(0.6, a_b, u_t);
  v_alpha = u_alpha;
}`;

const FRAG = `#version 300 es
precision mediump float;
in float v_grey;
in float v_alpha;
out vec4 o;
void main() {
  // Soft round dot; premultiplied so overlapping linework builds up cleanly.
  float d = length(gl_PointCoord - 0.5);
  float a = v_alpha * (1.0 - smoothstep(0.28, 0.5, d));
  o = vec4(vec3(v_grey) * a, a);
}`;

/** Dot diameter in CSS px. */
const POINT_SIZE = 1.5;
/**
 * Per-dot opacity at a reference density; denser clouds get fainter dots so
 * the picture's overall brightness does not change with the budget.
 */
const ALPHA_AT_REF = 0.62;
const REF_COUNT = 20000;

function compile(gl: WebGL2RenderingContext, type: number, src: string): WebGLShader | null {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.warn('flow figure: shader failed', gl.getShaderInfoLog(sh));
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

export function createPointRenderer(canvas: HTMLCanvasElement): PointRenderer | null {
  const gl = canvas.getContext('webgl2', {
    alpha: true,
    premultipliedAlpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: 'low-power',
  });
  if (!gl) return null;

  const vs = compile(gl, gl.VERTEX_SHADER, VERT);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
  const program = gl.createProgram();
  if (!vs || !fs || !program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.warn('flow figure: program failed', gl.getProgramInfoLog(program));
    return null;
  }

  const u = (name: string) => gl.getUniformLocation(program, name);
  const loc = {
    res: u('u_res'),
    a: u('u_a'),
    b: u('u_b'),
    s: u('u_s'),
    t: u('u_t'),
    size: u('u_size'),
    alpha: u('u_alpha'),
  };

  const vao = gl.createVertexArray();
  const vbo = gl.createBuffer();
  gl.bindVertexArray(vao);
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  const bytes = STRIDE * 4;
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, bytes, 0); // x0, y0
  gl.enableVertexAttribArray(1);
  gl.vertexAttribPointer(1, 2, gl.FLOAT, false, bytes, 8); // x1, y1
  gl.enableVertexAttribArray(2);
  gl.vertexAttribPointer(2, 1, gl.FLOAT, false, bytes, 16); // brightness
  gl.bindVertexArray(null);

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

  let count = 0;
  let lost = false;
  const onLost = (e: Event) => {
    e.preventDefault();
    lost = true;
  };
  canvas.addEventListener('webglcontextlost', onLost);

  return {
    get lost() {
      return lost;
    },
    setParticles(p) {
      if (lost) return;
      gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
      gl.bufferData(gl.ARRAY_BUFFER, p.data, gl.STATIC_DRAW);
      count = p.count;
    },
    resize(width, height) {
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    },
    draw(g, t, opacity, dpr) {
      if (lost) return;
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      if (!count || opacity <= 0) return;
      gl.useProgram(program);
      gl.uniform2f(loc.res, g.w, g.h);
      gl.uniform2f(loc.a, g.ax, g.ay);
      gl.uniform2f(loc.b, g.bx, g.by);
      gl.uniform1f(loc.s, g.s);
      gl.uniform1f(loc.t, t);
      gl.uniform1f(loc.size, POINT_SIZE * dpr);
      const density = Math.min(1, Math.sqrt(REF_COUNT / count));
      gl.uniform1f(loc.alpha, ALPHA_AT_REF * density * (0.75 + 0.25 * t) * opacity);
      gl.bindVertexArray(vao);
      gl.drawArrays(gl.POINTS, 0, count);
      gl.bindVertexArray(null);
    },
    destroy() {
      canvas.removeEventListener('webglcontextlost', onLost);
      gl.deleteBuffer(vbo);
      gl.deleteVertexArray(vao);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    },
  };
}
