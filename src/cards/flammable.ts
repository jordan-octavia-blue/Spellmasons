import { addTarget, EffectState, ICard, Spell } from './index';
import { CardCategory } from '../types/commonTypes';
import { Vec2, lerpVec2 } from '../jmath/Vec';
import * as Unit from '../entity/Unit';
import { IUnit } from '../entity/Unit';
import { CardRarity, probabilityMap } from '../types/commonTypes';
import { easeOutCubic } from '../jmath/Easing';
import * as config from '../config';
import * as colors from '../graphics/ui/colors';
import Underworld from '../Underworld';
import { getOrInitModifier } from './util';
import { playDefaultSpellSFX } from './cardUtils';
import { burnCardId } from './burn';
import { fireballCardId } from './fireball';
export const flammableId = 'Flammable';
function add(unit: IUnit, underworld: Underworld, prediction: boolean, quantity: number, extra?: any) {
    const modifier = getOrInitModifier(unit, flammableId, { isCurse: true, quantity, keepOnDeath: true }, () => {
        // Nothing to init
    });
}
const spell: Spell = {
    card: {
        id: flammableId,
        category: CardCategory.Targeting,
        supportQuantity: true,
        manaCost: 10,
        healthCost: 0,
        expenseScaling: 1,
        probability: probabilityMap[CardRarity.SPECIAL],
        requires: [fireballCardId],
        requiresFollowingCard: false,
        sfx: 'targetCursed',
        thumbnail: 'spellIconTargetCursed.png',
        description: 'When cursed unit first gets burned, double the burn stacks and removes itself. \n Stackable.',
        allowNonUnitTarget: true,
        effect: async (state: EffectState, card: ICard, quantity: number, underworld: Underworld, prediction: boolean, outOfRange?: boolean) => {
            const targets = state.targetedUnits;
            // Add Flammable to all targeted units
            for (const target of targets) {
                Unit.addModifier(target, flammableId, underworld, prediction, quantity);
            }

            return state;
        },
    },
    modifiers: {
        add,
    },
};

export default spell;