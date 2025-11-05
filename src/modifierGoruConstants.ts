import { registerModifiers } from "./cards";
import { getOrInitModifier } from "./cards/util";
import * as Player from './entity/Player';
import * as Unit from './entity/Unit';
import * as config from './config';
import Underworld from './Underworld';

export const soulCapacityId = 'Increase Soul Capacity'
export const startingSoulsId = 'Increase Starting Souls'
export function registerGoruConstantRunes() {
  registerModifiers(soulCapacityId, {
    description: `soul-capacity-desc`,
    unitOfMeasure: 'Soul Capacity',
    _costPerUpgrade: 50,
    quantityPerUpgrade: 5,
    constant: true,
    omitForWizardType: ['Deathmason', 'Spellmason'],
    add: (unit: Unit.IUnit, underworld: Underworld, prediction: boolean, quantity: number = 1) => {
      const modifier = getOrInitModifier(unit, soulCapacityId, { isCurse: false, quantity, keepOnDeath: true }, () => { });
      if (modifier) {
        if (exists(unit.soulFragmentsMax)) {
          unit.soulFragmentsMax += 5;
        }
      }
    },
    probability: 0,
  });
  registerModifiers(startingSoulsId, {
    description: `starting-soul-desc`,
    unitOfMeasure: 'Additional Starting Soul Fragments',
    _costPerUpgrade: 50,
    quantityPerUpgrade: 1,
    constant: true,
    omitForWizardType: ['Deathmason', 'Spellmason'],
    add: (unit: Unit.IUnit, underworld: Underworld, prediction: boolean, quantity: number = 1) => {
      getOrInitModifier(unit, startingSoulsId, { isCurse: false, quantity, keepOnDeath: true }, () => { });
    },
    probability: 0,
  });
}
