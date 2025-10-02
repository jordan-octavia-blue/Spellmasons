import { registerEvents, registerModifiers } from "./cards";
import { getOrInitModifier } from "./cards/util";
import * as Unit from './entity/Unit';
import floatingText from "./graphics/FloatingText";
import Underworld from './Underworld';
import { freezeCardId } from "./cards/freeze";

// Grants a unit invulnerability to its own damage (I.E. explosives)
export const frozenSolidId = 'Frozen Solid';
export default function registerFrozenSolid() {
    registerModifiers(frozenSolidId, {
        description: 'Take no damage when frozen',
        stage: "Amount Override",
        _costPerUpgrade: 100,
        maxUpgradeCount: 1,
        add: (unit: Unit.IUnit, underworld: Underworld, prediction: boolean, quantity: number = 1) => {
            getOrInitModifier(unit, frozenSolidId, { isCurse: false, quantity, keepOnDeath: true }, () => {
                Unit.addEvent(unit, frozenSolidId);
            });
        }
    });
    registerEvents(frozenSolidId, {
        onTakeDamage: (unit: Unit.IUnit, amount: number, underworld: Underworld, prediction: boolean, damageDealer?: Unit.IUnit) => {
            const modifier = unit.modifiers[frozenSolidId];
            if (modifier) {
                // If I am frozen, negate damage
                if (unit.modifiers[freezeCardId]) {
                    amount = 0;
                    floatingText({ coords: unit, text: 'Frozen Solid', prediction });
                }
            }

            return amount;
        }
    });
}