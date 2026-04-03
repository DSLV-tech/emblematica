---
name: Build Fix Approach — Emblematica
description: How to fix TypeScript build errors when src/ root files conflict with src/views/ versions
type: feedback
---

When old Vite-era root files (src/DetailView.tsx, src/PassaportoView.tsx, etc.) cause type errors, add missing types to src/types/index.ts rather than deleting the files — they might be referenced later.

**Why:** Deleting orphan files needs user confirmation; adding types to the canonical file is safer and keeps the codebase compiling cleanly.

**How to apply:** Always check if the error is in a root-level src/ file vs a src/views/ file. Root-level files are legacy; add minimal types to satisfy them without changing their logic.
