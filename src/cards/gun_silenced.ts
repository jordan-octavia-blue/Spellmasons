import * as Unit from '../entity/Unit';
import { EffectState, ICard, refundLastSpell, Spell } from './index';
import { CardCategory, CardRarity, probabilityMap } from '../types/commonTypes';
import * as math from '../jmath/math';
import { getNormalVector, jitter, projectOnNormal, Vec2 } from '../jmath/Vec';
import { arrowEffect } from './arrow';
import * as config from "../config";
import Underworld from '../Underworld';
import * as Image from '../graphics/Image';
import { playSpellSFX } from './cardUtils';
import { closestLineSegmentIntersectionWithLine, findWherePointIntersectLineSegmentAtRightAngle, LineSegment } from '../jmath/lineSegment';
import seedrandom from 'seedrandom';
import { getUniqueSeedString } from '../jmath/rand';
import { forcePushAwayFrom } from '../effects/force_move';
import floatingText from '../graphics/FloatingText';
import { healManaUnits } from '../effects/heal';

export const gunSilencedId = 'Silenced Pistol';
const damage = 50;
const manaCost = 50;
const soulFragmentCostOverride = 3;

const spell: Spell = {
  card: {
    id: gunSilencedId,
    category: CardCategory.Damage,
    manaCost,
    healthCost: 0,
    supportQuantity: true,
    expenseScaling: 1,
    soulFragmentCostOverride,
    probability: 0,
    thumbnail: 'gun-silenced.png',
    // so that you can fire the arrow at targets out of range
    allowNonUnitTarget: true,
    ignoreRange: false,
    animationPath: '',
    sfx: 'gunSilenced',
    description: ['gun_silenced_desc', damage.toString()],
    effect: async (state: EffectState, card: ICard, quantity: number, underworld: Underworld, prediction: boolean, outOfRange?: boolean) => {
      playSpellSFX('gunSilenced', prediction);
      let casterPositionAtTimeOfCast = state.casterPositionAtTimeOfCast;
      const startPoint = casterPositionAtTimeOfCast;
      let shotLocations: Vec2[] = [];
      let shotLocation = math.getCoordsAtDistanceTowardsTarget(casterPositionAtTimeOfCast, state.castLocation, state.casterUnit.attackRange, true)
      shotLocation = gunShotLOS(startPoint, shotLocation, underworld);
      shotLocations.push(shotLocation);

      if (prediction && predictionGraphicsRed) {
        predictionGraphicsRed.lineStyle(1, 0xff0000, 0.2)
        predictionGraphicsRed.moveTo(startPoint.x, startPoint.y);
        predictionGraphicsRed.lineTo(shotLocation.x, shotLocation.y);
      }
      const ls = { p1: casterPositionAtTimeOfCast, p2: shotLocation }
      const potentialTargets = underworld.getAllUnits(prediction);
      let unitsKilled = 0;
      for (let u of potentialTargets) {
        if (u == state.casterUnit) {
          continue;
        }
        const intersection = findWherePointIntersectLineSegmentAtRightAngle(u, ls)
        if (!intersection) {
          continue;
        }
        const dist = math.distance(intersection, u);
        const hitRadius = config.COLLISION_MESH_RADIUS - 8;
        if (dist <= hitRadius) {
          // const isBehind = state.casterUnit.x < u.x && state.casterUnit.
          Unit.takeDamage({
            unit: u,
            amount: damage,
            sourceUnit: state.casterUnit,
            fromVec2: ls.p1,
            thinBloodLine: true
          }, underworld, prediction);
          if (u.health <= 0) {
            // This is a special feature of this spell that if it kills the enemy it's free!
            unitsKilled++;
          }
        }
      }
      if (unitsKilled > 0) {
        if (state.casterPlayer) {
          if (state.casterPlayer.wizardType == 'Spellmason') {
            await healManaUnits([state.casterUnit], (manaCost - 20) * unitsKilled, state.casterUnit, underworld, prediction, state);
          } else if (state.casterPlayer.wizardType == 'Deathmason' && state.casterUnit.charges) {
            Unit.drawCharges(state.casterUnit, underworld, unitsKilled);
          } else if (state.casterPlayer.wizardType == 'Goru') {
            const restoredSoulFragments = (soulFragmentCostOverride - 2) * unitsKilled
            floatingText({ coords: state.casterUnit, text: `+ ${restoredSoulFragments} ${i18n('Soul Fragments')}`, style: { fill: 'white', ...config.PIXI_TEXT_DROP_SHADOW }, prediction });
            state.casterUnit.soulFragments += restoredSoulFragments;
          }
        }
      }
      doDraw(startPoint, shotLocations, prediction, Date.now() + 100);
      return state;
    },
  },
};
export function gunShotLOS(start: Vec2, end: Vec2, underworld: Underworld): Vec2 {

  const lineOfSight: LineSegment = { p1: start, p2: end };
  const closest = closestLineSegmentIntersectionWithLine(lineOfSight, underworld.walls)
  if (closest) {
    return closest.intersection;
  } else {
    return end;
  }
  // for (let w of underworld.walls) {
  //   if (lineSegmentIntersection(lineOfSight, w)) {
  //     return false
  //   }
  // }
}
function doDraw(start: Vec2, ends: Vec2[], prediction: boolean, endTime: number) {
  if (!headless && !prediction && projectileGraphics) {
    projectileGraphics.clear();
    projectileGraphics.lineStyle(2, 0xffffff, .7)
    for (let end of ends) {
      projectileGraphics.moveTo(start.x, start.y);
      projectileGraphics.lineTo(end.x, end.y);
    }
  }

  // Show the electricity for a moment
  if (Date.now() < endTime) {
    requestAnimationFrame(() => doDraw(start, ends, prediction, endTime))
  } else {
    projectileGraphics?.clear();
  }

}



export default spell;