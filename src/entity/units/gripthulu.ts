import type * as PIXI from 'pixi.js';
import { allUnits, type UnitSource } from './index';
import { UnitSubType, UnitType } from '../../types/commonTypes';
import * as Unit from '../Unit';
import * as math from '../../jmath/math';
import { MultiColorReplaceFilter } from '@pixi/filter-multi-color-replace';
import { bloodGripthulu } from '../../graphics/ui/colors';
import type Underworld from '../../Underworld';
import { containerProjectiles } from '../../graphics/PixiUtils';
import { getAngleBetweenVec2s, Vec2 } from '../../jmath/Vec';
import { forcePushToDestination } from '../../effects/force_move';
import { getBestRangedLOSTarget, rangedLOSMovement } from './actions/rangedAction';
import { allModifiers, registerEvents } from '../../cards';
import { getOrInitModifier } from '../../cards/util';
import { raceTimeout } from '../../Promise';

export const gripthulu_id = 'gripthulu';
const unit: UnitSource = {
  id: gripthulu_id,
  info: {
    description: 'gripthulu copy',
    image: 'gripthulu/poisIdle',
    subtype: UnitSubType.SPECIAL_LOS,
  },
  unitProps: {
    damage: 0,
    attackRange: 500,
    mana: 30,
    manaMax: 30,
    manaPerTurn: 10,
    manaCostToCast: 20,
    bloodColor: bloodGripthulu,
  },
  spawnParams: {
    probability: 100,
    budgetCost: 4,
    maxQuantityPerLevel: 3,
    unavailableUntilLevelIndex: 5,
  },
  animations: {
    idle: 'gripthulu/poisIdle',
    hit: 'gripthulu/poisHit',
    attack: 'gripthulu/poisAttack',
    die: 'gripthulu/poisDeath',
    walk: 'gripthulu/poisWalk',
  },
  sfx: {
    damage: 'poisonerHurt',
    death: 'poisonerDeath'
  },
  init: (unit: Unit.IUnit, underworld: Underworld) => {
    const modifier = getOrInitModifier(unit, gripthuluAction, { isCurse: false, quantity: 1 }, () => {
      Unit.addEvent(unit, gripthuluAction);
    });
  },
  action: async (unit: Unit.IUnit, attackTargets, underworld) => {
    // Gripthulhu just checks attackTarget, not canAttackTarget to know if it can attack because getBestRangedLOSTarget() will return undefined
    // if it can't attack any targets
    const attackTarget = attackTargets && attackTargets[0];
    // Attack
    if (attackTarget && unit.mana >= unit.manaCostToCast) {
      //@ts-ignore: Prevent attacking after moving
      unit.movedThisTurn = false;
    } else {
      //@ts-ignore: Prevent attacking after moving
      unit.movedThisTurn = true;
      // If it gets to this block it means it is either out of range or cannot see enemy
      await rangedLOSMovement(unit, underworld);
    }
  },
  getUnitAttackTargets: (unit: Unit.IUnit, underworld: Underworld) => {
    const targets = getBestRangedLOSTarget(unit, underworld)
      // @ts-ignore: targetedByGripthulu prevents multiple gripthulus from targeting the same target which causes a desync
      .filter(u => !u.targetedByGripthulu || u.targetedByGripthulu == unit.id);
    if (targets) {
      // Gripthulu can only target one enemy
      return targets.slice(0, 1).map(u => {
        // @ts-ignore: targetedByGripthulu prevents multiple gripthulus from targeting the same target which causes a desync
        u.targetedByGripthulu = unit.id;
        return u;
      });
    } else {
      return [];
    }
  }
};
const forwardSpeed = 0.2;
const backwardSpeed = 0.5;
export async function animateDrag(start: Vec2, end: Vec2) {
  if (!globalThis.pixi) {
    return;
  }
  let count = 0;

  const NUM_OF_POINTS = 20;
  const ropeLength = math.distance(start, end) / NUM_OF_POINTS;

  const points: PIXI.Point[] = [];

  for (let i = 0; i < NUM_OF_POINTS; i++) {
    points.push(new globalThis.pixi.Point(0, 0));
  }

  const strip = new globalThis.pixi.SimpleRope(globalThis.pixi.Texture.from('gripthuluMagic.png'), points);

  strip.x = start.x;
  strip.y = start.y;
  // Make strip grow towards target
  strip.rotation = getAngleBetweenVec2s(start, end);

  containerProjectiles?.addChild(strip);
  return new Promise<void>((resolve) => {
    // start animating
    requestAnimationFrame(animate);
    const waveHeight = 10;
    const endCount = 10;
    let retracting = false;

    function animate() {
      if (retracting) {
        count -= backwardSpeed;
      } else {
        count += forwardSpeed;
      }
      if (count >= endCount) {
        resolve();
        retracting = true;
      }
      const animatedLength = math.lerp(0, ropeLength, count / endCount);

      for (let i = 0; i < points.length; i++) {
        const point = points[i];
        if (point) {
          point.y = Math.sin((i * 0.5) + count) * waveHeight * i / 8;
          point.x = i * animatedLength;
          // Pull target back with last point
          // if (retracting) {
          //   const isLastPoint = i == points.length - 1;
          //   if (isLastPoint) {
          //     end.x = point.x;
          //     end.y = point.y;
          //   }
          // }
        }
      }

      if (retracting && count <= 0) {
        // clean up
        containerProjectiles?.removeChild(strip);

      } else {
        // keep animating
        requestAnimationFrame(animate);
      }
    }
  });
}
export default unit;

export const gripthuluAction = 'I am Gripthulu';
export function registerGripthuluAction() {

  registerEvents(gripthuluAction, {
    onTooltip: (unit: Unit.IUnit, underworld: Underworld) => {
      const modifier = unit.modifiers[gripthuluAction];
      if (modifier && allModifiers[gripthuluAction]) {
        // Only player units should get the description
        allModifiers[gripthuluAction].description = unit.unitType == UnitType.PLAYER_CONTROLLED ? i18n('rune_i_am_gripthulu') : '';
      }
    },
    onTurnEnd: async (unit: Unit.IUnit, underworld: Underworld, prediction: boolean) => {
      //@ts-ignore: Prevent attacking after moving
      if (unit.movedThisTurn) {
        return;
      }
      const isPlayerUnit = unit.unitType === UnitType.PLAYER_CONTROLLED
      const unitSource = allUnits[unit.unitSourceId]
      if (unitSource) {
        const attackTargets = isPlayerUnit ?
          getBestRangedLOSTarget(unit, underworld)
            // @ts-ignore: targetedByGripthulu prevents multiple gripthulus from targeting the same target which causes a desync
            .filter(u => !u.targetedByGripthulu || u.targetedByGripthulu == unit.id)
          : unitSource.getUnitAttackTargets(unit, underworld);
        const attackTarget = attackTargets[0];
        if (attackTarget && (isPlayerUnit || unit.mana >= unit.manaCostToCast)) {
          Unit.orient(unit, attackTarget);
          let promise = Promise.resolve();
          if (isPlayerUnit) {
            const quantity = unit.modifiers[gripthuluAction]?.quantity || 1;
            const promises = []
            for (let target of attackTargets.slice(0, quantity)) {

              // CAUTION: Desync risk, having 2 awaits in headless causes a movement desync
              // because the forcePush must be invoked syncronously such that the forceMove record
              // is created when this function returns syncronously so that the headless engine will
              // run forceMoves as soon as it is done
              let animatePromise = Promise.resolve();
              if (!globalThis.headless) {
                animatePromise = animateDrag(unit, target);
              }
              promises.push(animatePromise.then(() => forcePushToDestination(target, unit, 1, underworld, false, unit)));
            }
            promise = raceTimeout(2000, "player gripthulu", Promise.all(promises));
          } else {
            unit.mana -= unit.manaCostToCast;
            // CAUTION: Desync risk, having 2 awaits in headless causes a movement desync
            // because the forcePush must be invoked syncronously such that the forceMove record
            // is created when this function returns syncronously so that the headless engine will
            // run forceMoves as soon as it is done
            if (!globalThis.headless) {
              await Unit.playComboAnimation(unit, unit.animations.attack, () => {
                return animateDrag(unit, attackTarget);
              });
            }
            promise = forcePushToDestination(attackTarget, unit, 1, underworld, false, unit);
            // @ts-ignore: targetedByGripthulu prevents multiple gripthulus from targeting the same target which causes a desync
            delete unit.targetedByGripthulu;
          }
          return promise;
        }
      }
    },
  });
}