import { registerEvents, registerModifiers } from "./cards";
import { suffocateCardId } from "./cards/suffocate";
import { getOrInitModifier } from "./cards/util";
import * as Unit from './entity/Unit';
import floatingText from "./graphics/FloatingText";
import { Faction } from "./types/commonTypes";
import Underworld from './Underworld';

export const DOOMED_ID = 'Doomed';
export default function registerDoomed() {
  registerModifiers(DOOMED_ID, {
    description: ['rune_doomed'],
    stage: "Amount Override",
    _costPerUpgrade: -50,
    maxUpgradeCount: 1,
    isMalady: true,
    add: (unit: Unit.IUnit, underworld: Underworld, prediction: boolean, quantity: number = 1) => {
      getOrInitModifier(unit, DOOMED_ID, { isCurse: false, quantity, keepOnDeath: true }, () => {
        const player = underworld.players.find(p => p.unit == unit)
        if (player) {
          Unit.addEvent(unit, DOOMED_ID);
        }
      });
    }
  });
  registerEvents(DOOMED_ID, {
    onTurnStart: async (unit: Unit.IUnit, underworld: Underworld, prediction: boolean, faction: Faction) => {
      const suffocateModifier = unit.modifiers[suffocateCardId];
      if (!suffocateModifier) {
        Unit.addModifier(unit, suffocateCardId, underworld, prediction, 1, { sourceUnitId: unit.id });
        floatingText({ coords: unit, text: DOOMED_ID });
      }
    }
  });

}