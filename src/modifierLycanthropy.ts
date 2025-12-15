import { registerEvents, registerModifiers } from "./cards";
import { getOrInitModifier } from "./cards/util";
import * as Unit from './entity/Unit';
import Underworld from './Underworld';
import { UnitSource, allUnits } from "./entity/units";
import { visualPolymorphPlayerUnit } from "./cards/polymorph";
import { werewolf_unit_id } from "./DevelopmentMods/RunicAlphabet/units/werewolf";
import { UnitType } from "./types/commonTypes";
import floatingText from "./graphics/FloatingText";
import type { IPlayer } from "./entity/Player";
import { ICard } from "./cards"
import { CardCost } from "./cards/cardUtils";
import { CardCategory } from "./types/commonTypes";
export const LycanthropyId = 'Lycanthropy';
import { restoreWizardTypeVisuals } from "./entity/Player";
import { spellmasonUnitId } from "./entity/units/playerUnit";
import { wildSwipeCardId } from "./DevelopmentMods/RunicAlphabet/cards/wild_swipe";
import { lungeId } from "./DevelopmentMods/RunicAlphabet/cards/lunge";
import { upgradeCardsSource } from "./Upgrade";
export default function registerLycanthropy() {
    registerModifiers(LycanthropyId, {
        description: 'Unlocks a new primal form usable once per level. Activate by standing still for 3 turns.',
        _costPerUpgrade: 150,
        maxUpgradeCount: 1,
        stage: 'Amount Flat',
        add: (unit: Unit.IUnit, underworld: Underworld, prediction: boolean, quantity: number = 1) => {
            getOrInitModifier(unit, LycanthropyId, { isCurse: false, quantity, keepOnDeath: true, standingStillTurns: 0, transformed: false, beenTransformed: false, reservedMana: 0, reservedSpells: [], werewolfSpells: [wildSwipeCardId, lungeId], displacedSpells: [], levelLastTransformed: 0 }, () => {
                Unit.addEvent(unit, LycanthropyId);
            });
        },
    });

    registerEvents(LycanthropyId, {
        onTurnEnd: async (unit: Unit.IUnit, underworld: Underworld, prediction: boolean) => {
            if (!unit.alive || !unit.modifiers[LycanthropyId]) {
                return;
            }
            if (unit.modifiers[LycanthropyId].beenTransformed && unit.modifiers[LycanthropyId].levelLastTransformed != underworld.levelIndex) {
                unit.modifiers[LycanthropyId].beenTransformed = false;
            }
            const originalUnit = allUnits[spellmasonUnitId]
            const player = underworld.players.find(p => p.unit == unit);
            if (player && player.unit.modifiers[LycanthropyId] && unit.modifiers[LycanthropyId].transformed && originalUnit && unit.modifiers[LycanthropyId].reservedSpells) {
                unit.modifiers[LycanthropyId].transformed = false;
                if (!prediction) {
                    visualPolymorphPlayerUnit(unit, originalUnit);
                    unit.mana = unit.modifiers[LycanthropyId].reservedMana;
                    unit.manaMax = unit.mana;
                    const spellsToRestore = unit.modifiers[LycanthropyId].reservedSpells || [];
                    const spellsToYoink = player.unit.modifiers[LycanthropyId].werewolfSpells || [];
                    player.disabledCards = player.disabledCards.filter(card => !spellsToRestore.includes(card));
                    player.inventory = player.inventory.filter(card => !spellsToYoink.includes(card));
                    let i = 0;
                    const spellsToPutBack = unit.modifiers[LycanthropyId].displacedSpells || [];
                    for (const spell of spellsToPutBack) {
                        player.cardsInToolbar[i] = spell;
                        i++;
                    }
                }
            }
            if (unit.stamina == unit.staminaMax && unit.mana == unit.manaMax && !unit.modifiers[LycanthropyId].beenTransformed) {
                unit.modifiers[LycanthropyId].standingStillTurns++;
                floatingText({ coords: unit, text: 'Still for ' + unit.modifiers[LycanthropyId].standingStillTurns, prediction });
                const toSourceUnit = allUnits[werewolf_unit_id];
                const player = underworld.players.find(p => p.unit == unit);
                if (player && toSourceUnit && unit.unitType === UnitType.PLAYER_CONTROLLED && unit.modifiers[LycanthropyId].standingStillTurns == 3) {
                    if (!prediction) {
                        //Shift Stats
                        unit.stamina += unit.mana;
                        unit.modifiers[LycanthropyId].reservedMana = unit.mana;
                        unit.mana = 0;
                        unit.manaMax = 0;
                        unit.stamina *= 1.5;
                        //transform
                        visualPolymorphPlayerUnit(unit, toSourceUnit);
                        if (!player.disabledCards) {
                            player.disabledCards = [];
                        }
                        //Disable all spells and insert werewolf spells
                        unit.modifiers[LycanthropyId].reservedSpells = player.inventory;
                        player.disabledCards.push(...player.inventory);
                        for (const spell of unit.modifiers[LycanthropyId].werewolfSpells) {
                            const upgrade = upgradeCardsSource.find(u => u.title === spell);
                            if (upgrade) {
                                underworld.forceUpgrade(player, upgrade, true);
                                floatingText({ coords: unit, text: 'Gained ' + spell, prediction });
                            } else {
                                floatingText({ coords: unit, text: 'Spell gain failed, upgrade does not exist.', prediction });
                            }
                        }
                        let i = 0;
                        for (const spell of unit.modifiers[LycanthropyId].werewolfSpells) {
                            let priorIndexofWSpell = player.cardsInToolbar.findIndex(card => card == spell);
                            unit.modifiers[LycanthropyId].displacedSpells.push(player.cardsInToolbar[i]);
                            player.cardsInToolbar[i] = spell;
                            player.cardsInToolbar[priorIndexofWSpell] = '';
                            i++;
                        }
                        unit.modifiers[LycanthropyId].transformed = true;
                        unit.modifiers[LycanthropyId].beenTransformed = true;
                    } else {
                    }
                } else if (!toSourceUnit) {
                }
            } else {
                unit.modifiers[LycanthropyId].standingStillTurns = 0;
                floatingText({ coords: unit, text: 'Turn count set to ' + unit.modifiers[LycanthropyId].standingStillTurns, prediction });
            }

        },
        onSpawn: (unit: Unit.IUnit, underworld: Underworld, prediction: boolean) => {
            const modifier = unit.modifiers[LycanthropyId];
            const originalUnit = allUnits[spellmasonUnitId]
            const player = underworld.players.find(p => p.unit == unit);
            if (originalUnit && unit.modifiers[LycanthropyId] && modifier && modifier.transformed && player && unit) {
                visualPolymorphPlayerUnit(unit, originalUnit);
                floatingText({ coords: unit, text: 'Spawn function called', prediction });
                unit.mana = unit.modifiers[LycanthropyId].reservedMana;
                unit.manaMax = unit.mana;
                const spellsToRestore = unit.modifiers[LycanthropyId].reservedSpells || [];
                floatingText({ coords: unit, text: 'Restoring ' + spellsToRestore.length + ' spells', prediction });
                const spellsToYoink = unit.modifiers[LycanthropyId].werewolfSpells || [];
                floatingText({ coords: unit, text: 'Yoinking ' + spellsToYoink.length + ' spells', prediction });
                player.disabledCards = player.disabledCards.filter(card => !spellsToRestore.includes(card));
                player.inventory = player.inventory.filter(card => !spellsToYoink.includes(card));
                let i = 0;
                const spellsToPutBack = unit.modifiers[LycanthropyId].displacedSpells || [];
                floatingText({ coords: unit, text: 'Putting back ' + spellsToPutBack.length + ' spells', prediction });
                for (const spell of spellsToPutBack) {
                    player.cardsInToolbar[i] = spell;
                    i++;
                }
            }
        }
    });
}
// Type guard
