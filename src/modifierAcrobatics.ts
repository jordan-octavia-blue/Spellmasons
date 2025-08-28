import { registerEvents, registerModifiers } from "./cards";
import { getOrInitModifier } from "./cards/util";
import * as Unit from './entity/Unit';
import floatingText from "./graphics/FloatingText";
import Underworld from './Underworld';
import type { IPlayer } from "./entity/Player";
import { ICard } from "./cards"
import { CardCost } from "./cards/cardUtils";
import { CardCategory } from "./types/commonTypes";

export const acrobaticsId = 'Acrobatics';
export default function registerAcrobatics() {
    registerModifiers(acrobaticsId, {
        description: 'rune_icy_veins',
        unitOfMeasure: '% Damage',
        stage: "Amount Multiplier",
        _costPerUpgrade: 200,
        quantityPerUpgrade: 300,
        maxUpgradeCount: 1,
        add: (unit: Unit.IUnit, underworld: Underworld, prediction: boolean, quantity: number = 1) => {
            getOrInitModifier(unit, acrobaticsId, { isCurse: false, quantity, keepOnDeath: true }, () => {
                Unit.addEvent(unit, acrobaticsId);
            });
        }
    });
    registerEvents(acrobaticsId, {
        onCostCalculation(player: IPlayer, card: ICard, timesUsedSoFar: number, cardCost: CardCost) {
            const modifier = player.unit.modifiers[acrobaticsId];
            if (modifier) {
                if (card.category == CardCategory.Movement) {
                    cardCost.staminaCost = cardCost.manaCost;
                    cardCost.manaCost = 0;
                }
                return cardCost;
            }
            return cardCost;
        }
    });
}