export type ImportedSectionTitle = "Skills" | "Agents" | "Context"

const populatedReadOnlyAffordance =
  "Imported from the Sample Repo. Rules are the only editable section in this MVP."

const emptyStateByTitle: Record<ImportedSectionTitle, string> = {
  Agents: "No imported Agents were generated from the Sample Repo.",
  Context: "No imported Context references were found in the Sample Repo.",
  Skills: "No imported Skills were found in the Sample Repo.",
}

export function getImportedSectionAffordance(
  title: ImportedSectionTitle,
  itemCount: number
) {
  return itemCount > 0 ? populatedReadOnlyAffordance : emptyStateByTitle[title]
}

export function getImportedSectionEmptyState(title: ImportedSectionTitle) {
  return emptyStateByTitle[title]
}
