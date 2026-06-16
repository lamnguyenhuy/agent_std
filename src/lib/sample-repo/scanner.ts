import type {
  DetectedFile,
  DetectedFileGroup,
  SampleRepoFile,
} from "./fixtures"

type DetectionRule = {
  groupId: string
  groupLabel: string
  matches: (path: string) => boolean
  type: DetectedFile["type"]
}

const configuredDocPaths = new Set([
  "docs/architecture.md",
  "docs/conventions.md",
  "docs/glossary.md",
])

const detectionRules: DetectionRule[] = [
  {
    groupId: "claude-instructions",
    groupLabel: "Claude instructions",
    matches: (path) => path.replace(/\\/g, "/").toLowerCase() === "claude.md",
    type: "Claude instructions",
  },
  {
    groupId: "cursor-rules",
    groupLabel: "Cursor rules",
    matches: (path) => path.replace(/\\/g, "/").toLowerCase() === ".cursorrules",
    type: "Cursor rules",
  },
  {
    groupId: "claude-skills",
    groupLabel: "Claude skills",
    matches: (path) => {
      const p = path.replace(/\\/g, "/").toLowerCase()
      return (
        p.startsWith(".claude/skills/") &&
        p.endsWith(".md") &&
        p !== ".claude/skills/.md" &&
        p.slice(".claude/skills/".length).split("/").length === 1
      )
    },
    type: "Claude skill",
  },
  {
    groupId: "docs-context",
    groupLabel: "Docs context",
    matches: (path) => {
      const p = path.replace(/\\/g, "/").toLowerCase()
      return configuredDocPaths.has(p)
    },
    type: "Project docs",
  },
]

export function scanSampleRepoFiles(files: SampleRepoFile[]): DetectedFile[] {
  if (!files) return []
  const filePaths = new Set(
    files.filter((file) => file != null && file.path != null).map((file) => file.path)
  )
  const detectedFiles: DetectedFile[] = []

  for (const rule of detectionRules) {
    const matchingPaths = [...filePaths].filter(rule.matches).sort()

    for (const path of matchingPaths) {
      detectedFiles.push({
        path,
        type: rule.type,
        status: "detected",
      })
    }
  }

  return detectedFiles
}

export function groupDetectedFiles(files: DetectedFile[]): DetectedFileGroup[] {
  if (!files) return []
  return detectionRules
    .map((rule) => ({
      id: rule.groupId,
      label: rule.groupLabel,
      files: files.filter((file) => file != null && file.type === rule.type),
    }))
    .filter((group) => group.files.length > 0)
}
