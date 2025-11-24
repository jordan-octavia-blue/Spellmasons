import seedrandom from "seedrandom";
import { EffectState, registerEvents, registerModifiers } from "./cards";
import { meteorCardId, meteorProjectiles } from "./cards/meteor";
import { getOrInitModifier } from "./cards/util";
import * as Unit from './entity/Unit';
import floatingText from "./graphics/FloatingText";
import { clone } from "./jmath/Vec";
import { CardCategory, Faction } from "./types/commonTypes";
import Underworld from './Underworld';
import { getUniqueSeedString } from "./jmath/rand";
import { create, pickups, RED_PORTAL } from "./entity/Pickup";
import { makeManaTrail } from "./graphics/Particles";
import { IPlayer } from "./entity/Player";
import { allCards } from "./cards";
import { allUnits } from "./entity/units";

export const PACIFIST_ID = 'Pacifist';
const percentOfMaxHealthPerCard = 0.05;
export default function registerPacifist() {
  registerModifiers(PACIFIST_ID, {
    description: ['rune_pacifist', (100 * percentOfMaxHealthPerCard).toString()],
    _costPerUpgrade: -100,
    maxUpgradeCount: 1,
    isMalady: true,
    add: (unit: Unit.IUnit, underworld: Underworld, prediction: boolean, quantity: number = 1) => {
      getOrInitModifier(unit, PACIFIST_ID, { isCurse: false, quantity, keepOnDeath: true }, () => {
        const player = underworld.players.find(p => p.unit == unit)
        if (player) {
          Unit.addEvent(unit, PACIFIST_ID);
        }
      });
    }
  });
  registerEvents(PACIFIST_ID, {
    onCast: async (effectState: EffectState, underworld: Underworld, prediction: boolean) => {
      const countDamageCards = effectState.cardIds.reduce((count, card) => {
        const cardObj = allCards[card]
        if (cardObj) {
          if (cardObj.category == CardCategory.Damage || cardObj.category == CardCategory.Curses || Object.keys(allUnits).some(unitId => cardObj.id.includes(unitId))) {
            return count + 1;
          }
        }
        return count;
      }, 0);
      const damage = effectState.casterUnit.healthMax * percentOfMaxHealthPerCard * countDamageCards;
      Unit.takeDamage({
        unit: effectState.casterUnit,
        amount: damage,
      }, underworld, prediction);
      floatingText({ coords: effectState.casterUnit, text: `${PACIFIST_ID}: ${damage}`, prediction });
    }
  });
}
