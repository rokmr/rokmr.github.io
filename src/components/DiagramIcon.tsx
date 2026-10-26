/** Streamline Core Line (CC BY 4.0); attribution accompanies diagram pages. */
export const diagramIconNames = ["help-chat-2", "pencil", "magnifying-glass", "filter-2", "new-file", "multiple-file-2", "page-setting", "layers-1", "database", "computer-chip-1", "cog", "input-box", "database-server-1"] as const;
export type DiagramIconName = typeof diagramIconNames[number];

export function DiagramIcon({ name }: { name: DiagramIconName }) {
  return <svg className="diagram-stage-symbol" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" focusable="false">
    <use href={`${import.meta.env.BASE_URL}assets/icons/streamline-core.svg#${name}`} />
  </svg>;
}
