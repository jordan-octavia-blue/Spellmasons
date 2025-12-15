import { registerEvents, registerModifiers } from "./cards";
import { getOrInitModifier } from "./cards/util";
import * as Unit from './entity/Unit';
import Underworld from './Underworld';

// Your damage spells heal allies instead of dealing damage
export const effervescenceId = 'Effervescence';
export default function registerEffervescence() {
    registerModifiers(effervescenceId, {
        description: ('Liquid now heals you instead of dealing damage'),
        _costPerUpgrade: 120,
        unitOfMeasure: '% Healing',
        quantityPerUpgrade: 30,
        maxUpgradeCount: 3,
        add: (unit: Unit.IUnit, underworld: Underworld, prediction: boolean, quantity: number = 1) => {
            getOrInitModifier(unit, effervescenceId, { isCurse: false, quantity, keepOnDeath: true }, () => {
                Unit.addEvent(unit, effervescenceId);
            });
            if (quantity == 90) {

            }
        }
    });
    registerEvents(effervescenceId, {
        onLiquid: (unit: Unit.IUnit, currentlyInLiquid: boolean, amount: number, underworld: Underworld, prediction: boolean, damageDealer?: Unit.IUnit) => {
            if (unit.modifiers[effervescenceId]) {
                amount = amount * -1 * (unit.modifiers[effervescenceId].quantity / 100);
            }
            return amount;
        }
    });
}