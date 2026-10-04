import { useEffect, useState } from 'react';

/**
 * `buildYear` ships in the prerendered HTML; the effect corrects it after
 * hydration so a page cached across New Year still shows the right year
 * without causing a hydration mismatch.
 */
export function Footer({ buildYear }: { buildYear: number }) {
  const [year, setYear] = useState(buildYear);
  useEffect(() => setYear(new Date().getFullYear()), []);

  return (
    <footer>
      <p>
        © <span>{year}</span>
        {' Rohit Kumar · Handcrafted with '}
        <span className="ai-badge">PyTorch-level</span> attention to detail
      </p>
    </footer>
  );
}
