import type { AppError } from "@/lib/errors"
import type { Result } from "@/lib/result"

export function validateRuleText(text: string): Result<string, AppError> {
  const trimmed = text.replace(/^[\s\u200B-\u200D\uFEFF]+|[\s\u200B-\u200D\uFEFF]+$/g, '')
  if (trimmed.length === 0) {
    return { ok: false, error: { code: "rule-empty", message: "Rule cannot be empty." } }
  }
  return { ok: true, data: trimmed }
}
