import { Spell } from './index';
import { CardCategory } from '../types/commonTypes';
import { playDefaultSpellSFX } from './cardUtils';
import { CardRarity, probabilityMap } from '../types/commonTypes';
import { refundLastSpell } from './index';
import { burnCardId, applyBurnWithEffect } from './burn';

export const stokeCardId = 'Stoke';
const baseBurnStacks = 1;
const spell: Spell = {
    card: {
        id: stokeCardId,
        category: CardCategory.Curses,
        sfx: 'poison',
        supportQuantity: true,
        manaCost: 8,
        healthCost: 0,
        expenseScaling: 1,
        probability: probabilityMap[CardRarity.UNCOMMON],
        thumbnail: 'stoke.png',
        description: "Adds 1 stack of Burn to all targeted Burning Units",
        effect: async (state, card, quantity, underworld, prediction) => {
            // .filter: only target living units
            const targets = state.targetedUnits.filter(u => u.alive).filter(u => u.modifiers[burnCardId]);
            if (targets.length > 0) {
                playDefaultSpellSFX(card, prediction);
                for (let unit of targets) {
                    const modifier = unit.modifiers[burnCardId];
                    if (modifier) {
                        modifier.quantity += baseBurnStacks * quantity;
                        applyBurnWithEffect(unit, underworld, prediction, 0);
                    }
                }
            } else {
                refundLastSpell(state, prediction, "Target a burning unit!");
                return state;
            }
            return state;
        },
    },
}
export default spell;