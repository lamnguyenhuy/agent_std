import type { DetectedFile, SampleRepoFile } from "@/lib/sample-repo/fixtures"

import {
  AgentPlaybookSchema,
  type AgentPlaybook,
  type PlaybookAgent,
  type PlaybookContext,
  type PlaybookRule,
  type PlaybookSkill,
  type ToolTranslator,
} from "@/lib/playbook/schema"

const defaultRepoName = "sample-nextjs-repo"

function normalizePath(path: string) {
  return path.replace(/\\/g, "/")
}

function toContentMap(files: SampleRepoFile[] = []) {
  return new Map(
    files
      .filter((file) => file != null && file.path != null)
      .map((file) => [normalizePath(file.path), file.content] as const)
  )
}

function getFileContent(
  contentByPath: Map<string, string>,
  path: string,
  fallback: string
) {
  return contentByPath.get(normalizePath(path))?.trim() || fallback
}

function createId(prefix: string, value: string) {
  return `${prefix}-${normalizePath(value)
    .toLowerCase()
    .replace(/\.md$/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")}`
}

function createRuleId(path: string) {
  const normalizedPath = normalizePath(path)

  if (normalizedPath.toLowerCase() === "claude.md") {
    return "rule-claude-md"
  }

  if (normalizedPath.toLowerCase() === ".cursorrules") {
    return "rule-cursorrules"
  }

  return createId("rule", normalizedPath)
}

function createSkillId(path: string) {
  return createId(
    "skill",
    normalizePath(path).split("/").pop()?.replace(/\.md$/i, "") || path
  )
}

function createContextId(path: string) {
  return createId("context", createContextLabel(path))
}

function createContextLabel(path: string) {
  const normalizedPath = normalizePath(path)
  return (
    normalizedPath.split("/").pop()?.replace(/\.md$/i, "") || normalizedPath
  )
}

function createPlaybookName(repoName: string) {
  if (repoName === defaultRepoName) {
    return "Sample Next.js Repo"
  }

  return repoName
    .split(/[-_]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

function createSkills(
  detectedFiles: DetectedFile[],
  contentByPath: Map<string, string>
): PlaybookSkill[] {
  return detectedFiles
    .filter((file) => file != null && file.type === "Claude skill")
    .map((file) => ({
      id: createSkillId(file.path),
      name: file.path.split("/").pop()?.replace(/\.md$/i, "") || file.path,
      instructions: getFileContent(
        contentByPath,
        file.path,
        `Imported from ${file.path}`
      ),
      origin: "imported" as const,
      sourcePath: normalizePath(file.path),
    }))
}

function createRules(
  detectedFiles: DetectedFile[],
  contentByPath: Map<string, string>
): PlaybookRule[] {
  return detectedFiles
    .filter(
      (file) =>
        file != null &&
        (file.type === "Claude instructions" || file.type === "Cursor rules")
    )
    .map((file) => ({
      id: createRuleId(file.path),
      text: getFileContent(
        contentByPath,
        file.path,
        `Imported from ${file.path}`
      ),
      origin: "imported" as const,
      sourcePath: normalizePath(file.path),
    }))
}

function createAgents(rules: PlaybookRule[]): PlaybookAgent[] {
  if (rules.length === 0) {
    return []
  }

  return [
    {
      id: "agent-workspace-default",
      name: "workspace-default",
      role: "Repository coding assistant",
      instructions: rules.map((rule) => rule.text),
      origin: "imported",
      sourcePaths: rules
        .map((rule) => rule.sourcePath)
        .filter((sourcePath): sourcePath is string => Boolean(sourcePath)),
    },
  ]
}

function createContextEntries(
  detectedFiles: DetectedFile[]
): PlaybookContext[] {
  return detectedFiles
    .filter((file) => file != null && file.type === "Project docs")
    .map((file) => ({
      id: createContextId(file.path),
      label: createContextLabel(file.path),
      path: normalizePath(file.path),
      origin: "imported" as const,
      sourcePath: normalizePath(file.path),
    }))
}

function createTranslators(): ToolTranslator[] {
  return [
    { tool: "claude-code", enabled: true },
    { tool: "cursor", enabled: true },
    { tool: "windsurf", enabled: true },
  ]
}

function assertNoCaseVariantConflicts(paths: string[]) {
  const seenPaths = new Map<string, string>()

  for (const path of paths) {
    const normalizedPath = normalizePath(path)
    const foldedPath = normalizedPath.toLowerCase()
    const existingPath = seenPaths.get(foldedPath)

    if (existingPath != null && existingPath !== normalizedPath) {
      throw new Error(
        `Found case-variant path conflict between "${existingPath}" and "${normalizedPath}".`
      )
    }

    seenPaths.set(foldedPath, normalizedPath)
  }
}

function compareDetectedFiles(left: DetectedFile, right: DetectedFile) {
  if (left.type !== right.type) {
    return left.type.localeCompare(right.type)
  }

  return normalizePath(left.path).localeCompare(normalizePath(right.path))
}

export function generatePlaybookDraft(
  detectedFiles: DetectedFile[] = [],
  sourceFiles: SampleRepoFile[] = [],
  repoName = defaultRepoName
): AgentPlaybook {
  const normalizedDetectedFiles = [...(detectedFiles || [])].sort(
    compareDetectedFiles
  )
  const contentByPath = toContentMap(sourceFiles)
  assertNoCaseVariantConflicts([
    ...normalizedDetectedFiles.map((file) => file.path),
    ...sourceFiles.map((file) => file.path),
  ])
  const rules = createRules(normalizedDetectedFiles, contentByPath)

  return AgentPlaybookSchema.parse({
    name: createPlaybookName(repoName),
    version: "0.1.0",
    repo: repoName,
    description:
      "Draft Agent Playbook generated from detected Sample Repo instructions.",
    skills: createSkills(normalizedDetectedFiles, contentByPath),
    agents: createAgents(rules),
    rules,
    context: createContextEntries(normalizedDetectedFiles),
    translators: createTranslators(),
  })
}
