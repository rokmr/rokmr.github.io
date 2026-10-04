export function SectionHeader({ number, title }: { number: string; title: string }) {
  return (
    <div className="section-header">
      <span className="section-number">{number}</span>
      <span className="section-title">{title}</span>
      <div className="section-line" />
    </div>
  );
}
