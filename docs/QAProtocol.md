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
- **Clear local storage and reboot game and make sure it plays** `localStorage.clear()`
    - Purge saved settings too: spellmasons_settings.json';
    - This is critical: https://discord.com/channels/1032294536640200766/1431665177278808226/1431751252353745119

- 2026
    - **Make sure red out of range circle still exists**