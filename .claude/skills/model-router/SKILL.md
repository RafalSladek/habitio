---
name: model-router
description: Recommends the most cost-effective Claude model (Haiku 4.5 vs Sonnet 4.6) for Claude Code tasks. Use this skill whenever the user asks "which model should I use", mentions "haiku" or "sonnet" in a routing context, asks about Claude Code cost optimization, wants to save money on AI usage, says "is this a haiku task", describes a task they're about to delegate to Claude Code and seems to want guidance, or asks "can haiku handle this". Also trigger when the user pastes a claude command and wants to know if they should downgrade/upgrade the model. Trigger proactively when someone describes a Claude Code task — suggest the optimal model even if they didn't explicitly ask.
---

# Model Router

Help the user pick the most cost-effective Claude model for their Claude Code task.
The goal: spend Sonnet budget only when a task genuinely needs judgment. Mechanical tasks belong on Haiku.

## Model Reference

| Model | ID | Input | Output |
|-------|-----|-------|--------|
| **Haiku 4.5** | `claude-haiku-4-5-20251001` | $0.80/MTok | $4.00/MTok |
| **Sonnet 4.6** | `claude-sonnet-4-6` | $3.00/MTok | $15.00/MTok |

Sonnet costs ~3.75× on input and ~3.75× on output. For a typical task, **Haiku saves roughly 73%**.

> Tip: for interactive sessions, switch inside Claude Code with `/model claude-haiku-4-5-20251001`.

## Routing Logic

The single deciding question: **Does this task require judgment, or just execution?**

Execution = following clear instructions mechanically.
Judgment = understanding intent, weighing tradeoffs, reasoning about correctness.

### Haiku — mechanical execution

No ambiguity about what "correct" looks like:

- Run tests, check CI, verify builds pass
- Format, lint, or auto-fix code (Prettier, ESLint --fix)
- Git operations: commit, push, status, diff, log
- Install or update dependencies
- Search / grep / find across the codebase
- Rename identifiers or files across the codebase (find-and-replace level)
- Generate boilerplate from a clear template
- Convert between simple data formats (JSON ↔ CSV, etc.)
- Add a logging statement or debug print
- Read a file and return a specific piece of information
- Run a script and report what happened

### Sonnet — judgment required

The task requires understanding intent, context, tradeoffs, or correctness:

- Code review: spotting bugs, evaluating design, suggesting improvements
- Debugging a mysterious failure or unexpected behavior
- Designing or architecting a new feature
- Implementing a non-trivial feature from requirements
- Refactoring for maintainability or correctness
- Performance analysis and optimization
- Security review or vulnerability assessment
- Writing documentation that requires understanding the codebase
- Any task where a wrong answer could silently introduce a bug
- Multi-file reasoning across unfamiliar code

### Borderline cases

When uncertain, ask: **"If Haiku got this slightly wrong, would I catch it in review?"**

- **Yes, low blast radius** → Haiku. You'll see it before it ships.
- **No, silent failure risk** → Sonnet. The model upgrade costs less than the bug.

| Borderline task | Haiku if… | Sonnet if… |
|---|---|---|
| Add error handling | simple null-check or try/catch | needs domain knowledge of which errors matter |
| Write unit tests | straightforward happy-path tests | edge cases need business logic understanding |
| Update a config file | key/value is obvious | config has subtle interactions |
| Translate code to another language | syntax-level translation | idioms and patterns need to carry over |

## Output Format

Always respond with this structure:

```
**Recommendation: [Haiku 4.5 / Sonnet 4.6]**

[1-2 sentences: what makes this task mechanical vs judgment-requiring]

**Cost:** Haiku ~$0.010 vs Sonnet ~$0.039 per typical 5K-token task (~74% savings with Haiku)

**Command:**
claude --model [model-id] '[task description]'
```

For ambiguous tasks, add one of:
- "**If you want safety:** use Sonnet — the quality gap is worth it here."
- "**If cost matters:** Haiku is likely fine — you'll catch any issues in review."

## Cost Quick Reference

For a typical 5K-token task (3K input + 2K output):
- Haiku: $0.0024 + $0.0080 = **~$0.010**
- Sonnet: $0.009 + $0.030 = **~$0.039**
- Savings with Haiku: **~74%**

For a larger 30K-token task (20K in + 10K out):
- Haiku: $0.016 + $0.040 = **~$0.056**
- Sonnet: $0.060 + $0.150 = **~$0.210**
- Savings with Haiku: **~73%**

The ratio is stable: Haiku consistently runs at ~27% the cost of Sonnet.
