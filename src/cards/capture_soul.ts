import { getCurrentTargets, refundLastSpell, Spell } from './index';
import * as Unit from '../entity/Unit';
import { CardCategory } from '../types/commonTypes';
import { Vec2 } from '../jmath/Vec';
import { CardRarity, probabilityMap } from '../types/commonTypes';
import { upgradeCardsSource } from '../Upgrade';
import { recalcPositionForCards } from '../graphics/ui/CardUI';
import floatingText from '../graphics/FloatingText';
import { makeManaTrail } from '../graphics/Particles';
import { playDefaultSpellSFX } from './cardUtils';
import { isWarden } from '../entity/Player';

export const id = 'Capture Soul';
const healthThreshold = 31;
const spell: Spell = {
  card: {
    id,
    category: CardCategory.Soul,
    manaCost: 40,
    healthCost: 0,
    probability: probabilityMap[CardRarity.RARE],
    expenseScaling: 2,
    supportQuantity: true,
    thumbnail: 'spellIconCaptureSoul.png',
    sfx: 'captureSoul',
    description: ['spell_capture_soul', healthThreshold.toString()],
    effect: async (state, card, quantity, underworld, prediction) => {
      const player = state.casterPlayer;
      if (player) {
        let targets = state.targetedUnits.filter(u => {
          return u.alive && u.health < healthThreshold * quantity;
        });
        for (let target of targets) {
          if (target) {
            if (!prediction) {
              const newCardId = Unit.unitSourceIdToName(target.unitSourceId, target.isMiniboss);
              const upgrade = upgradeCardsSource.find(u => u.title == newCardId)
              if (upgrade) {
                floatingText({ coords: target, text: 'Soul Captured!' });
                underworld.forceUpgrade(player, upgrade, true);
                // Track captured souls for Warden
                if (isWarden(player)) {
                  if (!player.wardenCapturedSouls.includes(target.unitSourceId)) {
                    player.wardenCapturedSouls.push(target.unitSourceId);
                  }
                  if (target.isMiniboss) {
                    const minibossName = Unit.unitSourceIdToName(target.unitSourceId, true);
                    if (!player.wardenCapturedSouls.includes(minibossName)) {
                      player.wardenCapturedSouls.push(minibossName);
                    }
                  }
                }
                playDefaultSpellSFX(card, prediction);
              } else {
                console.error('Cannot capture soul, upgrade not found with title:', newCardId)
              }
            }
            Unit.die(target, underworld, prediction, state.casterUnit);
          }
        }
        if (targets.length == 0) {
          refundLastSpell(state, prediction, 'No valid targets. Cost refunded.');
        }
      } else {
        console.error(`Cannot ${id}, no effectState.casterPlayer`);
      }
      return state;
    },
  },
};
export default spell;
