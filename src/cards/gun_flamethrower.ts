import { addTarget, Spell } from './index';
import { drawUIConePrediction } from '../graphics/PlanningView';
import { CardCategory } from '../types/commonTypes';
import { getAngleBetweenVec2s, Vec2 } from '../jmath/Vec';
import { isAngleBetweenAngles } from '../jmath/Angle';
import { distance, sortCosestTo } from '../jmath/math';
import { CardRarity, probabilityMap } from '../types/commonTypes';
import { IUnit } from '../entity/Unit';
import * as Unit from '../entity/Unit';
import { playDefaultSpellSFX } from './cardUtils';
import { burnCardId } from './burn';

export const gunFlamethrowerId = 'Flamethrower';
const coneAngle = Math.PI / 4;
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
        thumbnail: 'flamethrower.png',
        requiresFollowingCard: false,
        description: 'Deals 20 damage and 4 stacks of burn to units in a cone originating from the caster.',
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
            // Draw visual cone for prediction
            if (prediction) {
                drawUIConePrediction(target, depth, startAngle, endAngle, 0xffffff);
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
                Unit.addModifier(unit, burnCardId, underworld, prediction, 4 * quantity, { sourceUnitId: state.casterUnit.id });
                Unit.takeDamage({ unit: unit, amount: damage * quantity, sourceUnit: state.casterUnit }, underworld, prediction);
            }
            return state;
        },
    },
};
function withinCone(origin: Vec2, coneStartPoint: Vec2, radius: number, startAngle: number, endAngle: number, target: Vec2): boolean {
    // and within angle:
    const targetAngle = getAngleBetweenVec2s(coneStartPoint, target);
    const distanceToConeStart = distance(target, coneStartPoint);

    // TODO - Investigate isAngleBetweenAngles
    //temp fix for cone inversion: if angle is whole circle, just check distance.
    return distanceToConeStart <= radius
        && (isAngleBetweenAngles(targetAngle, startAngle, endAngle) || Math.abs(endAngle - startAngle) >= 2 * Math.PI);
}
export default spell;
