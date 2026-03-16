# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Spellmasons is a turn-based, tactical roguelike video game with online cooperative multiplayer. Players create spell combinations to overcome enemies. The codebase is TypeScript-based, using Pixi.js for graphics and Svelte for UI.

## Build Commands

```bash
npm start                    # Start Vite dev server at http://localhost:3000
npm test                     # Type check + run Jest tests (tests are outdated, don't run)
npm run tsc                  # Type check only
npm run build                # Full production build (types + tsc + vite + headless + manifest)
npm run lint                 # Prettier format check
npm run format               # Prettier auto-format
npm run headless             # Build and run headless server (for multiplayer without graphics)
```

## Architecture

### Core Game State
- **`src/Underworld.ts`** - Central game state manager. Contains all entities (units, pickups, obstacles), handles turn progression, multiplayer sync, map generation, and seeded RNG for deterministic replays.
- **`src/Overworld.ts`** - Campaign/progression management across multiple levels.
- **`src/config.ts`** - Game constants (health, speed, ranges, etc.).

### Entity System (`src/entity/`)
- `Unit.ts` - Base unit class with health, movement, damage handling
- `Player.ts` - Player-specific logic extending Unit
- `Pickup.ts` - Pickups/potions system
- `units/` - 28+ enemy types (archer, golem, deathmason, summoner, etc.)
- `units/actions/` - Combat actions (meleeAction, rangedAction)

### Spell/Card System (`src/cards/`)
Each spell is a separate file with an async `effect()` function. Spells support targeting, AoE, chaining, and interrupts. The async pattern allows animation synchronization.

Key files:
- `index.ts` - Card registry and Events interface
- `cardUtils.ts` - Spell utilities, cost calculation

**Targeting iteration pattern** (important for spells that modify targets):
```typescript
const length = targets.length;
for (let i = 0; i < length; i++) {
  const target = targets[i];
  if (!target) continue;
  // Use addTarget() here safely
}
```
Do NOT use `for...of` when calling `addTarget()` as it mutates the array.

### Modifier/Event System
Modifiers attach data to units; events trigger effects. See `src/Events.ts` for the Events interface with hooks like `onDealDamage`, `onDeath`, `onTurnEnd`, `onSpellCast`, etc.

Modifier files are in `src/` root (e.g., `modifierPoison.ts`, `modifierArmor.ts`).

### Graphics (`src/graphics/`)
- `PixiUtils.ts` - Pixi.js rendering setup
- `PlanningView.ts` - Tactical planning overlay showing attack predictions
- `Image.ts` - Sprite and animation management
- `Particles.ts` - Particle effects
- `ui/` - UI components including CardUI, colors, eventListeners, keyMapping

### Math Utilities (`src/jmath/`)
- `Vec.ts` - 2D vector operations
- `Pathfinding.ts` - A* pathfinding
- `Polygon2.ts` - Polygon collision/intersection
- `moveWithCollision.ts` - Physics and collision
- `rand.ts` - Seeded RNG (seedrandom)

### Networking (`src/network/`)
WebSocketPie-based real-time multiplayer with message-based architecture. Supports P2P and stateless relay servers.

### Modding API
Mods access the engine through `globalThis.SpellmasonsAPI`. The API is defined in `src/api.ts`. Mods may import types only (`import type {...}`) from the engine; everything else must come from SpellmasonsAPI.

Sample mods: `src/DevelopmentMods/`

## Coding Conventions

- **Single Source of Truth (DRY)**: When the same decision logic appears in multiple places, extract it into a single function so the rule is defined once and all call sites stay in sync. Example: `syncAdminMode()` in `Underworld.ts` is the sole authority for whether `globalThis.adminMode` should be on or off.

- **Null/undefined checks**: Do NOT use `=== undefined`, `!== undefined`, `== null`, `!= null`, etc. Instead use the global helpers:
  - `isNullOrUndef(value)` — returns true if value is null or undefined
  - `exists(value)` — returns true if value is not null and not undefined (opposite of isNullOrUndef)

## Development Tips

- Press F12 to open console (works in Steam version too)
- Set `adminMode = true` in console, then Shift+Click opens admin menu
- Ctrl+Space opens quick admin menu for spawning things
- `devUnderworld` in console to inspect game state
- `selectedUnit` to inspect the selected unit
- `devAutoPickUpgrades=false` to disable auto-upgrade during development

## Headless Server

The game can run headless (no graphics) for multiplayer servers:
- TypeScript config: `tsconfig.headless.json`
- Output: `headless-server-build/`
- Entry point: `src/HeadlessServer.ts`

## Localization

Do not modify localization files (`.json` or `.tsv` in `public/localization/`). These files are generated and managed separately.

When adding new user-facing text (floating text, UI labels, tooltips, descriptions, etc.), note any hardcoded strings that need localization in `localize-todo.md` at the repo root. Include the file path, the string, and a brief description of where it appears. This ensures nothing is missed when localization files are updated.
