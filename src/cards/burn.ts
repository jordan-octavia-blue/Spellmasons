import { IUnit } from '../entity/Unit';
import { Spell } from './index';
import * as Unit from '../entity/Unit';
import Underworld from '../Underworld';
import { CardCategory } from '../types/commonTypes';
import floatingText from '../graphics/FloatingText';
import { CardRarity, probabilityMap } from '../types/commonTypes';
import { getOrInitModifier } from './util';
import { freezeCardId } from './freeze';
import { flammableId } from './flammable';
import { makeFireExplosion } from '../graphics/ParticleCollection';

export const burnCardId = 'Burn';
export const baseBurnStacks = 1;
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
        thumbnail: 'burn.png',
        description: "Inflicts a stack of Burn. Burn damage scales according to 5 times the number of stacks squared. Burn stacks decrease by 1 every turn.",
        effect: async (state, card, quantity, underworld, prediction) => {
            // .filter: only target living units
            const targets = state.targetedUnits.filter(u => u.alive);
            if (targets.length) {
                for (let unit of targets) {
                    applyBurnWithEffect(unit, underworld, prediction, baseBurnStacks * quantity, { sourceUnitId: state.casterUnit.id });
                }
            }
            return state;
        },
    },
    modifiers: {
        add,
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
            if (!unit.alive) return;
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

// Applies burn stacks to a unit and plays the fire explosion particle effect.
// Use this when burn is applied outside of the Ignite spell itself (e.g. wildfire spread, flamethrower).
export function applyBurnWithEffect(unit: IUnit, underworld: Underworld, prediction: boolean, quantity: number, extra?: { [key: string]: any }) {
    if (unit.inLiquid) {
        if (!prediction && !globalThis.headless) {
            floatingText({ coords: unit, text: 'Extinguished', style: { fill: '#87ceebff' } });
        }
        return;
    }
    if (quantity > 0) {
        Unit.addModifier(unit, burnCardId, underworld, prediction, quantity, extra);
    }
    if (!prediction && !globalThis.headless) {
        makeFireExplosion(unit, prediction);
    }
}

function add(unit: Unit.IUnit, underworld: Underworld, prediction: boolean, quantity: number = 1, extra?: { [key: string]: any }) {
    if (unit.inLiquid) {
        return;
    }
    if (unit.modifiers[flammableId]) {
        const flammableStacks = unit.modifiers[flammableId].quantity;
        quantity = quantity * (flammableStacks + 1);
        Unit.removeModifier(unit, flammableId, underworld);
    }
    const modifier = getOrInitModifier(unit, burnCardId, { isCurse: true, quantity }, () => {
        Unit.addEvent(unit, burnCardId);
    });
    if (unit.modifiers[freezeCardId] && !prediction) {
        Unit.removeModifier(unit, freezeCardId, underworld);
    }
}

export default spell;