import { registerEvents, registerModifiers } from "./cards";
import { getOrInitModifier } from "./cards/util";
import * as Unit from './entity/Unit';
import Underworld from './Underworld';
import * as Cards from './cards';
import { randInt } from "./jmath/rand";
import floatingText from "./graphics/FloatingText";

// Deals [quantity] damage to an attacker when hit
export const BlurId = 'Blur';
export default function registerBlur() {
    registerModifiers(BlurId, {
        unitOfMeasure: '% Nullification chance',
        description: 'Gain a % chance to avoid damage',
        _costPerUpgrade: 70,
        quantityPerUpgrade: 1,
        maxUpgradeCount: 5,
        add: (unit: Unit.IUnit, underworld: Underworld, prediction: boolean, quantity: number = 1) => {
            getOrInitModifier(unit, BlurId, { isCurse: false, quantity, keepOnDeath: true }, () => {
                Unit.addEvent(unit, BlurId);
            });
        }
    });
    registerEvents(BlurId, {
        onTakeDamage: (unit: Unit.IUnit, amount: number, underworld: Underworld, prediction: boolean, damageDealer?: Unit.IUnit) => {
            const modifier = unit.modifiers[BlurId];
            if (modifier) {
                // Blur will not negate damage if we are being healed
                if (damageDealer && amount > 0) {
                    const roll = randInt(1, 100);
                    if (roll <= modifier.quantity) {
                        amount = 0;
                        floatingText({ coords: unit, text: `Dodged!`, prediction });
                    }
                }
            }

            // Blur does not modify incoming damage
            return amount;
        }
    });
}