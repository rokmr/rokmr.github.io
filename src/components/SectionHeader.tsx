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
      <span className="section-title">{title}</span>
      <div className="section-line" />
    </div>
  );
}
