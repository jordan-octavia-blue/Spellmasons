import { registerEvents, registerModifiers } from "./cards";
import { getOrInitModifier } from "./cards/util";
import * as Unit from './entity/Unit';
import floatingText from "./graphics/FloatingText";
import Underworld from './Underworld';

export const STATUE_ID = 'Statue';
export default function registerStatue() {
  registerModifiers(STATUE_ID, {
    description: ['rune_statue'],
    stage: "Amount Override",
    _costPerUpgrade: -80,
    maxUpgradeCount: 1,
    isMalady: true,
    add: (unit: Unit.IUnit, underworld: Underworld, prediction: boolean, quantity: number = 1) => {
      getOrInitModifier(unit, STATUE_ID, { isCurse: false, quantity, keepOnDeath: true }, () => {
        unit.staminaMax = 0;
        unit.stamina = unit.staminaMax;
      });
    }
  });

}