import { CardCategory } from '../types/commonTypes';
import { IUpgrade, upgradeCardsSource } from '../Upgrade';
import { allCards, type ICard } from './index';
import type { IPlayer } from '../entity/Player';
import Underworld from '../Underworld';
import { chooseOneOfSeeded, getUniqueSeedString, seedrandom } from '../jmath/rand';
import * as config from '../config';
import * as CardUI from '../graphics/ui/CardUI';
import { isModActive } from '../registerMod';

// Thumbnails for each category
const categoryThumbnails: Record<CardCategory, string> = {
  [CardCategory.Damage]: 'spellIconBolt.png',
  [CardCategory.Movement]: 'spellIconDash.png',
  [CardCategory.Targeting]: 'spellIconConnect.png',
  [CardCategory.Mana]: 'spellIconConserve.png',
  [CardCategory.Curses]: 'spellIconCursify.png',
  [CardCategory.Blessings]: 'spellIconHeal.png',
  [CardCategory.Soul]: 'spellIconCaptureSoul.png',
};

const categoryNames: Record<CardCategory, string> = {
  [CardCategory.Damage]: 'Damage',
  [CardCategory.Movement]: 'Movement',
  [CardCategory.Targeting]: 'Targeting',
  [CardCategory.Mana]: 'Mana',
  [CardCategory.Curses]: 'Curses',
  [CardCategory.Blessings]: 'Blessings',
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

export function animateWardenShuffle() {
  if (globalThis.headless) return;
  const slots = document.querySelectorAll('#card-hand .slot');
  slots.forEach(el => {
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

export function resolveAllWardenSlots(player: IPlayer, underworld: Underworld) {
  // Clear inventory and toolbar for re-resolution
  player.inventory = [];
  player.cardsInToolbar = Array(config.NUMBER_OF_TOOLBAR_SLOTS * config.NUMBER_OF_TOOLBARS).fill('');

  for (let i = 0; i < player.wardenSlots.length; i++) {
    const cardId = resolveWardenSlot(player, i, underworld);
    if (cardId) {
      player.inventory.push(cardId);
      // Place in toolbar at the corresponding position
      if (i < player.cardsInToolbar.length) {
        player.cardsInToolbar[i] = cardId;
      }
    }
  }
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
        if (slotIndex < player.cardsInToolbar.length) {
          player.cardsInToolbar[slotIndex] = cardId;
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
