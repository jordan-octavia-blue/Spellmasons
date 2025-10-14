import * as Unit from '../entity/Unit';
import { EffectState, ICard, Spell } from './index';
import { CardCategory, CardRarity, probabilityMap } from '../types/commonTypes';
import * as math from '../jmath/math';
import { Vec2 } from '../jmath/Vec';
import { arrowEffect } from './arrow';
import * as config from "../config";
import Underworld from '../Underworld';
import * as Image from '../graphics/Image';
import { playSpellSFX } from './cardUtils';
import { findWherePointIntersectLineSegmentAtRightAngle } from '../jmath/lineSegment';

export const gunSniperId = 'Sniper Rifle';
const max_damage = 100;

const spell: Spell = {
  card: {
    id: gunSniperId,
    category: CardCategory.Damage,
    manaCost: 100,
    healthCost: 0,
    supportQuantity: true,
    expenseScaling: 1,
    costGrowthAlgorithm: 'exponential',
    probability: 0,
    thumbnail: 'gun-sniper.png',
    // so that you can fire the arrow at targets out of range
    allowNonUnitTarget: true,
    ignoreRange: true,
    animationPath: '',
    sfx: 'gunSniper',
    description: ['gun_sniper', max_damage.toString()],
    effect: async (state: EffectState, card: ICard, quantity: number, underworld: Underworld, prediction: boolean, outOfRange?: boolean) => {
      playSpellSFX('gunSniper', prediction);
      // START: Shoot multiple arrows at offset
      let casterPositionAtTimeOfCast = state.casterPositionAtTimeOfCast;
      let castLocation = math.getCoordsAtDistanceTowardsTarget(casterPositionAtTimeOfCast, state.castLocation, 10000, true);
      const startPoint = casterPositionAtTimeOfCast;
      if (prediction && predictionGraphicsRed) {
        predictionGraphicsRed.lineStyle(1, 0xff0000, 1.0)
        predictionGraphicsRed.moveTo(startPoint.x, startPoint.y);
        predictionGraphicsRed.lineTo(castLocation.x, castLocation.y);
      }
      const ls = { p1: casterPositionAtTimeOfCast, p2: castLocation }
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
          const damage = quantity * math.lerp(max_damage, 10, dist / hitRadius);
          Unit.takeDamage({
            unit: u,
            amount: damage,
            sourceUnit: state.casterUnit,
            fromVec2: ls.p1,
            thinBloodLine: true
          }, underworld, prediction);

        }

      }
      return state;
    },
  },
};



export default spell;