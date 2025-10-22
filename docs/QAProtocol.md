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
- **[ ] Green Glop merge desync on multiplayer**