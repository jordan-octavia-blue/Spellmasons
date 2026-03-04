import { Spell } from './index';
import * as Unit from '../entity/Unit';
import Underworld from '../Underworld';
import { CardCategory } from '../types/commonTypes';
import { playDefaultSpellSFX } from './cardUtils';
import { CardRarity, probabilityMap } from '../types/commonTypes';
import { refundLastSpell } from './index';
import { burnCardId, applyBurnWithEffect } from './burn';
import { stokeCardId } from './stoke';

export const stoke2CardId = 'Stoke 2';
const baseBurnStacks = 1;
const spell: Spell = {
    card: {
        id: stoke2CardId,
        category: CardCategory.Curses,
        sfx: 'poison',
        supportQuantity: true,
        manaCost: 12,
        healthCost: 0,
        allowNonUnitTarget: true,
        expenseScaling: 1,
        requires: [stokeCardId],
        probability: probabilityMap[CardRarity.UNCOMMON],
        thumbnail: 'stoke2.png',
        description: "Adds 1 stack of Burn to ALL Burning Units",
        effect: async (state, card, quantity, underworld, prediction) => {
            // .filter: only target living units
            const targets = underworld.getAllUnits(prediction).filter(u => u.modifiers[burnCardId]);
            if (targets.length > 0) {
                playDefaultSpellSFX(card, prediction);
                for (let unit of targets) {
                    const modifier = unit.modifiers[burnCardId];
                    if (modifier) {
                        modifier.quantity += baseBurnStacks * quantity;
                        applyBurnWithEffect(unit, underworld, prediction, 0);
                    } else {
                        applyBurnWithEffect(unit, underworld, prediction, baseBurnStacks * quantity);
                    }
                }
            } else {
                refundLastSpell(state, prediction);
                return state;
            }
            return state;
        },
    },
}
export default spell;