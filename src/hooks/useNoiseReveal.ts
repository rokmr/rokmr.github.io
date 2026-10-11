import { useEffect } from 'react';

/** Grain texture size — near the cards' own resolution, so the grain is fine. */
const NOISE_W = 400;
const NOISE_H = 225;
/** Grey level of the grain: dark, centred near the card surface, so it reads as grain, not static. */
const NOISE_MEAN = 46;
const NOISE_SD = 30;

let noiseUrl: Promise<string> | null = null;

/** Gaussian grey noise, generated once per page and shared by every card. */
function noiseTexture(): Promise<string> {
  noiseUrl ??= new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = NOISE_W;
    canvas.height = NOISE_H;
    const ctx = canvas.getContext('2d');
    if (!ctx) return resolve('');
    const img = ctx.createImageData(NOISE_W, NOISE_H);
    for (let i = 0; i < img.data.length; i += 4) {
      const g = Math.sqrt(-2 * Math.log(1 - Math.random())) * Math.cos(2 * Math.PI * Math.random());
      const v = Math.max(0, Math.min(255, NOISE_MEAN + g * NOISE_SD));
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
      img.data[i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    canvas.toBlob((blob) => resolve(blob ? URL.createObjectURL(blob) : ''));
  });
  return noiseUrl;
}

/**
 * Generates elements into view the way Figure 1 generates its picture: a
 * noise layer over the element fades from opacity 1 to 0, which composites
 * to x_t = (1 − t)·noise + t·image at every pixel. Runs once per element.
 *
 * Targets are `[data-noise-reveal]` elements containing a
 * `.noise-reveal__layer`. Elements already on screen when this runs, and
 * readers who prefer reduced motion, are left alone (no noise, no flash).
 */
export function useNoiseReveal() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-noise-reveal]'));
    if (!els.length) return;

    let observer: IntersectionObserver | null = null;
    let cancelled = false;

    void noiseTexture().then((url) => {
      if (cancelled || !url) return;
      document.documentElement.style.setProperty('--noise-texture', `url(${url})`);

      const offscreen = els.filter((el) => {
        const r = el.getBoundingClientRect();
        return r.top > window.innerHeight || r.bottom < 0;
      });
      // Cover them with noise now, before they can be seen.
      offscreen.forEach((el) => (el.dataset.noiseReveal = 'pending'));

      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            (entry.target as HTMLElement).dataset.noiseReveal = 'done';
            observer?.unobserve(entry.target);
          }
        },
        { threshold: 0.35 },
      );
      offscreen.forEach((el) => observer?.observe(el));
    });

    return () => {
      cancelled = true;
      observer?.disconnect();
    };
  }, []);
}
