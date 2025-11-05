import { registerEvents, registerModifiers } from "./cards";
import { getOrInitModifier } from "./cards/util";
import * as Unit from './entity/Unit';
import { Faction } from "./types/commonTypes";
import Underworld from './Underworld';
import { suffocateCardId } from "./cards/suffocate";
import floatingText from "./graphics/FloatingText";

export const BLEEDING_ID = 'Bleeding';
export const BLOODY_ROBES_ID = 'Bloody Robes';
export default function registerBleeding() {
  registerModifiers(BLOODY_ROBES_ID, {
    description: ['rune_bloody_robes'],
    _costPerUpgrade: -10,
    maxUpgradeCount: 5,
    quantityPerUpgrade: 5,
    unitOfMeasure: "Damage",
    isMalady: true,
    add: (unit: Unit.IUnit, underworld: Underworld, prediction: boolean, quantity: number = 1) => {
      getOrInitModifier(unit, BLOODY_ROBES_ID, { isCurse: false, quantity, keepOnDeath: true }, () => {
        Unit.addEvent(unit, BLOODY_ROBES_ID);
      });
    }
  });
  registerEvents(BLOODY_ROBES_ID, {
    onTakeDamage: (unit: Unit.IUnit, amount: number, underworld: Underworld, prediction: boolean, damageDealer?: Unit.IUnit): number => {
      const mod = unit.modifiers[BLOODY_ROBES_ID];
      if (mod) {
        if (amount > 0) {
          Unit.addModifier(unit, BLEEDING_ID, underworld, prediction, mod.quantity);
        }
      }
      return amount;
    },
  });
  registerModifiers(BLEEDING_ID, {
    description: ['bleeding_desc'],
    add: (unit: Unit.IUnit, underworld: Underworld, prediction: boolean, quantity: number = 1) => {
      getOrInitModifier(unit, BLEEDING_ID, { isCurse: true, quantity, keepOnDeath: true }, () => {
        floatingText({ coords: unit, text: BLEEDING_ID, prediction });
        Unit.addEvent(unit, BLEEDING_ID);
      });
    }
  })
  registerEvents(BLEEDING_ID, {
    onTakeDamage: (unit: Unit.IUnit, amount: number, underworld: Underworld, prediction: boolean, damageDealer?: Unit.IUnit): number => {
      const mod = unit.modifiers[BLEEDING_ID];
      if (mod) {
        if (amount < 0) {
          floatingText({ coords: unit, text: 'Bleeding Stopped', prediction });
          Unit.removeModifier(unit, BLEEDING_ID, underworld);
        }
      }
      return amount;
    },
    onTurnStart: async (unit: Unit.IUnit, underworld: Underworld, prediction: boolean, faction: Faction) => {
      const mod = unit.modifiers[BLEEDING_ID];
      if (mod) {
        floatingText({ coords: unit, text: BLEEDING_ID, prediction });
        Unit.takeDamage({ unit, amount: mod.quantity, pureDamage: true }, underworld, prediction);

      }
    }
  });
}