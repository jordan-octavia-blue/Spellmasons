import type * as PIXI from 'pixi.js';
import { IUnit, takeDamage } from '../entity/Unit';
import * as Image from '../graphics/Image';
import { Spell } from './index';
import * as Unit from '../entity/Unit';
import Underworld from '../Underworld';
import { CardCategory } from '../types/commonTypes';
import { playDefaultSpellAnimation, playDefaultSpellSFX } from './cardUtils';
import floatingText from '../graphics/FloatingText';
import { CardRarity, probabilityMap } from '../types/commonTypes';
import { getOrInitModifier } from './util';
import { refundLastSpell } from './index';
import { burnCardId } from './burn';

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
        thumbnail: 'spellIconPoison.png',
        animationPath: 'spellPoison',
        description: "Adds 1 stack of Burn to all targeted Burning Units",
        effect: async (state, card, quantity, underworld, prediction) => {
            // .filter: only target living units
            const targets = state.targetedUnits.filter(u => u.alive).filter(u => u.modifiers[burnCardId]);
            if (targets.length > 0) {
                await Promise.all([playDefaultSpellAnimation(card, targets, prediction), playDefaultSpellSFX(card, prediction)]);
                for (let unit of targets) {
                    const modifier = unit.modifiers[burnCardId];
                    if (modifier) {
                        modifier.quantity += baseBurnStacks * quantity;
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