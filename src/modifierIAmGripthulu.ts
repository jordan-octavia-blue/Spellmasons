import { registerModifiers } from "./cards";
import { getOrInitModifier } from "./cards/util";
import * as Unit from './entity/Unit';
import { gripthuluAction } from "./entity/units/gripthulu";
import Underworld from './Underworld';

export const iamgripthulu = 'I am Gripthulu';

export default function register_i_am_gripthulu() {
    registerModifiers(iamgripthulu, {
        description: ('rune_i_am_gripthulu'),
        _costPerUpgrade: 40,
        unitOfMeasure: 'Units',
        quantityPerUpgrade: 1,
        maxUpgradeCount: 5,
        omitForWizardType: ['Deathmason', 'Goru'],
        add: (unit: Unit.IUnit, underworld: Underworld, prediction: boolean, quantity: number = 1) => {
            getOrInitModifier(unit, gripthuluAction, { isCurse: false, quantity, keepOnDeath: true }, () => {
                Unit.addEvent(unit, gripthuluAction);
            });
        },
    });
}
