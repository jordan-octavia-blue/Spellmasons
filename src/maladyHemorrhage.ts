import { registerEvents, registerModifiers } from "./cards";
import { getOrInitModifier } from "./cards/util";
import * as Unit from './entity/Unit';
import floatingText from "./graphics/FloatingText";
import Underworld from './Underworld';

export const HEMORRHAGE_ID = 'Hemorrhage';
export const HEMORRHAGING_ID = 'Hemorrhaging';
export default function registerHemorrhage() {
  registerModifiers(HEMORRHAGE_ID, {
    description: ['rune_hemorrhage'],
    stage: "Amount Override",
    _costPerUpgrade: -40,
    maxUpgradeCount: 1,
    isMalady: true,
    add: (unit: Unit.IUnit, underworld: Underworld, prediction: boolean, quantity: number = 1) => {
      getOrInitModifier(unit, HEMORRHAGE_ID, { isCurse: false, quantity, keepOnDeath: true }, () => {
        const player = underworld.players.find(p => p.unit == unit)
        if (player) {
          Unit.addEvent(unit, HEMORRHAGE_ID);
        }
      });
    }
  });
  registerEvents(HEMORRHAGE_ID, {
    onTakeDamage: (unit: Unit.IUnit, amount: number, underworld: Underworld, prediction: boolean, damageDealer?: Unit.IUnit) => {
      const modifier = unit.modifiers[HEMORRHAGE_ID];
      if (modifier) {
        if (damageDealer && damageDealer.faction !== unit.faction) {
          Unit.addModifier(unit, HEMORRHAGING_ID, underworld, prediction, modifier.quantity, { sourceUnitId: damageDealer.id });
          floatingText({ coords: unit, text: [HEMORRHAGE_ID], prediction });
        }
      }

      return amount;
    }
  });
  registerModifiers(HEMORRHAGING_ID, {
    description: ['hemorrhaging'],
    stage: "Amount Override",
    add: (unit: Unit.IUnit, underworld: Underworld, prediction: boolean, quantity: number = 1) => {
      getOrInitModifier(unit, HEMORRHAGING_ID, { isCurse: true, quantity, keepOnDeath: true }, () => {
        const player = underworld.players.find(p => p.unit == unit)
        if (player) {
          Unit.addEvent(unit, HEMORRHAGING_ID);
        }
      });
    }
  });
  registerEvents(HEMORRHAGING_ID, {
    onTakeDamage: (unit: Unit.IUnit, amount: number, underworld: Underworld, prediction: boolean, damageDealer?: Unit.IUnit) => {
      // Stop hemorrhaging when healed
      if (amount < 0) {
        Unit.removeModifier(unit, HEMORRHAGING_ID, underworld)
      }
      return amount;
    },
    onTurnStart: async (unit: Unit.IUnit, underworld: Underworld, prediction: boolean) => {
      const modifier = unit.modifiers[HEMORRHAGING_ID];
      if (modifier) {
        floatingText({ coords: unit, text: [HEMORRHAGING_ID, modifier.quantity.toString()] });
        Unit.takeDamage({ unit, amount: modifier.quantity }, underworld, prediction);
      }
    }
  });
}