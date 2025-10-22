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
- [ ] Remove pillar and altar from codex
- [ ] Loading game as Goru and then spawning in the next level caused a change to spellmason
- [ ] Make sure modded familiars are visible to everyone even if the host doesn't have the mod on
- Make sure modded maps and familiars are only in the pool if the mod is enabled.
- Features
    - **[ ] Green Glop merge desync on multiplayer**
    - Green Glops can now merge with other Green Glops
    - New Corrupted Ancient enemy deals damage as a % of your health
    - Maladies! (Runes that are negative but grant SP) - Maladies are available to modders!
        - Hemorrhage (thanks Rampantgecko)
        - Rift
        - Doomed
        - Nuclear Option (thanks Entchenklein)
        - Statue (thanks Bug Jones and Mr. Big Shot)
        - Anemic
        - There will be more maladies added in the future, this is just a start!