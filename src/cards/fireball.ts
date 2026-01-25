import * as Unit from '../entity/Unit';
import type { HasSpace } from '../entity/Type';
import * as Image from '../graphics/Image';
import { CardCategory } from '../types/commonTypes';
import { EffectState, ICard, refundLastSpell, Spell } from './index';
import * as math from '../jmath/math';
import { CardRarity, probabilityMap } from '../types/commonTypes';
import * as config from '../config';
import { Vec2 } from '../jmath/Vec';
import Underworld from '../Underworld';
import { makeForceMoveProjectile, moveAlongVector, normalizedVector } from '../jmath/moveWithCollision';
import { addPixiSpriteAnimated, containerProjectiles } from '../graphics/PixiUtils';
import { explode } from '../effects/explode';
import { burnCardId } from './burn';
import * as colors from '../graphics/ui/colors';


export const fireballCardId = 'Fireball';
const damage = 10;
const baseRadius = 170;
const basePushDistance = 10;
const spell: Spell = {
    card: {
        id: fireballCardId,
        category: CardCategory.Damage,
        supportQuantity: true,
        manaCost: 60,
        healthCost: 0,
        expenseScaling: 1,
        probability: probabilityMap[CardRarity.COMMON],
        thumbnail: 'spellIconArrow.png',
        // so that you can fire the arrow at targets out of range
        allowNonUnitTarget: true,
        ignoreRange: true,
        animationPath: '',
        sfx: 'arrow',
        description: ['spell_arrow', damage.toString()],
        effect: fireballEffect(1, fireballCardId)
    },
    events: {
        onProjectileCollision: ({ unit, underworld, projectile, prediction }) => {
            const impactLocation = projectile.pushedObject;
            const adjustedRadius = baseRadius * (1 + (0.25 * projectile.state.aggregator.radiusBoost));
            const burnedUnits = underworld.getUnitsWithinDistanceOfTarget(impactLocation, baseRadius, prediction);
            for (let burnVictim of burnedUnits) {
                Unit.addModifier(burnVictim, burnCardId, underworld, prediction, 3, { sourceUnitId: projectile.state.casterUnit.id });
            }
            explode(impactLocation, adjustedRadius, damage, basePushDistance,
                projectile.state.casterUnit,
                underworld, prediction,
                colors.bloatExplodeStart, colors.bloatExplodeEnd)
        }
    }
};
export function fireballEffect(multiShotCount: number, collideFnKey: string, piercesRemaining: number = 0, bouncesRemaining: number = 0) {
    return async (state: EffectState, card: ICard, quantity: number, underworld: Underworld, prediction: boolean, outOfRange?: boolean) => {
        let targets: Vec2[] = state.targetedUnits;
        targets = targets.length ? targets : [state.castLocation];
        let casterPositionAtTimeOfCast = state.casterPositionAtTimeOfCast;
        const startPoint = casterPositionAtTimeOfCast;
        for (let i = 0; i < quantity; i++) {
            for (let target of targets) {
                const velocity = math.similarTriangles(target.x - casterPositionAtTimeOfCast.x, target.y - casterPositionAtTimeOfCast.y, math.distance(startPoint, target), config.ARROW_PROJECTILE_SPEED)
                let image: Image.IImageAnimated | undefined;
                if (!prediction) {
                    image = Image.create(casterPositionAtTimeOfCast, 'arrow', containerProjectiles)
                    if (image) {
                        image.sprite.rotation = Math.atan2(velocity.y, velocity.x);
                    }
                }
                const pushedObject: HasSpace = {
                    x: casterPositionAtTimeOfCast.x,
                    y: casterPositionAtTimeOfCast.y,
                    radius: 1,
                    inLiquid: false,
                    immovable: false,
                    image,
                    beingPushed: false,
                }
                makeForceMoveProjectile({
                    sourceUnit: state.casterUnit,
                    pushedObject,
                    startPoint,
                    velocity,
                    piercesRemaining: 0,
                    bouncesRemaining: 0,
                    collidingUnitIds: [state.casterUnit.id],
                    collideFnKey,
                    state,
                }, underworld, prediction);
            }
        }
        await underworld.awaitForceMoves();
        return state;
    }
}
export default spell;