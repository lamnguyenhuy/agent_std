export type LineDiff = {
  type: "added" | "removed" | "unchanged"
  line: string
  oldLineNum?: number
  newLineNum?: number
}

/**
 * Compute a simple line-based diff between two strings.
 * Uses a longest-common-subsequence approach for accuracy.
 */
export function computeLineDiff(before: string, after: string): LineDiff[] {
  const beforeLines = before === "" ? [] : before.split("\n")
  const afterLines = after === "" ? [] : after.split("\n")

  // Build LCS table
  const m = beforeLines.length
  const n = afterLines.length
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (beforeLines[i - 1] === afterLines[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
      }
    }
  }

  // Backtrack to build diff
  const result: LineDiff[] = []
  let i = m, j = n
  const temp: LineDiff[] = []

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && beforeLines[i - 1] === afterLines[j - 1]) {
      temp.push({ type: "unchanged", line: beforeLines[i - 1], oldLineNum: i, newLineNum: j })
      i--
      j--
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      temp.push({ type: "added", line: afterLines[j - 1], newLineNum: j })
      j--
    } else {
      temp.push({ type: "removed", line: beforeLines[i - 1], oldLineNum: i })
      i--
    }
  }

  // Reverse to get correct order
  for (let k = temp.length - 1; k >= 0; k--) {
    result.push(temp[k])
  }

  return result
}

/**
 * Generate a unified diff string for one file.
 */
export function generateUnifiedDiff(
  before: string,
  after: string,
  filePath: string
): string {
  const diff = computeLineDiff(before, after)
  const hasChanges = diff.some((d) => d.type !== "unchanged")
  if (!hasChanges) return ""

  const lines: string[] = []
  const isNewFile = before === ""
  const isDeleted = after === ""

  // Header
  const sourcePath = isNewFile ? "/dev/null" : `a/${filePath}`
  const targetPath = isDeleted ? "/dev/null" : `b/${filePath}`
  lines.push(`--- ${sourcePath}`)
  lines.push(`+++ ${targetPath}`)

  // Group into hunks
  let hunkStart = 0
  while (hunkStart < diff.length) {
    // Find first changed line in this hunk
    while (hunkStart < diff.length && diff[hunkStart].type === "unchanged") {
      hunkStart++
    }
    if (hunkStart >= diff.length) break

    // Determine context: up to 3 unchanged lines before first change
    const contextBefore = Math.min(3, hunkStart)
    const hunkBegin = hunkStart - contextBefore

    // Find end of this hunk (change region + 3 context lines after)
    let hunkEnd = hunkStart
    let changesInHunk = 0
    let unchangedAfter = 0

    while (hunkEnd < diff.length) {
      if (diff[hunkEnd].type !== "unchanged") {
        changesInHunk++
        unchangedAfter = 0
      } else {
        unchangedAfter++
        if (unchangedAfter >= 3 && changesInHunk > 0) break
      }
      hunkEnd++
    }
    // Trim trailing unchanged lines beyond first 3
    if (unchangedAfter > 0) {
      hunkEnd -= (unchangedAfter - 3)
    }

    // Count old/new lines in hunk
    let oldCount = 0, newCount = 0
    let oldStart = 0, newStart = 0

    for (let k = hunkBegin; k < hunkEnd; k++) {
      if (diff[k].type === "removed" || diff[k].type === "unchanged") oldCount++
      if (diff[k].type === "added" || diff[k].type === "unchanged") newCount++
      if (oldStart === 0 && diff[k].oldLineNum != null) oldStart = diff[k].oldLineNum!; if (newStart === 0 && diff[k].newLineNum != null) newStart = diff[k].newLineNum!
    }

    if (oldStart === 0) oldStart = 1
    if (newStart === 0) newStart = 1

    lines.push(`@@ -${oldStart},${oldCount} +${newStart},${newCount} @@`)

    for (let k = hunkBegin; k < hunkEnd; k++) {
      const d = diff[k]
      switch (d.type) {
        case "unchanged":
          lines.push(` ${d.line}`)
          break
        case "removed":
          lines.push(`-${d.line}`)
          break
        case "added":
          lines.push(`+${d.line}`)
          break
      }
    }

    hunkStart = hunkEnd
  }

  return lines.join("\n") + "\n"
}

export type ArtifactPair = {
  path: string
  before: string
  after: string
}

/**
 * Generate a complete patch bundle string from multiple artifact pairs.
 */
export function generatePatchBundle(
  pairs: ArtifactPair[]
): string {
  const parts: string[] = []

  for (const pair of pairs) {
    const diff = generateUnifiedDiff(pair.before, pair.after, pair.path)
    if (diff) {
      parts.push(diff)
    }
  }

  return parts.join("\n")
}
