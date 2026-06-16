---
project_name: "agent_std"
workflowType: "correct-course"
status: "approved"
mode: "Incremental"
changeScope: "Minor"
created: "2026-06-09"
updated: "2026-06-09"
approvedAt: "2026-06-09"
approvedBy: "Lamnh"
trigger:
  source: "_bmad-output/planning-artifacts/implementation-readiness-report-2026-06-09.md"
  readinessStatus: "NEEDS WORK"
affectedArtifacts:
  - "_bmad-output/planning-artifacts/epics.md"
---

# Sprint Change Proposal: Implementation Readiness Corrections

## 1. Issue Summary

Implementation Readiness found that the Agent Studio planning set is close but not ready for sprint planning as-is.

The readiness report identified:

- 0 critical issues.
- 3 major issues.
- 4 minor concerns.
- 100% PRD FR coverage.
- Sound epic/story structure with no forward dependencies.

The triggering issue is not a failed implementation story. It is a planning-readiness gap discovered before sprint planning. If left unresolved, implementation agents could make inconsistent decisions about tests, Cursor output format, and patch export format.

## 2. Impact Analysis

### Epic Impact

**Epic 1: Demo Workspace and Git-Native Playbook Foundation**

- Impact: Requires an explicit story for test and CI foundations.
- Reason: Architecture requires Vitest, Playwright smoke coverage, and CI steps, but these were not represented in final story acceptance criteria.

**Epic 3: Cross-Tool Preview and Compatibility Notes**

- Impact: Story 3.3 requires a concrete Cursor output target.
- Reason: The prior story allowed either modern `.cursor/rules` or legacy `.cursorrules` to be foregrounded.

**Epic 4: Review Plan, Behavior Diff, and Patch Export**

- Impact: Story 4.5 requires a concrete patch artifact format.
- Reason: The prior story allowed "patch or equivalent diff artifact," which was too ambiguous for implementation.

### Story Impact

- Added Story 1.2: `Establish Test and CI Harness`.
- Renumbered prior Epic 1 stories:
  - Old Story 1.2 became Story 1.3.
  - Old Story 1.3 became Story 1.4.
  - Old Story 1.4 became Story 1.5.
- Updated Story 3.3 acceptance criteria to foreground `.cursor/rules` and treat `.cursorrules` as legacy compatibility.
- Updated Story 4.5 acceptance criteria to require a zip archive containing `agent-studio.patch` as a unified diff and generated files for inspection.

### Artifact Conflicts

**PRD**

- No direct PRD change required.
- Existing PRD language permits Cursor compatibility handling and patch export.

**Architecture**

- No direct architecture change required.
- The changes align with architecture requirements for test strategy, CI, Cursor compatibility context, and browser-generated export artifacts.

**UX Design**

- No direct UX change required.
- Minor UX warnings from readiness remain suitable for sprint/story checklists: responsive breakpoints, mock alignment, and code panel details.

**Epics**

- `epics.md` required direct edits and has been updated.

### Technical Impact

- No backend, auth, database, GitHub, filesystem, or new integration scope added.
- Added implementation expectation for Vitest, Playwright, package scripts, and minimum CI.
- Locked Cursor output target: `.cursor/rules` primary, `.cursorrules` legacy compatibility.
- Locked patch artifact format: zip archive with generated files plus `agent-studio.patch` unified diff.

## 3. Recommended Approach

### Selected Path

**Direct Adjustment**

### Rationale

Direct adjustment is the lowest-risk path:

- The MVP scope does not change.
- No epic is obsolete.
- No architecture rework is required.
- No PRD rewrite is required.
- The affected areas are isolated to story clarity in `epics.md`.
- Corrections reduce implementation churn before sprint planning.

### Effort Estimate

Low.

### Risk Assessment

Low.

### Timeline Impact

Minimal. These are planning corrections before sprint planning, not implementation rework.

## 4. Detailed Change Proposals

### Change 1: Add Test and CI Harness Story

**Artifact:** `_bmad-output/planning-artifacts/epics.md`

**Section:** Epic 1

**Status:** Approved and applied.

**New Story Added:**

```markdown
### Story 1.2: Establish Test and CI Harness

**Requirements:** AR-20, AR-21, AR-22, NFR-1, NFR-6

As a tech lead,
I want the demo app to include automated test and CI foundations,
So that future implementation stories can verify deterministic behavior and demo reliability.

**Acceptance Criteria:**

**Given** the starter app has been initialized
**When** the test harness is configured
**Then** Vitest is available for domain unit tests
**And** Playwright is available for the sample-flow smoke test
**And** package scripts exist for typecheck, lint, unit tests, and E2E smoke testing
**And** CI runs typecheck, lint, and unit tests at minimum
**And** the initial test setup does not introduce backend, auth, database, GitHub, or filesystem integration scope.
```

**Rationale:** Makes architecture-required verification work explicit before implementation stories start.

### Change 2: Lock Cursor Output Target

**Artifact:** `_bmad-output/planning-artifacts/epics.md`

**Section:** Story 3.3

**Status:** Approved and applied.

**Old Acceptance Criterion:**

```markdown
**And** the preview supports the MVP Cursor target decision: modern `.cursor/rules` foregrounded with `.cursorrules` compatibility, or recognizable `.cursorrules` foregrounded if product keeps that choice
```

**New Acceptance Criteria:**

```markdown
**And** the preview foregrounds modern `.cursor/rules` output
**And** the preview may include `.cursorrules` as a legacy compatibility artifact or note
**And** compatibility copy explains that `.cursorrules` is legacy compatibility while `.cursor/rules` is the primary MVP Cursor target
```

**Rationale:** Removes implementation ambiguity while preserving legacy compatibility context.

### Change 3: Lock Patch Export Artifact Format

**Artifact:** `_bmad-output/planning-artifacts/epics.md`

**Section:** Story 4.5

**Status:** Approved and applied.

**Old Acceptance Criteria:**

```markdown
**Then** the browser downloads a reviewable patch or equivalent diff artifact
**And** the artifact includes canonical Playbook changes
**And** the artifact includes generated Claude Code, Cursor, and Windsurf output changes
```

**New Acceptance Criteria:**

```markdown
**Then** the browser downloads a zip archive for patch review
**And** the archive includes `agent-studio.patch` as a unified diff artifact
**And** `agent-studio.patch` includes canonical Playbook changes
**And** `agent-studio.patch` includes generated Claude Code, Cursor, and Windsurf output changes
**And** the archive also includes the generated files for direct inspection
```

**Related Story Text Update:**

```markdown
I want to download a zip archive containing a unified diff patch,
So that agent behavior changes can be reviewed like code.
```

**Rationale:** Removes "or equivalent" ambiguity and preserves the review-like-code product promise without adding GitHub PR scope.

## 5. Implementation Handoff

### Change Scope Classification

**Minor**

### Handoff Recipients

- Product Owner / Planning owner: confirm the story changes are acceptable.
- Developer agent: use the updated `epics.md` as the source for sprint planning and implementation stories.

### Success Criteria

- Rerun Implementation Readiness.
- Readiness report should no longer list the three major issues:
  - test/CI story coverage,
  - Cursor output target ambiguity,
  - patch artifact ambiguity.
- If readiness passes, proceed to Sprint Planning.

### Next Steps

1. Approve this Sprint Change Proposal.
2. Rerun `bmad-check-implementation-readiness`.
3. If status is ready, run `bmad-sprint-planning`.

## 6. Workflow Completion Log

### Approval

Approved by Lamnh on 2026-06-09.

### Scope Classification

**Minor**

The change can be handled directly through the updated planning artifact. No PRD, UX, or architecture rewrite is required.

### Artifacts Modified

- `_bmad-output/planning-artifacts/epics.md`
- `_bmad-output/planning-artifacts/sprint-change-proposal-2026-06-09.md`

### Routed To

- Developer agent / Sprint Planning workflow.

### Handoff Instructions

- Treat the updated `epics.md` as the current source for sprint planning.
- Rerun Implementation Readiness before sprint planning.
- If readiness passes, proceed to `bmad-sprint-planning`.
