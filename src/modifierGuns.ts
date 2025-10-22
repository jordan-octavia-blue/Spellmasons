import { registerModifiers } from "./cards";
import { gunSniperId } from "./cards/gun_sniper";
import { gunShotgunId } from "./cards/gun_shotgun";
import { getOrInitModifier } from "./cards/util";
import * as Player from './entity/Player';
import * as Unit from './entity/Unit';
import { chooseOneOfSeeded, getUniqueSeedString, seedrandom } from "./jmath/rand";
import Underworld from './Underworld';
import * as Upgrade from './Upgrade';
import { gunSilencedId } from "./cards/gun_silenced";

export const gunsId = 'Guns'
const gunUpgrades = [gunSniperId, gunShotgunId, gunSilencedId];
export function registerGuns() {
    registerModifiers(gunsId, {
        description: `Guns`,
        unitOfMeasure: 'Guns',
        _costPerUpgrade: 75,
        quantityPerUpgrade: 1,
        maxUpgradeCount: gunUpgrades.length,
        add: (unit: Unit.IUnit, underworld: Underworld, prediction: boolean, quantity: number = 1) => {
            const player = underworld.players.find(p => p.unit == unit);
            if (player) {
                getOrInitModifier(unit, gunsId, { isCurse: false, quantity, keepOnDeath: true }, () => { });
                const random = seedrandom(getUniqueSeedString(underworld, player));
                const upgradeTitle = chooseOneOfSeeded(gunUpgrades.filter(x => !player.inventory.includes(x)), random);
                if (upgradeTitle) {
                    const upgrade = Upgrade.getUpgradeByTitle(upgradeTitle);
                    if (upgrade) {
                        underworld.forceUpgrade(player, upgrade, true);
                    } else {
                        console.error('Could not find gun upgrade for Guns rune');
                    }
                } else {
                    console.error('Could not find gun upgrade for Guns rune - name');
                }
            } else {
                console.error(`Cannot add rune ${gunsId}, no player is associated with unit`);
            }
        },
    });
}
