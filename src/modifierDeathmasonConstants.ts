import { registerModifiers } from "./cards";
import { getOrInitModifier } from "./cards/util";
import * as Player from './entity/Player';
import * as Unit from './entity/Unit';
import Underworld from './Underworld';

export const soulmuncherId = 'Soul Muncher'
export function registerSoulmuncher() {
  registerModifiers(soulmuncherId, {
    description: `soulmuncher-desc`,
    unitOfMeasure: '',
    _costPerUpgrade: 100,
    quantityPerUpgrade: 1,
    maxUpgradeCount: 12,
    constant: true,
    omitForWizardType: ['Goru', 'Spellmason'],
    add: (unit: Unit.IUnit, underworld: Underworld, prediction: boolean, quantity: number = 1) => {
      getOrInitModifier(unit, soulmuncherId, { isCurse: false, quantity, keepOnDeath: true }, () => { });
    },
    probability: 0,
  });
}

export const witchyVibesId = 'Witchy Vibes'
export function registerWitchyVibes() {
  registerModifiers(witchyVibesId, {
    description: `witchy-vibes-desc`,
    unitOfMeasure: '',
    _costPerUpgrade: 75,
    quantityPerUpgrade: 1,
    maxUpgradeCount: 12,
    constant: true,
    omitForWizardType: ['Goru', 'Spellmason'],
    add: (unit: Unit.IUnit, underworld: Underworld, prediction: boolean, quantity: number = 1) => {
      getOrInitModifier(unit, witchyVibesId, { isCurse: false, quantity, keepOnDeath: true }, () => { });
    },
    probability: 0,
  });
}


export const fairIsFairId = 'Fair is Fair'
export function registerFairIsFair() {
  registerModifiers(fairIsFairId, {
    description: `fair-is-fair-desc`,
    unitOfMeasure: '',
    _costPerUpgrade: 250,
    quantityPerUpgrade: 1,
    maxUpgradeCount: 1,
    constant: true,
    omitForWizardType: ['Goru', 'Spellmason'],
    add: (unit: Unit.IUnit, underworld: Underworld, prediction: boolean, quantity: number = 1) => {
      getOrInitModifier(unit, fairIsFairId, { isCurse: false, quantity, keepOnDeath: true }, () => { });
    },
    probability: 0,
  });
}
