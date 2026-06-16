import { z } from "zod"

export const PlaybookItemOriginSchema = z.enum(["imported", "edited"])
export const ToolIdSchema = z.enum(["claude-code", "cursor", "windsurf"])

export const PlaybookSkillSchema = z
  .object({
    id: z.string().min(1),
    name: z.string().min(1),
    instructions: z.string().min(1),
    origin: PlaybookItemOriginSchema,
    sourcePath: z.string().min(1),
  })
  .strict()

export const PlaybookAgentSchema = z
  .object({
    id: z.string().min(1),
    name: z.string().min(1),
    role: z.string().min(1),
    instructions: z.array(z.string().min(1)).min(1),
    origin: PlaybookItemOriginSchema,
    sourcePaths: z.array(z.string().min(1)).min(1),
  })
  .strict()

const ImportedPlaybookRuleSchema = z
  .object({
    id: z.string().min(1),
    text: z.string().min(1),
    origin: z.literal("imported"),
    sourcePath: z.string().min(1),
  })
  .strict()

const EditedPlaybookRuleSchema = z
  .object({
    id: z.string().min(1),
    text: z.string().min(1),
    origin: z.literal("edited"),
    sourcePath: z.string().min(1).optional(),
  })
  .strict()

export const PlaybookRuleSchema = z.union([
  ImportedPlaybookRuleSchema,
  EditedPlaybookRuleSchema,
])

export const PlaybookContextSchema = z
  .object({
    id: z.string().min(1),
    label: z.string().min(1),
    path: z.string().min(1),
    origin: PlaybookItemOriginSchema,
    sourcePath: z.string().min(1),
  })
  .strict()

export const ToolTranslatorSchema = z
  .object({
    tool: ToolIdSchema,
    enabled: z.boolean(),
  })
  .strict()

export const AgentPlaybookSchema = z
  .object({
    name: z.string().min(1),
    version: z.string().min(1),
    repo: z.string().min(1),
    description: z.string().min(1),
    skills: z.array(PlaybookSkillSchema),
    agents: z.array(PlaybookAgentSchema),
    rules: z.array(PlaybookRuleSchema),
    context: z.array(PlaybookContextSchema),
    translators: z.array(ToolTranslatorSchema).min(1),
  })
  .strict()

export type AgentPlaybook = z.infer<typeof AgentPlaybookSchema>
export type PlaybookSkill = z.infer<typeof PlaybookSkillSchema>
export type PlaybookAgent = z.infer<typeof PlaybookAgentSchema>
export type PlaybookRule = z.infer<typeof PlaybookRuleSchema>
export type PlaybookContext = z.infer<typeof PlaybookContextSchema>
export type ToolTranslator = z.infer<typeof ToolTranslatorSchema>
export type ToolId = z.infer<typeof ToolIdSchema>
