import { registerEvents, registerModifiers } from "./cards";
import { freezeCardId } from "./cards/freeze";
import { getOrInitModifier } from "./cards/util";
import * as Unit from './entity/Unit';
import floatingText from "./graphics/FloatingText";
import { get } from "./storage";
import Underworld from './Underworld';

export const vampirismId = 'Vampirism';
export default function registerVampirism() {
    registerModifiers(vampirismId, {
        description: 'Permanent Blood Curse, Gain Lifesteal',
        unitOfMeasure: '% Healing',
        stage: "Amount Multiplier",
        _costPerUpgrade: 70,
        quantityPerUpgrade: 20,
        maxUpgradeCount: 5,
        add: (unit: Unit.IUnit, underworld: Underworld, prediction: boolean, quantity: number = 1) => {
            getOrInitModifier(unit, vampirismId, { isCurse: false, quantity, keepOnDeath: true }, () => {
                Unit.addEvent(unit, vampirismId);
            });
            getOrInitModifier(unit, 'Blood Curse', { isCurse: true, quantity, keepOnDeath: true }, () => {
                Unit.addModifier(unit, 'Blood Curse', underworld, prediction, 1);
                Unit.addEvent(unit, 'Blood Curse');
            });
        }
    });
    registerEvents(vampirismId, {
        onDealDamage: (damageDealer: Unit.IUnit, amount: number, underworld: Underworld, prediction: boolean, damageReciever?: Unit.IUnit) => {
            const modifier = damageDealer.modifiers[vampirismId];
            if (modifier) {
                const healAmount = amount * (modifier.quantity / 100);
                if (damageDealer.health + healAmount < damageDealer.healthMax) {
                    damageDealer.health += healAmount;
                } else if (damageDealer.health + healAmount >= damageDealer.healthMax) {
                    damageDealer.health = damageDealer.healthMax;
                }
            }

            return amount;
        },
        onTurnStart: async (unit: Unit.IUnit, underworld: Underworld, prediction: boolean) => {
            if (unit.modifiers[vampirismId] && !unit.modifiers['Blood Curse']) {
                getOrInitModifier(unit, 'Blood Curse', { isCurse: true, quantity: unit.modifiers[vampirismId].quantity, keepOnDeath: true }, () => {
                    Unit.addModifier(unit, 'Blood Curse', underworld, prediction, 1);
                    Unit.addEvent(unit, 'Blood Curse');
                });
            }
        }
    });
}