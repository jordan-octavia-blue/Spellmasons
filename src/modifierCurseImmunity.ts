import { registerEvents, registerModifiers } from "./cards";
import { getOrInitModifier } from "./cards/util";
import * as Image from './graphics/Image';
import * as Unit from './entity/Unit';
import Underworld from './Underworld';
import floatingText from "./graphics/FloatingText";
import { oneOffHealAnimation } from "./effects/heal";

export const curseimmunityId = 'CurseImmunity';
const subspriteId = 'curseImmunity';
function addModifierVisuals(unit: Unit.IUnit, underworld: Underworld) {
  Image.addSubSprite(unit.image, subspriteId);
}
export default function registerCurseImmunity() {
  registerModifiers(curseimmunityId, {
    description: 'curseimmunity_description',
    probability: 100,
    addModifierVisuals,
    add: (unit: Unit.IUnit, underworld: Underworld, prediction: boolean, quantity: number = 1) => {
      getOrInitModifier(unit, curseimmunityId, { isCurse: false, quantity, keepOnDeath: true }, () => {
        Unit.addEvent(unit, curseimmunityId);
      });
    },
    subsprite: {
      imageName: subspriteId,
      alpha: 1.0,
      anchor: {
        x: 0.5,
        y: 0.5,
      },
      scale: {
        x: 1,
        y: 1,
      },
    },
  });
  registerEvents(curseimmunityId, {
    onTurnStart: async (unit: Unit.IUnit, underworld: Underworld, prediction: boolean) => {
      runCurseImmunity(unit, underworld);
    },
  });
}

function runCurseImmunity(unit: Unit.IUnit, underworld: Underworld) {
  if (Object.values(unit.modifiers).some(m => m.isCurse)) {
    const percentIncrease = 0.1 * Object.entries(unit.modifiers).filter(([key, props]) => props.isCurse).length;
    // if (unit.unitType == UnitType.PLAYER_CONTROLLED) {
    //   const healAmount = unit.health * percentIncrease
    //   healUnit(unit, healAmount, undefined, underworld, false);
    //   floatingText({ coords: unit, text: `${i18n(curseimmunityId)}: + ${healAmount} HP` });
    // } else {
    oneOffHealAnimation(unit);
    playSFXKey('potionPickupMana');
    const prevHealth = unit.healthMax;
    unit.healthMax *= 1 + percentIncrease;
    unit.healthMax = Math.floor(unit.healthMax);
    const delta = unit.healthMax - prevHealth
    unit.health += delta;
    floatingText({ coords: unit, text: `${i18n(curseimmunityId)}: + ${unit.healthMax - prevHealth} HP` });
    // }
  }

}