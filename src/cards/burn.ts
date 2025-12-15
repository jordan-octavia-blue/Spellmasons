import type * as PIXI from 'pixi.js';
import { IUnit, takeDamage } from '../entity/Unit';
import * as Image from '../graphics/Image';
import { Spell } from './index';
import * as Unit from '../entity/Unit';
import Underworld from '../Underworld';
import { CardCategory } from '../types/commonTypes';
import { playDefaultSpellAnimation, playDefaultSpellSFX } from './cardUtils';
import floatingText from '../graphics/FloatingText';
import { CardRarity, probabilityMap } from '../types/commonTypes';
import { getOrInitModifier } from './util';
import { freezeCardId } from './freeze';
import { flammableId } from './flammable';

export const burnCardId = 'Ignite';
export const baseBurnStacks = 1;
const subspriteImageName = 'modifierPoisonDrip';
const spell: Spell = {
    card: {
        id: burnCardId,
        category: CardCategory.Curses,
        sfx: 'poison',
        supportQuantity: true,
        manaCost: 10,
        healthCost: 0,
        expenseScaling: 1,
        probability: probabilityMap[CardRarity.UNCOMMON],
        thumbnail: 'spellIconPoison.png',
        animationPath: 'spellPoison',
        description: "Inflicts a stack of Burn. Burn damage scales according to 5 times the number of stacks squared. Burn stacks decrease by 1 every turn.",
        effect: async (state, card, quantity, underworld, prediction) => {
            // .filter: only target living units
            const targets = state.targetedUnits.filter(u => u.alive);
            if (targets.length) {
                await Promise.all([playDefaultSpellAnimation(card, targets, prediction), playDefaultSpellSFX(card, prediction)]);
                for (let unit of targets) {
                    Unit.addModifier(unit, burnCardId, underworld, prediction, baseBurnStacks * quantity, { sourceUnitId: state.casterUnit.id });
                }
            }
            return state;
        },
    },
    modifiers: {
        add,
        addModifierVisuals,
        subsprite: {
            imageName: subspriteImageName,
            alpha: 1.0,
            anchor: {
                x: 0.6,
                y: 0.5,
            },
            scale: {
                x: 1.0,
                y: 1.0,
            },
        },
    },
    events: {
        onTooltip: (unit: Unit.IUnit, underworld: Underworld) => {
            const modifier = unit.modifiers[burnCardId];
            if (modifier) {
                // Set tooltip:
                const stacks = modifier.quantity;
                const damage = 5 * stacks * stacks;
                modifier.tooltip = `${modifier.quantity} ${i18n('Burn')} \n ${damage} Burn damage on turn end`;
            }
        },
        onTurnEnd: async (unit: IUnit, underworld: Underworld, prediction: boolean) => {
            const modifier = unit.modifiers[burnCardId];
            if (modifier) {
                // Don't take damage on prediction because it is confusing for people to see the prediction damage that poison will do,
                // they assume prediction damage is only from their direct cast, not including the start of the next turn
                if (!prediction) {
                    const sourceUnit = underworld.getUnitById(modifier.sourceUnitId, prediction);
                    const stacks = modifier.quantity;
                    const damage = 5 * stacks * stacks;
                    Unit.takeDamage({
                        unit: unit,
                        amount: damage,
                        sourceUnit: sourceUnit,
                        fromVec2: unit,
                    }, underworld, prediction);
                    floatingText({
                        coords: unit, text: `${damage} burn damage`,
                        style: { fill: '#c05a0dff' },
                    });
                    modifier.quantity -= 1;
                    if (modifier.quantity <= 0) {
                        Unit.removeModifier(unit, burnCardId, underworld);
                    }
                }
            } else {
                console.error(`Should have ${burnCardId} modifier on unit but it is missing`);
                return;
            }
        },
    },
};

function add(unit: Unit.IUnit, underworld: Underworld, prediction: boolean, quantity: number = 1, extra?: { [key: string]: any }) {
    if (unit.modifiers[flammableId] && !prediction) {
        const flammableStacks = unit.modifiers[flammableId].quantity;
        quantity = quantity * (flammableStacks + 1);
        Unit.removeModifier(unit, flammableId, underworld);
    }
    const modifier = getOrInitModifier(unit, burnCardId, { isCurse: true, quantity }, () => {
        Unit.addEvent(unit, burnCardId);
        if (unit.modifiers[freezeCardId] && !prediction) {
            Unit.removeModifier(unit, freezeCardId, underworld);
            floatingText({ coords: unit, text: 'Ice Melted', style: { fill: '#c05a0dff' } });
        }


    });
}

function addModifierVisuals(unit: Unit.IUnit, underworld: Underworld) {
    Image.addSubSprite(unit.image, subspriteImageName);
    if (spell.modifiers?.subsprite) {
        // @ts-ignore: imagePath is a property that i've added and is not a part of the PIXI type
        // which is used for identifying the sprite or animation that is currently active
        const poisonSubsprite = unit.image?.sprite.children.find(c => c.imagePath == spell.modifiers?.subsprite?.imageName)
        if (poisonSubsprite) {
            const animatedSprite = poisonSubsprite as PIXI.AnimatedSprite;
            animatedSprite.onFrameChange = (currentFrame) => {
                if (currentFrame == 5) {
                    animatedSprite.anchor.x = (3 + Math.random() * (6 - 3)) / 10;
                }
            }
        }
    }
}

export default spell;