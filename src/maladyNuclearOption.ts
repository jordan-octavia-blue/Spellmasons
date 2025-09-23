import { registerEvents, registerModifiers } from "./cards";
import { meteorCardId, meteorProjectiles } from "./cards/meteor";
import { getOrInitModifier } from "./cards/util";
import * as Unit from './entity/Unit';
import floatingText from "./graphics/FloatingText";
import { clone } from "./jmath/Vec";
import { Faction } from "./types/commonTypes";
import Underworld from './Underworld';

export const NUCLEAR_OPTION_ID = 'Nuclear Option';
export default function registerNuclearOption() {
  registerModifiers(NUCLEAR_OPTION_ID, {
    description: ['rune_nuclear_option'],
    stage: "Amount Override",
    _costPerUpgrade: -40,
    maxUpgradeCount: 1,
    isMalady: true,
    add: (unit: Unit.IUnit, underworld: Underworld, prediction: boolean, quantity: number = 1) => {
      getOrInitModifier(unit, NUCLEAR_OPTION_ID, { isCurse: false, quantity, keepOnDeath: true }, () => {
        const player = underworld.players.find(p => p.unit == unit)
        if (player) {
          Unit.addEvent(unit, NUCLEAR_OPTION_ID);
        }
      });
    }
  });
  registerEvents(NUCLEAR_OPTION_ID, {
    onTurnStart: async (unit: Unit.IUnit, underworld: Underworld, prediction: boolean, faction: Faction) => {
      floatingText({ coords: unit, text: NUCLEAR_OPTION_ID });
      await underworld.castCards({
        casterCardUsage: {},
        casterUnit: unit,
        casterPositionAtTimeOfCast: clone(unit),
        cardIds: [meteorCardId],
        castLocation: unit,
        initialTargetedUnitId: unit.id,
        prediction: false,
        outOfRange: false,
        castForFree: true,
      });
    }
  });

}