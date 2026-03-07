# Step Tracking – Template

**Purpose**: Track a single roadmap step (e.g. 3.1, 5.2) with status, tasks, and notes. Use one section per step when you need finer-grained tracking than the phase analysis.

---

## Step [X.Y]: [Step name]

**Phase**: [N] – [Phase name]  
**Goal**: [One sentence from roadmap]

### Status

| Field | Value |
|-------|--------|
| **Status** | ⏳ Pending / 🚧 In progress / ✅ Complete |
| **Started** | YYYY-MM-DD |
| **Completed** | YYYY-MM-DD |
| **Assignee** | (optional) |

### Tasks (from roadmap / phase doc)

- [ ] [Task 1]
- [ ] [Task 2]
- [ ] [Task 3]

### Notes

- [Decision or blocker]
- [Link to PR or commit]

### UI / Acceptance

- [ ] [Checkpoint 1]
- [ ] [Checkpoint 2]

### Changelog entry (when complete)

Copy to [01-changelog.md](./01-changelog.md):

```markdown
### Step X.Y: [Step name]
- **Status**: ✅ Complete
- **Completed**: YYYY-MM-DD
- **Notes**: [Brief summary]
- **Updated**: YYYY-MM-DD
```

---

## How to use

1. Duplicate this template (or add a new section) for the step you are tracking.
2. Update status and tasks as you work.
3. When the step is done, add an entry to [01-changelog.md](./01-changelog.md) and mark the step complete here.
4. Reference the phase analysis doc for full step description: [02-phases/](../02-phases/).

---

**See also**: [02-analysis-template.md](./02-analysis-template.md) (for full phase analysis), [01-changelog.md](./01-changelog.md) (step completion log).
