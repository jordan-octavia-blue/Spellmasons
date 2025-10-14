import * as Unit from '../entity/Unit';
import { EffectState, Spell, addTarget, refundLastSpell } from './index';
import Underworld from '../Underworld';
import { CardCategory } from '../types/commonTypes';
import { playDefaultSpellAnimation, playDefaultSpellSFX } from './cardUtils';
import { CardRarity, probabilityMap } from '../types/commonTypes';
import * as Pickup from '../entity/Pickup';


export const purifyCardId = 'purify';
// Removes all curse modifiers
const spell: Spell = {
  card: {
    id: purifyCardId,
    category: CardCategory.Blessings,
    sfx: 'purify',
    manaCost: 20,
    healthCost: 0,
    expenseScaling: 1,
    probability: probabilityMap[CardRarity.UNCOMMON],
    thumbnail: 'spellIconPurify.png',
    animationPath: 'spellPurify',
    description: 'spell_purify',
    effect: async (state, card, quantity, underworld, prediction) => {
      const targets = [...state.targetedUnits, ...state.targetedPickups.filter(p => p.name == Pickup.RED_PORTAL)];
      let doRefund = true;
      if (targets.length) {
        doRefund = false;
        playDefaultSpellSFX(card, prediction);
        await playDefaultSpellAnimation(card, targets, prediction);
        for (let thing of targets) {
          apply(thing, underworld, prediction, state)
        }
      }
      if (doRefund) {
        refundLastSpell(state, prediction, 'No valid targets. Cost refunded.')
      }
      return state;
    },
  },
};
export function apply(thing: Unit.IUnit | Pickup.IPickup, underworld: Underworld, prediction: boolean, state: EffectState) {

  if (Unit.isUnit(thing)) {

    for (let [modifier, modifierProperties] of Object.entries(thing.modifiers)) {
      if (modifierProperties.isCurse) {
        Unit.removeModifier(thing, modifier, underworld);
      }
    }
  } else if (Pickup.isPickup(thing)) {
    // Purify turns red portals into blue portals
    if (thing.name == Pickup.RED_PORTAL) {
      const clone = Pickup.create({ pos: thing, pickupSource: Pickup.pickups.find((p) => p.name == Pickup.BLUE_PORTAL)!, logSource: 'Clone' }, underworld, prediction);
      if (clone) {
        Pickup.setPosition(clone, thing.x, thing.y);
        Pickup.setPower(clone, thing.power);
        addTarget(clone, state, underworld, prediction);
      }
      Pickup.removePickup(thing, underworld, prediction);

    }
  }
}
export default spell;
