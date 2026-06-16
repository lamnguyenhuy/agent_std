import yaml from "js-yaml"
import type { AgentPlaybook } from "@/lib/playbook/schema"

export function serializePlaybookToYaml(playbook: AgentPlaybook): string {
  return yaml.dump(playbook, {
    indent: 2,
    lineWidth: 120,
    noRefs: true,
    sortKeys: false,
  })
}
