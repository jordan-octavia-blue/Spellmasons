# QA Protocol
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

Oct 24:
- [ ] Make sure modded familiars are visible to everyone even if the host doesn't have the mod on
- [ ] Test self-revival
- Test new translations
    - check translations for all maladies
- [ ] Retest doom scroll
- Make sure modded maps and familiars are only in the pool if the mod is enabled.
- [ ] Back compat: underworld.events is not iterable
- Test familiars on multiplayers
- QA modded maps
- Update i18n
- Thank KendoWeed69 for starting soul amount rune

--- Archived
- Test loading a saved multiplayer game
- Test Hotseat multiplayer basics
    - Test one player dying and next player carrying on to next level and make sure they both spawn
