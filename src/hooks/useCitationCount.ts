import { useEffect, useState } from 'react';

/**
 * Live citation count from Semantic Scholar, falling back to the prerendered
 * value. Only ever increases the displayed number, so a cold or failing API
 * response cannot make the count look worse than the committed fallback.
 */
export function useCitationCount(arxivId: string, fallback: number): number {
  const [count, setCount] = useState(fallback);

  useEffect(() => {
    const controller = new AbortController();

    fetch(
      `https://api.semanticscholar.org/graph/v1/paper/arXiv:${arxivId}?fields=citationCount`,
      { signal: controller.signal },
    )
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { citationCount?: number } | null) => {
        const live = data?.citationCount;
        if (typeof live === 'number' && live > fallback) setCount(live);
      })
      .catch(() => {}); // silent — keeps the fallback count

    return () => controller.abort();
  }, [arxivId, fallback]);

  return count;
}
