---
name: Agent Studio
status: draft
sources:
  - ../../prds/prd-agent_std-2026-06-09/prd.md
updated: 2026-06-09
colors:
  background: '#F7F8FA'
  foreground: '#15181D'
  surface: '#FFFFFF'
  surface-subtle: '#F1F3F5'
  surface-code: '#101418'
  foreground-code: '#E7EEF5'
  border: '#D8DDE3'
  border-strong: '#AEB7C2'
  muted: '#6B7280'
  primary: '#0F766E'
  primary-foreground: '#FFFFFF'
  accent: '#2563EB'
  accent-foreground: '#FFFFFF'
  success: '#15803D'
  warning: '#B45309'
  warning-surface: '#FFF7ED'
  destructive: '#B91C1C'
  destructive-surface: '#FEF2F2'
  info-surface: '#EFF6FF'
typography:
  body:
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif'
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: '0'
  label:
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif'
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.35'
    letterSpacing: '0'
  heading:
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif'
    fontSize: 18px
    fontWeight: '650'
    lineHeight: '1.3'
    letterSpacing: '0'
  code:
    fontFamily: 'JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, monospace'
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.55'
    letterSpacing: '0'
rounded:
  sm: 4px
  md: 6px
  lg: 8px
  full: 9999px
spacing:
  '1': 4px
  '2': 8px
  '3': 12px
  '4': 16px
  '5': 20px
  '6': 24px
  '8': 32px
  gutter: 16px
  rail: 280px
  inspector: 420px
components:
  primary-button:
    background: '{colors.primary}'
    foreground: '{colors.primary-foreground}'
    radius: '{rounded.md}'
  secondary-button:
    background: '{colors.surface}'
    foreground: '{colors.foreground}'
    border: '{colors.border}'
    radius: '{rounded.md}'
  code-panel:
    background: '{colors.surface-code}'
    foreground: '{colors.foreground-code}'
    radius: '{rounded.md}'
  warning-note:
    background: '{colors.warning-surface}'
    foreground: '{colors.warning}'
    radius: '{rounded.md}'
---

## Brand & Style

Agent Studio is a focused developer tool for reviewing agent behavior. The visual system should feel quiet, precise, and operational: closer to a Git diff viewer, API console, or internal developer platform than a marketing SaaS dashboard.

[ASSUMPTION] The MVP inherits shadcn/ui and Tailwind conventions. This DESIGN.md specifies the product-layer visual identity: compact spacing, restrained color, code-oriented panels, and status surfaces for review decisions. The interface should not use decorative gradients, oversized hero sections, or illustrative cards. The product value is the review flow.

## Colors

The palette uses neutral surfaces with three functional accents:

- **Primary Teal (`{colors.primary}`)** marks the main action path: create Playbook, add rule, export patch.
- **Action Blue (`{colors.accent}`)** marks selected preview tabs and information about translated outputs.
- **Success Green (`{colors.success}`)** marks generated-ready or validation-passed states.
- **Warning Amber (`{colors.warning}` / `{colors.warning-surface}`)** marks compatibility notes, adapted output, or assumptions.
- **Destructive Red (`{colors.destructive}` / `{colors.destructive-surface}`)** marks invalid rules, export failures, or blocked states.
- **Code Surface (`{colors.surface-code}`)** is used only for generated output previews and patch/diff previews.

Avoid using accent colors decoratively. Every non-neutral color must communicate action, state, or tool-output meaning.

## Typography

Use a compact sans-serif interface for all product text. Headings are functional section labels, not brand moments. Use `{typography.heading}` only for surface titles and major panel headings.

Use `{typography.code}` for Playbook YAML, generated output previews, Plan rows that include file paths, and patch/diff snippets. Code text must never be smaller than 12px.

## Layout & Spacing

Desktop is the primary demo viewport. The default layout is a 3-panel workbench:

- Left rail: Sample Repo and Agent Playbook structure.
- Center: Rules editor and imported Playbook sections.
- Right inspector: Cross-Tool Preview, Plan, Behavior Diff, and Patch Export.

Use `{spacing.gutter}` between panels. Keep repeated tool panels dense but readable. Cards are allowed for repeated objects or panel groupings, but avoid nested cards.

At tablet width, collapse the left rail into a sidebar sheet. At mobile width, stack surfaces and make Cross-Tool Preview tab-only; mobile supports inspection, not the primary sales demo.

## Elevation & Depth

Use borders and tonal surface changes instead of heavy shadows. Panels sit on `{colors.background}` and use `{colors.surface}` with `{colors.border}`. Hover states can use `{colors.surface-subtle}`.

## Shapes

Use crisp tool-like corners: `{rounded.sm}` for inputs and small controls, `{rounded.md}` for buttons and cards, `{rounded.lg}` for modal/sheet containers. Pill shapes are reserved for status badges and tool labels.

## Components

- **Primary Button** — Uses `{components.primary-button}`. Use for Create Playbook, Add Rule, Export Patch. Only one primary button per panel.
- **Secondary Button** — Uses `{components.secondary-button}`. Use for download generated files, reset sample, or copy output.
- **Code Panel** — Uses `{components.code-panel}`. Includes line wrapping toggle, copy action, and stable height where possible.
- **Tool Tab** — Segmented control for Claude Code, Cursor, and Windsurf previews. Active tab uses `{colors.accent}`.
- **Compatibility Note** — Uses `{components.warning-note}` and appears inside preview panels, not as global alert.
- **Behavior Diff Row** — Uses neutral text for unchanged framing, `{colors.success}` for added behavior, `{colors.destructive}` for removed behavior, and `{colors.warning}` for adapter warnings.

## Do's and Don'ts

| Do | Don't |
|---|---|
| Keep the UI dense, readable, and workbench-like | Add landing-page hero styling inside the product |
| Use color only for action or state | Use decorative gradients, orbs, or visual flourishes |
| Make generated outputs inspectable in code panels | Hide the core value behind modal-only previews |
| Keep Rules editing obvious and central | Suggest full Skills/Agents/Context CRUD exists in MVP |
| Show provenance and compatibility notes near the affected output | Put generic warnings in detached banners |
| Favor tabs, segmented controls, badges, and icons for tool surfaces | Use large cards for every concept |
