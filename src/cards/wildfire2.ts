import { Spell } from './index';
import { CardCategory } from '../types/commonTypes';
import { CardRarity, probabilityMap } from '../types/commonTypes';
import { burnCardId } from './burn';
import { wildfire_id, contaminate } from './wildfire';

export const wildfire2_id = 'Wildfire 2';
const spell: Spell = {
    card: {
        id: wildfire2_id,
        category: CardCategory.Curses,
        supportQuantity: true,
        manaCost: 50,
        healthCost: 0,
        expenseScaling: 1,
        replaces: [wildfire_id],
        probability: probabilityMap[CardRarity.SPECIAL],
        thumbnail: 'wildfire2.png',
        allowNonUnitTarget: true,
        description: 'Spreads the burn stacks of all burning units to nearby units.',
        effect: async (state, card, quantity, underworld, prediction) => {
            let promises = [];
            for (let unit of underworld.getAllUnits(prediction).filter(u => u.modifiers[burnCardId])) {
                promises.push(contaminate(state.casterPlayer, unit, quantity, state.aggregator.radiusBoost, underworld, prediction));
            }
            await Promise.all(promises);
            return state;
        },
    },
};
export default spell;
