# Simple & Low-Risk Tasks

## Tier 1: Very Simple (description/text fixes, near-zero risk)

### 1. Bolt description undersells damage
- **File:** `src/cards/bolt.ts`
- **Issue:** Description says it deals `8` damage per stack, but actual formula is `damage * (chainsRemaining + 1)`. At 2 stacks the first chain does 16 damage, not 8.
- **Fix:** Update the description string to mention the chain multiplier. One-line text change.
- **Source:** https://steamcommunity.com/app/1618380/discussions/0/694250999467024453/

### 2. Gripthulu missing action indicator
- **File:** `src/graphics/PlanningView.ts:750`
- **Issue:** Action indicator logic only shows for `SUPPORT_CLASS` or `GORU_BOSS` subtypes (always-show path), or for other units only when targeting the player. Gripthulu is `SPECIAL_LOS` so it falls through.
- **Fix:** Add `gripthulu` to the special-case condition. One-line change, purely visual/UI.
- **Source:** https://discord.com/channels/1032294536640200766/1431718501516705962

## Tier 2: Simple (small logic fix, low risk)

### 3. Contaminate cost not discounted for Goru with Witch skill
- **File:** `src/cards/cardUtils.ts:148-159`
- **Issue:** Goru returns early with only `soulFragmentCost`, bypassing the Witch discount at line 250-253.
- **Fix:** Apply the Witch discount to `soulFragmentCost` before Goru's early return. Small, localized change.
- **Source:** https://discord.com/channels/1032294536640200766/1474904385929875476

## Tier 3: Moderate (clear fix but touches more logic)

### 4. Goru showing as Spellmason
- **Files:** `src/graphics/PlanningView.ts:926`, `src/entity/Player.ts` (`setWizardType()`)
- **Issue:** Non-Spellmason players have their description skipped as a workaround because `unitSourceId` isn't updated when `setWizardType()` is called.
- **Fix Options:**
  - A) Update `unitSourceId` in `Player.setWizardType()` (better, fixes root cause)
  - B) Remove the `skipDescription` workaround in PlanningView
- **Source:** https://discord.com/channels/1032294536640200766/1462948393859940484

### 5. Rend damage description mismatch
- **File:** `src/cards/rend.ts`
- **Issue:** Description already shows a damage table via `calculateRendDamage(1..10)`, and the formula `(1+2+...+stack) * 10` is correct. The mismatch may be in how the description words the scaling. Possibly just a wording clarification.
- **Fix:** Clarify description wording. Need to check Discord report for specifics.
- **Source:** https://discord.com/channels/1032294536640200766/1474932964214313091
