import { registerModifiers } from "./cards";
import { getOrInitModifier } from "./cards/util";
import * as Unit from './entity/Unit';
import Underworld from './Underworld';

export const wardenSpellLockId = 'Spell Anchor';
export function registerWardenConstantRunes() {
  registerModifiers(wardenSpellLockId, {
    description: `spell-anchor-desc`,
    unitOfMeasure: 'Locked Slots',
    _costPerUpgrade: 75,
    quantityPerUpgrade: 1,
    maxUpgradeCount: 3,
    constant: true,
    omitForWizardType: ['Spellmason', 'Deathmason', 'Goru'],
    add: (unit: Unit.IUnit, underworld: Underworld, prediction: boolean, quantity: number = 1) => {
      getOrInitModifier(unit, wardenSpellLockId, { isCurse: false, quantity, keepOnDeath: true }, () => { });
    },
    probability: 0,
  });
}
