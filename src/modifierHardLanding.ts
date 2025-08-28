import { registerEvents, registerModifiers } from "./cards";
import { animateMitosis, doCloneUnit } from "./cards/clone";
import { getOrInitModifier } from "./cards/util";
import { explode } from "./effects/explode";
import * as Unit from './entity/Unit';
import floatingText from "./graphics/FloatingText";
import Underworld from './Underworld';
import * as config from './config';
import { forcePushAwayFrom } from "./effects/force_move";
import { takeDamage } from "./entity/Unit";
import type { Vec2 } from "./jmath/Vec";

export const HardLandingId = 'Hard Landing';
export default function registerHardLanding() {
    registerModifiers(HardLandingId, {
        description: ('Deals damage and does knockback upon spawning.'),
        _costPerUpgrade: 70,
        unitOfMeasure: 'Damage',
        quantityPerUpgrade: 20,
        stage: 'Amount Flat',
        add: (unit: Unit.IUnit, underworld: Underworld, prediction: boolean, quantity: number = 1) => {
            getOrInitModifier(unit, HardLandingId, { isCurse: false, quantity, keepOnDeath: true }, () => {
                Unit.addEvent(unit, HardLandingId);
            });
        }
    });
    registerEvents(HardLandingId, {
        onSpawn: (unit: Unit.IUnit, underworld: Underworld, prediction: boolean) => {
            const modifier = unit.modifiers[HardLandingId];
            if (modifier) {
                const spawnLocation = { x: unit.x, y: unit.y } as Vec2;
                const units = underworld.getUnitsWithinDistanceOfTarget(spawnLocation, 100, prediction).filter(u => u.id != unit.id);
                units.forEach(u => {
                    // Deal damage to units
                    takeDamage({
                        unit: u,
                        amount: modifier.quantity,
                        sourceUnit: unit,
                        fromVec2: unit,
                    }, underworld, prediction);
                });

                units.forEach(u => {
                    // Push units away from exploding location
                    forcePushAwayFrom(u, spawnLocation, 100, underworld, prediction, unit);
                })

                underworld.getPickupsWithinDistanceOfTarget(spawnLocation, 100, prediction)
                    .forEach(p => {
                        // Push pickups away
                        forcePushAwayFrom(p, spawnLocation, 100, underworld, prediction, unit);
                    });
                // Wait a bit for floating text otherwise it gets covered by sky beam
                setTimeout(() => {
                    floatingText({ coords: spawnLocation, text: HardLandingId, prediction });
                }, 500)
            } else {
                console.error(`Expected to find ${HardLandingId} modifier`)
            }
        }
    });
}
