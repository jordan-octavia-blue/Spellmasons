import seedrandom from "seedrandom";
import { registerEvents, registerModifiers } from "./cards";
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
const percentOfMaxHealthPerCard = 0.01;
export default function registerPacifist() {
  registerModifiers(PACIFIST_ID, {
    description: ['rune_pacifist', (100 * percentOfMaxHealthPerCard).toString()],
    _costPerUpgrade: -100,
    unitOfMeasure: 'Percent',
    maxUpgradeCount: 10,
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
    onTurnStart: async (unit: Unit.IUnit, underworld: Underworld, prediction: boolean, faction: Faction) => {
      const p = underworld.players.find(p => p.unit == unit);
      if (p) {
        runPacifist(p, underworld, prediction);
      }
    }
  });
}
function runPacifist(p: IPlayer, underworld: Underworld, prediction: boolean) {
  const mod = p.unit.modifiers[PACIFIST_ID]
  const quantity = mod?.quantity || 1;
  const damage = p.inventory.reduce((count, cur) => {
    const card = allCards[cur];
    if (card) {
      if (card.category == CardCategory.Damage || card.category == CardCategory.Curses || Object.keys(allUnits).some(unitId => card.id.includes(unitId))) {
        return count + 1;
      }
    }
    return count;
  }, 0);
  const percent = damage * percentOfMaxHealthPerCard * quantity;
  const amount = percent * p.unit.healthMax;
  floatingText({
    coords: p.unit, text: `${PACIFIST_ID}: ${100 * percent}%`
  });
  Unit.takeDamage({ amount, unit: p.unit, pureDamage: true }, underworld, prediction)

}