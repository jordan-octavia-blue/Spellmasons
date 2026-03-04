import * as Unit from '../entity/Unit';
import type { HasSpace } from '../entity/Type';
import { CardCategory } from '../types/commonTypes';
import { EffectState, ICard, Spell } from './index';
import * as math from '../jmath/math';
import { CardRarity, probabilityMap } from '../types/commonTypes';
import * as config from '../config';
import { Vec2 } from '../jmath/Vec';
import Underworld from '../Underworld';
import { ForceMoveProjectile, makeForceMoveProjectile } from '../jmath/moveWithCollision';
import { containerProjectiles } from '../graphics/PixiUtils';
import { explode } from '../effects/explode';
import { burnCardId } from './burn';
import * as colors from '../graphics/ui/colors';
import * as particles from 'jdoleary-fork-pixi-particle-emitter';
import { createParticleTexture, logNoTextureWarning, wrappedEmitter } from '../graphics/Particles';
import { stopAndDestroyForeverEmitter } from '../graphics/ParticleCollection';


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
        thumbnail: 'fireball.png',
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
            // Stop the fire trail emitter on impact
            if (projectile.emitter) {
                stopAndDestroyForeverEmitter(projectile.emitter);
            }
            const impactLocation = projectile.pushedObject;
            const adjustedRadius = baseRadius * (1 + (0.25 * projectile.state.aggregator.radiusBoost));
            const burnedUnits = underworld.getUnitsWithinDistanceOfTarget(impactLocation, adjustedRadius, prediction);
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
                const pushedObject: HasSpace = {
                    x: casterPositionAtTimeOfCast.x,
                    y: casterPositionAtTimeOfCast.y,
                    radius: 1,
                    inLiquid: false,
                    immovable: false,
                    beingPushed: false,
                }
                const emitter = !prediction ? attachFireballParticles(pushedObject, underworld) : undefined;
                const projectile = makeForceMoveProjectile({
                    sourceUnit: state.casterUnit,
                    pushedObject,
                    startPoint,
                    velocity,
                    piercesRemaining: 0,
                    bouncesRemaining: 0,
                    collidingUnitIds: [state.casterUnit.id],
                    collideFnKey,
                    state,
                }, underworld, prediction) as ForceMoveProjectile;
                if (emitter) {
                    projectile.emitter = emitter;
                }
            }
        }
        await underworld.awaitForceMoves();
        return state;
    }
}

function attachFireballParticles(target: HasSpace, underworld: Underworld): particles.Emitter | undefined {
    const texture = createParticleTexture();
    if (!texture) {
        logNoTextureWarning('attachFireballParticles');
        return;
    }
    const particleConfig =
        particles.upgradeConfig(fireballEmitterConfig(), [texture]);
    if (containerProjectiles) {
        const wrapped = wrappedEmitter(particleConfig, containerProjectiles);
        if (wrapped) {
            underworld.particleFollowers.push({
                displayObject: wrapped.container,
                emitter: wrapped.emitter,
                target,
            });
            return wrapped.emitter;
        }
    }
    return undefined;
}

const fireballEmitterConfig = () => ({
    autoUpdate: true,
    "alpha": {
        "start": 1,
        "end": 0
    },
    "scale": {
        "start": 3,
        "end": 0.5,
        "minimumScaleMultiplier": 0.5
    },
    "color": {
        "start": "#ffcc33",
        "end": "#aa2200"
    },
    "speed": {
        "start": 40,
        "end": 10,
        "minimumSpeedMultiplier": 0.5
    },
    "acceleration": {
        "x": 0,
        "y": -60
    },
    "maxSpeed": 0,
    "startRotation": {
        "min": 0,
        "max": 360
    },
    "noRotation": false,
    "rotationSpeed": {
        "min": 0,
        "max": 200
    },
    "lifetime": {
        "min": 0.2,
        "max": 0.5
    },
    "blendMode": "normal",
    "frequency": 0.003,
    "emitterLifetime": 0,
    "maxParticles": 300,
    "pos": {
        "x": 0,
        "y": 0
    },
    "addAtBack": false,
    "spawnType": "circle",
    "spawnCircle": {
        "x": 0,
        "y": 0,
        "r": 8
    }
});

export default spell;