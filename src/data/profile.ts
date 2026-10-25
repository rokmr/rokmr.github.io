// Import the reviewed projection only. Never import content/private here.
import profile from '../../content/generated/public-profile.json';

export { profile as publicProfile };

/** Keep existing URL anchors while the old detail records are migrated. */
export function publicRoleFor(legacyId: string) {
  const id = legacyId === 'iisc' ? 'iisc-ta' : legacyId;
  return profile.records.find((record) => record.kind === 'employment' && record.id === id);
}
