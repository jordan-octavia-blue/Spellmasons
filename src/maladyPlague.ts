import { registerEvents, registerModifiers } from "./cards";
import { getOrInitModifier } from "./cards/util";
import * as Unit from './entity/Unit';
import { Faction } from "./types/commonTypes";
import Underworld from './Underworld';
import { suffocateCardId } from "./cards/suffocate";
import floatingText from "./graphics/FloatingText";

export const PLAGUE_ID = 'Plague';
export default function registerPlague() {
  registerModifiers(PLAGUE_ID, {
    description: ['rune_plague'],
    _costPerUpgrade: -50,
    maxUpgradeCount: 1,
    isMalady: true,
    add: (unit: Unit.IUnit, underworld: Underworld, prediction: boolean, quantity: number = 1) => {
      getOrInitModifier(unit, PLAGUE_ID, { isCurse: false, quantity, keepOnDeath: true }, () => {
        const player = underworld.players.find(p => p.unit == unit)
        Unit.addModifier(unit, suffocateCardId, underworld, prediction, quantity);
        if (player) {
          Unit.addEvent(unit, PLAGUE_ID);
        }
      });
    }
  });
  registerEvents(PLAGUE_ID, {
    onTurnStart: async (unit: Unit.IUnit, underworld: Underworld, prediction: boolean, faction: Faction) => {
      if (!unit.modifiers[suffocateCardId]) {
        floatingText({ coords: unit, text: PLAGUE_ID });
        Unit.addModifier(unit, suffocateCardId, underworld, prediction, 1);
      }
    }
  });
}