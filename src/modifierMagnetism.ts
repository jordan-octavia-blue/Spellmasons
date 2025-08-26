import { registerEvents, registerModifiers } from "./cards";
import { getOrInitModifier } from "./cards/util";
import * as Unit from './entity/Unit';
import Underworld from './Underworld';
import { forcePushTowards } from "./effects/force_move";
import floatingText from "./graphics/FloatingText";
import { raceTimeout } from "./Promise";

export const magnetismId = 'Magnetism';
export default function registerMagnetism() {
    registerModifiers(magnetismId, {
        description: 'Pull enemies closer to you on turn start',
        _costPerUpgrade: 30,
        unitOfMeasure: 'Units',
        quantityPerUpgrade: 1,
        maxUpgradeCount: 3,
        add: (unit: Unit.IUnit, underworld: Underworld, prediction: boolean, quantity: number = 1) => {
            getOrInitModifier(unit, magnetismId, { isCurse: false, quantity, keepOnDeath: true }, () => {
                Unit.addEvent(unit, magnetismId);
            });
        },
    });
    registerEvents(magnetismId, {
        onTurnStart: async (unit: Unit.IUnit, underworld: Underworld, prediction: boolean) => {
            const modifier = unit.modifiers[magnetismId];
            if (modifier) {
                const chargedUnits = underworld.getAllUnits(prediction).filter(u => u.alive);
                const promises = [];
                for (let chargedUnit of chargedUnits) {
                    promises.push(forcePushTowards(chargedUnit, unit, 140, underworld, prediction));
                }
                await raceTimeout(2_000, 'magnetism', Promise.all(promises));
            }

        }
    });
}