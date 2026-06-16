import JSZip from "jszip"
import type { ArtifactPair } from "./generate-patch"
import { generatePatchBundle } from "./generate-patch"
import { serializePlaybookToYaml } from "./serialize-playbook"
import { addProvenance } from "./add-provenance"
import type { AgentPlaybook } from "@/lib/playbook/schema"
import type { GeneratedArtifact } from "@/lib/translators/types"

export type PatchArchive = {
  buffer: ArrayBuffer
  filename: string
}

export async function generatePatchArchive(
  playbook: AgentPlaybook,
  artifactPairs: ArtifactPair[],
  translatorResults: Array<{ label: string; artifacts: GeneratedArtifact[] }>
): Promise<PatchArchive> {
  const patchContent = generatePatchBundle(artifactPairs)
  const zip = new JSZip()

  if (patchContent.trim()) {
    zip.file("agent-studio.patch", patchContent)
  }

  zip.file(".agent-studio/playbook.yaml", serializePlaybookToYaml(playbook))

  for (const { artifacts } of translatorResults) {
    for (const artifact of artifacts) {
      const safePath = sanitizeZipPath(artifact.path)
      zip.file(safePath, addProvenance(artifact.path, artifact.content))
    }
  }

  const buffer = await zip.generateAsync({ type: "arraybuffer" })
  return { buffer, filename: "agent-studio-patch-review.zip" }
}

function sanitizeZipPath(path: string): string {
  return path
    .replace(/\\/g, "/")
    .replace(/^\/+/, "")
    .replace(/\.\.\//g, "")
    .replace(/\.\./g, "")
    .replace(/~/g, "")
}
