import { registerModifiers } from "./cards";
import { getOrInitModifier } from "./cards/util";
import * as Unit from './entity/Unit';
import Underworld from './Underworld';

export const runeNimbleId = 'Nimble';

export default function registerNimble() {
    registerModifiers(runeNimbleId, {
        description: 'Gain 10% increased movement speed per stack',
        _costPerUpgrade: 10,
        add: (unit: Unit.IUnit, underworld: Underworld, prediction: boolean, quantity: number = 1) => {
            const player = underworld.players.find(p => p.unit == unit);
            if (player) {
                getOrInitModifier(unit, runeNimbleId, { isCurse: false, quantity, keepOnDeath: true }, () => { });
                unit.moveSpeed *= (1 + 0.1 * quantity);
            } else {
                console.error(`Cannot add rune ${runeNimbleId}, no player is associated with unit`);
            }
        },
    });
}
