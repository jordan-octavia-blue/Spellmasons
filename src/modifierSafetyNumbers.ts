import { registerEvents, registerModifiers } from "./cards";
import { shieldId } from "./cards/shield";
import { getOrInitModifier } from "./cards/util";
import * as Unit from './entity/Unit';
import Underworld from './Underworld';
import { explode } from "./effects/explode";
import { drawUICircle } from "./graphics/PlanningView";
import * as colors from "./graphics/ui/colors";
import { get } from "./storage";

// Regenerates [quantity] shield at the start of each turn
export const safetyNumbersId = 'Safety in Numbers';
export default function registersafetyNumbers() {
    registerModifiers(safetyNumbersId, {
        description: 'Grants a shield to allies within radius based on how many allies are nearby at the end of your turn',
        unitOfMeasure: 'shield per ally affected',
        _costPerUpgrade: 150,
        quantityPerUpgrade: 10,
        maxUpgradeCount: 1,
        add: (unit: Unit.IUnit, underworld: Underworld, prediction: boolean, quantity: number = 1) => {
            getOrInitModifier(unit, safetyNumbersId, { isCurse: false, quantity, keepOnDeath: true }, () => {
                Unit.addEvent(unit, safetyNumbersId);
            });
        }
    });
    registerEvents(safetyNumbersId, {
        onTurnEnd: async (unit: Unit.IUnit, underworld: Underworld, prediction: boolean) => {
            const modifier = unit.modifiers[safetyNumbersId];
            if (modifier) {
                const allyUnits = explode(unit, 140, 0, 0, unit, underworld, prediction).filter(u => u.faction == unit.faction && u.alive);
                for (let ally of allyUnits) {
                    getOrInitModifier(ally, shieldId, { isCurse: false, quantity: modifier.quantity * (allyUnits.length), keepOnDeath: true }, () => {
                        Unit.addModifier(ally, shieldId, underworld, prediction, modifier.quantity * (allyUnits.length));
                        Unit.addEvent(ally, shieldId);
                    });
                }
            }
        },
        onDrawSelected: async (unit: Unit.IUnit, underworld: Underworld, prediction: boolean) => {
            if (globalThis.selectedUnitGraphics) {
                drawUICircle(globalThis.selectedUnitGraphics, unit, 140, 0xfff689, 'Safety in Numbers Radius');
            }
        }
    });
}