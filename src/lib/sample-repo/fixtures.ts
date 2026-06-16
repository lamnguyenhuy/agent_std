import { groupDetectedFiles, scanSampleRepoFiles } from "./scanner"

export type DetectedFileStatus = "detected" | "imported" | "ready"

export type DetectedFile = {
  path: string
  type: "Claude instructions" | "Cursor rules" | "Claude skill" | "Project docs"
  status: DetectedFileStatus
}

export type DetectedFileGroup = {
  id: string
  label: string
  files: DetectedFile[]
}

export type PlaybookSectionStatus =
  | "pending"
  | "imported"
  | "read-only"
  | "editable"
  | "enabled"

export const PLAYBOOK_SECTION_NAMES = [
  "Skills",
  "Agents",
  "Rules",
  "Context",
  "Tool Translators",
] as const

export type PlaybookSection = {
  name: (typeof PLAYBOOK_SECTION_NAMES)[number]
  status: PlaybookSectionStatus
}

export type SampleRepoWorkspace = {
  name: string
  description: string
  repoStatus: string
  importStatus: string
  playbookStatus: string
  playbookReadiness: string
  playbookSections: PlaybookSection[]
  detectedFileGroups: DetectedFileGroup[]
}

export type SampleRepoFile = {
  path: string
  content: string
}

export const sampleRepoFiles: SampleRepoFile[] = [
  {
    path: "CLAUDE.md",
    content: "Use the project standards before editing code.",
  },
  {
    path: ".cursorrules",
    content: "Prefer small focused changes and keep tests current.",
  },
  {
    path: ".claude/skills/code-review.md",
    content: "Review for correctness, maintainability, and test coverage.",
  },
  {
    path: ".claude/skills/test-writer.md",
    content: "Write focused tests for behavior and edge cases.",
  },
  {
    path: "docs/architecture.md",
    content: "The app uses a client-heavy Next.js architecture.",
  },
  {
    path: "docs/conventions.md",
    content: "Use TypeScript, Tailwind, and accessible controls.",
  },
  {
    path: "docs/glossary.md",
    content: "Agent Playbook is the canonical repo behavior file.",
  },
  {
    path: "README.md",
    content: "Unknown project documentation ignored by the MVP scanner.",
  },
  {
    path: "docs/random-notes.md",
    content: "Unknown docs are ignored unless configured.",
  },
  {
    path: ".claude/skills/archive/old.md",
    content: "Nested skill files are ignored in the MVP scanner.",
  },
  {
    path: ".claude/skills/not-markdown.txt",
    content: "Non-Markdown skill files are ignored.",
  },
  {
    path: "packages/web/CLAUDE.md",
    content: "Nested tool config is ignored in MVP.",
  },
]

export const sampleRepoWorkspace: SampleRepoWorkspace = {
  name: "sample-nextjs-repo",
  description: "Sample Repo is controlled demo data",
  repoStatus: "Sample Repo loaded",
  importStatus: "Detected files ready for Playbook creation",
  playbookStatus: "No Playbook yet",
  playbookReadiness: "Ready to create .agent-studio/playbook.yaml",
  playbookSections: [
    { name: "Skills", status: "pending" },
    { name: "Agents", status: "pending" },
    { name: "Rules", status: "pending" },
    { name: "Context", status: "pending" },
    { name: "Tool Translators", status: "pending" },
  ],
  get detectedFileGroups() {
    return groupDetectedFiles(scanSampleRepoFiles(sampleRepoFiles))
  },
}
