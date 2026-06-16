import type { ToolId } from "@/lib/playbook/schema"
import { claudeCodeTranslator } from "@/lib/translators/claude-code"
import { cursorTranslator } from "@/lib/translators/cursor"
import { windsurfTranslator } from "@/lib/translators/windsurf"
import type { TranslatorModule } from "@/lib/translators/types"

export const TRANSLATORS: TranslatorModule[] = [
  claudeCodeTranslator,
  cursorTranslator,
  windsurfTranslator,
]

export function getTranslator(id: ToolId): TranslatorModule {
  const found = TRANSLATORS.find((t) => t.id === id)
  if (!found) {
    throw new Error(`No translator registered for tool id: ${id}`)
  }
  return found
}

export type {
  TranslatorModule,
  TranslatorResult,
  GeneratedArtifact,
  CompatibilityNote,
} from "@/lib/translators/types"
