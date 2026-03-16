# Localization TODO

User-facing strings that need localization (not yet wrapped in `i18n()`).

## Burn card (`src/cards/burn.ts`)
- `'Extinguished'` — floating text when burn is applied to a unit in liquid (line ~89)
- `'Ice Melted'` — floating text when burn removes freeze (line ~114). Note: this string existed before but was never localized.

## Modded Map announcement (`src/Underworld.ts`)
- `` `Modded Map: ${handmadeMapName}` `` — centered floating text when a handmade/modded map loads (line ~1810)
- `'Modded Map'` — fallback when handmade map has no name (line ~1810)
