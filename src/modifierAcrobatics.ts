import { registerEvents, registerModifiers } from "./cards";
import { getOrInitModifier } from "./cards/util";
import * as Unit from './entity/Unit';
import floatingText from "./graphics/FloatingText";
import Underworld from './Underworld';

export const acrobaticsId = 'Acrobatics';
export default function registerAcrobatics() {
    registerModifiers(acrobaticsId, {
        description: 'rune_icy_veins',
        unitOfMeasure: '% Damage',
        stage: "Amount Multiplier",
        _costPerUpgrade: 200,
        quantityPerUpgrade: 300,
        maxUpgradeCount: 1,
        add: (unit: Unit.IUnit, underworld: Underworld, prediction: boolean, quantity: number = 1) => {
            getOrInitModifier(unit, acrobaticsId, { isCurse: false, quantity, keepOnDeath: true }, () => {
                Unit.addEvent(unit, acrobaticsId);
            });
        }
    });
    registerEvents(acrobaticsId, {
        onCostCalculation
    });
}