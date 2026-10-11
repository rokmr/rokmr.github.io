import type { Preview } from '../data/projects';

/**
 * Renders a <picture> when a webp variant exists, a plain <img> otherwise —
 * matching the original markup exactly.
 */
export function Picture({ preview, className }: { preview: Preview; className?: string }) {
  const img = (
    <img
      src={preview.src}
      alt={preview.alt}
      width={preview.width}
      height={preview.height}
      loading="lazy"
      decoding="async"
      className={className}
    />
  );

  if (!preview.webp) return img;

  return (
    <picture>
      <source srcSet={preview.webp} type="image/webp" />
      {img}
    </picture>
  );
}
