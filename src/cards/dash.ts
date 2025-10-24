import { getCurrentTargets, Spell } from './index';
import { CardCategory } from '../types/commonTypes';
import { playDefaultSpellSFX } from './cardUtils';
import { CardRarity, probabilityMap } from '../types/commonTypes';
import { forcePushToDestination } from '../effects/force_move';

export const dash_id = 'Dash';
const spell: Spell = {
  card: {
    id: dash_id,
    category: CardCategory.Movement,
    supportQuantity: true,
    sfx: 'dash',
    manaCost: 10,
    healthCost: 0,
    expenseScaling: 1,
    probability: probabilityMap[CardRarity.COMMON],
    thumbnail: 'spellIconDash.png',
    description: 'spell_dash',
    effect: async (state, card, quantity, underworld, prediction) => {
      const targets = getCurrentTargets(state);
      if (!targets.length) {
        return state;
      }
      const target = targets[targets.length - 1];
      playDefaultSpellSFX(card, prediction);
      if (target) {
        await forcePushToDestination(state.casterUnit, target, quantity, underworld, prediction, state.casterUnit);
      }
      return state;
    },
  },
};
export default spell;
