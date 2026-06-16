const PROVENANCE_LINE = "Generated from `.agent-studio/playbook.yaml`. Do not edit directly."

const COMMENT_STYLE: Array<{ ext: string; prefix: string; suffix: string }> = [
  { ext: ".yaml", prefix: "# ", suffix: "" },
  { ext: ".yml", prefix: "# ", suffix: "" },
  { ext: ".md", prefix: "<!-- ", suffix: " -->" },
  { ext: ".json", prefix: "// ", suffix: "" },
  { ext: ".js", prefix: "// ", suffix: "" },
  { ext: ".ts", prefix: "// ", suffix: "" },
  { ext: ".tsx", prefix: "// ", suffix: "" },
  { ext: ".jsx", prefix: "// ", suffix: "" },
  { ext: ".py", prefix: "# ", suffix: "" },
  { ext: ".sh", prefix: "# ", suffix: "" },
  { ext: ".toml", prefix: "# ", suffix: "" },
  { ext: ".cfg", prefix: "# ", suffix: "" },
  { ext: ".ini", prefix: "; ", suffix: "" },
  { ext: ".html", prefix: "<!-- ", suffix: " -->" },
  { ext: ".xml", prefix: "<!-- ", suffix: " -->" },
]

function detectCommentStyle(path: string): { prefix: string; suffix: string } {
  const ext = path.toLowerCase().split(".").pop()
  if (!ext) return COMMENT_STYLE[0]
  for (const style of COMMENT_STYLE) {
    const styleExt = style.ext.replace(/^\./, "")
    if (styleExt === ext) return { prefix: style.prefix, suffix: style.suffix }
  }
  return COMMENT_STYLE[0]
}

export function addProvenance(filePath: string, content: string): string {
  const { prefix, suffix } = detectCommentStyle(filePath)
  const comment = `${prefix}${PROVENANCE_LINE}${suffix}`
  // Check if provenance already exists
  if (content.includes(PROVENANCE_LINE)) return content
  // Prepend with newline if content is non-empty
  return content.length > 0 ? `${comment}\n${content}` : comment
}
