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
        thumbnail: 'spellIconPoison.png',
        animationPath: 'spellPoison',
        description: "Adds 1 stack of Burn to ALL Burning Units",
        effect: async (state, card, quantity, underworld, prediction) => {
            // .filter: only target living units
            const targets = underworld.getAllUnits(prediction).filter(u => u.modifiers[burnCardId]);
            if (targets.length > 0) {
                await Promise.all([playDefaultSpellAnimation(card, targets, prediction), playDefaultSpellSFX(card, prediction)]);
                for (let unit of targets) {
                    const modifier = unit.modifiers[burnCardId];
                    if (modifier) {
                        modifier.quantity += baseBurnStacks * quantity;
                    } else {
                        Unit.addModifier(unit, burnCardId, underworld, prediction, baseBurnStacks * quantity);
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