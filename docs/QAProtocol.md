# QA Protocol

- QA: Skipping tutorial if the first thing you do is play as a different wizard than the spellmason
- QA: Loading a sandbox game
- QA: Fix set stat admin commands in electron build
- Bug: Warden shouldn't have access to "Sell"
- Bug: Warden shouldn't have access to constant runes that belong to other wizard types
- Bug: warden's earned spells through runes don't stay
- Warden's random spells shouldn't pulling from mods unless the mods are active
- Warden spells should always randomize within their existing category, so if you have a damage spell in slot one, when they randomize, slot one should still be a damage spell
- Feature: Add a constant rune for warden that allows for locking the first X spell slots so they don't randomize during a round (they should still randomize after you beat a level).  Allow upgrading it 3 times to affect up to 3 spell slots
**MARCH**
- QA all latest changes
    - Custom rule override
    - Sandbox (qa in steam build)
    - Burn spells

## Regular
- Run `npm run headless-build-only` to check tsc errors which `npm run bun-headless` will not catch
- Test hosting LAN server from Electron build
- Test tutorial ALWAYS on electron build
- Test Host Local Server, Host via Docker (run `testDockerImage.sh`)
- Run `npm run build_types` to keeps mods types up to date (and push the changes to github)
    - Test mods
    - Push types to spellmasons-mods
- Make sure the AI can take their turn
- Test saving if you modify underworld with new elements added to the level that need to be serialized
- Test loading an old save file for backwards compatibility
- **Clear local storage and reboot game and make sure it plays** `localStorage.clear()`
    - Purge saved settings too, set spellmasons_settings.json to `{}` (deleting it wont work because steam cloud will sync it);
    - This is critical: https://discord.com/channels/1032294536640200766/1431665177278808226/1431751252353745119
- new bugs?
    - **Deathmason particles not shownig up in hotseat mult?**
    - somehow gripthulu pulled me after death (also after being frozen)
    - souls don't show up in hotseat after you switch back to goru
