import seedrandom from "seedrandom";
import { registerEvents, registerModifiers } from "./cards";
import { meteorCardId, meteorProjectiles } from "./cards/meteor";
import { getOrInitModifier } from "./cards/util";
import * as Unit from './entity/Unit';
import floatingText from "./graphics/FloatingText";
import { clone } from "./jmath/Vec";
import { Faction } from "./types/commonTypes";
import Underworld from './Underworld';
import { getUniqueSeedString } from "./jmath/rand";
import { create, pickups, RED_PORTAL } from "./entity/Pickup";
import { makeManaTrail } from "./graphics/Particles";

export const RIFT_ID = 'Rift';
export default function registerRift() {
  registerModifiers(RIFT_ID, {
    description: ['rune_rift'],
    stage: "Amount Override",
    unitOfMeasure: "Red Portal",
    _costPerUpgrade: -5,
    isMalady: true,
    add: (unit: Unit.IUnit, underworld: Underworld, prediction: boolean, quantity: number = 1) => {
      getOrInitModifier(unit, RIFT_ID, { isCurse: false, quantity, keepOnDeath: true }, () => {
        const player = underworld.players.find(p => p.unit == unit)
        if (player) {
          Unit.addEvent(unit, RIFT_ID);
        }
      });
    }
  });
  registerEvents(RIFT_ID, {
    onTurnStart: async (unit: Unit.IUnit, underworld: Underworld, prediction: boolean, faction: Faction) => {
      const modifier = unit.modifiers[RIFT_ID];
      const redPortalSource = pickups.find(p => p.name == RED_PORTAL);
      if (modifier && redPortalSource) {
        const seed = seedrandom(`${getUniqueSeedString(underworld)}-${unit.id}`);
        for (let i = 0; i < modifier.quantity; i++) {
          const newPortalLocation = underworld.findValidSpawnInWorldBounds(prediction, seed, { allowLiquid: true });
          if (newPortalLocation) {
            const portal = create({ pos: newPortalLocation, pickupSource: redPortalSource, logSource: 'deathmason' }, underworld, false);
            if (portal) {
              if (!prediction) {
                makeManaTrail(unit, newPortalLocation, underworld, '#930e0e', '#930e0e').then(() => {
                  floatingText({ coords: newPortalLocation, text: RIFT_ID });
                });
              }
            }

          }

        }
      }

    }
  });
}