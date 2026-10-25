import { sectionMeta, type SectionId } from '../data/site';

/**
 * The numbered rule above each section. The number and title come from the
 * section table so they always match the page order.
 */
export function SectionHeader({ id }: { id: SectionId }) {
  const { number, title } = sectionMeta(id);
  return (
    <div className="section-header">
      <span className="section-number">{number}</span>
      <h2 className="section-title">{title}</h2>
      <div className="section-line" />
    </div>
  );
}
