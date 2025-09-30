import { registerEvents, registerModifiers } from "./cards";
import { getOrInitModifier } from "./cards/util";
import * as Unit from './entity/Unit';
import Underworld from './Underworld';
import { UnitSource, allUnits } from "./entity/units";
import { visualPolymorphPlayerUnit } from "./cards/polymorph";
import { golem_unit_id } from "./entity/units/golem";
import { UnitType } from "./types/commonTypes";

export const LycanthropyId = 'Lycanthropy';

export default function registerLycanthropy() {
    registerModifiers(LycanthropyId, {
        description: 'Unlocks a new primal form usable once per level. Activate by standing still for 3 turns.',
        _costPerUpgrade: 150,
        maxUpgradeCount: 1,
        add: (unit: Unit.IUnit, underworld: Underworld, prediction: boolean, quantity: number = 1) => {
            getOrInitModifier(unit, LycanthropyId, { isCurse: false, quantity, keepOnDeath: true }, () => {
                Unit.addEvent(unit, LycanthropyId);
            });
        },
    });

    registerEvents(LycanthropyId, {
        onTurnEnd: async (unit: Unit.IUnit, underworld: Underworld, prediction: boolean) => {
            if (!unit.alive) {
                return;
            }

            console.log(`[Lycanthropy] Checking transform for unit ${unit.id}`, {
                stamina: unit.stamina,
                staminaMax: unit.staminaMax,
                mana: unit.mana,
                manaMax: unit.manaMax,
                prediction,
            });

            if (unit.stamina == unit.staminaMax && unit.mana == unit.manaMax) {
                const toSourceUnit: UnitSource | undefined = allUnits[golem_unit_id];
                console.log('[Lycanthropy] Found golem source:', toSourceUnit);

                if (toSourceUnit && unit.unitType === UnitType.PLAYER_CONTROLLED) {
                    if (!prediction) {
                        console.log('[Lycanthropy] Transforming visuals now');
                        visualPolymorphPlayerUnit(unit, toSourceUnit);
                    } else {
                        console.log('[Lycanthropy] Skipped transform in prediction');
                    }
                } else if (!toSourceUnit) {
                    console.error('[Lycanthropy] toSourceUnit is undefined or invalid!');
                }
            }
        }
    });
}
