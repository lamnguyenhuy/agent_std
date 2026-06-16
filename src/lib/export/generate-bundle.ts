import JSZip from "jszip"
import type { AgentPlaybook } from "@/lib/playbook/schema"
import type { GeneratedArtifact } from "@/lib/translators/types"
import { serializePlaybookToYaml } from "./serialize-playbook"
import { addProvenance } from "./add-provenance"

const PLAYBOOK_YAML_PATH = ".agent-studio/playbook.yaml"

function sanitizeFilename(name: string): string {
  return name
    .replace(/\s+/g, "-")
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "")
    .replace(/\.{2,}/g, ".")
    .replace(/^[.-]+|[.-]+$/g, "")
}

export type ExportBundle = {
  buffer: ArrayBuffer
  filename: string
}

export async function generateExportBundle(
  playbook: AgentPlaybook,
  translatorResults: Array<{ label: string; artifacts: GeneratedArtifact[] }>
): Promise<ExportBundle> {
  const zip = new JSZip()

  zip.file(PLAYBOOK_YAML_PATH, serializePlaybookToYaml(playbook))

  for (const { artifacts } of translatorResults) {
    for (const artifact of artifacts) {
      const contentWithProvenance = addProvenance(artifact.path, artifact.content)
      zip.file(artifact.path, contentWithProvenance)
    }
  }

  const buffer = await zip.generateAsync({ type: "arraybuffer" })
  const safeName = sanitizeFilename(playbook.name)
  const archiveName = `${safeName}-generated-files-${Date.now()}.zip`

  return { buffer, filename: archiveName }
}

export function bundleToBlob(buffer: ArrayBuffer): Blob {
  return new Blob([buffer], { type: "application/zip" })
}
