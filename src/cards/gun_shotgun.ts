import * as Unit from '../entity/Unit';
import { EffectState, ICard, Spell } from './index';
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

export const gunShotgunId = 'Shotgun';
const damage = 10;
const shots = 10;

const spell: Spell = {
  card: {
    id: gunShotgunId,
    category: CardCategory.Damage,
    manaCost: 50,
    healthCost: 0,
    supportQuantity: true,
    expenseScaling: 1,
    probability: 0,
    thumbnail: 'gun-shotgun.png',
    // so that you can fire the arrow at targets out of range
    allowNonUnitTarget: true,
    ignoreRange: false,
    animationPath: '',
    sfx: 'gunShotgun',
    description: ['gun_shotgun_desc', damage.toString()],
    effect: async (state: EffectState, card: ICard, quantity: number, underworld: Underworld, prediction: boolean, outOfRange?: boolean) => {
      playSpellSFX('gunShotgun', prediction);
      let casterPositionAtTimeOfCast = state.casterPositionAtTimeOfCast;
      let castLocation = state.castLocation;
      // let castLocation = math.getCoordsAtDistanceTowardsTarget(casterPositionAtTimeOfCast, state.castLocation, 1000, true);
      const startPoint = casterPositionAtTimeOfCast;
      const seed = seedrandom(getUniqueSeedString(underworld, state.casterPlayer));
      let shotLocations: Vec2[] = [];
      for (let s = 0; s < shots * quantity; s++) {
        const radius = 100 * (state.aggregator.radiusBoost || 1);
        let shotLocation = jitter(castLocation, radius, seed);
        shotLocation = gunShotLOS(startPoint, shotLocation, underworld);
        shotLocations.push(shotLocation);

        if (prediction && predictionGraphicsRed) {
          predictionGraphicsRed.lineStyle(1, 0xff0000, 0.2)
          predictionGraphicsRed.moveTo(startPoint.x, startPoint.y);
          predictionGraphicsRed.lineTo(shotLocation.x, shotLocation.y);
        }
        const ls = { p1: casterPositionAtTimeOfCast, p2: shotLocation }
        const potentialTargets = underworld.getAllUnits(prediction);
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
            Unit.takeDamage({
              unit: u,
              amount: damage,
              sourceUnit: state.casterUnit,
              fromVec2: ls.p1,
              thinBloodLine: true
            }, underworld, prediction);
          }
        }
      }
      doDraw(startPoint, shotLocations, prediction, Date.now() + 100);
      await forcePushAwayFrom(state.casterUnit, castLocation, 60 * quantity, underworld, prediction, state.casterUnit);
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