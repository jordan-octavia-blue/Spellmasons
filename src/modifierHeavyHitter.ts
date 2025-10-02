import { registerEvents, registerModifiers } from "./cards";
import { getOrInitModifier } from "./cards/util";
import * as Unit from './entity/Unit';
import floatingText from "./graphics/FloatingText";
import Underworld from './Underworld';
import type { IPlayer } from "./entity/Player";
import { ICard } from "./cards"
import { CardCost } from "./cards/cardUtils";
import { CardCategory } from "./types/commonTypes";

export const heavyHitterId = 'Heavy Hitter';
export default function registerHeavyHitter() {
    registerModifiers(heavyHitterId, {
        description: 'Doubles the cost of damage spells, but they now deal damage again as pure damage',
        _costPerUpgrade: 150,
        quantityPerUpgrade: 1,
        maxUpgradeCount: 1,
        add: (unit: Unit.IUnit, underworld: Underworld, prediction: boolean, quantity: number = 1) => {
            getOrInitModifier(unit, heavyHitterId, { isCurse: false, quantity, keepOnDeath: true }, () => {
                Unit.addEvent(unit, heavyHitterId);
            });
        }
    });
    registerEvents(heavyHitterId, {
        onCostCalculation(player: IPlayer, card: ICard, timesUsedSoFar: number, cardCost: CardCost) {
            const modifier = player.unit.modifiers[heavyHitterId];
            if (modifier) {
                if (card.category == CardCategory.Damage) {
                    cardCost.manaCost *= 2;
                    cardCost.staminaCost *= 2;
                    cardCost.healthCost *= 2;
                }
                return cardCost;
            }
            return cardCost;
        },
        onDealDamage: (damageDealer: Unit.IUnit, amount: number, underworld: Underworld, prediction: boolean, damageReciever?: Unit.IUnit) => {
            const modifier = damageDealer.modifiers[heavyHitterId];
            if (modifier && damageReciever) {
                Unit.takeDamage({ unit: damageReciever, amount, pureDamage: true, }, underworld, prediction);
            }
            return amount;
        }
    });
}