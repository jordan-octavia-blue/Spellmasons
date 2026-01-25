import { addTarget, defaultTargetsForAllowNonUnitTargetTargetingSpell, getCurrentTargets, Spell } from './index';
import { drawUIConePrediction, drawUICone } from '../graphics/PlanningView';
import { CardCategory } from '../types/commonTypes';
import * as colors from '../graphics/ui/colors';
import { getAngleBetweenVec2s, Vec2 } from '../jmath/Vec';
import { isAngleBetweenAngles } from '../jmath/Angle';
import { distance, sortCosestTo } from '../jmath/math';
import { CardRarity, probabilityMap } from '../types/commonTypes';
import type Underworld from '../Underworld';
import { raceTimeout } from '../Promise';
import { easeOutCubic } from '../jmath/Easing';
import * as config from '../config';
import { HasSpace } from '../entity/Type';
import { IUnit, takeDamage } from '../entity/Unit';
import * as Unit from '../entity/Unit';
import { playDefaultSpellSFX } from './cardUtils';
import { burnCardId } from './burn';

export const gunFlamethrowerId = 'Flamethrower';
const range = 200;
const coneAngle = Math.PI / 4
const timeoutMsAnimation = 2000;
const damage = 20;
const spell: Spell = {
    card: {
        id: gunFlamethrowerId,
        category: CardCategory.Blessings,
        supportQuantity: true,
        manaCost: 20,
        healthCost: 0,
        expenseScaling: 1,
        probability: probabilityMap[CardRarity.RUNIC],
        thumbnail: 'gun-shotgun.png',
        requiresFollowingCard: false,
        description: 'Deals 20 damage and 3 stacks of burn to units in a cone originating from the caster.',
        allowNonUnitTarget: true,
        effect: async (state, card, quantity, underworld, prediction, outOfRange) => {

            const depth = state.casterUnit.attackRange;
            // Width does not change with quantity
            const adjustedAngle = coneAngle;

            // Note: This loop must NOT be a for..of and it must cache the length because it
            // mutates state.targetedUnits as it iterates.  Otherwise it will continue to loop as it grows
            const projectAngle = getAngleBetweenVec2s(state.casterUnit, state.castLocation);
            const startAngle = projectAngle + adjustedAngle / 2;
            const endAngle = projectAngle - adjustedAngle / 2;
            const target = state.casterUnit;
            const animatedCones = [];
            const location = state.casterUnit;
            // Draw visual circle for prediction
            if (prediction) {
                drawUIConePrediction(target, depth, startAngle, endAngle, 0xffffff);
            } else {
                animatedCones.push({ origin: state.casterUnit, coneStartPoint: target, radius: depth, startAngle, endAngle });
            }
            let withinRadiusAndAngle: IUnit[] = [];
            underworld.getPotentialTargets(
                prediction
            ).filter(t => Unit.isUnit(t)).filter(t => {
                return withinCone(state.casterUnit, target, depth, startAngle, endAngle, t);
            }).filter(e => e !== state.casterUnit).forEach(u => { if (Unit.isUnit(u)) withinRadiusAndAngle.push(u) });
            // Sort by distance to cone start
            withinRadiusAndAngle.sort(sortCosestTo(target));
            // Add entities to target
            withinRadiusAndAngle.forEach(e => addTarget(e, state, underworld, prediction));
            playDefaultSpellSFX(card, prediction);
            for (let unit of withinRadiusAndAngle) {
                Unit.addModifier(unit, burnCardId, underworld, prediction, 4 * quantity);
                Unit.takeDamage({ unit: unit, amount: damage * quantity, sourceUnit: state.casterUnit }, underworld, prediction);
            }
            return state;
        },
    },
};
export interface Cone {
    origin: Vec2;
    coneStartPoint: Vec2;
    radius: number;
    startAngle: number;
    endAngle: number;
}
async function animate(cones: Cone[], underworld: Underworld, prediction: boolean) {
    if (globalThis.headless || prediction) {
        // Animations do not occur on headless, so resolve immediately or else it
        // will just waste cycles on the server
        return Promise.resolve();
    }
    if (cones.length == 0) {
        // Prevent this function from running if there is nothing to animate
        return Promise.resolve();
    }
    // Keep track of which entities have been targeted so far for the sake
    // of making a new sfx when a new entity gets targeted
    const entitiesTargeted: HasSpace[] = [];
    playSFXKey('targeting');
    return raceTimeout(timeoutMsAnimation, 'animatedExpand', new Promise<void>(resolve => {
        animateFrame(cones, Date.now(), entitiesTargeted, underworld, resolve)();
    })).then(() => {
        globalThis.predictionGraphicsGreen?.clear();
    });
}
const millisToGrow = 1000;
function withinCone(origin: Vec2, coneStartPoint: Vec2, radius: number, startAngle: number, endAngle: number, target: Vec2): boolean {
    // and within angle:
    const targetAngle = getAngleBetweenVec2s(coneStartPoint, target);
    const distanceToConeStart = distance(target, coneStartPoint);

    // TODO - Investigate isAngleBetweenAngles
    //temp fix for cone inversion: if angle is whole circle, just check distance.
    return distanceToConeStart <= radius
        && (isAngleBetweenAngles(targetAngle, startAngle, endAngle) || Math.abs(endAngle - startAngle) >= 2 * Math.PI);
}
function animateFrame(cones: Cone[], startTime: number, entitiesTargeted: HasSpace[], underworld: Underworld, resolve: (value: void | PromiseLike<void>) => void) {
    return function animateFrameInner() {
        if (globalThis.predictionGraphicsGreen) {
            globalThis.predictionGraphicsGreen.clear();
            const now = Date.now();
            const timeDiff = now - startTime;
            for (let cone of cones) {

                const { radius, origin, coneStartPoint, startAngle, endAngle } = cone;

                const animatedRadius = radius * easeOutCubic(Math.min(1, timeDiff / millisToGrow));

                drawUICone(globalThis.predictionGraphicsGreen, coneStartPoint, animatedRadius, startAngle, endAngle, 0xffffff);
                globalThis.predictionGraphicsGreen.endFill();
                // Draw circles around new targets
                const withinRadiusAndAngle = underworld.getPotentialTargets(
                    false
                ).filter(t => {
                    return withinCone(origin, coneStartPoint, animatedRadius, startAngle, endAngle, t);
                });
                withinRadiusAndAngle.forEach(v => {
                    if (!entitiesTargeted.includes(v)) {
                        entitiesTargeted.push(v);
                        playSFXKey('targetAquired');
                    }
                    globalThis.predictionGraphicsGreen?.drawCircle(v.x, v.y, config.COLLISION_MESH_RADIUS);
                })
            }
            if (timeDiff > millisToGrow) {
                resolve();
                return;
            } else {
                requestAnimationFrame(animateFrame(cones, startTime, entitiesTargeted, underworld, resolve));
            }
        } else {
            resolve();
        }
    }
}
export default spell;
