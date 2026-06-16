import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/workbench/status-badge"
import type { PlaybookRule } from "@/lib/playbook/schema"

const ruleOriginUi = {
  edited: {
    label: "Edited",
    variant: "accent",
  },
  imported: {
    label: "Imported",
    variant: "subtle",
  },
} as const

type RulesEditorProps = {
  getDisplayText: (ruleId: string, ruleText: string) => string
  getError: (ruleId: string) => string | undefined
  newRuleText: string
  onAddRule: () => void
  onNewRuleTextChange: (value: string) => void
  onRemoveRule: (ruleId: string) => void
  onRuleTextChange: (ruleId: string, value: string) => void
  rules: PlaybookRule[]
}

export function RulesEditor({
  getDisplayText,
  getError,
  newRuleText,
  onAddRule,
  onNewRuleTextChange,
  onRemoveRule,
  onRuleTextChange,
  rules,
}: RulesEditorProps) {
  return (
    <div className="grid gap-4">
      <form
        className="grid gap-3 rounded-md border border-border bg-card p-3"
        onSubmit={(event) => {
          event.preventDefault()
          onAddRule()
        }}
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-xs font-semibold text-muted-foreground">
              Add rule
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              New rules are stored as user-edited Playbook content.
            </p>
          </div>
          <Button className="shrink-0" type="submit" variant="secondary">
            Add Rule
          </Button>
        </div>
        <textarea
          aria-label="New rule"
          className="min-h-[96px] w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          onChange={(event) => onNewRuleTextChange(event.target.value)}
          placeholder="Add a new Playbook rule"
          value={newRuleText}
        />
      </form>

      <div className="grid gap-3">
        {rules.map((rule, index) => {
          const originUi = ruleOriginUi[rule.origin] ?? ruleOriginUi.edited
          const errorMessage = getError(rule.id)
          const inputId = `rule-input-${rule.id}`
          const errorId = `rule-error-${rule.id}`

          return (
            <article
              className="grid gap-3 rounded-md border border-border bg-background p-3"
              key={rule.id}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-xs font-semibold text-muted-foreground">
                  Rule {index + 1}
                </div>
                <StatusBadge
                  label={originUi.label}
                  variant={originUi.variant}
                />
              </div>
              <textarea
                aria-describedby={errorMessage ? errorId : undefined}
                aria-invalid={!!errorMessage}
                aria-label={`Rule ${index + 1}`}
                className="min-h-[112px] w-full resize-none rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                id={inputId}
                onChange={(event) =>
                  onRuleTextChange(rule.id, event.target.value)
                }
                value={getDisplayText(rule.id, rule.text)}
              />
              {errorMessage ? (
                <p
                  aria-live="assertive"
                  className="text-sm text-destructive"
                  id={errorId}
                  role="alert"
                >
                  {errorMessage}
                </p>
              ) : null}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="min-w-0 font-mono text-[11px] break-all text-muted-foreground">
                  {rule.sourcePath ?? "Added in this Playbook"}
                </div>
                <Button
                  className="shrink-0"
                  onClick={() => onRemoveRule(rule.id)}
                  size="sm"
                  type="button"
                  variant="destructive"
                >
                  Remove rule {index + 1}
                </Button>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
