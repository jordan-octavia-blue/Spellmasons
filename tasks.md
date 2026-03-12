- sellForDeathmasonJson.json returns index.html

# Tasks - Organized by Complexity
- Bolt description says it does less damage than it does: https://steamcommunity.com/app/1618380/discussions/0/694250999467024453/
- Bug: rend damage scaling doesn't match spell description: https://discord.com/channels/1032294536640200766/1474932964214313091

---

## Quick Wins (Low Complexity)

Simple config changes, text fixes, verification tasks, and cosmetic issues.

- Update credits
- Double check that the armor rune works
- Revise store copy: https://x.com/SigmaxG54447/status/2016280337001693253?s=20
- Check out Bug's PR in modding repo
- Translation error: https://discord.com/channels/1032294536640200766/1048345669607358516/1441390413134041088
- Goru showing as spellmason: https://discord.com/channels/1032294536640200766/1462948393859940484
- Gripthulu does not use an action indicator https://discord.com/channels/1032294536640200766/1431718501516705962
- UI bug: Going from hotseat right to goru in singleplayer shows mana bar instead of souls bar
- UI small last spell bug: https://discord.com/channels/1032294536640200766/1449910021285744691
- UI: Long spells cover end game screen buttons: https://discord.com/channels/1032294536640200766/1415035757613154385/1437866364101591081
- Floating text is going too fast
- Arrows are traveling too slowly. https://discord.com/channels/1032294536640200766/1442527131220447412
- Contaminate spell cost remains the same on Goru when acquiring Witch skill. https://discord.com/channels/1032294536640200766/1474904385929875476
- Warden spells seem to be completely random, instead of keeping category spells in the same place https://discord.com/channels/1032294536640200766/1032294537235812404/1481452878207127755
- Warden: Spell cost seems to be higher

---

## Low-Medium Complexity

Targeted bug fixes with clear scope - usually a single condition check, filter, or state reset.

- submerge doesn't trigger mana on kill: https://discord.com/channels/1032294536640200766/1476089694956818443
- bug: Icy veins doesn't proc with shatter: https://discord.com/channels/1032294536640200766/1466535122546196595
- bug: +30 SP pick doesn't shuffle card choices, forcing shuffle next time - check rerollOmit
- Empower on damageAsPercent units is fractional and looks like it does nothing until you cast it more than once
- Enfeeble stacking weirdness: https://discord.com/channels/1032294536640200766/1454263831013494818
- Siphon stacking broken https://discord.com/channels/1032294536640200766/1474182264588992717
- Lastwill is stackable: https://discord.com/channels/1032294536640200766/1461661497917968568
- Last will prevents onKillResurrect? https://discord.com/channels/1032294536640200766/1449862946506145882
- Vampirism doesn't come back until the 2nd turn of each round https://discord.com/channels/@me/1096183078579359844/1450929157050732715
- Glop did damage through fortify and did not warn https://discord.com/channels/1032294536640200766/1451288487729958975
- Green Glop scaling is too powerful: https://discord.com/channels/1032294536640200766/1432874093920780348
- Purifying slow 100% results in super high stamina: https://discord.com/channels/1032294536640200766/1415035757613154385
- Mod Blur + Bloody Robes - bloody robes still procs: https://discord.com/channels/1032294536640200766/1442256798760570940
- Plague Doctor Mask not working on summons https://discord.com/channels/1032294536640200766/1457460715236364298/1458809913123012689
- Burning Rage messes up damage buff for corrupted ancient (% damage) https://discord.com/channels/1456037265607229453/1465404299004739831/1466268335544074241
- All captured souls are Runic and so they sell for way too much SP
- Enemies created via deathmason portal DO grant xp?? https://steamcommunity.com/app/1618380/discussions/0/768556945317620000/
- Goru can farm souls on summon Golems https://discord.com/channels/1032294536640200766/1441182733002080356/1442517432714399774
- Mods disabled after "play again" https://discord.com/channels/1032294536640200766/1032294537235812404
- bugs: the sprites for mana evolution aren't showing up and there's some weird behavior with the warden and spells given by runes
- Portal tinting issue: https://discord.com/channels/1032294536640200766/1464323921603203285
- If a rift portal is in the water, trying to teleport to it just removes the portal
- UI issue, spell overwrite: https://discord.com/channels/1032294536640200766/1459724264700903548
- Fix set stat admin commands in electron build
- Deathmason negative spells: https://discord.com/channels/1032294536640200766/1410074878991667300
  - https://discord.com/channels/1032294536640200766/1394897731033759855/1416776077585682432
  - reproduction: https://discord.com/channels/1032294536640200766/1441454906774126819/1449082963718308102

---

## Medium Complexity

Multi-system bugs, interaction issues, and moderate features requiring deeper investigation.

### Bloodletting Issues (grouped)
- Bloodletting + revitalize + overheal and selfcast burst SHOWS self damage but results in healing IF you already have a shield active - Alex from Discord
- Sacrifice + Bloodletting issue: https://discord.com/channels/1032294536640200766/1453121765680353586
- Bloodletting poison issue: https://discord.com/channels/1032294536640200766/1032294537235812404/1461249977153097970
- bloodletting meteor issue https://discord.com/channels/1032294536640200766/1458453104839229673
- Blood letting preview bug: https://discord.com/channels/1032294536640200766/1450565157938794496
- Blood letting not working in multiplayer https://discord.com/channels/1032294536640200766/1456107710197006491

### Burn Issues (grouped)
- Burn bugs: https://discord.com/channels/1456037265607229453/1465404299004739831/1480915971647475783
- Weedy and Bug Jones' burn spells - icon art reference

### Exploits
- Bug: infinite SP exploit: https://discord.com/channels/1032294536640200766/1463777930856501268/1464413368936042549
- pain nova overuse exploit: https://discord.com/channels/1032294536640200766/1463001822414508032
- Goru soul debt exploit in multiplayer (queue spell during animation) - Lymsical

### Physics/Collision
- Player dashed through wall: https://discord.com/channels/1032294536640200766/1464916212545880199
- You can push units through walls if they're exiting water
- Units against a wall don't get hit by arrows (see Underworld 558 const collision = handleWallCollision)
- Collision walls broken on custom map (https://discord.com/channels/1032294536640200766/1442464596496617593)

### Maps
- Skull map has broken corners issue
- Skull map has hole https://discord.com/channels/1032294536640200766/1450936346381385902
- Fix weedy's skull map https://discord.com/channels/@me/1312250611382616186/1458137812757909547
- Tiled maps not loading https://discord.com/channels/1032294536640200766/1060649713679994900/1456761739130568918
- Water world messing up impact build https://steamcommunity.com/app/1618380/discussions/0/595163936631008041/

### Other Medium
- Too much simultaneous set bounty causes huge lag spike: https://discord.com/channels/1032294536640200766/1032294537235812404/1481449399598059712
- Higher refresh rate monitor yields faster zoom and floating text
- When cloning a lot, things start stretching https://discord.com/channels/1032294536640200766/1450486701800685639
- Optimize Clone https://discord.com/channels/1032294536640200766/1450486701800685639/1450522969343393963
- Unit auto merging caused ally npcs to change teams (https://discord.com/channels/1032294536640200766/1451585228740235304)
- Resolution issue: https://discord.com/channels/1032294536640200766/1449048866438512700
- Uncaught Error: Texture Error: frame does not fit inside the base Texture dimensions (on startup)
- Robe color selector doesn't work with Proton https://discord.com/channels/1032294536640200766/1440720803758080185
- Game won't close: https://discord.com/channels/1032294536640200766/1437296426123001958
- Save / load rune inconsistency repro steps (only with auto saves??): https://discord.com/channels/1032294536640200766/1359827639925346354/1455181336296820788
- Getting stuck on the deathmason in singleplayer when the tutorial isn't complete https://discord.com/channels/1032294536640200766/1032294537235812404/1474948979967131678
- Softlock: Add Arrow Ricochet + Targeting Arrow + Circle Targeting + Soul Bind + Arrow ; Tom Dawson (email)
- Liquid mancer affect bloodbath and drown https://discord.com/channels/1032294536640200766/1467035997362716822

---

## Medium-High Complexity

Features and systems changes that touch multiple areas.

- Rune for warden to lock one slot to prevent it from rerolling
- Sandbox mode doesn't work nor does it announce how to use it
- Rethink Mana on Kill https://discord.com/channels/1032294536640200766/1453422874865176677
- Revisit difficulty per reviews
- Revisit NUMBER_OF_PLAYERS_BEFORE_BUDGET_INCREASES: https://discord.com/channels/1456037265607229453/1456041844776370266/1465031723807932660
- Difficulty ramping suggestion: https://discord.com/channels/1032294536640200766/1445874663468302508/1464653039842492419
- Write a script to make packaging mods easier
- More pickups
- Integrate custom difficulty API:
  ```
  globalThis.setDifficulty('custom')
  globalThis.setGameRules({ PLAYER_BASE_STAMINA: 500 })
  openCustomRulesPopup()
  ```

### Desync/Multiplayer
- Swap desync? https://discord.com/channels/1032294536640200766/1451296850350051358
- Units that push eachother cause desync - Desync when units push eachother #248

---

## High Complexity

Major features, new content, and architectural changes.

- New wizard that picks spell categories instead of spells and they randomize each turn (other new character ideas: https://discord.com/channels/1032294536640200766/1452911696250146927)
- A spell that allows you to jump into enemies and explode them like Neo
- A spell that pushes units away on contact
- Steam workshop support - Steam Workshop Support #1409
- Worm's Armageddon Style customization & multiplayer enhancements a la Floofe https://discord.com/channels/1456037265607229453/1456041844776370266/1464800147946082306
- Sub objective ideas: https://discord.com/channels/1032294536640200766/1475504344764780604/1476968836136833190

---

## Review/Research (No code changes, just reading)

- Take a better look at this feedback: https://discord.com/channels/1032294536640200766/1441182733002080356
- Look over ideas: https://steamcommunity.com/app/1618380/discussions/0/693123052112785092/
- Read spell suggestions: https://discord.com/channels/1032294536640200766/1359827639925346354/1455181336296820788
- https://discord.com/channels/1456037265607229453/1456041844776370266/1465041500936208597
- Original-kevin-floof-spellmasons-save.json https://discord.com/channels/1456037265607229453/1465404299004739831/1465786054685626469
