import { CardCategory } from '../types/commonTypes';
import { IUpgrade, upgradeCardsSource } from '../Upgrade';
import { allCards, type ICard } from './index';
import type { IPlayer } from '../entity/Player';
import Underworld from '../Underworld';
import { chooseOneOfSeeded, getUniqueSeedString, seedrandom } from '../jmath/rand';
import * as config from '../config';
import * as CardUI from '../graphics/ui/CardUI';
import { isModActive } from '../registerMod';
import { wardenSpellLockId } from '../modifierWardenConstants';

// Thumbnails for each category
const categoryThumbnails: Record<CardCategory, string> = {
  [CardCategory.Damage]: 'images/spell/warden_ball_damage.png',
  [CardCategory.Movement]: 'images/spell/warden_ball_move.png',
  [CardCategory.Targeting]: 'images/spell/warden_ball_target.png',
  [CardCategory.Mana]: 'images/spell/warden_ball_mana.png',
  [CardCategory.Curses]: 'images/spell/warden_ball_curse.png',
  [CardCategory.Blessings]: 'images/spell/warden_ball_blessing.png',
  [CardCategory.Soul]: 'images/spell/warden_ball_soul.png',
};

const categoryNames: Record<CardCategory, string> = {
  [CardCategory.Damage]: 'Damage',
  [CardCategory.Movement]: 'Movement',
  [CardCategory.Targeting]: 'Targeting',
  [CardCategory.Mana]: 'Mana',
  [CardCategory.Curses]: 'Curse',
  [CardCategory.Blessings]: 'Blessing',
  [CardCategory.Soul]: 'Soul',
};

export function getCardsInCategory(category: CardCategory, player: IPlayer, underworld: Underworld): ICard[] {
  return Object.values(allCards).filter(card => {
    if (card.category !== category) return false;
    // Exclude cards from inactive mods
    if (!isModActive(card, underworld)) return false;
    // For Soul category, exclude summon cards (probability 0) unless captured
    if (category === CardCategory.Soul && card.probability === 0) {
      return player.wardenCapturedSouls.includes(card.id);
    }
    // Exclude cards with probability 0 (special/hidden cards)
    if (card.probability <= 0) return false;
    return true;
  });
}

export function resolveWardenSlot(player: IPlayer, slotIndex: number, underworld: Underworld): string | undefined {
  const category = player.wardenSlots[slotIndex];
  if (isNullOrUndef(category)) return undefined;

  const availableCards = getCardsInCategory(category, player, underworld);
  if (availableCards.length === 0) return undefined;

  const seedString = `${getUniqueSeedString(underworld, player)}-warden-${slotIndex}`;
  const seed = seedrandom(seedString);
  const chosen = chooseOneOfSeeded(availableCards, seed);
  return chosen?.id;
}

export function animateWardenShuffle(lockedToolbarPositions?: Set<number>) {
  if (globalThis.headless) return;
  const slots = document.querySelectorAll('#card-hand .slot');
  slots.forEach((el, index) => {
    // Skip animation for slots locked by Spell Anchor
    if (lockedToolbarPositions && lockedToolbarPositions.has(index)) return;
    el.classList.remove('warden-shuffle');
    // Force reflow to restart animation
    void (el as HTMLElement).offsetWidth;
    el.classList.add('warden-shuffle');
  });
  // Clean up class after animation ends
  setTimeout(() => {
    slots.forEach(el => el.classList.remove('warden-shuffle'));
  }, 600);
}

export function resolveAllWardenSlots(player: IPlayer, underworld: Underworld, isLevelStart: boolean = false): Set<number> {
  // Save earned spells (freeSpells) before clearing inventory
  const earnedSpells = player.freeSpells.filter(id => player.inventory.includes(id));
  // Track toolbar positions of earned spells
  const earnedSpellToolbarPositions: { id: string, index: number }[] = [];
  for (const spellId of earnedSpells) {
    const idx = player.cardsInToolbar.indexOf(spellId);
    if (idx !== -1) {
      earnedSpellToolbarPositions.push({ id: spellId, index: idx });
    }
  }

  // Track where each warden slot's card currently sits on the toolbar.
  // Use cardsInToolbar as source of truth (the user may have rearranged).
  // Build a reverse map: toolbar position -> warden slot index
  const toolbarPosToSlot: Map<number, number> = new Map();
  const slotToToolbarPos: Map<number, number> = new Map();
  const usedToolbarPositions = new Set<number>();
  for (let i = 0; i < player.wardenSlots.length; i++) {
    const currentCard = player.inventory[i];
    if (currentCard) {
      for (let t = 0; t < player.cardsInToolbar.length; t++) {
        if (player.cardsInToolbar[t] === currentCard && !usedToolbarPositions.has(t)) {
          slotToToolbarPos.set(i, t);
          toolbarPosToSlot.set(t, i);
          usedToolbarPositions.add(t);
          break;
        }
      }
    }
  }

  // Determine how many slots are locked by Spell Anchor
  const spellLockModifier = player.unit.modifiers[wardenSpellLockId];
  // isLevelStart is used to force locked spells to rerandomize on each new level
  const lockedSlotCount = isLevelStart ? 0 : (spellLockModifier?.quantity || 0);

  // Determine which toolbar positions are locked (first N occupied warden-card positions)
  // and which warden slot indices those correspond to
  const lockedToolbarPositions = new Set<number>();
  const lockedSlotIndices = new Set<number>();
  if (lockedSlotCount > 0) {
    let locked = 0;
    for (let t = 0; t < player.cardsInToolbar.length && locked < lockedSlotCount; t++) {
      const cardId = player.cardsInToolbar[t];
      if (!cardId || earnedSpells.includes(cardId)) continue;
      const slotIdx = toolbarPosToSlot.get(t);
      if (isNullOrUndef(slotIdx)) continue;
      lockedToolbarPositions.add(t);
      lockedSlotIndices.add(slotIdx);
      locked++;
    }
  }

  // Save previous toolbar for locked cards
  const previousToolbar = [...player.cardsInToolbar];

  // Clear inventory and toolbar for re-resolution
  player.inventory = [];
  player.cardsInToolbar = Array(config.NUMBER_OF_TOOLBAR_SLOTS * config.NUMBER_OF_TOOLBARS).fill('');

  // First pass: restore locked cards at their toolbar positions
  for (const t of lockedToolbarPositions) {
    const cardId = previousToolbar[t];
    if (cardId) {
      player.inventory.push(cardId);
      player.cardsInToolbar[t] = cardId;
    }
  }

  // Second pass: resolve unlocked warden slots
  for (let i = 0; i < player.wardenSlots.length; i++) {
    if (lockedSlotIndices.has(i)) continue;

    const cardId = resolveWardenSlot(player, i, underworld);
    if (cardId) {
      player.inventory.push(cardId);
      const toolbarPos = slotToToolbarPos.get(i) ?? i;
      if (toolbarPos < player.cardsInToolbar.length && player.cardsInToolbar[toolbarPos] === '') {
        player.cardsInToolbar[toolbarPos] = cardId;
      } else {
        // Preferred position occupied (e.g. by a locked card), find first empty slot
        const emptyIdx = player.cardsInToolbar.indexOf('');
        if (emptyIdx !== -1) {
          player.cardsInToolbar[emptyIdx] = cardId;
        }
      }
    }
  }

  // Re-add earned spells to inventory and toolbar
  for (const spellId of earnedSpells) {
    if (!player.inventory.includes(spellId)) {
      player.inventory.push(spellId);
    }
  }
  for (const { id, index } of earnedSpellToolbarPositions) {
    if (index < player.cardsInToolbar.length && player.cardsInToolbar[index] === '') {
      player.cardsInToolbar[index] = id;
    } else {
      // Find first empty toolbar slot
      const emptyIdx = player.cardsInToolbar.indexOf('');
      if (emptyIdx !== -1) {
        player.cardsInToolbar[emptyIdx] = id;
      } else {
        console.warn(`Warden: no empty toolbar slot for earned spell "${id}"`);
      }
    }
  }

  return lockedToolbarPositions;
}

export const WARDEN_UPGRADE_ID_PREFIX = 'Warden: ';

function makeWardenCategoryUpgrade(category: CardCategory): IUpgrade {
  const title = `Warden: ${categoryNames[category]}`;
  return {
    title,
    type: 'card',
    cardCategory: category,
    probability: 50,
    omitForWizardType: ['Spellmason', 'Deathmason', 'Goru'],
    thumbnail: categoryThumbnails[category],
    description: () => `Add a ${categoryNames[category]} spell slot. Each turn, a random ${categoryNames[category]} spell fills this slot.`,
    cost: { manaCost: 0, healthCost: 0, staminaCost: 0 },
    effect: (player: IPlayer, underworld: Underworld) => {
      player.wardenSlots.push(category);
      const slotIndex = player.wardenSlots.length - 1;
      const cardId = resolveWardenSlot(player, slotIndex, underworld);
      if (cardId) {
        player.inventory.push(cardId);
        const emptySlotIndex = player.cardsInToolbar.indexOf('');
        if (emptySlotIndex !== -1) {
          player.cardsInToolbar[emptySlotIndex] = cardId;
        }
      }
      CardUI.recalcPositionForCards(player, underworld);
    },
  };
}

let wardenCategoryUpgrades: IUpgrade[] | undefined;

export function getWardenCategoryUpgrades(): IUpgrade[] {
  if (!wardenCategoryUpgrades) {
    wardenCategoryUpgrades = [
      makeWardenCategoryUpgrade(CardCategory.Damage),
      makeWardenCategoryUpgrade(CardCategory.Movement),
      makeWardenCategoryUpgrade(CardCategory.Targeting),
      makeWardenCategoryUpgrade(CardCategory.Mana),
      makeWardenCategoryUpgrade(CardCategory.Curses),
      makeWardenCategoryUpgrade(CardCategory.Blessings),
      makeWardenCategoryUpgrade(CardCategory.Soul),
    ];
  }
  return wardenCategoryUpgrades;
}
