// ============================================
// Lorenz-attractor particle system (flow-matching visual)
// ============================================
// Ported from the original script.js. The maths, typed-array layout and
// draw-call batching are unchanged — only the globals became parameters so the
// simulation can be created, resized and disposed by a React effect.

export type Particles = {
  /** Flat [nx, ny, tx, ty, b] per particle — cache-friendly, no GC churn. */
  readonly data: Float32Array;
  readonly count: number;
};

export type VectorFieldArrow = { cx: number; cy: number; vx: number; vy: number };

export type Viewport = {
  w: number;
  h: number;
  centerX: number;
  centerY: number;
  scale: number;
};

/** Particle budget by viewport width: same visual cloud, lighter per-frame cost. */
export function particleBudget(width: number): number {
  if (width < 480) return 5000;
  if (width < 768) return 8000;
  if (width < 1200) return 12000;
  return 16000;
}

export function measureViewport(width: number, height: number): Viewport {
  return {
    w: width,
    h: height,
    centerX: width * 0.72,
    centerY: height * 0.5,
    scale: Math.min(width, height) * 0.28,
  };
}

/** Samples the Lorenz attractor into normalised butterfly target points. */
function generateButterfly(): { x: number; y: number; b: number }[] {
  const points: { x: number; y: number; b: number }[] = [];

  const sigma = 10;
  const rho = 28;
  const beta = 8 / 3;
  const dt = 0.004;
  let x = 0.1;
  let y = 0;
  let z = 0;

  // Settle onto the attractor before sampling.
  for (let i = 0; i < 2500; i++) {
    const dx = sigma * (y - x);
    const dy = x * (rho - z) - y;
    const dz = x * y - beta * z;
    x += dx * dt;
    y += dy * dt;
    z += dz * dt;
  }

  const lorenzScale = 0.035;

  for (let i = 0; i < 30000; i++) {
    const dx = sigma * (y - x);
    const dy = x * (rho - z) - y;
    const dz = x * y - beta * z;
    x += dx * dt;
    y += dy * dt;
    z += dz * dt;

    const nx = x * lorenzScale;
    const ny = -(z - 25) * lorenzScale;

    if (nx >= -0.85 && nx <= 0.85 && ny >= -0.85 && ny <= 0.85) {
      points.push({ x: nx, y: ny, b: 0.8 });
    }
  }

  return points;
}

export function createParticles(count: number): Particles {
  const targetPoints = generateButterfly();
  const data = new Float32Array(count * 5);

  for (let i = 0; i < count; i++) {
    const noiseR = Math.sqrt(-2 * Math.log(Math.random())) * 0.55;
    const noiseTheta = Math.random() * Math.PI * 2;
    const off = i * 5;

    data[off] = noiseR * Math.cos(noiseTheta);
    data[off + 1] = noiseR * Math.sin(noiseTheta);

    if (i < targetPoints.length) {
      const tp = targetPoints[i]!;
      data[off + 2] = tp.x;
      data[off + 3] = tp.y;
      data[off + 4] = tp.b;
    } else {
      const angle = Math.random() * Math.PI * 2;
      const r = 1.1 + Math.random() * 0.25;
      data[off + 2] = Math.cos(angle) * r;
      data[off + 3] = Math.sin(angle) * r;
      data[off + 4] = 0.12;
    }
  }

  // Sort by target brightness so adjacent particles share a colour bucket;
  // fillStyle then changes ~32 times per frame instead of thousands.
  // Uint16Array would overflow above 65536 particles, so index with Uint32Array.
  const idx = new Uint32Array(count);
  for (let i = 0; i < count; i++) idx[i] = i;
  idx.sort((a, b) => data[a * 5 + 4]! - data[b * 5 + 4]!);

  const sorted = new Float32Array(count * 5);
  for (let i = 0; i < count; i++) {
    const src = idx[i]! * 5;
    const dst = i * 5;
    sorted[dst] = data[src]!;
    sorted[dst + 1] = data[src + 1]!;
    sorted[dst + 2] = data[src + 2]!;
    sorted[dst + 3] = data[src + 3]!;
    sorted[dst + 4] = data[src + 4]!;
  }
  data.set(sorted);

  return { data, count };
}

export const VF_GRID_N = 18; // 18x18 = 324 cells
const VF_RANGE = 0.95;
export const VF_CELL_SIZE = (VF_RANGE * 2) / VF_GRID_N;

/** Bins particle velocities (target − noise) into a grid to draw flow arrows. */
export function buildVectorField({ data, count }: Particles): VectorFieldArrow[] {
  const bins = Array.from({ length: VF_GRID_N * VF_GRID_N }, () => ({ vx: 0, vy: 0, n: 0 }));

  for (let i = 0; i < count; i++) {
    const off = i * 5;
    const nx = data[off]!;
    const ny = data[off + 1]!;
    const tx = data[off + 2]!;
    const ty = data[off + 3]!;

    // Bin by trajectory midpoint.
    const mx = (nx + tx) / 2;
    const my = (ny + ty) / 2;
    const gi = Math.floor(((mx + VF_RANGE) / (VF_RANGE * 2)) * VF_GRID_N);
    const gj = Math.floor(((my + VF_RANGE) / (VF_RANGE * 2)) * VF_GRID_N);

    if (gi >= 0 && gi < VF_GRID_N && gj >= 0 && gj < VF_GRID_N) {
      const bin = bins[gj * VF_GRID_N + gi]!;
      bin.vx += tx - nx;
      bin.vy += ty - ny;
      bin.n++;
    }
  }

  const field: VectorFieldArrow[] = [];
  for (let j = 0; j < VF_GRID_N; j++) {
    for (let i = 0; i < VF_GRID_N; i++) {
      const bin = bins[j * VF_GRID_N + i]!;
      if (bin.n === 0) continue;
      field.push({
        cx: -VF_RANGE + (i + 0.5) * VF_CELL_SIZE,
        cy: -VF_RANGE + (j + 0.5) * VF_CELL_SIZE,
        vx: bin.vx / bin.n,
        vy: bin.vy / bin.n,
      });
    }
  }
  return field;
}

const NBUCKETS = 32;

/** Draws one frame at interpolation position `t` (0 = noise, 1 = butterfly). */
export function drawFrame(
  ctx: CanvasRenderingContext2D,
  view: Viewport,
  particles: Particles,
  vectorField: VectorFieldArrow[],
  t: number,
  opacity: number,
): void {
  const { w, h, centerX, centerY, scale } = view;

  ctx.fillStyle = '#0a0a0a';
  ctx.fillRect(0, 0, w, h);

  if (opacity <= 0) return;
  ctx.globalAlpha = opacity;

  // Grid, batched into a single stroke.
  const gridExtent = scale * 0.95;
  const gridLines = 8;
  const gridStep = (gridExtent * 2) / gridLines;
  const gridAlpha = 0.04 + t * 0.025;

  const gridPath = new Path2D();
  for (let i = 0; i <= gridLines; i++) {
    const gx = centerX - gridExtent + i * gridStep;
    gridPath.moveTo(gx, centerY - gridExtent);
    gridPath.lineTo(gx, centerY + gridExtent);
    const gy = centerY - gridExtent + i * gridStep;
    gridPath.moveTo(centerX - gridExtent, gy);
    gridPath.lineTo(centerX + gridExtent, gy);
  }
  ctx.strokeStyle = `rgba(255,255,255,${gridAlpha})`;
  ctx.lineWidth = 0.5;
  ctx.stroke(gridPath);

  const axesPath = new Path2D();
  axesPath.moveTo(centerX - gridExtent, centerY);
  axesPath.lineTo(centerX + gridExtent, centerY);
  axesPath.moveTo(centerX, centerY - gridExtent);
  axesPath.lineTo(centerX, centerY + gridExtent);
  ctx.strokeStyle = `rgba(255,255,255,${gridAlpha * 1.8})`;
  ctx.lineWidth = 0.6;
  ctx.stroke(axesPath);

  // Particles. fillRect is 10-20x faster than arc() at sub-pixel sizes; a
  // 0.8x0.8 square matches the visual weight of the original r=0.55 circle.
  const { data, count } = particles;
  const oneMinusT = 1 - t;
  const alphaBase = 0.28 + t * 0.45;
  const tGreenR = 1 - t * 0.15;
  const tGreenB = 1 - t * 0.2;
  const pSize = 0.8;
  const pHalf = pSize * 0.5;

  const bucketColors = new Array<string>(NBUCKETS);
  for (let bi = 0; bi < NBUCKETS; bi++) {
    const gray = (bi / (NBUCKETS - 1)) * 255;
    const r = (gray * tGreenR) | 0;
    const g = gray | 0;
    const b = (gray * tGreenB) | 0;
    bucketColors[bi] = `rgba(${r},${g},${b},${alphaBase.toFixed(2)})`;
  }

  let prevBucket = -1;
  for (let i = 0; i < count; i++) {
    const off = i * 5;
    const x = centerX + (oneMinusT * data[off]! + t * data[off + 2]!) * scale;
    const y = centerY + (oneMinusT * data[off + 1]! + t * data[off + 3]!) * scale;
    const brightness = oneMinusT * (0.28 + Math.random() * 0.18) + t * data[off + 4]!;
    const bi = (brightness * NBUCKETS) | 0; // fast floor
    const clamped = bi < 0 ? 0 : bi >= NBUCKETS ? NBUCKETS - 1 : bi;
    if (clamped !== prevBucket) {
      ctx.fillStyle = bucketColors[clamped]!;
      prevBucket = clamped;
    }
    ctx.fillRect(x - pHalf, y - pHalf, pSize, pSize);
  }

  // Flow-matching arrows, fading out as the cloud resolves.
  const arrowAlpha = Math.max(0, (1 - t) * 0.45);
  if (arrowAlpha > 0.01) {
    const maxArrowLen = scale * VF_CELL_SIZE * 0.8;
    const headLen = 3;

    ctx.strokeStyle = `rgba(74, 222, 128, ${arrowAlpha})`;
    ctx.fillStyle = `rgba(74, 222, 128, ${arrowAlpha})`;
    ctx.lineWidth = 0.8;

    const linePath = new Path2D();
    const headPath = new Path2D();

    for (const v of vectorField) {
      const ox = centerX + v.cx * scale;
      const oy = centerY + v.cy * scale;
      const vx = v.vx * scale;
      const vy = v.vy * scale;
      const mag = Math.sqrt(vx * vx + vy * vy);
      if (mag < 0.5) continue;

      const len = Math.min(mag * 0.18, maxArrowLen);
      const nx = vx / mag;
      const ny = vy / mag;
      const ex = ox + nx * len;
      const ey = oy + ny * len;

      linePath.moveTo(ox, oy);
      linePath.lineTo(ex, ey);

      headPath.moveTo(ex, ey);
      headPath.lineTo(
        ex - nx * headLen - ny * headLen * 0.4,
        ey - ny * headLen + nx * headLen * 0.4,
      );
      headPath.lineTo(
        ex - nx * headLen + ny * headLen * 0.4,
        ey - ny * headLen - nx * headLen * 0.4,
      );
      headPath.closePath();
    }

    ctx.stroke(linePath);
    ctx.fill(headPath);
  }

  ctx.globalAlpha = 1;
}
