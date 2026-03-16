"use strict";
const {
  PixiUtils: PixiUtils$i,
  rand: rand$g,
  cardUtils: cardUtils$C,
  commonTypes: commonTypes$X,
  cards: cards$P
} = globalThis.SpellmasonsAPI;
const { randFloat: randFloat$3 } = rand$g;
const { refundLastSpell: refundLastSpell$A } = cards$P;
const { containerSpells: containerSpells$5 } = PixiUtils$i;
const Unit$N = globalThis.SpellmasonsAPI.Unit;
const { oneOffImage: oneOffImage$4, playDefaultSpellSFX: playDefaultSpellSFX$r } = cardUtils$C;
const { CardCategory: CardCategory$V, probabilityMap: probabilityMap$U, CardRarity: CardRarity$T } = commonTypes$X;
const cardId$i = "Undead Blade";
const damageDone$2 = 60;
const animationPath$5 = "spellUndeadBlade";
const delayBetweenAnimationsStart$2 = 400;
const spell$T = {
  card: {
    id: cardId$i,
    category: CardCategory$V.Damage,
    supportQuantity: true,
    manaCost: 10,
    healthCost: 0,
    expenseScaling: 1,
    probability: probabilityMap$U[CardRarity$T.COMMON],
    thumbnail: "spellmasons-mods/undead_blade/spellIconUndeadBlade.png",
    animationPath: animationPath$5,
    sfx: "hurt",
    description: [`Deals ${damageDone$2} to summoned units and resurrected units only.`],
    effect: async (state, card, quantity, underworld, prediction) => {
      const targets = state.targetedUnits.filter((u) => u.alive && !u.originalLife);
      let delayBetweenAnimations = delayBetweenAnimationsStart$2;
      for (let q = 0; q < quantity; q++) {
        if (!prediction && !globalThis.headless) {
          playDefaultSpellSFX$r(card, prediction);
          for (let unit2 of targets) {
            const spellEffectImage = oneOffImage$4(unit2, animationPath$5, containerSpells$5);
            if (spellEffectImage) {
              spellEffectImage.sprite.rotation = randFloat$3(-Math.PI / 6, Math.PI / 6);
              if (q % 2 == 0) {
                spellEffectImage.sprite.scale.x = -1;
              }
            }
            Unit$N.takeDamage({
              unit: unit2,
              amount: damageDone$2,
              sourceUnit: state.casterUnit,
              fromVec2: state.casterUnit
            }, underworld, prediction);
          }
          await new Promise((resolve) => setTimeout(resolve, delayBetweenAnimations));
          delayBetweenAnimations *= 0.8;
          delayBetweenAnimations = Math.max(20, delayBetweenAnimations);
        } else {
          for (let unit2 of targets) {
            Unit$N.takeDamage({
              unit: unit2,
              amount: damageDone$2,
              sourceUnit: state.casterUnit,
              fromVec2: state.casterUnit
            }, underworld, prediction);
          }
        }
      }
      if (targets.length == 0) {
        refundLastSpell$A(state, prediction, "No valid targets. Cost refunded.");
      }
      return state;
    }
  }
};
const mod$a = {
  modName: "Undead Blade",
  author: "Jordan O'Leary",
  description: "A spell that does lots of damage to summons and resurrected units",
  screenshot: "spellmasons-mods/undead_blade/spellIconUndeadBlade.png",
  spells: [
    spell$T
  ],
  // The spritesheet is created with TexturePacker: https://www.codeandweb.com/texturepacker
  spritesheet: "spellmasons-mods/undead_blade/undead_blade.json"
};
const {
  cardUtils: cardUtils$B,
  commonTypes: commonTypes$W,
  cards: cards$O,
  cardsUtil: cardsUtil$j,
  FloatingText: FloatingText$c
} = globalThis.SpellmasonsAPI;
const { refundLastSpell: refundLastSpell$z } = cards$O;
const Unit$M = globalThis.SpellmasonsAPI.Unit;
const { playDefaultSpellSFX: playDefaultSpellSFX$q } = cardUtils$B;
const { CardCategory: CardCategory$U, probabilityMap: probabilityMap$T, CardRarity: CardRarity$S } = commonTypes$W;
const cardId$h = "Decay";
const spell$S = {
  card: {
    id: cardId$h,
    category: CardCategory$U.Curses,
    supportQuantity: true,
    manaCost: 35,
    healthCost: 0,
    expenseScaling: 2,
    probability: probabilityMap$T[CardRarity$S.RARE],
    thumbnail: "spellmasons-mods/Wodes_Grimoire/graphics/icons/spelliconDecay.png",
    sfx: "poison",
    description: [`Causes the target to take damage equal to the number of decay stacks squared at the start of their turn. The target then gains another stack.`],
    effect: async (state, card, quantity, underworld, prediction) => {
      const targets = state.targetedUnits.filter((u) => u.alive);
      if (targets.length == 0) {
        refundLastSpell$z(state, prediction, "No target, mana refunded");
      } else {
        if (!prediction) {
          playDefaultSpellSFX$q(card, prediction);
        }
        for (let unit2 of targets) {
          Unit$M.addModifier(unit2, card.id, underworld, prediction, quantity);
        }
      }
      return state;
    }
  },
  modifiers: {
    add: add$b
  },
  events: {
    onTurnStart: async (unit2, underworld, prediction) => {
      const modifier = unit2.modifiers[cardId$h];
      if (modifier && !!Math.pow(modifier.quantity, 2) && !prediction) {
        Unit$M.takeDamage({ unit: unit2, amount: Math.pow(modifier.quantity, 2) }, underworld, prediction);
        FloatingText$c.default({
          coords: unit2,
          text: `${Math.pow(modifier.quantity, 2)} decay damage`,
          style: { fill: "#525863", strokeThickness: 1 }
        });
        modifier.quantity++;
      }
    }
  }
};
function add$b(unit2, _underworld, _prediction, quantity) {
  cardsUtil$j.getOrInitModifier(unit2, cardId$h, {
    isCurse: true,
    quantity,
    persistBetweenLevels: false
  }, () => {
    SpellmasonsAPI.Unit.addEvent(unit2, cardId$h);
  });
}
const {
  cardUtils: cardUtils$A,
  commonTypes: commonTypes$V,
  cards: cards$N
} = globalThis.SpellmasonsAPI;
const { refundLastSpell: refundLastSpell$y } = cards$N;
const Unit$L = globalThis.SpellmasonsAPI.Unit;
const { playDefaultSpellSFX: playDefaultSpellSFX$p } = cardUtils$A;
const { CardCategory: CardCategory$T, probabilityMap: probabilityMap$S, CardRarity: CardRarity$R } = commonTypes$V;
const cardId$g = "Dominate";
const healthThreshhold = 0.25;
const spell$R = {
  card: {
    id: cardId$g,
    category: CardCategory$T.Soul,
    supportQuantity: false,
    manaCost: 60,
    healthCost: 0,
    expenseScaling: 2.5,
    probability: probabilityMap$S[CardRarity$R.RARE],
    thumbnail: "spellmasons-mods/Wodes_Grimoire/graphics/icons/spelliconDominate.png",
    sfx: "suffocate",
    description: [`Converts an enemy to fight for you if they are below ${healthThreshhold * 100}% health.`],
    //Wololo
    effect: async (state, card, quantity, underworld, prediction) => {
      const targets = state.targetedUnits.filter((u) => u.alive && u.health <= u.healthMax * healthThreshhold && u.faction !== state.casterUnit.faction);
      if (!prediction && !globalThis.headless) {
        playDefaultSpellSFX$p(card, prediction);
      }
      for (let unit2 of targets) {
        Unit$L.changeFaction(unit2, state.casterUnit.faction);
      }
      if (targets.length == 0) {
        refundLastSpell$y(state, prediction, "No low health targets to convert, mana refunded");
      }
      return state;
    }
  }
};
const {
  cardUtils: cardUtils$z,
  commonTypes: commonTypes$U,
  cards: cards$M,
  cardsUtil: cardsUtil$i
} = globalThis.SpellmasonsAPI;
const { refundLastSpell: refundLastSpell$x } = cards$M;
const Unit$K = globalThis.SpellmasonsAPI.Unit;
const { playDefaultSpellSFX: playDefaultSpellSFX$o } = cardUtils$z;
const { CardCategory: CardCategory$S, probabilityMap: probabilityMap$R, CardRarity: CardRarity$Q } = commonTypes$U;
const cardId$f = "Ensnare";
const spell$Q = {
  card: {
    id: cardId$f,
    category: CardCategory$S.Curses,
    supportQuantity: true,
    manaCost: 25,
    healthCost: 0,
    expenseScaling: 2,
    probability: probabilityMap$R[CardRarity$Q.SPECIAL],
    thumbnail: "spellmasons-mods/Wodes_Grimoire/graphics/icons/spelliconEnsnare.png",
    sfx: "",
    description: [`Prevents the target from moving for one turn. Furthur casts increase duration.`],
    effect: async (state, card, quantity, underworld, prediction) => {
      const targets = state.targetedUnits.filter((u) => u.alive);
      if (targets.length == 0) {
        refundLastSpell$x(state, prediction, "No target, mana refunded");
      } else {
        if (!prediction) {
          playDefaultSpellSFX$o(card, prediction);
        }
        for (let unit2 of targets) {
          Unit$K.addModifier(unit2, card.id, underworld, prediction, quantity);
        }
      }
      return state;
    }
  },
  modifiers: {
    add: add$a,
    remove: remove$4
  },
  events: {
    onTurnEnd: async (unit2, underworld, prediction) => {
      const modifier = unit2.modifiers[cardId$f];
      if (modifier) {
        modifier.quantity--;
        if (modifier.quantity <= 0) {
          Unit$K.removeModifier(unit2, cardId$f, underworld);
        }
      }
    }
  }
};
function add$a(unit2, underworld, prediction, quantity) {
  cardsUtil$i.getOrInitModifier(unit2, cardId$f, {
    isCurse: true,
    quantity,
    persistBetweenLevels: false,
    originalstat: unit2.staminaMax
  }, () => {
    SpellmasonsAPI.Unit.addEvent(unit2, cardId$f);
    unit2.stamina = 0;
    unit2.staminaMax = 0;
  });
}
function remove$4(unit2, underworld) {
  if (unit2.modifiers && unit2.modifiers[cardId$f]) {
    const originalStamina = unit2.modifiers[cardId$f].originalstat;
    if (originalStamina && unit2.staminaMax == 0) {
      unit2.staminaMax = originalStamina;
    }
  }
}
const {
  cardUtils: cardUtils$y,
  commonTypes: commonTypes$T,
  cards: cards$L,
  FloatingText: FloatingText$b
} = globalThis.SpellmasonsAPI;
const { refundLastSpell: refundLastSpell$w } = cards$L;
globalThis.SpellmasonsAPI.Unit;
const { playDefaultSpellSFX: playDefaultSpellSFX$n } = cardUtils$y;
const { CardCategory: CardCategory$R, probabilityMap: probabilityMap$Q, CardRarity: CardRarity$P } = commonTypes$T;
const Events = globalThis.SpellmasonsAPI.Events;
const cardId$e = "Fast Forward";
const spell$P = {
  card: {
    id: cardId$e,
    category: CardCategory$R.Soul,
    //Theres no "other" category
    supportQuantity: false,
    manaCost: 25,
    healthCost: 0,
    expenseScaling: 1.5,
    probability: probabilityMap$Q[CardRarity$P.RARE],
    thumbnail: "spellmasons-mods/Wodes_Grimoire/graphics/icons/spelliconFastForward.png",
    sfx: "push",
    //TODO
    description: [`Shunt the target forward through time. Causes progression of spell effects but does not affect cooldowns.`],
    //TODO: better deffinition
    effect: async (state, card, quantity, underworld, prediction) => {
      const targets = state.targetedUnits.filter((u) => u.alive);
      if (!prediction && !globalThis.headless) {
        playDefaultSpellSFX$n(card, prediction);
        for (let unit2 of targets) {
          setTimeout(() => {
            FloatingText$b.default({
              coords: unit2,
              text: `Fast Forward`,
              style: { fill: "#ff0000", strokeThickness: 1 }
            });
          }, 200);
          procEvents(unit2, underworld, prediction);
        }
      } else {
        for (let unit2 of targets) {
          procEvents(unit2, underworld, prediction);
        }
      }
      if (targets.length == 0) {
        refundLastSpell$w(state, prediction, "No targets chosen, mana refunded");
      }
      return state;
    }
  }
};
async function procEvents(unit2, underworld, prediction) {
  for (let i = 0; i < unit2.events.length; i++) {
    const eventName = unit2.events[i];
    if (eventName) {
      const fns = Events.default.onTurnStartSource[eventName];
      if (fns) {
        await fns(unit2, underworld, prediction, unit2.faction);
      }
    }
  }
  for (let i = 0; i < unit2.events.length; i++) {
    const eventName = unit2.events[i];
    if (eventName) {
      const fne = Events.default.onTurnEndSource[eventName];
      if (fne) {
        await fne(unit2, underworld, prediction, unit2.faction);
      }
    }
  }
}
const {
  Particles: Particles$6,
  particleEmitter: particleEmitter$2
} = globalThis.SpellmasonsAPI;
function makeFlameStrikeWithParticles(position, prediction, resolver) {
  if (prediction || globalThis.headless) {
    if (resolver) {
      resolver();
    }
    return;
  }
  const texture = Particles$6.createParticleTexture();
  if (!texture) {
    Particles$6.logNoTextureWarning("makeFlameStrikeAttack");
    return;
  }
  const config2 = particleEmitter$2.upgradeConfig({
    autoUpdate: true,
    "alpha": {
      "start": 0.425,
      "end": 0.25
    },
    "scale": {
      "start": 1.5,
      "end": 3,
      "minimumScaleMultiplier": 1
    },
    "color": {
      "start": "#ebc323",
      "end": "#e63e1c"
    },
    "speed": {
      "start": 400,
      "end": 0,
      "minimumSpeedMultiplier": 1
    },
    "acceleration": {
      "x": 0,
      "y": -500
    },
    "maxSpeed": 0,
    "startRotation": {
      "min": 80,
      "max": 100
    },
    "noRotation": false,
    "rotationSpeed": {
      "min": 0,
      "max": 0
    },
    "lifetime": {
      "min": 0.5,
      "max": 1.3
    },
    "blendMode": "normal",
    "frequency": 4e-3,
    "emitterLifetime": 1.2,
    "maxParticles": 230,
    "pos": {
      "x": 0,
      "y": -300
    },
    "addAtBack": false,
    "spawnType": "rect",
    "spawnRect": {
      "x": -5,
      "y": 180,
      "w": 10,
      "h": 0
    }
  }, [texture]);
  Particles$6.simpleEmitter(position, config2, resolver);
}
const {
  cardUtils: cardUtils$x,
  commonTypes: commonTypes$S,
  PlanningView: PlanningView$l,
  cards: cards$K
} = globalThis.SpellmasonsAPI;
const { drawUICircle: drawUICircle$1 } = PlanningView$l;
const Unit$J = globalThis.SpellmasonsAPI.Unit;
const { playDefaultSpellSFX: playDefaultSpellSFX$m } = cardUtils$x;
const { refundLastSpell: refundLastSpell$v } = cards$K;
const { CardCategory: CardCategory$Q, probabilityMap: probabilityMap$P, CardRarity: CardRarity$O } = commonTypes$S;
const cardId$d = "FlameStrike";
const damageMain = 40;
const damageSplash = 10;
const splashRadius = 64;
const spell$O = {
  card: {
    id: cardId$d,
    category: CardCategory$Q.Damage,
    supportQuantity: true,
    manaCost: 40,
    healthCost: 0,
    expenseScaling: 1.5,
    probability: probabilityMap$P[CardRarity$O.UNCOMMON],
    thumbnail: "spellmasons-mods/Wodes_Grimoire/graphics/icons/spelliconFlameStrike.png",
    sfx: "burst",
    description: [`Deals ${damageMain} damage to the target and ${damageSplash} damage to nearby targets in a small area.`],
    effect: async (state, card, quantity, underworld, prediction) => {
      await new Promise((resolve) => {
        const targets = state.targetedUnits.filter((u) => u.alive);
        const adjustedRadius = getAdjustedRadius(state.aggregator.radiusBoost);
        if (targets.length == 0) {
          refundLastSpell$v(state, prediction);
          resolve();
        }
        for (let unit2 of targets) {
          const explosionTargets = underworld.getUnitsWithinDistanceOfTarget(unit2, adjustedRadius, prediction);
          const quantityAdjustedDamageMain = damageMain * quantity;
          const quantityAdjustedDamageSplash = damageSplash * quantity;
          if (!prediction && !globalThis.headless) {
            playDefaultSpellSFX$m(card, prediction);
            setTimeout(() => {
              explosionTargets.forEach((t) => {
                const damage2 = t == unit2 ? quantityAdjustedDamageMain : quantityAdjustedDamageSplash;
                Unit$J.takeDamage({ unit: t, amount: damage2, sourceUnit: state.casterUnit }, underworld, prediction);
              });
              resolve();
            }, 400);
            makeFlameStrikeWithParticles(unit2, prediction);
          } else {
            if (prediction) {
              drawUICircle$1(globalThis.predictionGraphicsRed, unit2, adjustedRadius, 13981270);
            }
            explosionTargets.forEach((t) => {
              const damage2 = t == unit2 ? quantityAdjustedDamageMain : quantityAdjustedDamageSplash;
              Unit$J.takeDamage({ unit: t, amount: damage2, sourceUnit: state.casterUnit }, underworld, prediction);
            });
            resolve();
          }
        }
      });
      return state;
    }
  }
};
function getAdjustedRadius(radiusBoost2 = 0) {
  return splashRadius * (1 + 0.5 * radiusBoost2);
}
const {
  cardUtils: cardUtils$w,
  commonTypes: commonTypes$R,
  cards: cards$J,
  cardsUtil: cardsUtil$h,
  JImage: JImage$9,
  JAudio: JAudio$8,
  FloatingText: FloatingText$a
} = globalThis.SpellmasonsAPI;
const { refundLastSpell: refundLastSpell$u } = cards$J;
const Unit$I = globalThis.SpellmasonsAPI.Unit;
const { playDefaultSpellSFX: playDefaultSpellSFX$l } = cardUtils$w;
const { CardCategory: CardCategory$P, probabilityMap: probabilityMap$O, CardRarity: CardRarity$N } = commonTypes$R;
const cardId$c = "Grace";
var healingAmount$1 = -40;
const spell$N = {
  card: {
    id: cardId$c,
    category: CardCategory$P.Blessings,
    supportQuantity: true,
    manaCost: 20,
    healthCost: 0,
    expenseScaling: 1,
    probability: probabilityMap$O[CardRarity$N.RARE],
    thumbnail: "spellmasons-mods/Wodes_Grimoire/graphics/icons/spelliconGrace.png",
    sfx: "purify",
    //TODO
    description: [`Heals the target for ${-healingAmount$1} after 3 turns. Stacks increase the amount, but do not change duration`],
    effect: async (state, card, quantity, underworld, prediction) => {
      const targets = state.targetedUnits.filter((u) => u.alive);
      if (targets.length == 0) {
        refundLastSpell$u(state, prediction, "No target, mana refunded");
      } else {
        if (!prediction) {
          playDefaultSpellSFX$l(card, prediction);
        }
        for (let unit2 of targets) {
          Unit$I.addModifier(unit2, card.id, underworld, prediction, 0, { amount: quantity });
        }
      }
      return state;
    }
  },
  modifiers: {
    add: add$9
  },
  events: {
    onTurnStart: async (unit2, underworld, prediction) => {
      const modifier = unit2.modifiers[cardId$c];
      if (modifier) {
        modifier.graceCountdown--;
        updateTooltip$2(unit2);
        if (modifier.graceCountdown <= 0) {
          let healing = calculateGraceHealing(modifier.graceQuantity);
          Unit$I.takeDamage({ unit: unit2, amount: healing }, underworld, prediction);
          if (!prediction) {
            FloatingText$a.default({
              coords: unit2,
              text: `Grace +${-healing} health`,
              style: { fill: "#40a058", strokeThickness: 1 }
            });
            JImage$9.addOneOffAnimation(unit2, "potionPickup", {}, { animationSpeed: 0.3, loop: false });
            JAudio$8.playSFXKey("potionPickupHealth");
          }
          Unit$I.removeModifier(unit2, cardId$c, underworld);
        }
      }
    }
  }
};
function add$9(unit2, underworld, prediction, quantity, extra) {
  const modifier = cardsUtil$h.getOrInitModifier(unit2, cardId$c, {
    isCurse: false,
    quantity,
    persistBetweenLevels: false
  }, () => {
    SpellmasonsAPI.Unit.addEvent(unit2, cardId$c);
  });
  if (!modifier.graceCountdown) {
    modifier.graceCountdown = 3;
  }
  modifier.graceQuantity = (modifier.graceQuantity || 0) + extra.amount;
  if (!prediction) {
    updateTooltip$2(unit2);
  }
}
function updateTooltip$2(unit2) {
  const modifier = unit2.modifiers && unit2.modifiers[cardId$c];
  if (modifier) {
    modifier.tooltip = `${modifier.graceCountdown} turns until healed for ${-calculateGraceHealing(modifier.graceQuantity)}`;
  }
}
function calculateGraceHealing(graceQuantity) {
  return graceQuantity * healingAmount$1;
}
const {
  cardUtils: cardUtils$v,
  commonTypes: commonTypes$Q,
  cards: cards$I,
  Particles: Particles$5,
  FloatingText: FloatingText$9,
  EffectsHeal: EffectsHeal$2
} = globalThis.SpellmasonsAPI;
const { refundLastSpell: refundLastSpell$t } = cards$I;
const Unit$H = globalThis.SpellmasonsAPI.Unit;
const { playDefaultSpellSFX: playDefaultSpellSFX$k } = cardUtils$v;
const { CardCategory: CardCategory$O, probabilityMap: probabilityMap$N, CardRarity: CardRarity$M, UnitType: UnitType$k } = commonTypes$Q;
const cardId$b = "Harvest";
const manaRegain = 20;
const spell$M = {
  card: {
    id: cardId$b,
    category: CardCategory$O.Mana,
    supportQuantity: false,
    manaCost: 0,
    healthCost: 35,
    expenseScaling: 1,
    probability: probabilityMap$N[CardRarity$M.UNCOMMON],
    thumbnail: "spellmasons-mods/Wodes_Grimoire/graphics/icons/spelliconHarvest.png",
    sfx: "sacrifice",
    description: [`Consumes target corpse for ${manaRegain} mana. Does not work on player corpses. Unstackable.

Tastes like chicken.`],
    effect: async (state, card, quantity, underworld, prediction) => {
      let promises = [];
      let totalManaHarvested = 0;
      const targets = state.targetedUnits.filter((u) => !u.alive && u.unitType != UnitType$k.PLAYER_CONTROLLED && u.flaggedForRemoval != true);
      for (let unit2 of targets) {
        totalManaHarvested += manaRegain * quantity;
        const manaTrailPromises = [];
        if (!prediction) {
          manaTrailPromises.push(Particles$5.makeManaTrail(unit2, state.casterUnit, underworld, "#e4ffee", "#40ff66", targets.length * quantity));
        }
        promises.push(prediction ? Promise.resolve() : Promise.all(manaTrailPromises));
      }
      await Promise.all(promises).then(() => {
        if (!prediction && !globalThis.headless) {
          playDefaultSpellSFX$k(card, prediction);
        }
        for (let unit2 of targets) {
          Unit$H.cleanup(unit2);
        }
        EffectsHeal$2.healManaUnit(state.casterUnit, totalManaHarvested, void 0, underworld, prediction);
      });
      if (targets.length == 0 && !totalManaHarvested) {
        refundLastSpell$t(state, prediction, "No corpses, health refunded");
      }
      if (!prediction && !!totalManaHarvested) {
        FloatingText$9.default({
          coords: state.casterUnit,
          text: `${totalManaHarvested} Mana Harvested`,
          style: { fill: "blue", strokeThickness: 1 }
        });
      }
      return state;
    }
  }
};
const {
  cardUtils: cardUtils$u,
  commonTypes: commonTypes$P,
  cards: cards$H,
  cardsUtil: cardsUtil$g,
  FloatingText: FloatingText$8
} = globalThis.SpellmasonsAPI;
const { refundLastSpell: refundLastSpell$s } = cards$H;
const Unit$G = globalThis.SpellmasonsAPI.Unit;
const { playDefaultSpellSFX: playDefaultSpellSFX$j } = cardUtils$u;
const { CardCategory: CardCategory$N, probabilityMap: probabilityMap$M, CardRarity: CardRarity$L } = commonTypes$P;
const cardId$a = "Regenerate";
const spell$L = {
  card: {
    id: cardId$a,
    category: CardCategory$N.Blessings,
    supportQuantity: true,
    manaCost: 20,
    healthCost: 0,
    expenseScaling: 2,
    probability: probabilityMap$M[CardRarity$L.SPECIAL],
    thumbnail: "spellmasons-mods/Wodes_Grimoire/graphics/icons/spelliconRegen.png",
    sfx: "heal",
    //TODO
    description: [`Heals the target for 10 health at the end of their turn for 5 turns. Stacks increase the amount and refresh the duration.`],
    effect: async (state, card, quantity, underworld, prediction) => {
      const targets = state.targetedUnits.filter((u) => u.alive);
      if (targets.length == 0) {
        refundLastSpell$s(state, prediction, "No target, mana refunded");
      } else {
        if (!prediction) {
          playDefaultSpellSFX$j(card, prediction);
        }
        for (let unit2 of targets) {
          Unit$G.addModifier(unit2, card.id, underworld, prediction, 5, { amount: quantity });
        }
      }
      return state;
    }
  },
  modifiers: {
    add: add$8,
    remove: remove$3
  },
  events: {
    onTurnEnd: async (unit2, underworld, prediction) => {
      const modifier = unit2.modifiers[cardId$a];
      if (modifier) {
        const healing = healingAmount(modifier.regenCounter);
        Unit$G.takeDamage({ unit: unit2, amount: healing }, underworld, prediction);
        modifier.quantity--;
        if (!prediction) {
          updateTooltip$1(unit2);
          FloatingText$8.default({
            coords: unit2,
            text: `Regenerate +${-healing} health`,
            style: { fill: "#40a058", strokeThickness: 1 }
          });
        }
        if (modifier.quantity <= 0) {
          Unit$G.removeModifier(unit2, cardId$a, underworld);
        }
      }
    }
  }
};
function remove$3(unit2, underworld) {
  const modifier = unit2.modifiers[cardId$a];
  if (modifier) {
    modifier.regenCounter = 0;
  }
}
function add$8(unit2, underworld, prediction, quantity, extra) {
  const modifier = cardsUtil$g.getOrInitModifier(unit2, cardId$a, {
    isCurse: false,
    quantity,
    persistBetweenLevels: false
  }, () => {
    SpellmasonsAPI.Unit.addEvent(unit2, cardId$a);
  });
  if (modifier.quantity > 5) {
    modifier.quantity = 5;
  }
  if (!prediction) {
    modifier.regenCounter = (modifier.regenCounter || 0) + extra.amount;
    updateTooltip$1(unit2);
  }
}
function healingAmount(castquantity) {
  let healing = -10;
  if (castquantity > 0) {
    healing = castquantity * -10;
  }
  return healing;
}
function updateTooltip$1(unit2) {
  const modifier = unit2.modifiers && unit2.modifiers[cardId$a];
  if (modifier) {
    modifier.tooltip = `Healing ${-healingAmount(modifier.regenCounter)} every ${modifier.quantity} turns`;
  }
}
const {
  cardUtils: cardUtils$t,
  commonTypes: commonTypes$O,
  cards: cards$G,
  cardsUtil: cardsUtil$f
} = globalThis.SpellmasonsAPI;
const { refundLastSpell: refundLastSpell$r } = cards$G;
const Unit$F = globalThis.SpellmasonsAPI.Unit;
const { playDefaultSpellSFX: playDefaultSpellSFX$i } = cardUtils$t;
const { CardCategory: CardCategory$M, probabilityMap: probabilityMap$L, CardRarity: CardRarity$K } = commonTypes$O;
const cardId$9 = "Pacify";
const spell$K = {
  card: {
    id: cardId$9,
    category: CardCategory$M.Curses,
    supportQuantity: true,
    manaCost: 30,
    healthCost: 0,
    expenseScaling: 2,
    probability: probabilityMap$L[CardRarity$K.SPECIAL],
    thumbnail: "spellmasons-mods/Wodes_Grimoire/graphics/icons/spelliconPacify.png",
    sfx: "",
    description: [`Prevents the target from attacking for one turn. Stacks increase duration. Does not affect Support Class units such as summoners or priests.`],
    effect: async (state, card, quantity, underworld, prediction) => {
      const targets = state.targetedUnits.filter((u) => u.alive && !(u.unitSubType == 3));
      if (targets.length == 0) {
        refundLastSpell$r(state, prediction, "No target, mana refunded");
      } else {
        if (!prediction) {
          playDefaultSpellSFX$i(card, prediction);
        }
        for (let unit2 of targets) {
          Unit$F.addModifier(unit2, card.id, underworld, prediction, quantity);
        }
      }
      return state;
    }
  },
  modifiers: {
    add: add$7,
    remove: remove$2
  },
  events: {
    onTurnEnd: async (unit2, underworld, prediction) => {
      const modifier = unit2.modifiers[cardId$9];
      if (modifier) {
        modifier.quantity--;
        if (modifier.quantity <= 0) {
          Unit$F.removeModifier(unit2, cardId$9, underworld);
        }
      }
    }
  }
};
function add$7(unit2, underworld, prediction, quantity) {
  cardsUtil$f.getOrInitModifier(unit2, cardId$9, {
    isCurse: true,
    quantity,
    persistBetweenLevels: false,
    originalstat: unit2.attackRange
  }, () => {
    SpellmasonsAPI.Unit.addEvent(unit2, cardId$9);
    unit2.attackRange = 0;
  });
}
function remove$2(unit2, underworld) {
  if (unit2.modifiers && unit2.modifiers[cardId$9]) {
    const originalRange = unit2.modifiers[cardId$9].originalstat;
    if (originalRange && unit2.attackRange == 0) {
      unit2.attackRange = originalRange;
    }
  }
}
const {
  cardUtils: cardUtils$s,
  commonTypes: commonTypes$N,
  cards: cards$F,
  Particles: Particles$4
} = globalThis.SpellmasonsAPI;
const { refundLastSpell: refundLastSpell$q } = cards$F;
const Unit$E = globalThis.SpellmasonsAPI.Unit;
const { playDefaultSpellSFX: playDefaultSpellSFX$h } = cardUtils$s;
const { CardCategory: CardCategory$L, probabilityMap: probabilityMap$K, CardRarity: CardRarity$J } = commonTypes$N;
const cardId$8 = "Vengeance";
const spell$J = {
  card: {
    id: cardId$8,
    category: CardCategory$L.Damage,
    supportQuantity: true,
    manaCost: 15,
    healthCost: 0,
    expenseScaling: 1.5,
    probability: probabilityMap$K[CardRarity$J.UNCOMMON],
    thumbnail: "spellmasons-mods/Wodes_Grimoire/graphics/icons/spelliconVengeance.png",
    sfx: "hurt",
    description: [`Deals damage equal to your missing health. This harms you first if you are targeted, then enemies.`],
    effect: async (state, card, quantity, underworld, prediction) => {
      let promises = [];
      const targets = state.targetedUnits.filter((u) => u.alive);
      let [potentialCaster] = targets.filter((u) => u == state.casterUnit);
      if (!!potentialCaster && targets[0] != state.casterUnit) {
        targets.splice(targets.indexOf(state.casterUnit), 1);
        targets.unshift(state.casterUnit);
      }
      if (targets.length == 0 || state.casterUnit.health == state.casterUnit.healthMax) {
        refundLastSpell$q(state, prediction, "No targets damaged, mana refunded");
        return state;
      }
      for (let unit2 of targets) {
        const manaTrailPromises = [];
        if (!prediction) {
          for (let i = 0; i < quantity; i++) {
            manaTrailPromises.push(Particles$4.makeManaTrail(state.casterUnit, unit2, underworld, "#ef4242", "#400d0d", targets.length * quantity));
          }
        }
        promises.push(prediction ? Promise.resolve() : Promise.all(manaTrailPromises));
      }
      await Promise.all(promises).then(() => {
        if (!prediction && !globalThis.headless) {
          playDefaultSpellSFX$h(card, prediction);
        }
        for (let q = 0; q < quantity; q++) {
          for (let unit2 of targets) {
            Unit$E.takeDamage({ unit: unit2, amount: damageDone$1(state), sourceUnit: state.casterUnit, fromVec2: state.casterUnit }, underworld, prediction);
          }
        }
      });
      return state;
    }
  }
};
function damageDone$1(state) {
  let damageMain2 = state.casterUnit.healthMax - state.casterUnit.health;
  damageMain2 = Math.max(0, damageMain2);
  return damageMain2;
}
const mod$9 = {
  modName: "Wode's Grimoire",
  author: "Blood Spartan",
  description: "Adds 10 new spells to your arsenal.",
  //TODO make word good
  screenshot: "spellmasons-mods/Wodes_Grimoire/graphics/icons/Wodes_grimoire_icon.png",
  spells: [
    //Add or Remove spells here.
    spell$S,
    spell$R,
    spell$Q,
    spell$P,
    //Very buggy, absolutly no idea how I got this working, but it does /shrug
    spell$O,
    spell$N,
    spell$M,
    spell$L,
    spell$K,
    //Stasis, //Not working as intended, can still be pushed
    spell$J
  ],
  // This spritesheet allows spell icons to be used in player thought bubbles in multiplayer
  spritesheet: "spellmasons-mods/Wodes_Grimoire/graphics/wodes_grimoire_spritesheet.json"
};
const {
  PixiUtils: PixiUtils$h,
  cardUtils: cardUtils$r,
  commonTypes: commonTypes$M,
  cards: cards$E
} = globalThis.SpellmasonsAPI;
const { refundLastSpell: refundLastSpell$p } = cards$E;
const { containerSpells: containerSpells$4 } = PixiUtils$h;
const Unit$D = globalThis.SpellmasonsAPI.Unit;
const { oneOffImage: oneOffImage$3 } = cardUtils$r;
const { CardCategory: CardCategory$K, probabilityMap: probabilityMap$J, CardRarity: CardRarity$I } = commonTypes$M;
const animationPath$4 = "VampBite";
const cardId$7 = "Vampire Bite";
const spell$I = {
  card: {
    id: cardId$7,
    category: CardCategory$K.Damage,
    supportQuantity: true,
    manaCost: 15,
    healthCost: 0,
    expenseScaling: 1.5,
    probability: probabilityMap$J[CardRarity$I.UNCOMMON],
    thumbnail: "spellmasons-mods/Renes_gimmicks/graphics/icons/VampireBite.png",
    animationPath: animationPath$4,
    sfx: "hurt",
    description: [`Deals 10 to the target and heals you for up to 50% damage done. Healing is not affected by modifiers, including blood curse`],
    effect: async (state, _card, quantity, underworld, prediction) => {
      const targets = state.targetedUnits.filter((u) => u.alive);
      if (targets.length == 0) {
        refundLastSpell$p(state, prediction, "No targets damaged, mana refunded");
        return state;
      }
      for (let unit2 of targets) {
        if (state.casterUnit.health < state.casterUnit.healthMax) {
          if (unit2.health < 10 * quantity) {
            state.casterUnit.health += unit2.health / 2;
          } else {
            state.casterUnit.health += 5 * quantity;
          }
          if (state.casterUnit.health > state.casterUnit.healthMax) {
            state.casterUnit.health = state.casterUnit.healthMax;
          }
        }
        if (!prediction) {
          oneOffImage$3(unit2, animationPath$4, containerSpells$4);
        }
        Unit$D.takeDamage({ unit: unit2, amount: 10 * quantity, sourceUnit: state.casterUnit, fromVec2: state.casterUnit }, underworld, prediction);
      }
      state.casterUnit.health -= state.casterUnit.health % 1;
      if (!prediction && !globalThis.headless) {
        await new Promise((resolve) => {
          setTimeout(resolve, 400);
        });
      }
      return state;
    }
  }
};
const {
  cardUtils: cardUtils$q,
  commonTypes: commonTypes$L,
  cards: cards$D,
  VisualEffects: VisualEffects$g,
  config: config$p,
  math: math$g,
  Pickup: Pickup$4
} = globalThis.SpellmasonsAPI;
const { refundLastSpell: refundLastSpell$o } = cards$D;
const { playDefaultSpellSFX: playDefaultSpellSFX$g } = cardUtils$q;
const { CardCategory: CardCategory$J, probabilityMap: probabilityMap$I, CardRarity: CardRarity$H } = commonTypes$L;
const cardId$6 = "Summon Trap";
const spell$H = {
  card: {
    id: cardId$6,
    category: CardCategory$J.Damage,
    supportQuantity: true,
    manaCost: 10,
    healthCost: 0,
    expenseScaling: 1,
    probability: probabilityMap$I[CardRarity$H.UNCOMMON],
    thumbnail: "spellmasons-mods/Renes_gimmicks/graphics/icons/SummonTrap.png",
    sfx: "hurt",
    description: [`Summons a trap that does 30 damage when stepped on`],
    allowNonUnitTarget: true,
    effect: async (state, card, quantity, underworld, prediction) => {
      const summonLocation = {
        x: state.castLocation.x,
        y: state.castLocation.y
      };
      for (let unit2 of underworld.units) {
        if (unit2.alive && math$g.distance(unit2, summonLocation) < config$p.COLLISION_MESH_RADIUS) {
          refundLastSpell$o(state, prediction, "Invalid summon location, mana refunded.");
          return state;
        }
      }
      if (underworld.isCoordOnWallTile(summonLocation)) {
        if (prediction)
          ;
        else {
          refundLastSpell$o(state, prediction, "Invalid summon location, mana refunded.");
        }
        return state;
      }
      playDefaultSpellSFX$g(card, prediction);
      const index = 0;
      if (!prediction) {
        VisualEffects$g.skyBeam(summonLocation);
        const pickup = underworld.spawnPickup(index, summonLocation, prediction);
        if (pickup) {
          Pickup$4.setPower(pickup, quantity);
        }
      } else {
        const pickup = underworld.spawnPickup(index, summonLocation, prediction);
        if (pickup) {
          Pickup$4.setPower(pickup, quantity);
        }
      }
      return state;
    }
  }
};
const {
  commonTypes: commonTypes$K,
  cards: cards$C
} = globalThis.SpellmasonsAPI;
const { refundLastSpell: refundLastSpell$n } = cards$C;
const Unit$C = globalThis.SpellmasonsAPI.Unit;
const { CardCategory: CardCategory$I, probabilityMap: probabilityMap$H, CardRarity: CardRarity$G } = commonTypes$K;
const retaliate = 0.15;
const cardId$5 = "Sadism";
const spell$G = {
  card: {
    id: cardId$5,
    category: CardCategory$I.Damage,
    supportQuantity: true,
    manaCost: 40,
    healthCost: 0,
    expenseScaling: 1.5,
    probability: probabilityMap$H[CardRarity$G.UNCOMMON],
    thumbnail: "spellmasons-mods/Renes_gimmicks/graphics/icons/Sadism.png",
    sfx: "hurt",
    description: [`Damage to target equal to its attack, you receive ${retaliate * 100}% of that attack damage`],
    effect: async (state, _card, quantity, underworld, prediction) => {
      const targets = state.targetedUnits.filter((u) => u.alive);
      if (targets.length == 0) {
        refundLastSpell$n(state, prediction, "No targets damaged, mana refunded");
        return state;
      }
      for (let unit2 of targets) {
        let damage2 = unit2.damage * quantity;
        Unit$C.takeDamage({ unit: unit2, amount: damage2, fromVec2: state.casterUnit, sourceUnit: state.casterUnit }, underworld, prediction);
        Unit$C.takeDamage({ unit: state.casterUnit, amount: damage2 * retaliate }, underworld, prediction);
      }
      state.casterUnit.health -= state.casterUnit.health % 1;
      return state;
    }
  }
};
const {
  particleEmitter: particleEmitter$1,
  Particles: Particles$3,
  PixiUtils: PixiUtils$g,
  cardUtils: cardUtils$p,
  commonTypes: commonTypes$J,
  cards: cards$B,
  cardsUtil: cardsUtil$e,
  FloatingText: FloatingText$7,
  ParticleCollection: ParticleCollection$3
} = globalThis.SpellmasonsAPI;
const BURNING_RAGE_PARTICLE_EMITTER_NAME = "BURNING_RAGE";
function makeBurningRageParticles(follow, underworld, prediction) {
  if (prediction || globalThis.headless) {
    return;
  }
  const texture = Particles$3.createParticleTexture();
  if (!texture) {
    Particles$3.logNoTextureWarning("makeBurningRageParticles");
    return;
  }
  const particleConfig = particleEmitter$1.upgradeConfig({
    autoUpdate: true,
    "alpha": {
      "start": 1,
      "end": 0
    },
    "scale": {
      "start": 1,
      "end": 0.25,
      "minimumScaleMultiplier": 1
    },
    "color": {
      "start": "#9e1818",
      "end": "#ffee00"
    },
    "speed": {
      "start": 20,
      "end": 60,
      "minimumSpeedMultiplier": 1
    },
    "acceleration": {
      "x": 0,
      "y": -50
    },
    "maxSpeed": 0,
    "startRotation": {
      "min": 265,
      "max": 275
    },
    "noRotation": false,
    "rotationSpeed": {
      "min": 0,
      "max": 0
    },
    "lifetime": {
      "min": 1,
      "max": 1.5
    },
    "blendMode": "normal",
    "frequency": 0.45,
    "emitterLifetime": -1,
    "maxParticles": 20,
    "pos": {
      "x": 0,
      "y": 0
    },
    "addAtBack": false,
    "spawnType": "circle",
    "spawnCircle": {
      "x": 0,
      "y": 0,
      "r": 25
    }
  }, [texture]);
  if (PixiUtils$g.containerUnits) {
    const wrapped = Particles$3.wrappedEmitter(particleConfig, PixiUtils$g.containerUnits);
    if (wrapped) {
      const { container, emitter } = wrapped;
      emitter.name = BURNING_RAGE_PARTICLE_EMITTER_NAME;
      underworld.particleFollowers.push({
        displayObject: container,
        emitter,
        target: follow
      });
    } else {
      console.error("Failed to create BurnigRage particle emitter");
    }
  } else {
    return;
  }
}
const { refundLastSpell: refundLastSpell$m } = cards$B;
const Unit$B = globalThis.SpellmasonsAPI.Unit;
const { playDefaultSpellSFX: playDefaultSpellSFX$f } = cardUtils$p;
const { CardCategory: CardCategory$H, probabilityMap: probabilityMap$G, CardRarity: CardRarity$F } = commonTypes$J;
const damageMultiplier$1 = 8;
const attackMultiplier = 5;
const cardId$4 = "Burning Rage";
const spell$F = {
  card: {
    id: cardId$4,
    category: CardCategory$H.Curses,
    supportQuantity: true,
    manaCost: 35,
    healthCost: 0,
    expenseScaling: 2,
    probability: probabilityMap$G[CardRarity$F.RARE],
    thumbnail: "spellmasons-mods/Renes_gimmicks/graphics/icons/Burninig_rage.png",
    sfx: "poison",
    description: [`Each stack causes target to take ${damageMultiplier$1} damage, but also increases the target's damage by ${attackMultiplier}. Staks increase each turn`],
    effect: async (state, card, quantity, underworld, prediction) => {
      const targets = state.targetedUnits.filter((u) => u.alive);
      if (targets.length == 0) {
        refundLastSpell$m(state, prediction, "No target, mana refunded");
      } else {
        if (!prediction) {
          playDefaultSpellSFX$f(card, prediction);
        }
        for (let unit2 of targets) {
          Unit$B.addModifier(unit2, card.id, underworld, prediction, quantity);
          unit2.damage += quantity * attackMultiplier;
        }
      }
      if (!prediction && !globalThis.headless) {
        await new Promise((resolve) => {
          setTimeout(resolve, 100);
        });
      }
      return state;
    }
  },
  modifiers: {
    add: add$6,
    remove: remove$1
  },
  events: {
    onTurnStart: async (unit2, underworld, prediction) => {
      const modifier = unit2.modifiers[cardId$4];
      if (modifier && !prediction) {
        Unit$B.takeDamage({ unit: unit2, amount: modifier.quantity * damageMultiplier$1 }, underworld, prediction);
        FloatingText$7.default({
          coords: unit2,
          text: `${modifier.quantity * damageMultiplier$1} rage damage`,
          style: { fill: "red", strokeThickness: 1 }
        });
        unit2.damage += attackMultiplier;
        modifier.quantity++;
      }
    }
  }
};
function add$6(unit2, underworld, prediction, quantity) {
  cardsUtil$e.getOrInitModifier(unit2, cardId$4, {
    isCurse: true,
    quantity,
    persistBetweenLevels: false
  }, () => {
    SpellmasonsAPI.Unit.addEvent(unit2, cardId$4);
    makeBurningRageParticles(unit2, underworld, prediction);
  });
}
function remove$1(unit2, underworld) {
  var _a;
  unit2.damage -= unit2.modifiers[cardId$4].quantity * attackMultiplier;
  unit2.damage = Math.max(unit2.damage, 0);
  for (let follower of underworld.particleFollowers) {
    if (((_a = follower == null ? void 0 : follower.emitter) == null ? void 0 : _a.name) === BURNING_RAGE_PARTICLE_EMITTER_NAME && follower.target == unit2) {
      ParticleCollection$3.stopAndDestroyForeverEmitter(follower.emitter);
      break;
    }
  }
}
const {
  commonTypes: commonTypes$I,
  cards: cards$A,
  cardsUtil: cardsUtil$d,
  FloatingText: FloatingText$6
} = globalThis.SpellmasonsAPI;
const { refundLastSpell: refundLastSpell$l } = cards$A;
const Unit$A = globalThis.SpellmasonsAPI.Unit;
const { CardCategory: CardCategory$G, probabilityMap: probabilityMap$F, CardRarity: CardRarity$E } = commonTypes$I;
const maxDuration = 3;
const distanceToDamageRatio = 0.05;
const cardId$3 = "Caltrops";
const spell$E = {
  card: {
    id: cardId$3,
    category: CardCategory$G.Curses,
    supportQuantity: true,
    manaCost: 30,
    healthCost: 0,
    expenseScaling: 1.5,
    probability: probabilityMap$F[CardRarity$E.UNCOMMON],
    thumbnail: "spellmasons-mods/Renes_gimmicks/graphics/icons/" + cardId$3 + ".png",
    sfx: "hurt",
    description: [`Target takes some damage it moves. Stacks, casting again replenishes duration up to ${maxDuration} turns. (Updates on turn change, recasts or damage)`],
    effect: async (state, _card, quantity, underworld, prediction) => {
      const targets = state.targetedUnits.filter((u) => u.alive);
      if (targets.length == 0) {
        refundLastSpell$l(state, prediction, "No targets damaged, mana refunded");
        return state;
      }
      for (let unit2 of targets) {
        Unit$A.addModifier(unit2, cardId$3, underworld, prediction, maxDuration, { amount: quantity });
        if (!prediction) {
          triggerDistanceDamage(unit2, underworld, prediction);
        }
      }
      return state;
    }
  },
  modifiers: {
    add: add$5
  },
  events: {
    //onMove: (unit, newLocation) => {triggerDistanceDamage(unit);return newLocation},
    onTakeDamage: (unit2, amount2, underworld, prediction) => {
      triggerDistanceDamage(unit2, underworld, prediction);
      return amount2;
    },
    onTurnStart: async (unit2, underworld, prediction) => {
      triggerDistanceDamage(unit2, underworld, prediction);
    },
    onTurnEnd: async (unit2, underworld, prediction) => {
      triggerDistanceDamage(unit2, underworld, prediction);
    }
  }
};
function add$5(unit2, _underworld, prediction, quantity, extra) {
  let firstStack = !unit2.events.includes(cardId$3);
  const modifier = cardsUtil$d.getOrInitModifier(unit2, cardId$3, {
    isCurse: true,
    quantity,
    persistBetweenLevels: false
  }, () => {
    if (firstStack) {
      SpellmasonsAPI.Unit.addEvent(unit2, cardId$3);
    }
  });
  if (firstStack) {
    modifier.last_x = unit2.x;
    modifier.last_y = unit2.y;
  }
  if (modifier.quantity > maxDuration) {
    modifier.quantity = maxDuration;
  }
  if (!prediction) {
    modifier.caltropsCounter = (modifier.caltropsCounter || 0) + extra.amount;
    updateTooltip(unit2);
  }
}
function caltropsAmount(castquantity) {
  let caltrops = 1;
  if (castquantity > 0) {
    caltrops = castquantity * 1;
  }
  return caltrops;
}
function updateTooltip(unit2) {
  const modifier = unit2.modifiers && unit2.modifiers[cardId$3];
  if (modifier) {
    modifier.tooltip = `When target moves deal ${caltropsAmount(modifier.caltropsCounter)} damage, lasts ${modifier.quantity} turns`;
  }
}
function triggerDistanceDamage(unit2, underworld, prediction = false) {
  if (!unit2.alive) {
    return;
  }
  const modifier = unit2.modifiers && unit2.modifiers[cardId$3];
  let x_diff = unit2.x - modifier.last_x;
  let y_diff = unit2.y - modifier.last_y;
  if (x_diff == 0 && y_diff == 0) {
    return;
  }
  let damage2 = Math.sqrt(x_diff * x_diff + y_diff * y_diff);
  damage2 = damage2 * distanceToDamageRatio * modifier.caltropsCounter;
  damage2 -= damage2 % 1;
  if (!modifier || damage2 < 1) {
    return;
  }
  modifier.last_x = unit2.x;
  modifier.last_y = unit2.y;
  Unit$A.takeDamage({ unit: unit2, amount: damage2 }, underworld, prediction);
  if (!prediction) {
    FloatingText$6.default({
      coords: unit2,
      text: `${damage2} caltrops damage`,
      style: { fill: "#grey", strokeThickness: 1 }
    });
  }
}
const mod$8 = {
  modName: "Renes gimmicks",
  author: "Renesans123/Edeusz",
  description: "Adds some new spells to the game",
  screenshot: "spellmasons-mods/Renes_gimmicks/graphics/icons/Renes_Gimmicks_icon.png",
  spells: [
    //Add or Remove spells here.
    spell$I,
    spell$H,
    spell$G,
    spell$F,
    spell$E
    //OnMove doesnt seem to be implemented
    //Thorns,//composeOnDamageEvents do not pass argument damageDealer right now
  ],
  spritesheet: "spellmasons-mods/Renes_gimmicks/graphics/icons/renes_spritesheet.json"
};
const {
  PixiUtils: PixiUtils$f,
  commonTypes: commonTypes$H,
  cards: cards$z,
  cardUtils: cardUtils$o,
  Unit: Unit$z,
  JPromise: JPromise$6
} = globalThis.SpellmasonsAPI;
const { oneOffImage: oneOffImage$2, playDefaultSpellSFX: playDefaultSpellSFX$e, playSpellSFX } = cardUtils$o;
const { refundLastSpell: refundLastSpell$k } = cards$z;
const { CardCategory: CardCategory$F, probabilityMap: probabilityMap$E, CardRarity: CardRarity$D } = commonTypes$H;
const { containerSpells: containerSpells$3 } = PixiUtils$f;
const animationPath$3 = "spellGravity";
const cardId$2 = "Gravity";
const percentDamage = 0.1;
const spell$D = {
  card: {
    id: cardId$2,
    category: CardCategory$F.Damage,
    supportQuantity: true,
    manaCost: 30,
    healthCost: 0,
    expenseScaling: 2,
    probability: probabilityMap$E[CardRarity$D.RARE],
    animationPath: animationPath$3,
    thumbnail: "spellmasons-mods/DaiNekoIchis_TomeOfSpells/graphics/Gravity.png",
    sfx: "pull",
    description: [`Deals damage to target(s) equal to ${percentDamage * 100}% of its current health.`],
    effect: async (state, card, quantity, underworld, prediction) => {
      const targets = state.targetedUnits.filter((u) => u.alive);
      if (!prediction && !globalThis.headless) {
        playSpellSFX("push", prediction);
        let promises = [];
        for (let unit2 of targets) {
          promises.push(new Promise((res) => {
            oneOffImage$2(unit2, animationPath$3, containerSpells$3, res);
            setTimeout(() => {
              playDefaultSpellSFX$e(card, prediction);
            }, 1e3);
          }));
        }
        await JPromise$6.raceTimeout(2e3, "Gravity attack animation", Promise.all(promises));
      }
      for (let unit2 of targets) {
        let damage2 = unit2.health * percentDamage * quantity;
        Unit$z.takeDamage({
          unit: unit2,
          amount: damage2,
          sourceUnit: state.casterUnit,
          fromVec2: state.casterUnit
        }, underworld, prediction);
      }
      if (targets.length == 0) {
        refundLastSpell$k(state, prediction, "No valid targets. Cost refunded.");
      }
      return state;
    }
  }
};
const {
  commonTypes: commonTypes$G,
  cards: cards$y,
  Unit: Unit$y,
  cardUtils: cardUtils$n,
  PixiUtils: PixiUtils$e
} = globalThis.SpellmasonsAPI;
const { oneOffImage: oneOffImage$1, playDefaultSpellSFX: playDefaultSpellSFX$d } = cardUtils$n;
const { refundLastSpell: refundLastSpell$j } = cards$y;
const { CardCategory: CardCategory$E, probabilityMap: probabilityMap$D, CardRarity: CardRarity$C } = commonTypes$G;
const { containerSpells: containerSpells$2 } = PixiUtils$e;
const cardId$1 = "Limit Blast";
const animationPath$2 = "Limit Glove";
const healthRequirement = 0.3;
const baseDamage = 5;
const damageMultiplier = 10;
const spell$C = {
  card: {
    id: cardId$1,
    category: CardCategory$E.Damage,
    supportQuantity: true,
    manaCost: 25,
    healthCost: 0,
    expenseScaling: 2,
    probability: probabilityMap$D[CardRarity$C.UNCOMMON],
    thumbnail: "spellmasons-mods/DaiNekoIchis_TomeOfSpells/graphics/LimitGlove.png",
    animationPath: animationPath$2,
    sfx: "debilitate",
    description: [`Deals ${baseDamage} damage to target(s). If caster's health is ${healthRequirement * 100}% or less, deals ${baseDamage * damageMultiplier} damage instead.`],
    effect: async (state, card, quantity, underworld, prediction) => {
      const targets = state.targetedUnits.filter((u) => u.alive);
      if (targets.length == 0) {
        refundLastSpell$j(state, prediction, "No valid targets. Cost refunded.");
        return state;
      }
      if (!prediction && !globalThis.headless) {
        for (let unit2 of targets) {
          oneOffImage$1(unit2, animationPath$2, containerSpells$2);
        }
        playDefaultSpellSFX$d(card, prediction);
        await new Promise((resolve) => setTimeout(resolve, 2e3));
      }
      for (let unit2 of targets) {
        let healthReqCalc = state.casterUnit.healthMax * healthRequirement;
        let damage2 = baseDamage;
        if (state.casterUnit.health <= healthReqCalc) {
          damage2 = damage2 * damageMultiplier;
        }
        Unit$y.takeDamage({
          unit: unit2,
          amount: damage2 * quantity,
          sourceUnit: state.casterUnit,
          fromVec2: state.casterUnit
        }, underworld, prediction);
      }
      if (!prediction && !globalThis.headless) {
        await new Promise((resolve) => setTimeout(resolve, 1e3));
      }
      return state;
    }
  }
};
const {
  Particles: Particles$2,
  ParticleCollection: ParticleCollection$2,
  particleEmitter,
  commonTypes: commonTypes$F,
  Unit: Unit$x,
  PlanningView: PlanningView$k,
  colors: colors$8,
  cardUtils: cardUtils$m
} = globalThis.SpellmasonsAPI;
const { CardCategory: CardCategory$D, probabilityMap: probabilityMap$C, CardRarity: CardRarity$B } = commonTypes$F;
const { drawUICirclePrediction: drawUICirclePrediction$6 } = PlanningView$k;
const { playDefaultSpellSFX: playDefaultSpellSFX$c } = cardUtils$m;
const { simpleEmitter } = Particles$2;
function makeWhiteWindParticles(position, radius, underworld, prediction) {
  if (prediction || globalThis.headless) {
    return;
  }
  const texture = Particles$2.createParticleTexture();
  if (!texture) {
    return;
  }
  const particleConfig = particleEmitter.upgradeConfig({
    "alpha": {
      "start": 1,
      "end": 0
    },
    "scale": {
      "start": 0.5,
      "end": 0.05,
      "minimumScaleMultiplier": 1
    },
    "color": {
      "start": "#ffffff",
      "end": "#ffffff"
    },
    "speed": {
      "start": radius * 1.5,
      "end": 0,
      "minimumSpeedMultiplier": 1
    },
    "acceleration": {
      "x": 0,
      "y": 0
    },
    "maxSpeed": 0,
    "startRotation": {
      "min": 90,
      "max": 180
    },
    "noRotation": true,
    "rotationSpeed": {
      "min": 0,
      "max": 0
    },
    "lifetime": {
      "min": 0.2,
      "max": 0.8
    },
    "blendMode": "add",
    "frequency": 1e-3,
    "emitterLifetime": waitTime / 2,
    "maxParticles": 500 * radius,
    "pos": {
      "x": 0,
      "y": 0
    },
    "addAtBack": false,
    "spawnType": "ring",
    "spawnCircle": {
      "x": 0,
      "y": 0,
      "r": radius,
      "minR": 0
    }
  }, [texture]);
  simpleEmitter(position, particleConfig);
}
const cardId = "Healing Breeze";
const baseRange = 100;
const waitTime = 2;
const spell$B = {
  card: {
    id: cardId,
    category: CardCategory$D.Blessings,
    supportQuantity: true,
    manaCost: 50,
    healthCost: 0,
    expenseScaling: 2,
    probability: probabilityMap$C[CardRarity$B.RARE],
    allowNonUnitTarget: true,
    thumbnail: "spellmasons-mods/DaiNekoIchis_TomeOfSpells/graphics/WhiteWind.png",
    sfx: "heal",
    description: [`Heals targets in an area around self equal to own health.`],
    effect: async (state, card, quantity, underworld, prediction) => {
      let adjustedRange = baseRange * (1 + (quantity - 1) * 0.5 + 0.25 * state.aggregator.radiusBoost);
      if (prediction) {
        drawUICirclePrediction$6(state.casterUnit, adjustedRange, colors$8.targetingSpellGreen, "Target Radius");
      } else {
        makeWhiteWindParticles(state.casterUnit, adjustedRange, underworld, prediction);
      }
      if (!prediction && !globalThis.headless) {
        await new Promise((resolve) => {
          setTimeout(resolve, waitTime * 1e3);
        });
      }
      let entities = underworld.getEntitiesWithinDistanceOfTarget(state.casterUnit, adjustedRange, prediction);
      for (let entity of entities) {
        if (Unit$x.isUnit(entity)) {
          let target = entity;
          Unit$x.takeDamage({ unit: target, amount: -state.casterUnit.health }, underworld, prediction);
        }
        playDefaultSpellSFX$c(card, prediction);
      }
      return state;
    }
  }
};
const {
  cards: cards$x,
  Pickup: Pickup$3,
  Unit: Unit$w,
  math: math$f,
  commonTypes: commonTypes$E
} = globalThis.SpellmasonsAPI;
const { addTarget: addTarget$d } = cards$x;
const { CardCategory: CardCategory$C, probabilityMap: probabilityMap$B } = commonTypes$E;
const UNITS_PER_STACK = 3;
function generateTargetHpMultipleOfSpell(multipleOf, manaCost, requiredId, rarity) {
  let reqId;
  if (requiredId) {
    if (requiredId == "Prime") {
      reqId = ["Target Health Prime"];
    } else {
      reqId = [`Target Health * ${requiredId}`];
    }
  } else {
    reqId = void 0;
  }
  return {
    card: {
      id: `Target Health * ${multipleOf}`,
      requires: reqId,
      category: CardCategory$C.Targeting,
      supportQuantity: true,
      manaCost,
      healthCost: 0,
      expenseScaling: 1,
      probability: probabilityMap$B[rarity],
      thumbnail: `spellmasons-mods/DaiNekoIchis_TomeOfSpells/graphics/TargetHp${multipleOf}.png`,
      requiresFollowingCard: true,
      description: [`Target ${UNITS_PER_STACK} living units (per stack) with health that is any multiple of ${multipleOf}, starting with the closest from the target point.`],
      allowNonUnitTarget: true,
      effect: async (state, card, quantity, underworld, prediction, outOfRange) => {
        const targets = underworld.getPotentialTargets(prediction).filter((u) => {
          if (Unit$w.isUnit(u)) {
            return u.alive && u.health % multipleOf == 0;
          } else {
            return false;
          }
        }).sort(math$f.sortCosestTo(state.castLocation)).slice(0, UNITS_PER_STACK * quantity);
        for (let target of targets) {
          addTarget$d(target, state, underworld, prediction);
        }
        return state;
      }
    }
  };
}
function isPrime(num) {
  if (num <= 1) {
    return false;
  }
  for (let n = 2; n < num; n++) {
    if (num % n == 0) {
      return false;
    }
  }
  return true;
}
const TargetHp3 = generateTargetHpMultipleOfSpell(3, 30, "Prime", commonTypes$E.CardRarity.UNCOMMON);
const TargetHp4 = generateTargetHpMultipleOfSpell(4, 35, 3, commonTypes$E.CardRarity.RARE);
const TargetHp5 = generateTargetHpMultipleOfSpell(5, 40, 4, commonTypes$E.CardRarity.FORBIDDEN);
const TargetHpPrime = {
  card: {
    id: `Target Health Prime`,
    category: CardCategory$C.Targeting,
    supportQuantity: true,
    manaCost: 25,
    healthCost: 0,
    expenseScaling: 4,
    probability: probabilityMap$B[commonTypes$E.CardRarity.COMMON],
    thumbnail: "spellmasons-mods/DaiNekoIchis_TomeOfSpells/graphics/TargetHpPrime.png",
    requiresFollowingCard: true,
    description: [`Target ${UNITS_PER_STACK} living units (per stack) with health that is any prime number, starting with the closest from the target point.`],
    allowNonUnitTarget: true,
    ignoreRange: true,
    effect: async (state, card, quantity, underworld, prediction, outOfRange) => {
      const targets = underworld.getPotentialTargets(prediction).filter((u) => {
        if (Unit$w.isUnit(u)) {
          return u.alive && isPrime(u.health);
        } else {
          return false;
        }
      }).sort(math$f.sortCosestTo(state.castLocation)).slice(0, UNITS_PER_STACK * quantity);
      for (let target of targets) {
        addTarget$d(target, state, underworld, prediction);
      }
      return state;
    }
  }
};
const mod$7 = {
  modName: "DaiNekoIchi's Tome of Spells",
  author: "DaiNekoIchi, PADS",
  description: "Adds several spells (probably heavily inspired from Final Fantasy)",
  screenshot: "spellmasons-mods/DaiNekoIchis_TomeOfSpells/graphics/TomeOfSpellsIcon.png",
  spells: [
    spell$D,
    spell$C,
    spell$B,
    TargetHpPrime,
    TargetHp3,
    TargetHp4,
    TargetHp5
  ],
  spritesheet: "spellmasons-mods/DaiNekoIchis_TomeOfSpells/graphics/spritesheet.json"
};
const urn_explosive_id$2 = "Explosive Urn";
const urn_poison_id$2 = "Toxic Urn";
const urn_ice_id$2 = "Ice Urn";
const {
  cardUtils: cardUtils$l,
  commonTypes: commonTypes$D,
  cards: cards$w,
  VisualEffects: VisualEffects$f,
  rand: rand$f,
  units: units$g,
  Pickup: Pickup$2,
  Unit: Unit$v,
  JAudio: JAudio$7
} = globalThis.SpellmasonsAPI;
const { chooseObjectWithProbability: chooseObjectWithProbability$1, getUniqueSeedString: getUniqueSeedString$5 } = rand$f;
const { allUnits: allUnits$6 } = units$g;
const { refundLastSpell: refundLastSpell$i, addUnitTarget: addUnitTarget$a } = cards$w;
const { playDefaultSpellSFX: playDefaultSpellSFX$b } = cardUtils$l;
const { CardCategory: CardCategory$B, probabilityMap: probabilityMap$A, CardRarity: CardRarity$A, Faction: Faction$f, UnitType: UnitType$j } = commonTypes$D;
const chaosWarpCardId = "Chaos Warp";
const spell$A = {
  card: {
    id: chaosWarpCardId,
    category: CardCategory$B.Soul,
    supportQuantity: false,
    manaCost: 40,
    healthCost: 0,
    expenseScaling: 1.5,
    probability: probabilityMap$A[CardRarity$A.UNCOMMON],
    thumbnail: "spellmasons-mods/Bogiacs_Spells/graphics/icons/ChaosWarp.png",
    sfx: "summonDecoy",
    description: [`Summons a random item. Potion, Trap, Urn, Portal`],
    allowNonUnitTarget: true,
    effect: async (state, card, _quantity, underworld, prediction) => {
      const summonLocation = {
        x: state.castLocation.x,
        y: state.castLocation.y
      };
      if (!underworld.isPointValidSpawn(summonLocation, prediction)) {
        refundLastSpell$i(state, prediction, "Invalid summon location, mana refunded.");
        return state;
      }
      const seed = rand$f.seedrandom(`${getUniqueSeedString$5(underworld, state.casterPlayer)}${state.castLocation.x}${state.castLocation.y}`);
      const randomEffect = rand$f.randInt(0, 10, seed);
      if (randomEffect <= 5) {
        const choicePotion = chooseObjectWithProbability$1(Pickup$2.pickups.map((p, indexPotion) => {
          return {
            indexPotion,
            probability: p.name.includes("Potion") ? p.probability : 0
          };
        }), seed);
        if (choicePotion) {
          const { indexPotion } = choicePotion;
          underworld.spawnPickup(indexPotion, summonLocation, prediction);
          if (!prediction) {
            JAudio$7.playSFXKey("spawnPotion");
            VisualEffects$f.skyBeam(summonLocation);
          }
        } else {
          refundLastSpell$i(state, prediction);
        }
      } else if (randomEffect <= 7) {
        playDefaultSpellSFX$b(card, prediction);
        const index = 0;
        underworld.spawnPickup(index, summonLocation, prediction);
        if (!prediction) {
          VisualEffects$f.skyBeam(summonLocation);
        }
        return state;
      } else if (randomEffect <= 9) {
        const urnID = rand$f.chooseOneOfSeeded([urn_explosive_id$2, urn_ice_id$2, urn_poison_id$2], seed);
        if (urnID !== void 0) {
          let sourceUnit = allUnits$6[urnID];
          if (sourceUnit) {
            const unit2 = Unit$v.create(
              urnID,
              summonLocation.x,
              summonLocation.y,
              Faction$f.ALLY,
              sourceUnit.info.image,
              UnitType$j.AI,
              sourceUnit.info.subtype,
              sourceUnit.unitProps,
              underworld,
              prediction
            );
            unit2.healthMax *= 1;
            unit2.health *= 1;
            unit2.damage *= 1;
            addUnitTarget$a(unit2, state, prediction);
            if (!prediction) {
              VisualEffects$f.skyBeam(summonLocation);
            }
          } else {
            refundLastSpell$i(state, prediction);
          }
        } else {
          refundLastSpell$i(state, prediction);
        }
      } else if (randomEffect > 9) {
        const portalPickupSource = Pickup$2.pickups.find((p) => p.name == Pickup$2.PORTAL_PURPLE_NAME);
        if (portalPickupSource) {
          if (!prediction) {
            Pickup$2.create({ pos: summonLocation, pickupSource: portalPickupSource, logSource: "Chaos Warp Portal" }, underworld, prediction);
            VisualEffects$f.skyBeam(summonLocation);
          }
        } else {
          refundLastSpell$i(state, prediction);
        }
      }
      return state;
    }
  }
};
const {
  commonTypes: commonTypes$C,
  cards: cards$v,
  VisualEffects: VisualEffects$e,
  rand: rand$e,
  Pickup: Pickup$1,
  JAudio: JAudio$6
} = globalThis.SpellmasonsAPI;
const { chooseObjectWithProbability, getUniqueSeedString: getUniqueSeedString$4 } = rand$e;
const { refundLastSpell: refundLastSpell$h } = cards$v;
const { CardCategory: CardCategory$A, probabilityMap: probabilityMap$z, CardRarity: CardRarity$z } = commonTypes$C;
const chaosWarpPotionCardId = "Chaos Warp - Potion";
const spell$z = {
  card: {
    id: chaosWarpPotionCardId,
    category: CardCategory$A.Soul,
    supportQuantity: false,
    requires: [chaosWarpCardId],
    manaCost: 40,
    healthCost: 0,
    expenseScaling: 1.5,
    probability: probabilityMap$z[CardRarity$z.RARE],
    thumbnail: "spellmasons-mods/Bogiacs_Spells/graphics/icons/ChaosWarpPotion.png",
    sfx: "spawnPotion",
    description: [`Summons a random Potion`],
    allowNonUnitTarget: true,
    effect: async (state, card, _quantity, underworld, prediction) => {
      const summonLocation = {
        x: state.castLocation.x,
        y: state.castLocation.y
      };
      if (!underworld.isPointValidSpawn(summonLocation, prediction)) {
        refundLastSpell$h(state, prediction, "Invalid summon location, mana refunded.");
        return state;
      }
      const seed = rand$e.seedrandom(`${getUniqueSeedString$4(underworld, state.casterPlayer)}${state.castLocation.x}${state.castLocation.y}`);
      const choicePotion = chooseObjectWithProbability(Pickup$1.pickups.map((p, indexPotion) => {
        return {
          indexPotion,
          probability: p.name.includes("Potion") ? p.probability : 0
        };
      }), seed);
      if (choicePotion) {
        const { indexPotion } = choicePotion;
        underworld.spawnPickup(indexPotion, summonLocation, prediction);
        if (!prediction) {
          JAudio$6.playSFXKey("spawnPotion");
          VisualEffects$e.skyBeam(summonLocation);
        }
      } else {
        refundLastSpell$h(state, prediction);
      }
      return state;
    }
  }
};
const urn_explosive_id$1 = "Explosive Urn";
const urn_poison_id$1 = "Toxic Urn";
const urn_ice_id$1 = "Ice Urn";
const {
  commonTypes: commonTypes$B,
  cards: cards$u,
  VisualEffects: VisualEffects$d,
  rand: rand$d,
  units: units$f,
  Unit: Unit$u
} = globalThis.SpellmasonsAPI;
const { allUnits: allUnits$5 } = units$f;
const { getUniqueSeedString: getUniqueSeedString$3 } = rand$d;
const { refundLastSpell: refundLastSpell$g, addUnitTarget: addUnitTarget$9 } = cards$u;
const { CardCategory: CardCategory$z, probabilityMap: probabilityMap$y, CardRarity: CardRarity$y, Faction: Faction$e, UnitType: UnitType$i } = commonTypes$B;
const chaosWarpUrnCardId = "Chaos Warp - Urn";
const spell$y = {
  card: {
    id: chaosWarpUrnCardId,
    category: CardCategory$z.Soul,
    supportQuantity: false,
    manaCost: 10,
    healthCost: 0,
    expenseScaling: 1.5,
    requires: [chaosWarpCardId],
    probability: probabilityMap$y[CardRarity$y.RARE],
    thumbnail: "spellmasons-mods/Bogiacs_Spells/graphics/icons/ChaosWarpUrn.png",
    sfx: "summonDecoy",
    description: [`Summons a random Urn.`],
    allowNonUnitTarget: true,
    effect: async (state, card, _quantity, underworld, prediction) => {
      const summonLocation = {
        x: state.castLocation.x,
        y: state.castLocation.y
      };
      if (!underworld.isPointValidSpawn(summonLocation, prediction)) {
        refundLastSpell$g(state, prediction, "Invalid summon location, mana refunded.");
        return state;
      }
      const seedString = `${getUniqueSeedString$3(underworld, state.casterPlayer)}${state.castLocation.x}${state.castLocation.y}`;
      const seed = rand$d.seedrandom(seedString);
      const urnID = rand$d.chooseOneOfSeeded([urn_explosive_id$1, urn_ice_id$1, urn_poison_id$1], seed);
      if (urnID !== void 0) {
        let sourceUnit = allUnits$5[urnID];
        if (sourceUnit) {
          const unit2 = Unit$u.create(
            urnID,
            summonLocation.x,
            summonLocation.y,
            Faction$e.ALLY,
            sourceUnit.info.image,
            UnitType$i.AI,
            sourceUnit.info.subtype,
            sourceUnit.unitProps,
            underworld,
            prediction
          );
          unit2.healthMax *= 1;
          unit2.health *= 1;
          unit2.damage *= 1;
          addUnitTarget$9(unit2, state, prediction);
          if (!prediction) {
            VisualEffects$d.skyBeam(summonLocation);
          }
        } else {
          refundLastSpell$g(state, prediction);
        }
      } else {
        refundLastSpell$g(state, prediction);
      }
      return state;
    }
  }
};
const plusRadiusId = "Plus Radius";
const {
  commonTypes: commonTypes$A,
  cards: cards$t
} = globalThis.SpellmasonsAPI;
const { refundLastSpell: refundLastSpell$f } = cards$t;
const { CardCategory: CardCategory$y, probabilityMap: probabilityMap$x, CardRarity: CardRarity$x, UnitType: UnitType$h } = commonTypes$A;
const targetDistanceId = "Distance Increase";
const radiusBoost = 20;
const spell$x = {
  card: {
    id: targetDistanceId,
    category: CardCategory$y.Blessings,
    supportQuantity: true,
    requires: [plusRadiusId],
    manaCost: 25,
    healthCost: 0,
    expenseScaling: 1,
    probability: probabilityMap$x[CardRarity$x.RARE],
    thumbnail: "spellmasons-mods/Bogiacs_Spells/graphics/icons/Distance_Increase.png",
    description: "Increases a unit's attack range.  Does not affect Spellmasons.",
    effect: async (state, card, quantity, underworld, prediction, outOfRange) => {
      const units2 = state.targetedUnits.filter((u) => u.unitType !== UnitType$h.PLAYER_CONTROLLED);
      for (let unit2 of units2) {
        unit2.attackRange += radiusBoost * quantity;
      }
      if (units2.length === 0) {
        refundLastSpell$f(state, prediction, "No Target!");
      }
      return state;
    }
  }
};
const thornsId = "Thorns";
const {
  commonTypes: commonTypes$z,
  rand: rand$c,
  Unit: Unit$t,
  JImage: JImage$8,
  cardUtils: cardUtils$k,
  cardsUtil: cardsUtil$c
} = globalThis.SpellmasonsAPI;
const { getOrInitModifier: getOrInitModifier$4 } = cardsUtil$c;
const { playDefaultSpellSFX: playDefaultSpellSFX$a } = cardUtils$k;
const { CardCategory: CardCategory$x, probabilityMap: probabilityMap$w, CardRarity: CardRarity$w } = commonTypes$z;
const reflectCardId = "Reflect";
const reflectMultiplier = 0.2;
let caster;
const modifierImagePath = "modifierShield.png";
function add$4(unit2, underworld, prediction, quantity = 1) {
  getOrInitModifier$4(unit2, reflectCardId, { isCurse: false, quantity }, () => {
    Unit$t.addEvent(unit2, reflectCardId);
  });
}
const spell$w = {
  card: {
    id: reflectCardId,
    category: CardCategory$x.Blessings,
    supportQuantity: true,
    manaCost: 80,
    healthCost: 0,
    expenseScaling: 3,
    costGrowthAlgorithm: "nlogn",
    probability: probabilityMap$w[CardRarity$w.RARE],
    thumbnail: "spellmasons-mods/Bogiacs_Spells/graphics/icons/Reflect.png",
    animationPath: "spellShield",
    description: `Reflects ` + (reflectMultiplier * 100).toString() + `% of damage received back to attackers.`,
    effect: async (state, card, quantity, underworld, prediction) => {
      for (let unit2 of state.targetedUnits.filter((u) => u.alive)) {
        caster = state;
        let animationPromise = Promise.resolve();
        animationPromise = JImage$8.addOneOffAnimation(unit2, "priestProjectileHit", {}, { loop: false });
        playDefaultSpellSFX$a(card, prediction);
        await animationPromise;
        Unit$t.addModifier(unit2, reflectCardId, underworld, prediction);
      }
      return state;
    }
  },
  modifiers: {
    //stage: `Reflect`,
    add: add$4,
    addModifierVisuals(unit2) {
      const animatedReflectSprite = JImage$8.addSubSprite(unit2.image, modifierImagePath);
      if (animatedReflectSprite) {
        animatedReflectSprite.tint = 16716032;
      }
    },
    subsprite: {
      imageName: modifierImagePath,
      alpha: 0.65,
      anchor: {
        x: 0.5,
        y: 0.5
      },
      scale: {
        x: 1.25,
        y: 1.25
      }
    }
  },
  events: {
    onTooltip: (unit2, underworld) => {
      const modifier = unit2.modifiers[reflectCardId];
      if (modifier) {
        if (modifier.quantity == 1) {
          modifier.tooltip = `Reflects ` + (reflectMultiplier * 100).toString() + `% of damage received back to attacker ` + modifier.quantity.toString() + ` time.`;
        } else {
          modifier.tooltip = `Reflects ` + (reflectMultiplier * 100).toString() + `% of damage received back to attacker ` + modifier.quantity.toString() + ` times.`;
        }
      }
    },
    onTakeDamage: (unit2, amount2, _underworld, prediction, damageDealer) => {
      const modifier = unit2.modifiers[reflectCardId];
      if (modifier) {
        if (damageDealer && amount2 > 0) {
          damageDealer.events = damageDealer.events.filter((x) => x !== reflectCardId);
          damageDealer.events = damageDealer.events.filter((x) => x !== thornsId);
          Unit$t.takeDamage({
            unit: damageDealer,
            amount: amount2 * reflectMultiplier,
            sourceUnit: unit2
          }, _underworld, prediction);
          if (damageDealer.modifiers[reflectCardId]) {
            Unit$t.addEvent(damageDealer, reflectCardId);
          }
          if (damageDealer.modifiers[thornsId]) {
            Unit$t.addEvent(damageDealer, thornsId);
          }
          modifier.quantity -= 1;
          if (modifier.quantity == 0) {
            Unit$t.removeModifier(caster.casterUnit, reflectCardId, _underworld);
          }
        }
      }
      return amount2;
    }
  }
};
const {
  commonTypes: commonTypes$y,
  cards: cards$s
} = globalThis.SpellmasonsAPI;
const { CardCategory: CardCategory$w, probabilityMap: probabilityMap$v, CardRarity: CardRarity$v, UnitType: UnitType$g } = commonTypes$y;
const { refundLastSpell: refundLastSpell$e } = cards$s;
const reinforceCardId = "Reinforce";
const reinforceAmount = 20;
const spell$v = {
  card: {
    id: reinforceCardId,
    category: CardCategory$w.Blessings,
    supportQuantity: true,
    manaCost: 40,
    healthCost: 0,
    expenseScaling: 1,
    probability: probabilityMap$v[CardRarity$v.RARE],
    thumbnail: "spellmasons-mods/Bogiacs_Spells/graphics/icons/Reinforce.png",
    animationPath: "potionPickup",
    description: "Increases Max HP by " + reinforceAmount.toString() + ".  Does not affect Spellmasons.",
    effect: async (state, card, quantity, underworld, prediction) => {
      const units2 = state.targetedUnits.filter((u) => u.unitType !== UnitType$g.PLAYER_CONTROLLED);
      for (let unit2 of units2) {
        unit2.healthMax += reinforceAmount;
        unit2.health += reinforceAmount;
      }
      if (units2.length === 0) {
        refundLastSpell$e(state, prediction);
      }
      return state;
    }
  }
};
const {
  colors: colors$7,
  JImage: JImage$7
} = globalThis.SpellmasonsAPI;
[[16711680, colors$7.stamina]];
async function healStaminaUnits(units2, amount2, sourceUnit, underworld, prediction, state) {
  units2 = units2.filter((u) => u.alive);
  if (units2.length == 0 || amount2 == 0)
    return;
  for (let unit2 of units2) {
    unit2.stamina += amount2;
  }
  return state;
}
const {
  commonTypes: commonTypes$x
} = globalThis.SpellmasonsAPI;
const { CardCategory: CardCategory$v, probabilityMap: probabilityMap$u, CardRarity: CardRarity$u } = commonTypes$x;
const revitaliseCardId = "Revitalise";
const revitaliseAmount = 100;
const spell$u = {
  card: {
    id: revitaliseCardId,
    category: CardCategory$v.Blessings,
    //sfx: healSfx, // Heal FX Handled in Unit.takeDamage()
    supportQuantity: true,
    manaCost: 15,
    healthCost: 0,
    expenseScaling: 1,
    probability: probabilityMap$u[CardRarity$u.COMMON],
    thumbnail: "spellmasons-mods/Bogiacs_Spells/graphics/icons/Revitalise.png",
    animationPath: "potionPickup",
    description: "Restores " + revitaliseAmount.toString() + " stamina to the target.",
    effect: async (state, card, quantity, underworld, prediction) => {
      await healStaminaUnits(state.targetedUnits, revitaliseAmount * quantity, state.casterUnit, underworld, prediction, state);
      return state;
    }
  }
};
const {
  Particles: Particles$1,
  commonTypes: commonTypes$w,
  Unit: Unit$s,
  EffectsHeal: EffectsHeal$1,
  cards: cards$r
} = globalThis.SpellmasonsAPI;
const { CardCategory: CardCategory$u, probabilityMap: probabilityMap$t, CardRarity: CardRarity$t } = commonTypes$w;
const { refundLastSpell: refundLastSpell$d } = cards$r;
const siphonCardId = "Siphon";
const amount = 10;
const spell$t = {
  card: {
    id: siphonCardId,
    category: CardCategory$u.Mana,
    sfx: "potionPickupMana",
    supportQuantity: true,
    manaCost: 0,
    healthCost: 8,
    costGrowthAlgorithm: "nlogn",
    expenseScaling: 1,
    probability: probabilityMap$t[CardRarity$t.FORBIDDEN],
    thumbnail: "spellmasons-mods/Bogiacs_Spells/graphics/icons/Siphon.png",
    animationPath: "potionPickup",
    description: `Drain 10 health and 10 mana from targets.`,
    effect: async (state, card, quantity, underworld, prediction) => {
      const targets = state.targetedUnits.filter((u) => u.alive);
      let promises = [];
      let manaStolen = 0;
      let healthStolen = 0;
      let amountStolen = amount * quantity;
      for (let unit2 of targets) {
        const manaStolenFromUnit = Math.min(unit2.mana, amountStolen);
        unit2.mana -= manaStolenFromUnit;
        manaStolen += manaStolenFromUnit;
        const healthStolenFromUnit = Math.min(unit2.health, amountStolen);
        healthStolen += healthStolenFromUnit;
        Unit$s.takeDamage({
          unit: unit2,
          amount: healthStolenFromUnit,
          sourceUnit: state.casterUnit,
          fromVec2: state.casterUnit
        }, underworld, prediction);
        if (!globalThis.headless && !prediction) {
          promises.push(Particles$1.makeManaTrail(unit2, state.casterUnit, underworld, "#fff9e4", "#ffcb3f", targets.length * quantity));
          promises.push(Particles$1.makeManaTrail(unit2, state.casterUnit, underworld, "#e4f9ff", "#3fcbff", targets.length * quantity));
        }
      }
      await Promise.all(promises);
      state.casterUnit.mana += manaStolen;
      EffectsHeal$1.healUnit(state.casterUnit, healthStolen, state.casterUnit, underworld, prediction, state);
      if (healthStolen == 0 && manaStolen == 0) {
        refundLastSpell$d(state, prediction);
      }
      return state;
    }
  }
};
const targetSimilarId = "Target Similar";
const {
  commonTypes: commonTypes$v,
  cards: cards$q,
  config: config$o,
  math: math$e,
  colors: colors$6,
  JAudio: JAudio$5,
  Unit: Unit$r
} = globalThis.SpellmasonsAPI;
const { addTarget: addTarget$c } = cards$q;
const { distance: distance$4 } = math$e;
const { CardCategory: CardCategory$t, probabilityMap: probabilityMap$s, CardRarity: CardRarity$s, UnitSubType: UnitSubType$e } = commonTypes$v;
const targetAllyId = "Target Ally";
const targetsPerQuantity$1 = 2;
const spell$s = {
  card: {
    id: targetAllyId,
    category: CardCategory$t.Targeting,
    supportQuantity: true,
    requires: [targetSimilarId],
    manaCost: 35,
    healthCost: 0,
    expenseScaling: 1,
    probability: probabilityMap$s[CardRarity$s.RARE],
    thumbnail: "spellmasons-mods/Bogiacs_Spells/graphics/icons/TargetAlly.png",
    requiresFollowingCard: true,
    description: `Target the closest ally. ${targetsPerQuantity$1} per stack.`,
    allowNonUnitTarget: true,
    effect: async (state, card, quantity, underworld, prediction, outOfRange) => {
      const faction = state.casterUnit.faction;
      const addedTargets = underworld.getPotentialTargets(prediction).filter((u) => Unit$r.isUnit(u) && u.unitSubType != UnitSubType$e.DOODAD && u.faction == faction && u !== state.casterUnit && !state.targetedUnits.includes(u)).sort((a, b) => distance$4(state.casterPositionAtTimeOfCast, a) - distance$4(state.casterPositionAtTimeOfCast, b)).slice(0, targetsPerQuantity$1 * quantity);
      if (addedTargets.length) {
        for (const target of addedTargets) {
          addTarget$c(target, state, underworld, prediction);
        }
        if (!prediction && !globalThis.headless) {
          JAudio$5.playSFXKey("targeting");
          await animateTargetAlly(addedTargets);
        }
      }
      return state;
    }
  }
};
async function animateTargetAlly(newTargets) {
  var _a;
  const animationDelay = 600;
  await new Promise((resolve) => {
    for (let target of newTargets) {
      if (globalThis.predictionGraphicsGreen) {
        globalThis.predictionGraphicsGreen.lineStyle(2, colors$6.targetingSpellGreen, 1);
        globalThis.predictionGraphicsGreen.drawCircle(target.x, target.y, config$o.COLLISION_MESH_RADIUS);
        setTimeout(resolve, animationDelay);
      } else {
        resolve();
      }
    }
  });
  (_a = globalThis.predictionGraphicsGreen) == null ? void 0 : _a.clear();
  return;
}
const {
  commonTypes: commonTypes$u,
  cards: cards$p,
  config: config$n,
  math: math$d,
  colors: colors$5,
  Unit: Unit$q,
  JAudio: JAudio$4
} = globalThis.SpellmasonsAPI;
const { addTarget: addTarget$b } = cards$p;
const { distance: distance$3 } = math$d;
const { CardCategory: CardCategory$s, probabilityMap: probabilityMap$r, CardRarity: CardRarity$r, UnitSubType: UnitSubType$d } = commonTypes$u;
const targetPlayerId = "Target Player";
const targetsPerQuantity = 2;
const PLAYER_CONTROLLED = 0;
const spell$r = {
  card: {
    id: targetPlayerId,
    category: CardCategory$s.Targeting,
    supportQuantity: true,
    requires: [targetAllyId],
    manaCost: 35,
    healthCost: 0,
    expenseScaling: 1,
    probability: probabilityMap$r[CardRarity$r.RARE],
    thumbnail: "spellmasons-mods/Bogiacs_Spells/graphics/icons/TargetPlayer.png",
    requiresFollowingCard: true,
    description: `Target the closest Player.`,
    allowNonUnitTarget: true,
    effect: async (state, card, quantity, underworld, prediction, outOfRange) => {
      const addedTargets = underworld.getPotentialTargets(prediction).filter((u) => Unit$q.isUnit(u) && u.unitSubType != UnitSubType$d.DOODAD && // Target players only
      u.unitType == PLAYER_CONTROLLED && // Filter out caster Unit since they are naturPlayer
      // the "closest" to themselves and if they want to target
      // themselves they can by casting on themselves and wont
      // need target Player to do it
      u !== state.casterUnit && !state.targetedUnits.includes(u)).sort((a, b) => distance$3(state.casterPositionAtTimeOfCast, a) - distance$3(state.casterPositionAtTimeOfCast, b)).slice(0, targetsPerQuantity * quantity);
      if (addedTargets.length) {
        for (const target of addedTargets) {
          addTarget$b(target, state, underworld, prediction);
        }
        if (!prediction && !globalThis.headless) {
          JAudio$4.playSFXKey("targeting");
          await animateTargetPlayer(addedTargets);
        }
      }
      return state;
    }
  }
};
async function animateTargetPlayer(newTargets) {
  var _a;
  const animationDelay = 600;
  await new Promise((resolve) => {
    for (let target of newTargets) {
      if (globalThis.predictionGraphicsGreen) {
        globalThis.predictionGraphicsGreen.lineStyle(2, colors$5.targetingSpellGreen, 1);
        globalThis.predictionGraphicsGreen.drawCircle(target.x, target.y, config$n.COLLISION_MESH_RADIUS);
        setTimeout(resolve, animationDelay);
      } else {
        resolve();
      }
    }
  });
  (_a = globalThis.predictionGraphicsGreen) == null ? void 0 : _a.clear();
  return;
}
const slashCardId$1 = "Slash";
const {
  commonTypes: commonTypes$t,
  cards: cards$o,
  rand: rand$b,
  cardUtils: cardUtils$j,
  PixiUtils: PixiUtils$d,
  Unit: Unit$p
} = globalThis.SpellmasonsAPI;
const { randFloat: randFloat$2 } = rand$b;
const { CardCategory: CardCategory$r, probabilityMap: probabilityMap$q, CardRarity: CardRarity$q } = commonTypes$t;
const tripleSlashCardId = "Triple Slash";
const damageDone = 20;
const delayBetweenAnimationsStart$1 = 250;
const animationPath$1 = "spellHurtCuts";
const spell$q = {
  card: {
    id: tripleSlashCardId,
    requires: [slashCardId$1],
    category: CardCategory$r.Damage,
    supportQuantity: true,
    manaCost: 20,
    healthCost: 0,
    expenseScaling: 1,
    probability: probabilityMap$q[CardRarity$q.UNCOMMON],
    thumbnail: "spellmasons-mods/Bogiacs_Spells/graphics/icons/TripleSlash.png",
    animationPath: animationPath$1,
    sfx: "hurt",
    description: [`Casts the Slash Spell three times.`],
    effect: async (state, card, quantity, underworld, prediction) => {
      return await tripleSlashEffect(state, card, quantity, underworld, prediction, damageDone, 1);
    }
  }
};
async function tripleSlashEffect(state, card, quantity, underworld, prediction, damage2, scale2) {
  const targets = state.targetedUnits.filter((u) => u.alive);
  let delayBetweenAnimations = delayBetweenAnimationsStart$1;
  for (let tripleSlashCounter = 0; tripleSlashCounter < 3; tripleSlashCounter++) {
    for (let q = 0; q < quantity; q++) {
      if (!prediction && !globalThis.headless) {
        cardUtils$j.playDefaultSpellSFX(card, prediction);
        for (let unit2 of targets) {
          const spellEffectImage = cardUtils$j.oneOffImage(unit2, animationPath$1, PixiUtils$d.containerSpells);
          if (spellEffectImage) {
            spellEffectImage.sprite.rotation = randFloat$2(-Math.PI / 6, Math.PI / 6);
            if (q % 2 == 0) {
              spellEffectImage.sprite.scale.x = -1;
            }
            spellEffectImage.sprite.scale.x *= scale2;
            spellEffectImage.sprite.scale.y *= scale2;
          }
          Unit$p.takeDamage({
            unit: unit2,
            amount: damage2,
            sourceUnit: state.casterUnit,
            fromVec2: state.casterUnit
          }, underworld, prediction);
        }
        await new Promise((resolve) => setTimeout(resolve, delayBetweenAnimations));
        delayBetweenAnimations *= 0.8;
        delayBetweenAnimations = Math.max(20, delayBetweenAnimations);
      } else {
        for (let unit2 of targets) {
          Unit$p.takeDamage({
            unit: unit2,
            amount: damage2,
            sourceUnit: state.casterUnit,
            fromVec2: state.casterUnit
          }, underworld, prediction);
        }
      }
    }
  }
  return state;
}
const mod$6 = {
  modName: "Bogiac's Spells",
  author: "Bogiac",
  description: "Adds some new spells to the game",
  screenshot: "spellmasons-mods/Bogiacs_Spells/graphics/icons/Bogiacs_Spells_icon.png",
  spritesheet: "spellmasons-mods/Bogiacs_Spells/graphics/spritesheet.json",
  spells: [
    //Add or Remove spells here.
    spell$A,
    spell$z,
    spell$y,
    spell$x,
    //Impact,
    spell$w,
    spell$v,
    spell$u,
    spell$t,
    spell$s,
    spell$r,
    spell$q
  ]
};
const {
  commonTypes: commonTypes$s,
  Unit: Unit$o,
  colors: colors$4,
  config: config$m,
  math: math$c,
  Vec: Vec$9,
  PlanningView: PlanningView$j,
  JPromise: JPromise$5
} = globalThis.SpellmasonsAPI;
const { add: add$3 } = Vec$9;
const { CardCategory: CardCategory$q, CardRarity: CardRarity$p, probabilityMap: probabilityMap$p, UnitType: UnitType$f } = commonTypes$s;
const { distance: distance$2 } = math$c;
const { drawPredictionLine, drawUICircleFillPrediction } = PlanningView$j;
const { raceTimeout: raceTimeout$4 } = JPromise$5;
const id$h = "Assimilate";
const numberOfTargetsPerQuantity = 5;
const baseRadius$2 = 250;
const spell$p = {
  card: {
    id: id$h,
    category: CardCategory$q.Soul,
    manaCost: 0,
    healthCost: 50,
    expenseScaling: 2,
    costGrowthAlgorithm: "exponential",
    probability: probabilityMap$p[CardRarity$p.RARE],
    thumbnail: "spellmasons-mods/The_Doom_Scroll/graphics/spellIconAssimilate.png",
    supportQuantity: true,
    requiresFollowingCard: false,
    allowNonUnitTarget: true,
    omitForWizardType: ["Deathmason", "Goru"],
    description: "Connects the caster to 5 nearby targets per cast, sacrificing them and funneling their power into the caster. Can only be cast once",
    effect: async (state, card, quantity, underworld, prediction) => {
      let limitTargetsLeft = numberOfTargetsPerQuantity * quantity + 1;
      let potentialTargets = [];
      underworld.getPotentialTargets(prediction).filter((t) => Unit$o.isUnit(t)).sort((a, b) => distance$2(a, state.casterUnit) - distance$2(b, state.casterUnit)).slice(0, limitTargetsLeft).forEach((u) => {
        if (Unit$o.isUnit(u))
          potentialTargets.push(u);
      });
      const wizard = state.casterUnit;
      let targets = [wizard];
      targets.length;
      const linkGroups = [];
      const target = wizard;
      const filterFn = (x) => {
        if (Unit$o.isUnit(x)) {
          return true;
        } else {
          return false;
        }
      };
      const adjustedRadius = baseRadius$2 * (1 + 0.1 * state.aggregator.radiusBoost);
      const chained = getConnectingUnits(
        target,
        adjustedRadius,
        limitTargetsLeft,
        targets,
        potentialTargets,
        filterFn,
        prediction
      );
      if (prediction) {
        chained.forEach((chained_entity) => {
          drawPredictionLine(chained_entity.chainSource, chained_entity.entity);
        });
      } else {
        linkGroups.push(chained.map((x) => ({ from: x.chainSource, targets: [{ to: x.entity, playedSound: false }] })));
      }
      chained.forEach((u) => targets.push(u.entity));
      if (!prediction) {
        await animateConnections(linkGroups, underworld, prediction);
      }
      const filterCasterOut = (x) => {
        if (x == state.casterUnit) {
          return false;
        } else {
          return true;
        }
      };
      mergeUnits(state.casterUnit, targets.filter((x) => filterCasterOut(x)), underworld, prediction, state);
      if (!prediction && !globalThis.headless && state.casterPlayer) {
        await new Promise((res) => {
          setTimeout(res, 200);
        });
        if (!state.casterPlayer.disabledCards) {
          state.casterPlayer.disabledCards = [];
        }
        state.casterPlayer.disabledCards.push("Assimilate");
      }
      return state;
    }
  }
};
function mergeUnits(target, unitsToMerge, underworld, prediction, state) {
  for (const unit2 of unitsToMerge) {
    if (prediction) {
      const graphics = globalThis.predictionGraphicsBlue;
      if (graphics) {
        graphics.lineStyle(2, 16777215, 1);
        graphics.moveTo(unit2.x, unit2.y);
        graphics.lineTo(target.x, target.y);
        graphics.drawCircle(target.x, target.y, 2);
      }
    }
    if (target.unitType == UnitType$f.PLAYER_CONTROLLED) {
      target.health += unit2.health;
      target.mana += unit2.mana;
      target.stamina += unit2.stamina;
      target.soulFragments += unit2.soulFragments;
      target.moveSpeed += unit2.moveSpeed / 10;
      target.strength += unit2.strength;
    } else {
      target.healthMax += unit2.healthMax;
      target.health += unit2.health;
      target.manaMax += unit2.manaMax;
      target.mana += unit2.mana;
      target.damage += unit2.damage;
      target.manaCostToCast += unit2.manaCostToCast;
      target.manaPerTurn += unit2.manaPerTurn;
      target.strength += unit2.strength;
    }
    if (unit2.unitType == UnitType$f.PLAYER_CONTROLLED) {
      Unit$o.die(unit2, underworld, prediction);
    } else {
      if (!prediction && unit2.originalLife) {
        underworld.enemiesKilled++;
      }
      if (state) {
        state.targetedUnits = state.targetedUnits.filter((u) => u != unit2);
      }
      Unit$o.cleanup(unit2);
    }
  }
  return state;
}
function getConnectingUnits(source, radius, chainsLeft, targets = [], potentialTargets, filterFn, prediction, radiusFn) {
  potentialTargets = potentialTargets.filter((x) => filterFn(x)).filter((t) => !targets.includes(t));
  let connected = [];
  if (chainsLeft > 0) {
    connected = getNextConnectingEntities(source, radius, chainsLeft, potentialTargets, prediction, radiusFn);
  }
  return connected;
}
function getNextConnectingEntities(source, baseRadius2, chainsLeft, potentialTargets, prediction, radiusModifierFn) {
  potentialTargets = potentialTargets.filter((x) => x != source);
  let adjustedRadius = baseRadius2;
  if (radiusModifierFn) {
    adjustedRadius *= radiusModifierFn(source, chainsLeft);
  }
  if (prediction) {
    drawUICircleFillPrediction(source, adjustedRadius - config$m.COLLISION_MESH_RADIUS / 2, colors$4.trueWhite);
  }
  let connected = [];
  do {
    let closestDist = adjustedRadius;
    let closestTarget = void 0;
    for (let t of potentialTargets) {
      const dist = math$c.distance(t, source);
      if (dist <= closestDist) {
        closestDist = dist;
        closestTarget = t;
      }
    }
    if (closestTarget) {
      connected.push({ chainSource: source, entity: closestTarget });
      chainsLeft--;
      if (chainsLeft > 0) {
        const next = getNextConnectingEntities(closestTarget, baseRadius2, chainsLeft, potentialTargets, prediction, radiusModifierFn);
        chainsLeft -= next.length;
        connected = connected.concat(next);
        potentialTargets = potentialTargets.filter((x) => {
          for (let c of connected) {
            if (x == c.entity)
              return false;
          }
          return true;
        });
      }
    } else {
      break;
    }
  } while (chainsLeft + 1 > 0);
  return connected;
}
const timeoutMsAnimation$3 = 2e3;
async function animateConnections(links, underworld, prediction) {
  if (globalThis.headless || prediction) {
    return Promise.resolve();
  }
  if (links.length == 0) {
    return Promise.resolve();
  }
  const entitiesTargeted = [];
  return raceTimeout$4(timeoutMsAnimation$3, "animatedConnect", new Promise((resolve) => {
    animateFrame$3(links, Date.now(), entitiesTargeted, underworld, resolve, prediction)();
  }));
}
const millisToGrow$3 = 750;
const circleRadius = config$m.COLLISION_MESH_RADIUS / 2;
function animateFrame$3(linkGroups, startTime, entitiesTargeted, underworld, resolve, prediction) {
  return function animateFrameInner() {
    if (globalThis.headless || prediction) {
      resolve();
      return;
    }
    if (globalThis.predictionGraphicsGreen) {
      globalThis.predictionGraphicsGreen.clear();
      globalThis.predictionGraphicsGreen.lineStyle(2, 16777215, 1);
      const now = Date.now();
      const timeDiff = now - startTime;
      for (let links of linkGroups) {
        for (let i = 0; i < links.length; i++) {
          const link = links[i];
          if (!link) {
            continue;
          }
          const { from, targets } = link;
          const proportionComplete = math$c.lerpSegmented(0, 1, timeDiff / millisToGrow$3, i, links.length);
          for (let target of targets) {
            if (proportionComplete === 0) {
              continue;
            }
            const { to } = target;
            const dist = distance$2(from, to);
            const edgeOfStartCircle = add$3(from, math$c.similarTriangles(to.x - from.x, to.y - from.y, dist, circleRadius));
            globalThis.predictionGraphicsGreen.moveTo(edgeOfStartCircle.x, edgeOfStartCircle.y);
            const edgeOfCircle = add$3(to, math$c.similarTriangles(from.x - to.x, from.y - to.y, dist, circleRadius));
            const pointApproachingTarget = add$3(edgeOfStartCircle, math$c.similarTriangles(edgeOfCircle.x - edgeOfStartCircle.x, edgeOfCircle.y - edgeOfStartCircle.y, dist, dist * Math.min(1, proportionComplete)));
            globalThis.predictionGraphicsGreen.lineTo(pointApproachingTarget.x, pointApproachingTarget.y);
            if (proportionComplete >= 1) {
              globalThis.predictionGraphicsGreen.drawCircle(to.x, to.y, circleRadius);
              if (!target.playedSound) {
                target.playedSound = true;
              }
            }
          }
        }
      }
      if (timeDiff > millisToGrow$3 + 250) {
        resolve();
        globalThis.predictionGraphicsGreen.clear();
        return;
      } else {
        requestAnimationFrame(animateFrame$3(linkGroups, startTime, entitiesTargeted, underworld, resolve, prediction));
      }
    } else {
      resolve();
    }
  };
}
const {
  commonTypes: commonTypes$r,
  Unit: Unit$n,
  colors: colors$3,
  math: math$b,
  config: config$l,
  Vec: Vec$8,
  cards: cards$n,
  PixiUtils: PixiUtils$c,
  moveWithCollision: moveWithCollision$8,
  modifierSummonerSickness: modifierSummonerSickness$2,
  JImage: JImage$6,
  FloatingText: FloatingText$5,
  Arrow: Arrow$2
} = globalThis.SpellmasonsAPI;
const { CardCategory: CardCategory$p, CardRarity: CardRarity$o, probabilityMap: probabilityMap$o } = commonTypes$r;
const { summoningSicknessId: summoningSicknessId$2 } = modifierSummonerSickness$2;
const floatingText$2 = FloatingText$5.default;
const bloodArrowCardId = "Bloodied Arrow";
const damage$3 = 10;
const bloodiedArrowEffect = Arrow$2.arrowEffect(1, bloodArrowCardId);
const corpseDecayId$2 = "Corpse Decay";
const spell$o = {
  card: {
    id: bloodArrowCardId,
    category: CardCategory$p.Curses,
    probability: probabilityMap$o[CardRarity$o.UNCOMMON],
    manaCost: 0,
    healthCost: 10,
    expenseScaling: 1,
    supportQuantity: false,
    ignoreRange: true,
    // so that you can fire the arrow at targets out of range
    allowNonUnitTarget: true,
    // This ensures that "target scamming" doesn't work with target arrow
    // due to it being able to fire out of range
    noInitialTarget: true,
    requiresFollowingCard: false,
    animationPath: "",
    sfx: "",
    thumbnail: "spellmasons-mods/The_Doom_Scroll/graphics/spellIconBloodArrow.png",
    description: "Conjures a corrupted arrow that deals 10 damage and TRANSFERS one stack of each curse per stack of Bloodied Arrow from the caster to the victims.",
    effect: async (state, card, quantity, underworld, prediction) => bloodiedArrowEffect(state, card, quantity, underworld, prediction).then((state2) => {
      const modifiersToExclude = [summoningSicknessId$2, corpseDecayId$2];
      const curses = Object.entries(state2.casterUnit.modifiers).map(([id2, mod2]) => ({ modId: id2, modifier: mod2 })).filter((x) => x.modifier.isCurse).filter((x) => !modifiersToExclude.includes(x.modId));
      for (let curse of curses) {
        curse.modifier.quantity -= quantity;
        if (curse.modifier.quantity <= 0) {
          Unit$n.removeModifier(state2.casterUnit, curse.modId, underworld);
        }
      }
      return state2;
    })
  },
  events: {
    onProjectileCollision: ({ unit: unit2, pickup, underworld, projectile, prediction }) => {
      var _a;
      if (projectile.state && projectile.sourceUnit) {
        if (unit2) {
          Unit$n.takeDamage({
            unit: unit2,
            amount: damage$3,
            sourceUnit: projectile.sourceUnit,
            fromVec2: projectile.startPoint,
            thinBloodLine: true
          }, underworld, prediction);
          const modifiersToExclude = [summoningSicknessId$2, corpseDecayId$2];
          const curses = Object.entries(projectile.sourceUnit.modifiers).map(([id2, mod2]) => ({ modId: id2, modifier: mod2 })).filter((x) => x.modifier.isCurse).filter((x) => !modifiersToExclude.includes(x.modId));
          for (let curse of curses) {
            let curseAmount = curse.modifier.quantity;
            let unitCurseAmount = ((_a = unit2.modifiers[curse.modId]) == null ? void 0 : _a.quantity) || 0;
            if (unitCurseAmount > curseAmount) {
              continue;
            } else if (unitCurseAmount < curseAmount) {
              if (!prediction) {
                floatingText$2({ coords: unit2, text: curse.modId });
              }
              if (unit2.alive) {
                Unit$n.addModifier(unit2, curse.modId, underworld, prediction, 1, curse.modifier);
              }
            }
          }
        } else {
          projectile.state.castLocation = projectile.pushedObject;
        }
      } else {
        console.error("State was not passed through projectile");
      }
    }
  }
};
const {
  commonTypes: commonTypes$q,
  Unit: Unit$m,
  colors: colors$2,
  math: math$a,
  config: config$k,
  Vec: Vec$7,
  cards: cards$m,
  PixiUtils: PixiUtils$b,
  moveWithCollision: moveWithCollision$7,
  modifierSummonerSickness: modifierSummonerSickness$1,
  JImage: JImage$5,
  FloatingText: FloatingText$4,
  Arrow: Arrow$1,
  Purify
} = globalThis.SpellmasonsAPI;
const floatingText$1 = FloatingText$4.default;
const { CardCategory: CardCategory$o, CardRarity: CardRarity$n, probabilityMap: probabilityMap$n } = commonTypes$q;
const { summoningSicknessId: summoningSicknessId$1 } = modifierSummonerSickness$1;
const damage$2 = 20;
const corpseDecayId$1 = "Corpse Decay";
const STERILE_ARROW_ID = "Sterile Arrow";
const serileArrowEffect = Arrow$1.arrowEffect(1, STERILE_ARROW_ID);
const spell$n = {
  card: {
    id: STERILE_ARROW_ID,
    category: CardCategory$o.Curses,
    probability: probabilityMap$n[CardRarity$n.UNCOMMON],
    manaCost: 0,
    healthCost: 15,
    expenseScaling: 1,
    supportQuantity: true,
    ignoreRange: true,
    // so that you can fire the arrow at targets out of range
    allowNonUnitTarget: true,
    // This ensures that "target scamming" doesn't work with target arrow
    // due to it being able to fire out of range
    noInitialTarget: true,
    requiresFollowingCard: false,
    animationPath: "",
    replaces: [bloodArrowCardId],
    sfx: "",
    thumbnail: "spellmasons-mods/The_Doom_Scroll/graphics/spellIconSterileArrow.png",
    description: "Conjures a mystical arrow that deals 20 damage and TRANSFERS curses from the caster to the victim.",
    effect: async (state, card, quantity, underworld, prediction) => serileArrowEffect(state, card, quantity, underworld, prediction).then((state2) => {
      Purify.apply(state2.casterUnit, underworld, prediction, state2);
      return state2;
    })
  },
  events: {
    onProjectileCollision: ({ unit: unit2, pickup, underworld, projectile, prediction }) => {
      if (projectile.state && projectile.sourceUnit) {
        if (unit2) {
          Unit$m.takeDamage({
            unit: unit2,
            amount: damage$2,
            sourceUnit: projectile.sourceUnit,
            fromVec2: projectile.startPoint,
            thinBloodLine: true
          }, underworld, prediction);
          const modifiersToExclude = [summoningSicknessId$1, corpseDecayId$1];
          const curses = Object.entries(projectile.sourceUnit.modifiers).map(([id2, mod2]) => ({ modId: id2, modifier: mod2 })).filter((x) => x.modifier.isCurse).filter((x) => !modifiersToExclude.includes(x.modId));
          for (let curse of curses) {
            if (!prediction) {
              floatingText$1({ coords: unit2, text: curse.modId });
            }
            if (unit2.alive) {
              const quantityToAdd = curse.modifier.quantity;
              Unit$m.addModifier(unit2, curse.modId, underworld, prediction, quantityToAdd, curse.modifier);
            }
          }
        } else {
          projectile.state.castLocation = projectile.pushedObject;
        }
      } else {
        console.error("State was not passed through projectile");
      }
    }
  }
};
const {
  commonTypes: commonTypes$p,
  Unit: Unit$l,
  colors: colors$1,
  math: math$9,
  config: config$j,
  Vec: Vec$6,
  cards: cards$l,
  PixiUtils: PixiUtils$a,
  moveWithCollision: moveWithCollision$6,
  modifierSummonerSickness,
  JImage: JImage$4,
  FloatingText: FloatingText$3,
  Arrow
} = globalThis.SpellmasonsAPI;
const floatingText = FloatingText$3.default;
const { CardCategory: CardCategory$n, CardRarity: CardRarity$m, probabilityMap: probabilityMap$m } = commonTypes$p;
const { summoningSicknessId } = modifierSummonerSickness;
const damage$1 = 20;
const corpseDecayId = "Corpse Decay";
const BLOODTHORN_ARROW_ID = "Bloodthorn Arrow";
const spell$m = {
  card: {
    id: BLOODTHORN_ARROW_ID,
    category: CardCategory$n.Curses,
    probability: probabilityMap$m[CardRarity$m.UNCOMMON],
    manaCost: 0,
    healthCost: 15,
    expenseScaling: 1,
    supportQuantity: true,
    ignoreRange: true,
    // so that you can fire the arrow at targets out of range
    allowNonUnitTarget: true,
    // This ensures that "target scamming" doesn't work with target arrow
    // due to it being able to fire out of range
    noInitialTarget: true,
    requiresFollowingCard: false,
    animationPath: "",
    replaces: [bloodArrowCardId],
    sfx: "",
    thumbnail: "spellmasons-mods/The_Doom_Scroll/graphics/spellIconBloodThorn.png",
    description: "Conjures a corrupted arrow that deals 20 damage and SPREADS curses from the caster to the victim.",
    effect: Arrow.arrowEffect(1, BLOODTHORN_ARROW_ID)
  },
  events: {
    onProjectileCollision: ({ unit: unit2, pickup, underworld, projectile, prediction }) => {
      if (projectile.state && projectile.sourceUnit) {
        if (unit2) {
          Unit$l.takeDamage({
            unit: unit2,
            amount: damage$1,
            sourceUnit: projectile.sourceUnit,
            fromVec2: projectile.startPoint,
            thinBloodLine: true
          }, underworld, prediction);
          const modifiersToExclude = [summoningSicknessId, corpseDecayId];
          const curses = Object.entries(projectile.sourceUnit.modifiers).map(([id2, mod2]) => ({ modId: id2, modifier: mod2 })).filter((x) => x.modifier.isCurse).filter((x) => !modifiersToExclude.includes(x.modId));
          for (let curse of curses) {
            if (!prediction) {
              floatingText({ coords: unit2, text: curse.modId });
            }
            if (unit2.alive) {
              Unit$l.addModifier(unit2, curse.modId, underworld, prediction, curse.modifier.quantity * 2, curse.modifier);
            }
          }
        } else {
          projectile.state.castLocation = projectile.pushedObject;
        }
      } else {
        console.error("State was not passed through projectile");
      }
    }
  }
};
const {
  commonTypes: commonTypes$o,
  Unit: Unit$k,
  units: units$e,
  config: config$i,
  cards: cards$k,
  cardUtils: cardUtils$i,
  PlanningView: PlanningView$i,
  VisualEffects: VisualEffects$c,
  forcePushAwayFrom: forcePushAwayFrom$3
} = globalThis.SpellmasonsAPI;
const { CardCategory: CardCategory$m, CardRarity: CardRarity$l, probabilityMap: probabilityMap$l, Faction: Faction$d, UnitType: UnitType$e } = commonTypes$o;
const { takeDamage: takeDamage$5 } = Unit$k;
const { allUnits: allUnits$4 } = units$e;
const { skyBeam: skyBeam$3 } = VisualEffects$c;
const { refundLastSpell: refundLastSpell$c, getCurrentTargets: getCurrentTargets$e, defaultTargetsForAllowNonUnitTargetTargetingSpell: defaultTargetsForAllowNonUnitTargetTargetingSpell$7 } = cards$k;
const { playDefaultSpellSFX: playDefaultSpellSFX$9 } = cardUtils$i;
const { addWarningAtMouse: addWarningAtMouse$4, drawUICirclePrediction: drawUICirclePrediction$5 } = PlanningView$i;
const id$g = "Raise Pillar";
const spell$l = {
  card: {
    id: id$g,
    category: CardCategory$m.Soul,
    sfx: "summonDecoy",
    supportQuantity: false,
    manaCost: 20,
    healthCost: 0,
    expenseScaling: 2,
    probability: probabilityMap$l[CardRarity$l.COMMON],
    thumbnail: "spellmasons-mods/The_Doom_Scroll/graphics/spellIconRaise_Pillar.png",
    description: "Raise a pillar at the target location, dealing 10 damage to nearby enemies and pushing them away.",
    allowNonUnitTarget: true,
    effect: async (state, card, quantity, underworld, prediction) => {
      const unitId = "pillar";
      const sourceUnit = allUnits$4[unitId];
      if (sourceUnit) {
        const currentTargets = getCurrentTargets$e(state);
        const newPillarLocations = currentTargets.length ? currentTargets : [state.castLocation];
        for (let target of newPillarLocations) {
          const summonLocation = {
            x: target.x,
            y: target.y
          };
          if (underworld.isCoordOnWallTile(summonLocation)) {
            if (prediction) {
              const WARNING = "Invalid Summon Location";
              addWarningAtMouse$4(WARNING);
            } else {
              refundLastSpell$c(state, prediction, "Invalid summon location, mana refunded.");
            }
            return state;
          }
          playDefaultSpellSFX$9(card, prediction);
          const unit2 = Unit$k.create(
            sourceUnit.id,
            summonLocation.x,
            summonLocation.y,
            Faction$d.ALLY,
            sourceUnit.info.image,
            UnitType$e.AI,
            sourceUnit.info.subtype,
            {
              ...sourceUnit.unitProps,
              healthMax: (sourceUnit.unitProps.healthMax || underworld.rules.UNIT_BASE_HEALTH) * quantity,
              health: (sourceUnit.unitProps.health || underworld.rules.UNIT_BASE_HEALTH) * quantity,
              damage: (sourceUnit.unitProps.damage || 0) * quantity,
              strength: quantity
            },
            underworld,
            prediction,
            state.casterUnit
          );
          if (prediction) {
            drawUICirclePrediction$5(unit2, 32, 16777215);
          }
          pillarExplode$2(unit2, 32, 10, underworld, prediction, state);
          if (!prediction) {
            skyBeam$3(unit2);
          }
        }
      } else {
        console.error(`Source unit ${unitId} is missing`);
      }
      return state;
    }
  }
};
async function pillarExplode$2(caster2, radius, damage2, underworld, prediction, state) {
  const units2 = underworld.getUnitsWithinDistanceOfTarget(caster2, radius, prediction).filter((u) => u.id != caster2.id).filter((u) => u.unitSourceId != "pillar");
  units2.forEach((u) => {
    takeDamage$5({
      unit: u,
      amount: damage2,
      sourceUnit: caster2,
      fromVec2: caster2
    }, underworld, prediction);
  });
  units2.forEach((u) => {
    const pushDistance = 32;
    forcePushAwayFrom$3(u, state.casterUnit, pushDistance, underworld, prediction, caster2);
  });
  underworld.getPickupsWithinDistanceOfTarget(caster2, radius, prediction).forEach((p) => {
    const pushDistance = 32;
    forcePushAwayFrom$3(p, state.casterUnit, pushDistance, underworld, prediction, caster2);
  });
}
const {
  commonTypes: commonTypes$n,
  Unit: Unit$j,
  math: math$8,
  config: config$h,
  PixiUtils: PixiUtils$9,
  moveWithCollision: moveWithCollision$5,
  cardUtils: cardUtils$h,
  cards: cards$j,
  JImage: JImage$3,
  units: units$d,
  forcePushTowards: forcePushTowards$2
} = globalThis.SpellmasonsAPI;
const { allUnits: allUnits$3 } = units$d;
const { CardCategory: CardCategory$l, CardRarity: CardRarity$k, probabilityMap: probabilityMap$k, Faction: Faction$c, UnitSubType: UnitSubType$c, UnitType: UnitType$d } = commonTypes$n;
const { takeDamage: takeDamage$4 } = Unit$j;
const { containerProjectiles: containerProjectiles$1 } = PixiUtils$9;
const { makeForceMoveProjectile: makeForceMoveProjectile$1 } = moveWithCollision$5;
const { playDefaultSpellSFX: playDefaultSpellSFX$8 } = cardUtils$h;
const { refundLastSpell: refundLastSpell$b } = cards$j;
const id$f = "Earth Push";
const defaultPushDistance$2 = 140;
const spell$k = {
  card: {
    id: id$f,
    category: CardCategory$l.Damage,
    supportQuantity: true,
    sfx: "push",
    manaCost: 15,
    healthCost: 0,
    expenseScaling: 1,
    requires: [id$g],
    probability: probabilityMap$k[CardRarity$k.COMMON],
    thumbnail: "spellmasons-mods/The_Doom_Scroll/graphics/spellIconEarthPush.png",
    description: "Launches targeted traps, pillars, and urns towards the cast location. Pillars deal 60 damage each and urns explode on collision with units.",
    ignoreRange: true,
    effect: async (state, card, quantity, underworld, prediction) => {
      let promises = [];
      const collideFnKey = id$f;
      playDefaultSpellSFX$8(card, prediction);
      const pickupTargets = state.targetedPickups.filter((p) => p.name === "Trap");
      const pillarTargets = state.targetedUnits.filter((u) => u.unitSourceId === "pillar");
      const urnTargets = state.targetedUnits.filter((u) => u.unitSourceId === "Ice Urn" || u.unitSourceId === "Explosive Urn" || u.unitSourceId === "Toxic Urn");
      if (pickupTargets.length == 0 && pillarTargets.length == 0 && urnTargets.length == 0) {
        refundLastSpell$b(state, prediction, "Target a trap, pillar, or urn");
      } else {
        if (pickupTargets.length > 0) {
          for (let pickup of pickupTargets) {
            promises.push(forcePushTowards$2(pickup, state.castLocation, defaultPushDistance$2 * 3 * quantity, underworld, prediction, state.casterUnit));
          }
        }
        if (pillarTargets.length > 0) {
          for (let pillar of pillarTargets) {
            let casterPositionAtTimeOfCast = pillar;
            let target = state.castLocation;
            let image;
            const startPoint = casterPositionAtTimeOfCast;
            const velocity = math$8.similarTriangles(target.x - startPoint.x, target.y - casterPositionAtTimeOfCast.y, math$8.distance(startPoint, target), config$h.ARROW_PROJECTILE_SPEED);
            if (!prediction) {
              image = JImage$3.create(casterPositionAtTimeOfCast, "pillar", containerProjectiles$1);
              if (image) {
                image.sprite.rotation = Math.PI / 6;
              }
            }
            const pushedObject = {
              x: casterPositionAtTimeOfCast.x,
              y: casterPositionAtTimeOfCast.y,
              radius: 1,
              inLiquid: false,
              image,
              immovable: false,
              beingPushed: false,
              debugName: "pillar_proj"
            };
            Unit$j.cleanup(pillar);
            makeForceMoveProjectile$1({
              sourceUnit: state.casterUnit,
              pushedObject,
              startPoint,
              velocity,
              piercesRemaining: 0,
              bouncesRemaining: 0,
              collidingUnitIds: [state.casterUnit.id],
              collideFnKey,
              state
            }, underworld, prediction);
          }
        }
        if (urnTargets.length > 0) {
          for (let urn of urnTargets) {
            let casterPositionAtTimeOfCast = urn;
            let target = state.castLocation;
            let image;
            const startPoint = casterPositionAtTimeOfCast;
            const velocity = math$8.similarTriangles(target.x - startPoint.x, target.y - casterPositionAtTimeOfCast.y, math$8.distance(startPoint, target), config$h.ARROW_PROJECTILE_SPEED);
            if (!prediction && urn.image) {
              image = JImage$3.load(JImage$3.serialize(urn.image), containerProjectiles$1);
              if (image) {
                image.sprite.rotation = Math.atan2(velocity.y, velocity.x);
              }
            }
            const pushedObject = {
              x: casterPositionAtTimeOfCast.x,
              y: casterPositionAtTimeOfCast.y,
              radius: 1,
              inLiquid: false,
              image,
              immovable: false,
              beingPushed: false,
              debugName: urn.unitSourceId
            };
            Unit$j.cleanup(urn);
            makeForceMoveProjectile$1({
              sourceUnit: state.casterUnit,
              pushedObject,
              startPoint,
              velocity,
              piercesRemaining: 0,
              bouncesRemaining: 0,
              collidingUnitIds: [state.casterUnit.id],
              collideFnKey,
              state
            }, underworld, prediction);
          }
        }
      }
      await Promise.all(promises);
      return state;
    }
  },
  events: {
    onProjectileCollision: ({ unit: unit2, underworld, projectile, prediction }) => {
      if (unit2) {
        if (projectile.pushedObject.debugName === "pillar_proj") {
          takeDamage$4({
            unit: unit2,
            amount: 60,
            sourceUnit: projectile.sourceUnit,
            fromVec2: projectile.startPoint,
            thinBloodLine: true
          }, underworld, prediction);
        } else if (projectile.pushedObject.debugName && projectile.pushedObject.debugName.includes("Urn")) {
          const sourceUrn = allUnits$3[projectile.pushedObject.debugName];
          const urn = Unit$j.create(projectile.pushedObject.debugName, projectile.pushedObject.x, projectile.pushedObject.y, Faction$c.ALLY, "urn_ice", UnitType$d.AI, UnitSubType$c.DOODAD, sourceUrn.unitProps, underworld, prediction, projectile.sourceUnit);
          takeDamage$4({ unit: urn, amount: urn.health, sourceUnit: projectile.sourceUnit }, underworld, prediction);
          if (urn.health > 0) {
            takeDamage$4({ unit: urn, amount: urn.health }, underworld, prediction);
          }
        }
      }
    }
  }
};
const { commonTypes: commonTypes$m, Unit: Unit$i, cardsUtil: cardsUtil$b } = globalThis.SpellmasonsAPI;
const { UnitSubType: UnitSubType$b } = commonTypes$m;
const ALTAR_UNIT_ID = "Altar";
const unit$1 = {
  id: ALTAR_UNIT_ID,
  info: {
    description: "An intricate pylon raised by a geomancer that is very mana conducive. Spells cast will automatically target this unit.",
    image: "altar",
    subtype: UnitSubType$b.DOODAD
  },
  animations: {
    idle: "altar",
    hit: "altar",
    attack: "altar",
    die: "altarDeath",
    walk: "altar"
  },
  sfx: {
    damage: "unitDamage",
    death: "decoyDeath"
  },
  unitProps: {
    damage: 0,
    attackRange: 0,
    staminaMax: 0,
    healthMax: 10,
    manaMax: 0,
    // This is critical to a decoy, it prevents it from being pushed due to unit crowding
    immovable: true,
    radius: 48,
    bloodColor: 8082207
  },
  spawnParams: {
    probability: 0,
    excludeMiniboss: true,
    excludeSummonCard: true,
    budgetCost: 0,
    unavailableUntilLevelIndex: 20
  },
  init: (unit2, underworld) => {
    Unit$i.addEvent(unit2, EVENT_REMOVE_ON_DEATH_ID);
    cardsUtil$b.getOrInitModifier(unit2, "Target Cursed", { isCurse: false, quantity: 1e4, keepOnDeath: false }, () => {
    });
    if (unit2.image) {
      unit2.image.sprite.anchor.y = 0.7;
    }
  },
  action: async (_self, _attackTargets, _underworld, _canAttackTarget) => {
  },
  getUnitAttackTargets: (unit2, underworld) => {
    return [];
  }
};
const EVENT_REMOVE_ON_DEATH_ID = "removeOnDeath";
const modifierRemoveOnDeath = {
  id: EVENT_REMOVE_ON_DEATH_ID,
  onDeath: async (unit2, underworld, prediction, sourceUnit) => {
    if (!prediction) {
      setTimeout(() => {
        Unit$i.cleanup(unit2, true);
      }, 1e3);
    }
  }
};
const {
  commonTypes: commonTypes$l,
  Unit: Unit$h,
  units: units$c,
  config: config$g,
  cards: cards$i,
  cardUtils: cardUtils$g,
  PlanningView: PlanningView$h,
  VisualEffects: VisualEffects$b,
  forcePushAwayFrom: forcePushAwayFrom$2
} = globalThis.SpellmasonsAPI;
const { CardCategory: CardCategory$k, CardRarity: CardRarity$j, probabilityMap: probabilityMap$j, Faction: Faction$b, UnitType: UnitType$c } = commonTypes$l;
const { takeDamage: takeDamage$3 } = Unit$h;
const { allUnits: allUnits$2 } = units$c;
const { skyBeam: skyBeam$2 } = VisualEffects$b;
const { refundLastSpell: refundLastSpell$a, getCurrentTargets: getCurrentTargets$d, defaultTargetsForAllowNonUnitTargetTargetingSpell: defaultTargetsForAllowNonUnitTargetTargetingSpell$6 } = cards$i;
const { playDefaultSpellSFX: playDefaultSpellSFX$7 } = cardUtils$g;
const { addWarningAtMouse: addWarningAtMouse$3, drawUICirclePrediction: drawUICirclePrediction$4 } = PlanningView$h;
const id$e = "Raise Altar";
const spell$j = {
  card: {
    id: id$e,
    category: CardCategory$k.Soul,
    sfx: "summonDecoy",
    supportQuantity: true,
    manaCost: 35,
    healthCost: 0,
    expenseScaling: 2,
    probability: probabilityMap$j[CardRarity$j.COMMON],
    thumbnail: "spellmasons-mods/The_Doom_Scroll/graphics/spellIconRaise_Altar.png",
    description: "Raise a mana conducive Altar at the target location, acting as a target for future spells cast",
    allowNonUnitTarget: true,
    effect: async (state, card, quantity, underworld, prediction) => {
      const unitId = ALTAR_UNIT_ID;
      const sourceUnit = allUnits$2[unitId];
      if (sourceUnit) {
        const summonLocation = {
          x: state.castLocation.x,
          y: state.castLocation.y
        };
        if (underworld.isCoordOnWallTile(summonLocation)) {
          if (prediction) {
            const WARNING = "Invalid Summon Location";
            addWarningAtMouse$3(WARNING);
          } else {
            refundLastSpell$a(state, prediction, "Invalid summon location, mana refunded.");
          }
          return state;
        }
        playDefaultSpellSFX$7(card, prediction);
        const unit2 = Unit$h.create(
          sourceUnit.id,
          summonLocation.x,
          summonLocation.y,
          Faction$b.ALLY,
          sourceUnit.info.image,
          UnitType$c.AI,
          sourceUnit.info.subtype,
          {
            ...sourceUnit.unitProps,
            healthMax: (sourceUnit.unitProps.healthMax || underworld.rules.UNIT_BASE_HEALTH) * quantity,
            health: (sourceUnit.unitProps.health || underworld.rules.UNIT_BASE_HEALTH) * quantity,
            damage: (sourceUnit.unitProps.damage || 0) * quantity,
            strength: quantity
          },
          underworld,
          prediction,
          state.casterUnit
        );
        if (prediction) {
          drawUICirclePrediction$4(unit2, 32, 16777215);
        }
        pillarExplode$1(unit2, 32, 10, underworld, prediction, state);
        if (!prediction) {
          skyBeam$2(unit2);
        }
      } else {
        console.error(`Source unit ${unitId} is missing`);
      }
      return state;
    }
  }
};
async function pillarExplode$1(caster2, radius, damage2, underworld, prediction, state) {
  const units2 = underworld.getUnitsWithinDistanceOfTarget(caster2, radius, prediction).filter((u) => u.id != caster2.id).filter((u) => u.unitSourceId != "pillar");
  units2.forEach((u) => {
    takeDamage$3({
      unit: u,
      amount: damage2,
      sourceUnit: caster2,
      fromVec2: caster2
    }, underworld, prediction);
  });
  units2.forEach((u) => {
    const pushDistance = 32;
    forcePushAwayFrom$2(u, state.casterUnit, pushDistance, underworld, prediction, caster2);
  });
  underworld.getPickupsWithinDistanceOfTarget(caster2, radius, prediction).forEach((p) => {
    const pushDistance = 32;
    forcePushAwayFrom$2(p, state.casterUnit, pushDistance, underworld, prediction, caster2);
  });
}
const {
  commonTypes: commonTypes$k,
  Unit: Unit$g,
  units: units$b,
  config: config$f,
  Vec: Vec$5,
  moveWithCollision: moveWithCollision$4,
  cards: cards$h,
  cardUtils: cardUtils$f,
  PlanningView: PlanningView$g,
  VisualEffects: VisualEffects$a,
  forcePushAwayFrom: forcePushAwayFrom$1
} = globalThis.SpellmasonsAPI;
const { CardCategory: CardCategory$j, CardRarity: CardRarity$i, probabilityMap: probabilityMap$i, Faction: Faction$a, UnitType: UnitType$b } = commonTypes$k;
const { takeDamage: takeDamage$2 } = Unit$g;
const { moveAlongVector: moveAlongVector$2, normalizedVector: normalizedVector$2 } = moveWithCollision$4;
const { invert: invert$2 } = Vec$5;
const { refundLastSpell: refundLastSpell$9, getCurrentTargets: getCurrentTargets$c } = cards$h;
const { playDefaultSpellSFX: playDefaultSpellSFX$6 } = cardUtils$f;
const { addWarningAtMouse: addWarningAtMouse$2, drawUICirclePrediction: drawUICirclePrediction$3 } = PlanningView$g;
const { skyBeam: skyBeam$1 } = VisualEffects$a;
const { allUnits: allUnits$1 } = units$b;
const id$d = "Raise Wall";
const baseWidth$2 = 48;
const spell$i = {
  card: {
    id: id$d,
    category: CardCategory$j.Soul,
    supportQuantity: true,
    manaCost: 30,
    healthCost: 0,
    expenseScaling: 1,
    probability: probabilityMap$i[CardRarity$i.SPECIAL],
    thumbnail: "spellmasons-mods/The_Doom_Scroll/graphics/spellIconRaise_Wall.png",
    requiresFollowingCard: false,
    description: "Raise a wall of pillars at the target location, blocking enemy movement but allowing projectiles through.",
    requires: [id$g],
    allowNonUnitTarget: true,
    effect: async (state, card, quantity, underworld, prediction, outOfRange) => {
      const unitId = "pillar";
      const sourceUnit = allUnits$1[unitId];
      const vector = normalizedVector$2(state.casterUnit, state.castLocation).vector;
      if (vector) {
        let spawnpoints = getSpawnPoints(state.castLocation, vector, baseWidth$2, quantity);
        const length = spawnpoints.length;
        if (length == 0) {
          spawnpoints.push(state.castLocation);
        }
        for (let i = 0; i < length; i++) {
          const target = spawnpoints[i];
          if (sourceUnit && target) {
            const summonLocation = {
              x: target.x,
              y: target.y
            };
            if (underworld.isCoordOnWallTile(summonLocation)) {
              if (prediction) {
                const WARNING = "Invalid Summon Location";
                addWarningAtMouse$2(WARNING);
              } else {
                refundLastSpell$9(state, prediction, "Invalid summon location, mana refunded.");
              }
              return state;
            }
            playDefaultSpellSFX$6(card, prediction);
            if (prediction) {
              drawUICirclePrediction$3(target, 32, 16777215);
            }
            const unit2 = Unit$g.create(
              sourceUnit.id,
              summonLocation.x,
              summonLocation.y,
              Faction$a.ALLY,
              sourceUnit.info.image,
              UnitType$b.AI,
              sourceUnit.info.subtype,
              {
                ...sourceUnit.unitProps,
                healthMax: sourceUnit.unitProps.healthMax || underworld.rules.UNIT_BASE_HEALTH,
                health: sourceUnit.unitProps.health || underworld.rules.UNIT_BASE_HEALTH,
                damage: (sourceUnit.unitProps.damage || 0) * quantity,
                strength: quantity
              },
              underworld,
              prediction,
              state.casterUnit
            );
            pillarExplode(unit2, 32, 10, underworld, prediction, state);
            if (!prediction) {
              skyBeam$1(unit2);
            }
          } else {
            console.error(`Source unit ${unitId} is missing`);
          }
        }
      }
      return state;
    }
  }
};
function getSpawnPoints(castLocation, vector, width, quantity) {
  let points = [];
  points.push(castLocation);
  const p1 = moveAlongVector$2(castLocation, invert$2(vector), -width);
  const p2 = moveAlongVector$2(castLocation, invert$2(vector), width);
  points.push(p1);
  points.push(p2);
  if (quantity > 1) {
    for (let i = 2; i <= quantity; i++) {
      const p3 = moveAlongVector$2(castLocation, invert$2(vector), -width * i);
      const p4 = moveAlongVector$2(castLocation, invert$2(vector), width * i);
      points.push(p3);
      points.push(p4);
    }
  }
  return points;
}
async function pillarExplode(caster2, radius, damage2, underworld, prediction, state) {
  const units2 = underworld.getUnitsWithinDistanceOfTarget(caster2, radius, prediction).filter((u) => u.id != caster2.id).filter((u) => u.unitSourceId != "pillar");
  units2.forEach((u) => {
    takeDamage$2({
      unit: u,
      amount: damage2,
      sourceUnit: caster2,
      fromVec2: caster2
    }, underworld, prediction);
  });
  units2.forEach((u) => {
    const pushDistance = 32;
    forcePushAwayFrom$1(u, state.casterUnit, pushDistance, underworld, prediction, caster2);
  });
  underworld.getPickupsWithinDistanceOfTarget(caster2, radius, prediction).forEach((p) => {
    const pushDistance = 32;
    forcePushAwayFrom$1(p, state.casterUnit, pushDistance, underworld, prediction, caster2);
  });
}
const {
  commonTypes: commonTypes$j,
  Unit: Unit$f,
  config: config$e,
  math: math$7,
  Vec: Vec$4,
  JPromise: JPromise$4,
  JAudio: JAudio$3,
  Easing: Easing$3,
  cardUtils: cardUtils$e,
  Angle,
  PlanningView: PlanningView$f,
  EffectsHeal,
  cards: cards$g
} = globalThis.SpellmasonsAPI;
const { CardCategory: CardCategory$i, CardRarity: CardRarity$h, probabilityMap: probabilityMap$h } = commonTypes$j;
const { distance: distance$1, sortCosestTo: sortCosestTo$3 } = math$7;
const { getAngleBetweenVec2s: getAngleBetweenVec2s$1 } = Vec$4;
const { healUnits } = EffectsHeal;
const { drawUICone, drawUIConePrediction } = PlanningView$f;
const { isAngleBetweenAngles } = Angle;
const { playDefaultSpellSFX: playDefaultSpellSFX$5 } = cardUtils$e;
const { getCurrentTargets: getCurrentTargets$b, defaultTargetsForAllowNonUnitTargetTargetingSpell: defaultTargetsForAllowNonUnitTargetTargetingSpell$5, addTarget: addTarget$a } = cards$g;
const bloodCurseCardId = "Blood Curse";
const sunlightId = "Sunlight";
const range$2 = 200;
const coneAngle = Math.PI / 4;
const healAmount = 20;
const spell$h = {
  card: {
    id: sunlightId,
    category: CardCategory$i.Blessings,
    supportQuantity: true,
    manaCost: 20,
    healthCost: 0,
    expenseScaling: 1,
    probability: probabilityMap$h[CardRarity$h.SPECIAL],
    thumbnail: "spellmasons-mods/The_Doom_Scroll/graphics/spellIconSunlight.png",
    requiresFollowingCard: false,
    description: "Heals 20 health to units in a cone originating from the caster. Deals 80 damage to blood cursed units.",
    allowNonUnitTarget: true,
    effect: async (state, card, quantity, underworld, prediction, outOfRange) => {
      const adjustedRadiusBoost = quantity - 1 + state.aggregator.radiusBoost;
      const depth = range$2 * (1 + 0.25 * adjustedRadiusBoost);
      const adjustedAngle = coneAngle * Math.pow(2, Math.min(quantity, 4)) / 2;
      const projectAngle = getAngleBetweenVec2s$1(state.casterUnit, state.castLocation);
      const startAngle = projectAngle + adjustedAngle / 2;
      const endAngle = projectAngle - adjustedAngle / 2;
      const target = state.casterUnit;
      const animatedCones = [];
      state.casterUnit;
      if (prediction) {
        drawUIConePrediction(target, depth, startAngle, endAngle, 16777215);
      } else {
        animatedCones.push({ origin: state.casterUnit, coneStartPoint: target, radius: depth, startAngle, endAngle });
      }
      let withinRadiusAndAngle = [];
      underworld.getPotentialTargets(
        prediction
      ).filter((t) => Unit$f.isUnit(t)).filter((t) => {
        return withinCone(state.casterUnit, target, depth, startAngle, endAngle, t);
      }).filter((e) => e !== state.casterUnit).forEach((u) => {
        if (Unit$f.isUnit(u))
          withinRadiusAndAngle.push(u);
      });
      withinRadiusAndAngle.sort(sortCosestTo$3(target));
      withinRadiusAndAngle.forEach((e) => addTarget$a(e, state, underworld, prediction));
      playDefaultSpellSFX$5(card, prediction);
      const bloodCursedUnits = withinRadiusAndAngle.filter((e) => e.modifiers[bloodCurseCardId]);
      await healUnits(bloodCursedUnits, healAmount * 3 * quantity, state.casterUnit, underworld, prediction, state);
      await healUnits(withinRadiusAndAngle, healAmount * quantity, state.casterUnit, underworld, prediction, state);
      return state;
    }
  }
};
function withinCone(origin, coneStartPoint, radius, startAngle, endAngle, target) {
  const targetAngle = getAngleBetweenVec2s$1(coneStartPoint, target);
  const distanceToConeStart = distance$1(target, coneStartPoint);
  return distanceToConeStart <= radius && (isAngleBetweenAngles(targetAngle, startAngle, endAngle) || Math.abs(endAngle - startAngle) >= 2 * Math.PI);
}
const {
  Unit: Unit$e,
  commonTypes: commonTypes$i,
  cards: cards$f,
  math: math$6
} = globalThis.SpellmasonsAPI;
const { isUnit: isUnit$5 } = Unit$e;
const { CardCategory: CardCategory$h, CardRarity: CardRarity$g, probabilityMap: probabilityMap$g } = commonTypes$i;
const { getCurrentTargets: getCurrentTargets$a, addTarget: addTarget$9 } = cards$f;
const { sortCosestTo: sortCosestTo$2 } = math$6;
const id$c = "Target Pillar";
const spell$g = {
  card: {
    id: id$c,
    category: CardCategory$h.Targeting,
    supportQuantity: true,
    manaCost: 10,
    healthCost: 0,
    expenseScaling: 1,
    probability: probabilityMap$g[CardRarity$g.SPECIAL],
    thumbnail: "spellmasons-mods/The_Doom_Scroll/graphics/spellIconTargetPillar.png",
    requiresFollowingCard: true,
    requires: [id$g],
    ignoreRange: true,
    description: "Adds 5 of the closest pillars per stack as targets for subsequent spells.",
    allowNonUnitTarget: true,
    effect: async (state, card, quantity, underworld, prediction, outOfRange) => {
      let targets = getCurrentTargets$a(state);
      const pillarsPerStack = 5;
      targets = targets.length ? targets : [state.castLocation];
      const potentialTargets = underworld.getPotentialTargets(prediction).filter((t) => isUnit$5(t) && t.unitSourceId === "pillar").sort(sortCosestTo$2(state.casterUnit)).slice(0, pillarsPerStack * quantity);
      const newTargets = potentialTargets;
      for (let newTarget of newTargets) {
        addTarget$9(newTarget, state, underworld, prediction);
      }
      return state;
    }
  }
};
const {
  commonTypes: commonTypes$h,
  math: math$5,
  colors,
  forcePushTowards: forcePushTowards$1,
  cardUtils: cardUtils$d,
  cards: cards$e,
  Unit: Unit$d,
  JAudio: JAudio$2,
  PlanningView: PlanningView$e,
  ParticleCollection: ParticleCollection$1,
  Particles
} = globalThis.SpellmasonsAPI;
const { CardCategory: CardCategory$g, CardRarity: CardRarity$f, probabilityMap: probabilityMap$f } = commonTypes$h;
const { distance } = math$5;
const { playDefaultSpellSFX: playDefaultSpellSFX$4 } = cardUtils$d;
const { addTarget: addTarget$8 } = cards$e;
const { takeDamage: takeDamage$1 } = Unit$d;
const { playSFXKey: playSFXKey$2 } = JAudio$2;
const { drawUICirclePrediction: drawUICirclePrediction$2 } = PlanningView$e;
const { makeParticleExplosion } = ParticleCollection$1;
const { createParticleTexture, logNoTextureWarning } = Particles;
const targetStompCardId = "Target Stomp";
const baseExplosionRadius = 140;
const stompMoveDistance = 100;
const stompRadius = 115;
const spell$f = {
  card: {
    id: targetStompCardId,
    category: CardCategory$g.Targeting,
    supportQuantity: true,
    allowNonUnitTarget: true,
    ignoreRange: true,
    sfx: "stomp",
    manaCost: 10,
    healthCost: 0,
    expenseScaling: 1,
    probability: probabilityMap$f[CardRarity$f.RARE],
    thumbnail: "spellmasons-mods/The_Doom_Scroll/graphics/spellIconTargetStomp.png",
    description: "Jump to a location and stomp, pulling enemies towards you and adds them as a target to subsequent spells.",
    effect: async (state, card, quantity, underworld, prediction) => {
      const target = state.castLocation;
      if (target) {
        if (!prediction && !globalThis.headless) {
          const delayBeforeDash = 500;
          playDefaultSpellSFX$4(card, prediction);
          makeStompWindupParticles(state.casterUnit, prediction);
          await new Promise((resolve) => setTimeout(resolve, delayBeforeDash));
        }
        const moveDistance = Math.min(distance(state.casterUnit, target), stompMoveDistance * quantity);
        await forcePushTowards$1(state.casterUnit, target, moveDistance, underworld, prediction, state.casterUnit);
        const radius = stompRadius * (1 + 0.25 * state.aggregator.radiusBoost);
        if (prediction) {
          drawUICirclePrediction$2(state.casterUnit, radius, colors.errorRed, "Stomp Radius");
        } else if (!globalThis.headless) {
          makeStompExplodeParticles2(state.casterUnit, radius, true, prediction);
          playSFXKey$2("bloatExplosion");
        }
        targetStompExplode(state.casterUnit, radius, 0, stompRadius, underworld, prediction, state);
      }
      return state;
    }
  }
};
async function targetStompExplode(caster2, radius, damage2, pushDistance, underworld, prediction, state) {
  const units2 = underworld.getUnitsWithinDistanceOfTarget(caster2, radius, prediction).filter((u) => u.id != caster2.id);
  units2.forEach((u) => {
    takeDamage$1({
      unit: u,
      amount: damage2,
      sourceUnit: caster2,
      fromVec2: caster2
    }, underworld, prediction);
  });
  units2.forEach((u) => {
    forcePushTowards$1(u, caster2, pushDistance, underworld, prediction, caster2);
  });
  units2.forEach((u) => {
    addTarget$8(u, state, underworld, prediction);
  });
  underworld.getPickupsWithinDistanceOfTarget(caster2, radius, prediction).forEach((p) => {
    forcePushTowards$1(p, caster2, pushDistance, underworld, prediction, caster2);
  });
}
function makeStompExplodeParticles2(position, radius, big, prediction) {
  if (prediction || globalThis.headless) {
    return;
  }
  const explosionSize = radius / baseExplosionRadius * (big ? 1 : 0.7);
  makeParticleExplosion(position, explosionSize, colors.trueGrey, colors.trueWhite, prediction);
}
function makeStompWindupParticles(position, prediction) {
  if (prediction || globalThis.headless) {
    return;
  }
  const texture = createParticleTexture();
  if (!texture) {
    logNoTextureWarning("makeStompParticleWindup");
    return;
  }
}
const {
  commonTypes: commonTypes$g,
  config: config$d,
  Vec: Vec$3,
  JPromise: JPromise$3,
  JAudio: JAudio$1,
  Polygon2: Polygon2$1,
  Easing: Easing$2,
  cardUtils: cardUtils$c,
  cards: cards$d,
  moveWithCollision: moveWithCollision$3,
  forcePushToDestination: forcePushToDestination$1,
  PlanningView: PlanningView$d
} = globalThis.SpellmasonsAPI;
const { CardCategory: CardCategory$f, CardRarity: CardRarity$e, probabilityMap: probabilityMap$e } = commonTypes$g;
const { raceTimeout: raceTimeout$3 } = JPromise$3;
const { playDefaultSpellSFX: playDefaultSpellSFX$3 } = cardUtils$c;
const { easeOutCubic: easeOutCubic$2 } = Easing$2;
const { playSFXKey: playSFXKey$1 } = JAudio$1;
const { invert: invert$1 } = Vec$3;
const { moveAlongVector: moveAlongVector$1, normalizedVector: normalizedVector$1 } = moveWithCollision$3;
const { drawUIPolyPrediction: drawUIPolyPrediction$1 } = PlanningView$d;
const { isVec2InsidePolygon: isVec2InsidePolygon$1 } = Polygon2$1;
const windTunnelId = "Wind Tunnel";
const defaultPushDistance$1 = 140;
const range$1 = 250;
const baseWidth$1 = 20;
const timeoutMsAnimation$2 = 2e3;
const spell$e = {
  card: {
    id: windTunnelId,
    category: CardCategory$f.Movement,
    supportQuantity: true,
    manaCost: 20,
    healthCost: 0,
    expenseScaling: 1,
    probability: probabilityMap$e[CardRarity$e.SPECIAL],
    thumbnail: "spellmasons-mods/The_Doom_Scroll/graphics/spellIconWind_Tunnel.png",
    requiresFollowingCard: false,
    description: "Pushes targets in a column away from the caster.",
    allowNonUnitTarget: true,
    effect: async (state, card, quantity, underworld, prediction, outOfRange) => {
      const adjustedRadiusBoost = quantity - 1 + state.aggregator.radiusBoost;
      const depth = range$1 * (1 + 0.5 * adjustedRadiusBoost);
      const width = baseWidth$1 * Math.pow(2, Math.min(quantity, 2)) / 2;
      const vector = normalizedVector$1(state.casterUnit, state.castLocation).vector || { x: 0, y: 0 };
      const animateColumns = [];
      const location = state.casterUnit;
      const targetingColumn = getColumnPoints$1(location, vector, width, depth);
      if (prediction) {
        drawUIPolyPrediction$1(targetingColumn, 16777215);
      } else {
        animateColumns.push({ castLocation: location, vector, width, depth });
      }
      const withinColumn = underworld.getPotentialTargets(
        prediction
      ).filter((t) => {
        return isVec2InsidePolygon$1(t, targetingColumn);
      });
      if (!prediction) {
        await animate$1(animateColumns, underworld, prediction);
      }
      let promises = [];
      playDefaultSpellSFX$3(card, prediction);
      for (let entity of withinColumn) {
        if (entity != state.casterUnit) {
          promises.push(forcePushToDestination$1(entity, moveAlongVector$1(entity, vector, defaultPushDistance$1 * quantity), 1, underworld, prediction, state.casterUnit));
        }
      }
      await Promise.all(promises);
      return state;
    }
  }
};
function getColumnPoints$1(castLocation, vector, width, depth) {
  const p1 = moveAlongVector$1(castLocation, invert$1(vector), -width);
  const p2 = moveAlongVector$1(castLocation, invert$1(vector), width);
  const p3 = moveAlongVector$1(p2, vector, depth);
  const p4 = moveAlongVector$1(p1, vector, depth);
  return [p1, p2, p3, p4];
}
async function animate$1(columns, underworld, prediction) {
  if (globalThis.headless || prediction) {
    return Promise.resolve();
  }
  if (columns.length == 0) {
    return Promise.resolve();
  }
  const entitiesTargeted = [];
  playSFXKey$1("targeting");
  return raceTimeout$3(timeoutMsAnimation$2, "animatedExpand", new Promise((resolve) => {
    animateFrame$2(columns, Date.now(), entitiesTargeted, underworld, resolve)();
  })).then(() => {
    var _a;
    (_a = globalThis.predictionGraphicsGreen) == null ? void 0 : _a.clear();
  });
}
const millisToGrow$2 = 1e3;
function animateFrame$2(columns, startTime, entitiesTargeted, underworld, resolve) {
  return function animateFrameInner() {
    if (globalThis.predictionGraphicsGreen) {
      globalThis.predictionGraphicsGreen.clear();
      const now = Date.now();
      const timeDiff = now - startTime;
      for (let column of columns) {
        const { castLocation, vector, width, depth } = column;
        const animatedDepth = depth * easeOutCubic$2(Math.min(1, timeDiff / millisToGrow$2));
        const targetingColumn = getColumnPoints$1(castLocation, vector, width, animatedDepth);
        globalThis.predictionGraphicsGreen.lineStyle(2, 16777215, 1);
        globalThis.predictionGraphicsGreen.drawPolygon(targetingColumn);
        const withinColumn = underworld.getPotentialTargets(
          false
        ).filter((t) => {
          return isVec2InsidePolygon$1(t, targetingColumn);
        });
        withinColumn.forEach((v) => {
          var _a;
          if (!entitiesTargeted.includes(v)) {
            entitiesTargeted.push(v);
            playSFXKey$1("targetAquired");
          }
          (_a = globalThis.predictionGraphicsGreen) == null ? void 0 : _a.drawCircle(v.x, v.y, config$d.COLLISION_MESH_RADIUS);
        });
      }
      if (timeDiff > millisToGrow$2) {
        resolve();
        return;
      } else {
        requestAnimationFrame(animateFrame$2(columns, startTime, entitiesTargeted, underworld, resolve));
      }
    } else {
      resolve();
    }
  };
}
const {
  commonTypes: commonTypes$f,
  config: config$c,
  Vec: Vec$2,
  JPromise: JPromise$2,
  JAudio,
  Polygon2,
  Easing: Easing$1,
  cardUtils: cardUtils$b,
  cards: cards$c,
  moveWithCollision: moveWithCollision$2,
  forcePushToDestination,
  PlanningView: PlanningView$c
} = globalThis.SpellmasonsAPI;
const { CardCategory: CardCategory$e, CardRarity: CardRarity$d, probabilityMap: probabilityMap$d } = commonTypes$f;
const { raceTimeout: raceTimeout$2 } = JPromise$2;
const { playDefaultSpellSFX: playDefaultSpellSFX$2 } = cardUtils$b;
const { easeOutCubic: easeOutCubic$1 } = Easing$1;
const { getCurrentTargets: getCurrentTargets$9, defaultTargetsForAllowNonUnitTargetTargetingSpell: defaultTargetsForAllowNonUnitTargetTargetingSpell$4 } = cards$c;
const { playSFXKey } = JAudio;
const { invert } = Vec$2;
const { moveAlongVector, normalizedVector } = moveWithCollision$2;
const { drawUIPolyPrediction } = PlanningView$c;
const { isVec2InsidePolygon } = Polygon2;
const id$b = "Wind Explosion";
const defaultPushDistance = 140;
const range = 250;
const baseWidth = 20;
const timeoutMsAnimation$1 = 2e3;
const spell$d = {
  card: {
    id: id$b,
    category: CardCategory$e.Movement,
    supportQuantity: true,
    manaCost: 30,
    healthCost: 0,
    expenseScaling: 1,
    requires: [windTunnelId],
    probability: probabilityMap$d[CardRarity$d.SPECIAL],
    thumbnail: "spellmasons-mods/The_Doom_Scroll/graphics/spellIconWind_Explosion.png",
    requiresFollowingCard: false,
    description: "Creates a wind tunnel pointing at each target.",
    allowNonUnitTarget: true,
    effect: async (state, card, quantity, underworld, prediction, outOfRange) => {
      const adjustedRadiusBoost = quantity - 1 + state.aggregator.radiusBoost;
      const depth = range * (1 + 0.5 * adjustedRadiusBoost);
      const width = baseWidth * Math.pow(2, Math.min(quantity, 2)) / 2;
      const targets = getCurrentTargets$9(state);
      const animateColumns = [];
      let promises = [];
      for (let target of targets) {
        if (!target) {
          continue;
        }
        const normVec = normalizedVector(state.casterUnit, target).vector;
        if (!normVec)
          continue;
        const vector = normVec;
        const targetingColumn = getColumnPoints(state.casterUnit, vector, width, depth);
        if (prediction) {
          drawUIPolyPrediction(targetingColumn, 16777215);
        } else {
          animateColumns.push({ castLocation: target, vector, width, depth });
        }
        const withinColumn = underworld.getPotentialTargets(
          prediction
        ).filter((t) => {
          return isVec2InsidePolygon(t, targetingColumn);
        });
        playDefaultSpellSFX$2(card, prediction);
        for (let entity of withinColumn) {
          if (entity != state.casterUnit) {
            promises.push(forcePushToDestination(entity, moveAlongVector(entity, vector, defaultPushDistance * quantity), 1 + adjustedRadiusBoost, underworld, prediction, state.casterUnit));
          }
        }
      }
      if (!prediction) {
        await animate(animateColumns, underworld, prediction);
      }
      await Promise.all(promises);
      return state;
    }
  }
};
function getColumnPoints(castLocation, vector, width, depth) {
  const p1 = moveAlongVector(castLocation, invert(vector), -width);
  const p2 = moveAlongVector(castLocation, invert(vector), width);
  const p3 = moveAlongVector(p2, vector, depth);
  const p4 = moveAlongVector(p1, vector, depth);
  return [p1, p2, p3, p4];
}
async function animate(columns, underworld, prediction) {
  if (globalThis.headless || prediction) {
    return Promise.resolve();
  }
  if (columns.length == 0) {
    return Promise.resolve();
  }
  const entitiesTargeted = [];
  playSFXKey("targeting");
  return raceTimeout$2(timeoutMsAnimation$1, "animatedExpand", new Promise((resolve) => {
    animateFrame$1(columns, Date.now(), entitiesTargeted, underworld, resolve)();
  })).then(() => {
    var _a;
    (_a = globalThis.predictionGraphicsGreen) == null ? void 0 : _a.clear();
  });
}
const millisToGrow$1 = 1e3;
function animateFrame$1(columns, startTime, entitiesTargeted, underworld, resolve) {
  return function animateFrameInner() {
    if (globalThis.predictionGraphicsGreen) {
      globalThis.predictionGraphicsGreen.clear();
      const now = Date.now();
      const timeDiff = now - startTime;
      for (let column of columns) {
        const { castLocation, vector, width, depth } = column;
        const animatedDepth = depth * easeOutCubic$1(Math.min(1, timeDiff / millisToGrow$1));
        const targetingColumn = getColumnPoints(castLocation, vector, width, animatedDepth);
        globalThis.predictionGraphicsGreen.lineStyle(2, 16777215, 1);
        globalThis.predictionGraphicsGreen.drawPolygon(targetingColumn);
        const withinColumn = underworld.getPotentialTargets(
          false
        ).filter((t) => {
          return isVec2InsidePolygon(t, targetingColumn);
        });
        withinColumn.forEach((v) => {
          var _a;
          if (!entitiesTargeted.includes(v)) {
            entitiesTargeted.push(v);
            playSFXKey("targetAquired");
          }
          (_a = globalThis.predictionGraphicsGreen) == null ? void 0 : _a.drawCircle(v.x, v.y, config$c.COLLISION_MESH_RADIUS);
        });
      }
      if (timeDiff > millisToGrow$1) {
        resolve();
        return;
      } else {
        requestAnimationFrame(animateFrame$1(columns, startTime, entitiesTargeted, underworld, resolve));
      }
    } else {
      resolve();
    }
  };
}
const { commonTypes: commonTypes$e } = globalThis.SpellmasonsAPI;
const { UnitSubType: UnitSubType$a } = commonTypes$e;
const unit = {
  id: "pillar",
  info: {
    description: "An earthen pillar raised by a geomancer that blocks the path of enemies. Will not block projectiles.",
    image: "pillar",
    subtype: UnitSubType$a.DOODAD
  },
  animations: {
    idle: "pillar",
    hit: "pillar",
    attack: "pillar",
    die: "pillarDeath",
    walk: "pillar"
  },
  sfx: {
    damage: "unitDamage",
    death: "decoyDeath"
  },
  unitProps: {
    damage: 0,
    attackRange: 0,
    staminaMax: 0,
    healthMax: 150,
    manaMax: 0,
    // This is critical to a decoy, it prevents it from being pushed due to unit crowding
    immovable: true,
    radius: 48,
    bloodColor: 8082207
  },
  spawnParams: {
    probability: 0,
    excludeMiniboss: true,
    excludeSummonCard: true,
    budgetCost: 0,
    unavailableUntilLevelIndex: 20
  },
  init: (unit2, underworld) => {
    if (unit2.image) {
      unit2.image.sprite.anchor.y = 0.7;
    }
  },
  action: async (_self, _attackTargets, _underworld, _canAttackTarget) => {
  },
  getUnitAttackTargets: (unit2, underworld) => {
    return [];
  }
};
const mod$5 = {
  modName: "The Doom Scroll",
  author: "Bug Jones, Dorioso Aytario",
  description: "Adds a variety of interesting new cards to support existing builds as well as introducing a new build.",
  screenshot: "spellmasons-mods/The_Doom_Scroll/graphics/Doom_Scroll.png",
  spells: [
    spell$p,
    spell$o,
    spell$m,
    spell$k,
    spell$l,
    spell$j,
    spell$i,
    spell$j,
    spell$n,
    spell$h,
    spell$g,
    spell$f,
    spell$d,
    spell$e,
    spell$n
  ],
  units: [
    unit,
    unit$1
  ],
  events: [modifierRemoveOnDeath],
  spritesheet: "spellmasons-mods/The_Doom_Scroll/graphics/spritesheet.json"
};
const {
  Unit: Unit$c,
  config: config$b,
  cardsUtil: cardsUtil$a,
  commonTypes: commonTypes$d,
  math: math$4,
  Easing,
  PlanningView: PlanningView$b,
  JPromise: JPromise$1,
  cards: cards$b
} = globalThis.SpellmasonsAPI;
const { CardCategory: CardCategory$d, CardRarity: CardRarity$c, probabilityMap: probabilityMap$c } = commonTypes$d;
const { sortCosestTo: sortCosestTo$1 } = math$4;
const { raceTimeout: raceTimeout$1 } = JPromise$1;
const { easeOutCubic } = Easing;
const { drawUICirclePrediction: drawUICirclePrediction$1 } = PlanningView$b;
const { defaultTargetsForAllowNonUnitTargetTargetingSpell: defaultTargetsForAllowNonUnitTargetTargetingSpell$3, getCurrentTargets: getCurrentTargets$8 } = cards$b;
const SubmergeId = "Submerge";
const timeoutMsAnimation = 2e3;
const id$a = "Bubble Burst";
const baseRadius$1 = 100;
const spell$c = {
  card: {
    id: id$a,
    category: CardCategory$d.Damage,
    supportQuantity: false,
    manaCost: 60,
    healthCost: 0,
    expenseScaling: 1,
    probability: probabilityMap$c[CardRarity$c.RARE],
    thumbnail: "spellmasons-mods/RunicAlphabet/graphics/spellIconBubbleBurst.png",
    requiresFollowingCard: false,
    description: "Summons a damaging bubble that pops and deals liquid damage to all units within radius.",
    allowNonUnitTarget: true,
    effect: async (state, card, quantity, underworld, prediction, outOfRange) => {
      const adjustedRange = baseRadius$1 * (1 + 0.5 * state.aggregator.radiusBoost);
      let targets = getCurrentTargets$8(state);
      const length = targets.length;
      const animateCircles = [];
      let bubbleBoys = [];
      for (let i = 0; i < length; i++) {
        const target = targets[i];
        if (!target) {
          continue;
        }
        if (prediction) {
          drawUICirclePrediction$1(target, adjustedRange, 16777215, !outOfRange ? "Bubble Radius" : void 0);
        } else {
          animateCircles.push({ pos: target, radius: adjustedRange });
        }
        const withinRadius = underworld.getUnitsWithinDistanceOfTarget(
          target,
          adjustedRange,
          prediction
        );
        withinRadius.sort(sortCosestTo$1(target));
        withinRadius.forEach((e) => bubbleBoys.push(e));
      }
      for (let unit2 of bubbleBoys) {
        let submerged = false;
        if (unit2.modifiers && unit2.modifiers[SubmergeId]) {
          submerged = true;
          Unit$c.removeModifier(unit2, SubmergeId, underworld);
        }
        Unit$c.addModifier(unit2, SubmergeId, underworld, prediction);
        if (!submerged) {
          Unit$c.removeModifier(unit2, SubmergeId, underworld);
        }
      }
      await animateTargetCircle$1(animateCircles, underworld, prediction);
      return state;
    }
  }
};
async function animateTargetCircle$1(circles, underworld, prediction, omitTargets = []) {
  if (globalThis.headless || prediction) {
    return Promise.resolve();
  }
  if (circles.length == 0) {
    return Promise.resolve();
  }
  const entitiesTargeted = [];
  return raceTimeout$1(timeoutMsAnimation, "animatedExpand", new Promise((resolve) => {
    animateFrame(circles, Date.now(), entitiesTargeted, underworld, resolve, omitTargets)();
  })).then(() => {
    var _a;
    (_a = globalThis.predictionGraphicsBlue) == null ? void 0 : _a.clear();
  });
}
const millisToGrow = 500;
function animateFrame(circles, startTime, entitiesTargeted, underworld, resolve, omitTargets = []) {
  return function animateFrameInner() {
    if (globalThis.predictionGraphicsBlue) {
      globalThis.predictionGraphicsBlue.clear();
      globalThis.predictionGraphicsBlue.lineStyle(2, 16777215, 1);
      const now = Date.now();
      const timeDiff = now - startTime;
      for (let circle of circles) {
        const { pos, radius } = circle;
        const animatedRadius = radius * easeOutCubic(Math.min(1, timeDiff / millisToGrow));
        globalThis.predictionGraphicsBlue.drawCircle(pos.x, pos.y, animatedRadius);
        globalThis.predictionGraphicsBlue.endFill();
        const withinRadius = underworld.getEntitiesWithinDistanceOfTarget(
          pos,
          animatedRadius,
          false
        );
        withinRadius.forEach((v) => {
          var _a;
          if (omitTargets.includes(v)) {
            return;
          }
          if (!entitiesTargeted.includes(v)) {
            entitiesTargeted.push(v);
          }
          (_a = globalThis.predictionGraphicsBlue) == null ? void 0 : _a.drawCircle(v.x, v.y, config$b.COLLISION_MESH_RADIUS);
        });
      }
      if (timeDiff > millisToGrow) {
        resolve();
        return;
      } else {
        requestAnimationFrame(animateFrame(circles, startTime, entitiesTargeted, underworld, resolve));
      }
    } else {
      resolve();
    }
  };
}
const {
  Pickup,
  Unit: Unit$b,
  commonTypes: commonTypes$c,
  cardsUtil: cardsUtil$9
} = globalThis.SpellmasonsAPI;
const { CardCategory: CardCategory$c, CardRarity: CardRarity$b, probabilityMap: probabilityMap$b } = commonTypes$c;
const { getOrInitModifier: getOrInitModifier$3 } = cardsUtil$9;
const id$9 = "Ephemerate";
function add$2(unit2, underworld, prediction, quantity, extra) {
  getOrInitModifier$3(unit2, id$9, {
    isCurse: false,
    quantity,
    originalQuantity: quantity
  }, () => {
    Unit$b.addEvent(unit2, id$9);
  });
}
const spell$b = {
  card: {
    id: id$9,
    category: CardCategory$c.Movement,
    manaCost: 30,
    healthCost: 0,
    expenseScaling: 1,
    probability: probabilityMap$b[CardRarity$b.FORBIDDEN],
    thumbnail: "spellmasons-mods/RunicAlphabet/graphics/spellIconEphemerate.png",
    description: `Causes the caster to phase out of reality, allowing them to phase back in anywhere on the map. Warning: Excessive warping may incur true damage to the caster.`,
    allowNonUnitTarget: true,
    supportQuantity: true,
    effect: async (state, card, quantity, underworld, prediction) => {
      const pickupSource = Pickup.pickups.find((p) => p.name == Pickup.PORTAL_YELLOW_NAME);
      if (pickupSource) {
        if (state.casterPlayer)
          ;
        Pickup.create({
          pos: state.casterUnit,
          pickupSource,
          logSource: "ephemerate.ts"
        }, underworld, prediction);
      }
      if (state.casterPlayer && quantity >= 2) {
        Unit$b.addModifier(state.casterUnit, id$9, underworld, prediction, quantity - 1);
      }
      return state;
    }
  },
  modifiers: {
    add: add$2
  },
  events: {
    onSpawn: (unit2, underworld, prediction) => {
      const pickupSource = Pickup.pickups.find((p) => p.name == Pickup.PORTAL_YELLOW_NAME);
      const modifier = unit2.modifiers[id$9];
      if (pickupSource && modifier && modifier.quantity >= 0) {
        modifier.quantity -= 1;
        if (modifier.originalQuantity >= 3 && modifier.originalQuantity - modifier.quantity >= 3) {
          Unit$b.takeDamage({ unit: unit2, amount: 10 * (modifier.originalQuantity - modifier.quantity), pureDamage: true }, underworld, prediction);
        }
        if (modifier.quantity >= 0) {
          Pickup.create({
            pos: unit2,
            pickupSource,
            logSource: "ephemerate.ts"
          }, underworld, prediction);
        }
      } else if (modifier && modifier.quantity <= 0) {
        Unit$b.removeModifier(unit2, id$9, underworld);
      }
    }
  }
};
const shieldId = "shield";
const freezeCardId$1 = "freeze";
const {
  FloatingText: FloatingText$2,
  Unit: Unit$a,
  Upgrade,
  JImage: JImage$2,
  cardsUtil: cardsUtil$8,
  JPromise,
  cardUtils: cardUtils$a,
  forcePushAwayFrom,
  forcePushTowards,
  commonTypes: commonTypes$b,
  CardUI: CardUI$1,
  explode,
  PlanningView: PlanningView$a,
  units: units$a,
  rand: rand$a,
  ParticleCollection
} = globalThis.SpellmasonsAPI;
const { getOrInitModifier: getOrInitModifier$2 } = cardsUtil$8;
const { CardCategory: CardCategory$b, UnitType: UnitType$a } = commonTypes$b;
const { drawUICircle } = PlanningView$a;
const { raceTimeout } = JPromise;
const { randInt: randInt$1 } = rand$a;
const { takeDamage } = Unit$a;
const HardLandingId = "Hard Landing";
const modifierHardLanding = {
  id: HardLandingId,
  description: "Deals damage and does knockback upon spawning.",
  _costPerUpgrade: 70,
  unitOfMeasure: "Damage",
  quantityPerUpgrade: 20,
  stage: "Amount Flat",
  add: (unit2, underworld, prediction, quantity = 1) => {
    getOrInitModifier$2(unit2, HardLandingId, { isCurse: false, quantity, keepOnDeath: true }, () => {
      Unit$a.addEvent(unit2, HardLandingId);
    });
  }
};
const vampirismId = "Vampirism";
const modifierVampirism = {
  id: vampirismId,
  description: "Permanent Blood Curse, Gain Lifesteal",
  unitOfMeasure: "% Healing",
  stage: "Amount Multiplier",
  _costPerUpgrade: 70,
  quantityPerUpgrade: 20,
  maxUpgradeCount: 5,
  add: (unit2, underworld, prediction, quantity = 1) => {
    getOrInitModifier$2(unit2, vampirismId, { isCurse: false, quantity, keepOnDeath: true }, () => {
      Unit$a.addEvent(unit2, vampirismId);
    });
    getOrInitModifier$2(unit2, "Blood Curse", { isCurse: true, quantity, keepOnDeath: true }, () => {
      Unit$a.addModifier(unit2, "Blood Curse", underworld, prediction, 1);
      Unit$a.addEvent(unit2, "Blood Curse");
    });
  }
};
const acrobaticsId = "Acrobatics";
const modifierAcrobatics = {
  id: acrobaticsId,
  description: "Movement spells now cost Stamina instead of Mana",
  _costPerUpgrade: 200,
  quantityPerUpgrade: 1,
  maxUpgradeCount: 1,
  add: (unit2, underworld, prediction, quantity = 1) => {
    getOrInitModifier$2(unit2, acrobaticsId, { isCurse: false, quantity, keepOnDeath: true }, () => {
      Unit$a.addEvent(unit2, acrobaticsId);
    });
  }
};
const safetyNumbersId = "Safety in Numbers";
const modifierSafetyNumbers = {
  id: safetyNumbersId,
  description: "Grants a shield to allies within radius based on how many allies are nearby at the end of your turn",
  unitOfMeasure: "shield per ally affected",
  _costPerUpgrade: 150,
  quantityPerUpgrade: 10,
  maxUpgradeCount: 1,
  add: (unit2, underworld, prediction, quantity = 1) => {
    getOrInitModifier$2(unit2, safetyNumbersId, { isCurse: false, quantity, keepOnDeath: true }, () => {
      Unit$a.addEvent(unit2, safetyNumbersId);
    });
  }
};
const nimbleId = "Nimble";
const modifierNimble = {
  id: nimbleId,
  description: "Gain 10% increased movement speed per stack",
  _costPerUpgrade: 10,
  add: (unit2, underworld, prediction, quantity = 1) => {
    const player = underworld.players.find((p) => p.unit == unit2);
    if (player) {
      getOrInitModifier$2(unit2, nimbleId, { isCurse: false, quantity, keepOnDeath: true }, () => {
      });
      unit2.moveSpeed *= 1 + 0.1 * quantity;
    } else {
      console.error(`Cannot add rune ${nimbleId}, no player is associated with unit`);
    }
  }
};
const meanderId = "Meander";
const modifierMeander = {
  id: meanderId,
  description: "Decrease movement speed by 10% per stack",
  _costPerUpgrade: -10,
  maxUpgradeCount: 10,
  isMalady: true,
  add: (unit2, underworld, prediction, quantity = 1) => {
    const player = underworld.players.find((p) => p.unit == unit2);
    if (player) {
      getOrInitModifier$2(unit2, meanderId, { isCurse: false, quantity, keepOnDeath: true }, () => {
      });
      unit2.moveSpeed *= 1 - 0.1 * quantity;
    } else {
      console.error(`Cannot add rune ${meanderId}, no player is associated with unit`);
    }
  }
};
const BlurId = "Blur";
const modifierBlur = {
  id: BlurId,
  unitOfMeasure: "% Nullification chance",
  description: "Gain a % chance to avoid damage",
  _costPerUpgrade: 70,
  quantityPerUpgrade: 1,
  maxUpgradeCount: 5,
  add: (unit2, underworld, prediction, quantity = 1) => {
    getOrInitModifier$2(unit2, BlurId, { isCurse: false, quantity, keepOnDeath: true }, () => {
      Unit$a.addEvent(unit2, BlurId);
    });
  }
};
const heavyHitterId = "Heavy Hitter";
const modifierHeavyHitter = {
  id: heavyHitterId,
  description: "Doubles the cost of damage spells, but they now deal damage again as pure damage",
  _costPerUpgrade: 150,
  quantityPerUpgrade: 1,
  maxUpgradeCount: 1,
  omitForWizardType: ["Deathmason"],
  add: (unit2, underworld, prediction, quantity = 1) => {
    getOrInitModifier$2(unit2, heavyHitterId, { isCurse: false, quantity, keepOnDeath: true }, () => {
      Unit$a.addEvent(unit2, heavyHitterId);
    });
  }
};
const frozenSolidId = "Frozen Solid";
const modifierFrozenSolid = {
  id: frozenSolidId,
  description: "Take no damage when frozen",
  stage: "Amount Override",
  _costPerUpgrade: 100,
  maxUpgradeCount: 1,
  add: (unit2, underworld, prediction, quantity = 1) => {
    getOrInitModifier$2(unit2, frozenSolidId, { isCurse: false, quantity, keepOnDeath: true }, () => {
      Unit$a.addEvent(unit2, frozenSolidId);
    });
  }
};
const effervescenceId = "Effervescence";
const modifierEffervescence = {
  id: effervescenceId,
  description: "Liquid now heals you instead of dealing damage",
  _costPerUpgrade: 120,
  unitOfMeasure: "% Healing",
  quantityPerUpgrade: 30,
  maxUpgradeCount: 3,
  add: (unit2, underworld, prediction, quantity = 1) => {
    getOrInitModifier$2(unit2, effervescenceId, { isCurse: false, quantity, keepOnDeath: true }, () => {
      Unit$a.addEvent(unit2, effervescenceId);
    });
  }
};
const magnetismId = "Magnetism";
const modifierMagnetism = {
  id: magnetismId,
  description: "Pull enemies closer to you on turn start",
  _costPerUpgrade: 30,
  unitOfMeasure: "Units",
  quantityPerUpgrade: 1,
  maxUpgradeCount: 3,
  add: (unit2, underworld, prediction, quantity = 1) => {
    getOrInitModifier$2(unit2, magnetismId, { isCurse: false, quantity, keepOnDeath: true }, () => {
      Unit$a.addEvent(unit2, magnetismId);
    });
  }
};
const selectiveMemoryId = "Selective Memory";
const modifierSelectiveMemory = {
  id: selectiveMemoryId,
  description: "One random spell in your inventory is disabled each level.",
  _costPerUpgrade: -100,
  maxUpgradeCount: 1,
  stage: "Reactive Effects",
  isMalady: true,
  add: (unit2, underworld, prediction, quantity = 1) => {
    getOrInitModifier$2(unit2, selectiveMemoryId, { isCurse: false, quantity, keepOnDeath: true, lastLevel: 0, stolenSpell: "null" }, () => {
      Unit$a.addEvent(unit2, selectiveMemoryId);
    });
    const player = underworld.players.find((p) => p.unit == unit2);
    if (player && unit2.modifiers[selectiveMemoryId]) {
      if (!player.disabledCards) {
        player.disabledCards = [];
      }
      const availableSpells = player.inventory.filter((card) => !player.disabledCards.includes(card));
      const spellStealIndex = randInt$1(0, player.inventory.length - 1);
      if (availableSpells[spellStealIndex]) {
        player.disabledCards.push(availableSpells[spellStealIndex]);
        if (unit2.modifiers[selectiveMemoryId]) {
          unit2.modifiers[selectiveMemoryId].stolenSpell = availableSpells[spellStealIndex];
        }
      }
      CardUI$1.recalcPositionForCards(player, underworld);
      CardUI$1.syncInventory(void 0, underworld);
    }
  }
};
const hardLandingEvent = {
  id: HardLandingId,
  onSpawn: (unit2, underworld, prediction) => {
    const modifier = unit2.modifiers[HardLandingId];
    if (modifier) {
      const spawnLocation = { x: unit2.x, y: unit2.y };
      const radius = 100;
      const units2 = underworld.getUnitsWithinDistanceOfTarget(spawnLocation, radius, prediction).filter((u) => u.id != unit2.id);
      units2.forEach((u) => {
        takeDamage({
          unit: u,
          amount: modifier.quantity,
          sourceUnit: unit2,
          fromVec2: unit2
        }, underworld, prediction);
      });
      if (!prediction) {
        ParticleCollection.makeParticleExplosion(spawnLocation, radius / 140, 11184810, 11184810, prediction);
      }
      PlanningView$a.runPredictions(underworld);
      units2.forEach((u) => {
        forcePushAwayFrom(u, spawnLocation, 100, underworld, prediction, unit2);
      });
      underworld.getPickupsWithinDistanceOfTarget(spawnLocation, 100, prediction).forEach((p) => {
        forcePushAwayFrom(p, spawnLocation, 100, underworld, prediction, unit2);
      });
      setTimeout(() => {
        FloatingText$2.default({ coords: spawnLocation, text: HardLandingId, prediction });
      }, 500);
    } else {
      console.error(`Expected to find ${HardLandingId} modifier`);
    }
  }
};
const vampirismEvent = {
  id: vampirismId,
  onDealDamage: (damageDealer, amount2, underworld, prediction, damageReciever) => {
    const modifier = damageDealer.modifiers[vampirismId];
    if (modifier) {
      const healAmount2 = amount2 * (modifier.quantity / 100);
      const bc = "Blood Curse";
      damageDealer.events = damageDealer.events.filter((e) => e != bc);
      Unit$a.takeDamage({
        unit: damageDealer,
        amount: -healAmount2,
        sourceUnit: void 0
      }, underworld, prediction);
      Unit$a.addEvent(damageDealer, "Blood Curse");
    }
    return amount2;
  },
  onTurnStart: async (unit2, underworld, prediction) => {
    if (unit2.modifiers[vampirismId] && !unit2.modifiers["Blood Curse"]) {
      getOrInitModifier$2(unit2, "Blood Curse", { isCurse: true, quantity: unit2.modifiers[vampirismId].quantity, keepOnDeath: true }, () => {
        Unit$a.addModifier(unit2, "Blood Curse", underworld, prediction, 1);
        Unit$a.addEvent(unit2, "Blood Curse");
      });
    }
  }
};
const acrobaticsEvent = {
  id: acrobaticsId,
  onCostCalculation(player, card, timesUsedSoFar, cardCost) {
    const modifier = player.unit.modifiers[acrobaticsId];
    if (modifier) {
      if (card.category == CardCategory$b.Movement) {
        cardCost.staminaCost = cardCost.manaCost;
        cardCost.manaCost = 0;
      }
      return cardCost;
    }
    return cardCost;
  }
};
const safetyNumbersEvent = {
  id: safetyNumbersId,
  onTurnEnd: async (unit2, underworld, prediction) => {
    const modifier = unit2.modifiers[safetyNumbersId];
    if (modifier) {
      const allyUnits = explode.explode(unit2, 140, 0, 0, unit2, underworld, prediction).filter((u) => u.faction == unit2.faction && u.alive);
      for (let ally of allyUnits) {
        getOrInitModifier$2(ally, shieldId, { isCurse: false, quantity: modifier.quantity * allyUnits.length, keepOnDeath: true }, () => {
          Unit$a.addModifier(ally, shieldId, underworld, prediction, modifier.quantity * allyUnits.length);
          Unit$a.addEvent(ally, shieldId);
        });
      }
    }
  },
  onDrawSelected: async (unit2, underworld, prediction) => {
    if (globalThis.selectedUnitGraphics) {
      drawUICircle(globalThis.selectedUnitGraphics, unit2, 140, 16774793, "Safety in Numbers Radius");
    }
  }
};
const blurEvent = {
  id: BlurId,
  onTakeDamage: (unit2, amount2, underworld, prediction, damageDealer) => {
    const modifier = unit2.modifiers[BlurId];
    if (modifier) {
      if (damageDealer && amount2 > 0) {
        const seed = rand$a.seedrandom(rand$a.getUniqueSeedString(underworld) + `${unit2.id}-${(damageDealer == null ? void 0 : damageDealer.id) || 0}`);
        const roll = randInt$1(1, 100, seed);
        if (roll <= modifier.quantity) {
          amount2 = 0;
          FloatingText$2.default({ coords: unit2, text: BlurId, prediction });
        }
      }
    }
    return amount2;
  }
};
const heavyHitterEvent = {
  id: heavyHitterId,
  onCostCalculation(player, card, timesUsedSoFar, cardCost) {
    const modifier = player.unit.modifiers[heavyHitterId];
    if (modifier) {
      if (card.category == CardCategory$b.Damage) {
        cardCost.manaCost *= 2;
        cardCost.staminaCost *= 2;
        cardCost.healthCost *= 2;
        if (cardCost.soulFragmentCost) {
          cardCost.soulFragmentCost *= 2;
        }
      }
      return cardCost;
    }
    return cardCost;
  },
  onDealDamage: (damageDealer, amount2, underworld, prediction, damageReciever) => {
    const modifier = damageDealer.modifiers[heavyHitterId];
    if (modifier && damageReciever) {
      Unit$a.takeDamage({ unit: damageReciever, amount: amount2, pureDamage: true }, underworld, prediction);
    }
    return amount2;
  }
};
const frozenSolidEvent = {
  id: frozenSolidId,
  onTakeDamage: (unit2, amount2, underworld, prediction, damageDealer) => {
    const modifier = unit2.modifiers[frozenSolidId];
    if (modifier) {
      const freezeModifier = unit2.modifiers[freezeCardId$1];
      if (freezeModifier && freezeModifier.quantity >= 0) {
        amount2 = 0;
        FloatingText$2.default({ coords: unit2, text: "Frozen Solid", prediction });
      }
    }
    return amount2;
  }
};
const effervescenceEvent = {
  id: effervescenceId,
  onLiquid: (unit2, currentlyInLiquid, amount2, underworld, prediction, damageDealer) => {
    if (unit2.modifiers[effervescenceId]) {
      amount2 = amount2 * -1 * (unit2.modifiers[effervescenceId].quantity / 100);
    }
    return amount2;
  }
};
const magnetismEvent = {
  id: magnetismId,
  onTurnStart: async (unit2, underworld, prediction) => {
    const modifier = unit2.modifiers[magnetismId];
    if (modifier) {
      const chargedUnits = underworld.getAllUnits(prediction).filter((u) => u.alive && u.faction != unit2.faction).slice(0, modifier.quantity);
      const promises = [];
      for (let chargedUnit of chargedUnits) {
        promises.push(forcePushTowards(chargedUnit, unit2, 140, underworld, prediction));
      }
      await raceTimeout(2e3, "magnetism", Promise.all(promises));
    }
  }
};
const selectiveMemoryEvent = {
  id: selectiveMemoryId,
  onSpawn: (unit2, underworld, prediction) => {
    const modifier = unit2.modifiers[selectiveMemoryId];
    const player = underworld.players.find((p) => p.unit == unit2);
    if (modifier && modifier.lastLevel != underworld.levelIndex && player) {
      modifier.lastLevel = underworld.levelIndex;
      if (!player.disabledCards) {
        player.disabledCards = [];
      }
      if (modifier.stolenSpell != "null") {
        player.disabledCards = player.disabledCards.filter((card) => card != modifier.stolenSpell);
      }
      const availableSpells = player.inventory.filter((card) => !player.disabledCards.includes(card));
      const spellStealIndex = randInt$1(0, availableSpells.length - 1);
      if (availableSpells[spellStealIndex]) {
        player.disabledCards.push(availableSpells[spellStealIndex]);
        modifier.stolenSpell = availableSpells[spellStealIndex];
      }
    }
    CardUI$1.recalcPositionForCards(player, underworld);
    CardUI$1.syncInventory(void 0, underworld);
  }
};
const mod$4 = {
  modName: "Runic Alphabet",
  author: "Bug Jones & Dorioso",
  description: "Adds a variety of new runes, and a handful of spells to support them.",
  screenshot: "spellmasons-mods/RunicAlphabet/graphics/runic_alphabet.png",
  modifiers: [
    modifierHardLanding,
    modifierVampirism,
    modifierAcrobatics,
    modifierSafetyNumbers,
    //modifierLycanthropy,
    modifierNimble,
    modifierMeander,
    modifierBlur,
    modifierHeavyHitter,
    modifierFrozenSolid,
    modifierEffervescence,
    modifierMagnetism,
    modifierSelectiveMemory
    //modifierImmovable,
  ],
  events: [
    hardLandingEvent,
    vampirismEvent,
    acrobaticsEvent,
    safetyNumbersEvent,
    //lycanthropyEvent,
    blurEvent,
    heavyHitterEvent,
    frozenSolidEvent,
    effervescenceEvent,
    magnetismEvent,
    selectiveMemoryEvent
    //immovableEvent
  ],
  spells: [
    spell$c,
    spell$b
    //wild_swipe,
    //lunge
  ],
  //units: [werewolf],
  spritesheet: "spellmasons-mods/RunicAlphabet/graphics/spritesheet.json"
};
const mod$3 = {
  modName: "Dorioso's Minions",
  author: "Dorioso Aytario",
  description: "Adds familiars that accompany you.",
  screenshot: "images/empty.png",
  spritesheet: "spellmasons-mods/Doriosos_minions/spritesheet/sheet.json",
  familiars: ["beholder", "shroom", "goo"]
};
const mod$2 = {
  modName: "Weedy's Worlds",
  author: "Weedybird",
  description: "New maps? New maps!",
  screenshot: "spellmasons-mods/WeedysWorlds/Weedys-Worlds.png",
  maps: [
    {
      "data": [
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        16,
        16,
        16,
        16,
        16,
        16,
        16,
        16,
        16,
        16,
        16,
        16,
        16,
        16,
        16,
        16,
        16,
        16,
        16,
        16,
        16,
        16,
        16,
        15,
        15,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        15,
        15,
        1,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        1,
        1,
        1,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        1,
        15,
        15,
        1,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        1,
        1,
        1,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        1,
        15,
        15,
        1,
        2,
        2,
        2,
        2,
        2,
        2,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        2,
        2,
        2,
        2,
        2,
        2,
        1,
        15,
        15,
        1,
        2,
        2,
        2,
        2,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        2,
        2,
        2,
        2,
        1,
        15,
        15,
        1,
        2,
        2,
        2,
        1,
        1,
        1,
        1,
        1,
        1,
        16,
        16,
        16,
        1,
        1,
        1,
        1,
        1,
        1,
        2,
        2,
        2,
        1,
        15,
        15,
        1,
        2,
        2,
        2,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        2,
        2,
        2,
        1,
        15,
        15,
        1,
        2,
        2,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        2,
        2,
        1,
        15,
        15,
        1,
        2,
        2,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        2,
        2,
        1,
        15,
        15,
        1,
        2,
        1,
        1,
        1,
        1,
        16,
        16,
        16,
        1,
        1,
        1,
        1,
        1,
        16,
        16,
        16,
        1,
        1,
        1,
        1,
        2,
        1,
        15,
        15,
        1,
        2,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        2,
        1,
        15,
        15,
        1,
        2,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        2,
        1,
        15,
        15,
        1,
        2,
        1,
        1,
        1,
        1,
        1,
        15,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        15,
        1,
        1,
        1,
        1,
        1,
        2,
        1,
        15,
        15,
        1,
        2,
        1,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        1,
        2,
        1,
        15,
        15,
        1,
        2,
        1,
        16,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        16,
        1,
        2,
        1,
        15,
        15,
        1,
        2,
        1,
        1,
        16,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        16,
        1,
        1,
        2,
        1,
        15,
        15,
        1,
        2,
        2,
        1,
        1,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        1,
        1,
        2,
        2,
        1,
        15,
        15,
        1,
        2,
        2,
        2,
        1,
        16,
        16,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        16,
        16,
        1,
        2,
        2,
        2,
        1,
        15,
        15,
        1,
        2,
        2,
        2,
        1,
        1,
        1,
        16,
        16,
        15,
        15,
        15,
        15,
        15,
        16,
        16,
        1,
        1,
        1,
        2,
        2,
        2,
        1,
        15,
        15,
        1,
        2,
        2,
        2,
        2,
        2,
        1,
        1,
        1,
        16,
        16,
        16,
        16,
        16,
        1,
        1,
        1,
        2,
        2,
        2,
        2,
        2,
        1,
        15,
        15,
        1,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        1,
        15,
        15,
        1,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        2,
        1,
        15,
        15,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15
      ],
      "height": 26,
      "name": "Battlefield",
      "width": 25
    },
    {
      "data": [
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        15,
        15,
        15,
        15,
        16,
        16,
        16,
        16,
        16,
        15,
        15,
        15,
        15,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        15,
        15,
        16,
        16,
        16,
        1,
        1,
        1,
        1,
        1,
        16,
        16,
        16,
        15,
        15,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        15,
        15,
        15,
        16,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        16,
        15,
        15,
        15,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        15,
        15,
        16,
        16,
        1,
        1,
        1,
        1,
        1,
        15,
        15,
        15,
        1,
        1,
        1,
        1,
        1,
        16,
        16,
        15,
        15,
        0,
        0,
        0,
        0,
        0,
        0,
        15,
        16,
        1,
        1,
        1,
        1,
        1,
        1,
        15,
        15,
        15,
        15,
        15,
        1,
        1,
        1,
        1,
        1,
        1,
        16,
        15,
        0,
        0,
        0,
        0,
        0,
        15,
        15,
        1,
        1,
        2,
        2,
        1,
        1,
        1,
        15,
        15,
        15,
        15,
        15,
        1,
        1,
        1,
        2,
        2,
        1,
        1,
        15,
        15,
        0,
        0,
        0,
        15,
        15,
        16,
        1,
        2,
        2,
        2,
        2,
        1,
        1,
        16,
        15,
        15,
        15,
        16,
        1,
        1,
        2,
        2,
        2,
        2,
        1,
        16,
        15,
        15,
        0,
        0,
        15,
        16,
        1,
        1,
        2,
        2,
        2,
        2,
        1,
        1,
        1,
        16,
        16,
        16,
        1,
        1,
        1,
        2,
        2,
        2,
        2,
        1,
        1,
        16,
        15,
        0,
        0,
        15,
        1,
        1,
        1,
        1,
        2,
        2,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        2,
        2,
        1,
        1,
        1,
        1,
        15,
        0,
        15,
        15,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        15,
        15,
        15,
        16,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        16,
        15,
        15,
        1,
        1,
        1,
        15,
        15,
        15,
        1,
        1,
        1,
        1,
        1,
        2,
        2,
        2,
        1,
        1,
        1,
        1,
        1,
        15,
        15,
        15,
        1,
        1,
        1,
        15,
        15,
        1,
        1,
        15,
        15,
        15,
        15,
        15,
        1,
        1,
        1,
        2,
        2,
        2,
        2,
        2,
        1,
        1,
        1,
        15,
        15,
        15,
        15,
        15,
        1,
        1,
        15,
        15,
        1,
        1,
        15,
        15,
        15,
        15,
        15,
        1,
        1,
        1,
        2,
        2,
        2,
        2,
        2,
        1,
        1,
        1,
        15,
        15,
        15,
        15,
        15,
        1,
        1,
        15,
        15,
        1,
        1,
        16,
        15,
        15,
        15,
        16,
        1,
        1,
        1,
        2,
        2,
        2,
        2,
        2,
        1,
        1,
        1,
        16,
        15,
        15,
        15,
        16,
        1,
        1,
        15,
        15,
        1,
        1,
        1,
        16,
        16,
        16,
        1,
        1,
        1,
        1,
        1,
        2,
        2,
        2,
        1,
        1,
        1,
        1,
        1,
        16,
        16,
        16,
        1,
        1,
        1,
        15,
        15,
        15,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        15,
        15,
        0,
        15,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        15,
        0,
        0,
        15,
        1,
        1,
        1,
        1,
        2,
        2,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        2,
        2,
        1,
        1,
        1,
        1,
        15,
        0,
        0,
        15,
        15,
        1,
        1,
        2,
        2,
        2,
        2,
        1,
        1,
        1,
        15,
        15,
        15,
        1,
        1,
        1,
        2,
        2,
        2,
        2,
        1,
        1,
        15,
        15,
        0,
        0,
        0,
        15,
        15,
        1,
        2,
        2,
        2,
        2,
        1,
        1,
        15,
        15,
        15,
        15,
        15,
        1,
        1,
        2,
        2,
        2,
        2,
        1,
        15,
        15,
        0,
        0,
        0,
        0,
        0,
        15,
        1,
        1,
        2,
        2,
        1,
        1,
        1,
        15,
        15,
        15,
        15,
        15,
        1,
        1,
        1,
        2,
        2,
        1,
        1,
        15,
        0,
        0,
        0,
        0,
        0,
        0,
        15,
        15,
        1,
        1,
        1,
        1,
        1,
        1,
        16,
        15,
        15,
        15,
        16,
        1,
        1,
        1,
        1,
        1,
        1,
        15,
        15,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        15,
        15,
        15,
        1,
        1,
        1,
        1,
        1,
        16,
        16,
        16,
        1,
        1,
        1,
        1,
        1,
        15,
        15,
        15,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        15,
        15,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        15,
        15,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        15,
        15,
        15,
        15,
        1,
        1,
        1,
        1,
        1,
        15,
        15,
        15,
        15,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
      ],
      "height": 28,
      "name": "Bubbles",
      "width": 27
    },
    {
      "data": [
        0,
        0,
        15,
        15,
        15,
        15,
        15,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        15,
        15,
        15,
        15,
        15,
        0,
        0,
        0,
        15,
        16,
        16,
        16,
        16,
        16,
        15,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        15,
        16,
        16,
        16,
        16,
        16,
        15,
        0,
        0,
        15,
        1,
        1,
        1,
        1,
        1,
        15,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        15,
        1,
        1,
        1,
        1,
        1,
        15,
        0,
        15,
        16,
        1,
        1,
        1,
        1,
        1,
        16,
        15,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        15,
        16,
        1,
        1,
        1,
        1,
        1,
        16,
        15,
        15,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        15,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        15,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        15,
        15,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        16,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        16,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        15,
        15,
        1,
        1,
        1,
        15,
        1,
        1,
        1,
        1,
        16,
        16,
        16,
        16,
        16,
        16,
        16,
        1,
        1,
        1,
        1,
        15,
        1,
        1,
        1,
        15,
        15,
        15,
        1,
        15,
        16,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        16,
        15,
        1,
        15,
        15,
        0,
        15,
        1,
        16,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        16,
        1,
        15,
        0,
        0,
        15,
        15,
        1,
        1,
        1,
        1,
        1,
        1,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        1,
        1,
        1,
        1,
        1,
        1,
        15,
        15,
        0,
        0,
        0,
        15,
        1,
        1,
        1,
        1,
        1,
        15,
        16,
        16,
        16,
        16,
        16,
        16,
        16,
        15,
        1,
        1,
        1,
        1,
        1,
        15,
        0,
        0,
        0,
        0,
        15,
        1,
        1,
        1,
        15,
        15,
        16,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        16,
        15,
        15,
        1,
        1,
        1,
        15,
        0,
        0,
        0,
        15,
        16,
        1,
        1,
        1,
        16,
        16,
        1,
        1,
        2,
        2,
        2,
        2,
        2,
        1,
        1,
        16,
        16,
        1,
        1,
        1,
        16,
        15,
        0,
        15,
        16,
        1,
        15,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        15,
        1,
        16,
        15,
        15,
        1,
        1,
        16,
        15,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        15,
        16,
        1,
        1,
        15,
        15,
        1,
        1,
        1,
        16,
        1,
        1,
        1,
        1,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        1,
        1,
        1,
        1,
        16,
        1,
        1,
        1,
        15,
        15,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        15,
        15,
        0,
        0,
        0,
        0,
        0,
        15,
        15,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        15,
        15,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        15,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        15,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        15,
        15,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        15,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        15,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        15,
        15,
        15,
        1,
        1,
        1,
        1,
        1,
        15,
        15,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        15,
        15,
        1,
        1,
        1,
        1,
        1,
        15,
        15,
        0,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        0
      ],
      "height": 21,
      "name": "Bone",
      "width": 25
    },
    {
      "data": [
        0,
        0,
        0,
        0,
        0,
        0,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        16,
        16,
        16,
        16,
        16,
        16,
        16,
        16,
        16,
        16,
        16,
        16,
        16,
        16,
        16,
        16,
        16,
        16,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        15,
        15,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        15,
        15,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        16,
        16,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        16,
        16,
        0,
        0,
        0,
        0,
        0,
        0,
        15,
        15,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        15,
        15,
        0,
        0,
        0,
        0,
        15,
        15,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        15,
        15,
        0,
        0,
        0,
        0,
        15,
        15,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        15,
        15,
        0,
        0,
        0,
        0,
        16,
        16,
        1,
        1,
        1,
        2,
        2,
        2,
        2,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        2,
        2,
        2,
        2,
        1,
        1,
        1,
        16,
        16,
        0,
        0,
        15,
        15,
        1,
        1,
        1,
        1,
        1,
        2,
        2,
        2,
        2,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        2,
        2,
        2,
        2,
        1,
        1,
        1,
        1,
        1,
        15,
        15,
        15,
        15,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        2,
        2,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        2,
        2,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        15,
        15,
        15,
        15,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        2,
        2,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        2,
        2,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        15,
        15,
        15,
        15,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        15,
        15,
        15,
        15,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        15,
        15,
        15,
        15,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        15,
        15,
        15,
        15,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        2,
        2,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        15,
        15,
        15,
        15,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        2,
        2,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        15,
        15,
        0,
        0,
        15,
        15,
        15,
        15,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        15,
        15,
        15,
        15,
        0,
        0,
        0,
        0,
        15,
        15,
        15,
        15,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        15,
        15,
        15,
        15,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        15,
        15,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        15,
        15,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        15,
        15,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        15,
        15,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        15,
        15,
        1,
        1,
        1,
        1,
        15,
        15,
        1,
        1,
        15,
        15,
        1,
        1,
        1,
        1,
        15,
        15,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        15,
        15,
        15,
        15,
        1,
        1,
        15,
        15,
        1,
        1,
        15,
        15,
        1,
        1,
        15,
        15,
        15,
        15,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        15,
        15,
        1,
        1,
        15,
        15,
        1,
        1,
        15,
        15,
        1,
        1,
        15,
        15,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
      ],
      "height": 25,
      "name": "Skull",
      "width": 30
    },
    {
      "data": [
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        16,
        16,
        16,
        16,
        16,
        16,
        16,
        16,
        16,
        16,
        16,
        15,
        15,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        15,
        15,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        15,
        15,
        1,
        1,
        2,
        2,
        1,
        1,
        1,
        2,
        2,
        1,
        1,
        15,
        15,
        1,
        1,
        2,
        1,
        1,
        1,
        1,
        1,
        2,
        1,
        1,
        15,
        15,
        1,
        1,
        2,
        1,
        1,
        1,
        1,
        1,
        2,
        1,
        1,
        15,
        15,
        1,
        1,
        1,
        1,
        1,
        15,
        1,
        1,
        1,
        1,
        1,
        15,
        15,
        1,
        1,
        1,
        1,
        1,
        15,
        1,
        1,
        1,
        1,
        1,
        15,
        15,
        1,
        1,
        1,
        1,
        1,
        16,
        1,
        1,
        1,
        1,
        1,
        15,
        15,
        1,
        1,
        2,
        1,
        1,
        1,
        1,
        1,
        2,
        1,
        1,
        15,
        15,
        1,
        1,
        2,
        1,
        1,
        1,
        1,
        1,
        2,
        1,
        1,
        15,
        15,
        1,
        1,
        2,
        2,
        1,
        1,
        1,
        2,
        2,
        1,
        1,
        15,
        15,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        15,
        15,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15,
        15
      ],
      "height": 16,
      "name": "Loop",
      "width": 13
    }
  ]
};
const {
  rand: rand$9,
  Unit: Unit$9,
  config: config$a,
  commonTypes: commonTypes$a,
  cards: cards$a,
  VisualEffects: VisualEffects$9,
  PlanningView: PlanningView$9,
  cardUtils: cardUtils$9,
  units: units$9
} = globalThis.SpellmasonsAPI;
const { getUniqueSeedString: getUniqueSeedString$2, chooseOneOfSeeded: chooseOneOfSeeded$2, seedrandom: seedrandom$2, randInt } = rand$9;
const { CardRarity: CardRarity$a, probabilityMap: probabilityMap$a, CardCategory: CardCategory$a, Faction: Faction$9, UnitSubType: UnitSubType$9, UnitType: UnitType$9 } = commonTypes$a;
const { addWarningAtMouse: addWarningAtMouse$1 } = PlanningView$9;
const { playDefaultSpellSFX: playDefaultSpellSFX$1 } = cardUtils$9;
const { skyBeam } = VisualEffects$9;
const { allUnits } = units$9;
const { addUnitTarget: addUnitTarget$8, refundLastSpell: refundLastSpell$8 } = cards$a;
const id$8 = "Capture Soul";
const bossmasonUnitId = "Deathmason", spellmasonUnitId = "Spellmason", golem_unit_id = "golem", ARCHER_ID = "archer", ANCIENT_UNIT_ID = "ancient", GLOP_UNIT_ID = "glop", gripthulu_id = "gripthulu", BLOOD_GOLEM_ID = "Blood Golem", POISONER_ID = "poisoner", VAMPIRE_ID = "vampire", BLOOD_ARCHER_ID = "Blood Archer", PRIEST_ID = "priest", SUMMONER_ID = "summoner", GHOST_ARCHER_ID = "Ghost Archer", MANA_VAMPIRE_ID = "Mana Vampire", DARK_PRIEST_ID = "dark priest", DARK_SUMMONER_ID = "Dark Summoner", urn_explosive_id = "Explosive Urn", urn_ice_id = "Ice Urn", urn_poison_id = "Toxic Urn", CORRUPTED_ANCIENT_UNIT_ID = "Corrupted Ancient", goru_id = "Goru", greenGlopId = "Green Glop";
const summonableUnits = [
  bossmasonUnitId,
  spellmasonUnitId,
  golem_unit_id,
  ARCHER_ID,
  ANCIENT_UNIT_ID,
  GLOP_UNIT_ID,
  gripthulu_id,
  BLOOD_GOLEM_ID,
  POISONER_ID,
  VAMPIRE_ID,
  BLOOD_ARCHER_ID,
  PRIEST_ID,
  SUMMONER_ID,
  GHOST_ARCHER_ID,
  MANA_VAMPIRE_ID,
  DARK_PRIEST_ID,
  DARK_SUMMONER_ID,
  urn_explosive_id,
  urn_ice_id,
  urn_poison_id,
  CORRUPTED_ANCIENT_UNIT_ID,
  goru_id,
  greenGlopId
];
const chaosSummonId = "Chaos Summon";
const spell$a = {
  card: {
    id: chaosSummonId,
    category: CardCategory$a.Soul,
    sfx: "summonDecoy",
    supportQuantity: false,
    manaCost: 40,
    healthCost: 0,
    expenseScaling: 1,
    probability: probabilityMap$a[CardRarity$a.SPECIAL],
    thumbnail: "spellmasons-mods/Mana Evolution/images/chaos_summon.png",
    replaces: [id$8],
    description: "Summons a random unit to fight for you. The summoned unit may receive random boss modifiers.",
    allowNonUnitTarget: true,
    effect: async (state, card, quantity, underworld, prediction) => {
      const seedString = `${getUniqueSeedString$2(underworld, state.casterPlayer)}${state.castLocation.x}${state.castLocation.y}${state.casterUnit.mana}`;
      const seed = seedrandom$2(seedString);
      const unitId = chooseOneOfSeeded$2(summonableUnits, seed);
      if (unitId) {
        const sourceUnit = allUnits[unitId];
        if (sourceUnit) {
          const summonLocation = {
            x: state.castLocation.x,
            y: state.castLocation.y
          };
          if (underworld.isCoordOnWallTile(summonLocation)) {
            if (prediction) {
              const WARNING = "Invalid Summon Location";
              addWarningAtMouse$1(WARNING);
            } else {
              refundLastSpell$8(state, prediction, "Invalid summon location, mana refunded.");
            }
            return state;
          }
          playDefaultSpellSFX$1(card, prediction);
          const unit2 = Unit$9.create(
            sourceUnit.id,
            summonLocation.x,
            summonLocation.y,
            Faction$9.ALLY,
            sourceUnit.info.image,
            UnitType$9.AI,
            sourceUnit.info.subtype,
            {
              ...sourceUnit.unitProps,
              healthMax: sourceUnit.unitProps.healthMax || underworld.rules.UNIT_BASE_HEALTH,
              health: sourceUnit.unitProps.health || underworld.rules.UNIT_BASE_HEALTH,
              damage: sourceUnit.unitProps.damage || 0,
              strength: 1,
              isMiniboss: randInt(0, 3, seed) == 0
            },
            underworld,
            prediction,
            state.casterUnit
          );
          addUnitTarget$8(unit2, state, prediction);
          if (!prediction) {
            skyBeam(unit2);
          }
        } else {
          console.error(`Source unit ${unitId} is missing`);
        }
        return state;
      } else {
        if (prediction) {
          const WARNING = "Invalid Summon Location";
          addWarningAtMouse$1(WARNING);
        } else {
          refundLastSpell$8(state, prediction, "Invalid summon location, mana refunded.");
        }
        return state;
      }
    }
  }
};
const {
  rand: rand$8,
  Unit: Unit$8,
  config: config$9,
  commonTypes: commonTypes$9,
  cards: cards$9,
  VisualEffects: VisualEffects$8,
  PlanningView: PlanningView$8,
  cardUtils: cardUtils$8,
  units: units$8,
  PixiUtils: PixiUtils$8,
  cardsUtil: cardsUtil$7,
  math: math$3,
  JImage: JImage$1,
  moveWithCollision: moveWithCollision$1,
  Vec: Vec$1
} = globalThis.SpellmasonsAPI;
const { CardRarity: CardRarity$9, probabilityMap: probabilityMap$9, CardCategory: CardCategory$9, Faction: Faction$8, UnitSubType: UnitSubType$8, UnitType: UnitType$8 } = commonTypes$9;
const { addUnitTarget: addUnitTarget$7, refundLastSpell: refundLastSpell$7, getCurrentTargets: getCurrentTargets$7, addTarget: addTarget$7, defaultTargetsForAllowNonUnitTargetTargetingSpell: defaultTargetsForAllowNonUnitTargetTargetingSpell$2 } = cards$9;
const { isUnit: isUnit$4, addModifier: addModifier$4 } = Unit$8;
const unstableId = "Unstable";
const displaceId = "displace";
const id$7 = "Unstable";
const spell$9 = {
  card: {
    id: id$7,
    category: CardCategory$9.Blessings,
    supportQuantity: false,
    manaCost: 20,
    healthCost: 0,
    expenseScaling: 1,
    probability: probabilityMap$9[CardRarity$9.SPECIAL],
    thumbnail: "spellmasons-mods/Mana Evolution/images/unstable.png",
    replaces: [displaceId],
    requiresFollowingCard: false,
    description: ["Inflicts the Boss Modifier Unstable, Causing the affected unit to teleport to a random location each turn."],
    allowNonUnitTarget: false,
    effect: async (state, card, quantity, underworld, prediction, outOfRange) => {
      let targets = getCurrentTargets$7(state);
      targets = targets.length ? targets : [state.castLocation];
      targets.forEach((t) => {
        if (isUnit$4(t)) {
          addModifier$4(t, unstableId, underworld, prediction, 1);
        }
      });
      return state;
    }
  }
};
const {
  rand: rand$7,
  Unit: Unit$7,
  config: config$8,
  commonTypes: commonTypes$8,
  cards: cards$8,
  VisualEffects: VisualEffects$7,
  PlanningView: PlanningView$7,
  cardUtils: cardUtils$7,
  units: units$7,
  PixiUtils: PixiUtils$7,
  cardsUtil: cardsUtil$6
} = globalThis.SpellmasonsAPI;
const { CardRarity: CardRarity$8, probabilityMap: probabilityMap$8, CardCategory: CardCategory$8, Faction: Faction$7, UnitSubType: UnitSubType$7, UnitType: UnitType$7 } = commonTypes$8;
const { addUnitTarget: addUnitTarget$6, refundLastSpell: refundLastSpell$6, getCurrentTargets: getCurrentTargets$6, addTarget: addTarget$6 } = cards$8;
const { isUnit: isUnit$3, addModifier: addModifier$3 } = Unit$7;
const clone_id = "clone";
const slimeId = "Slime";
const id$6 = "Slime";
const spell$8 = {
  card: {
    id: id$6,
    category: CardCategory$8.Blessings,
    supportQuantity: false,
    manaCost: 20,
    healthCost: 0,
    expenseScaling: 1,
    probability: probabilityMap$8[CardRarity$8.SPECIAL],
    thumbnail: "spellmasons-mods/Mana Evolution/images/slime.png",
    replaces: [clone_id],
    requiresFollowingCard: false,
    description: ["Inflicts the Boss Modifier Slime, Causing the affected unit to clone itself each turn."],
    allowNonUnitTarget: false,
    effect: async (state, card, quantity, underworld, prediction, outOfRange) => {
      let targets = getCurrentTargets$6(state);
      targets = targets.length ? targets : [state.castLocation];
      targets.forEach((t) => {
        if (isUnit$3(t)) {
          addModifier$3(t, slimeId, underworld, prediction, 1);
        }
      });
      return state;
    }
  }
};
const {
  rand: rand$6,
  Unit: Unit$6,
  config: config$7,
  commonTypes: commonTypes$7,
  cards: cards$7,
  VisualEffects: VisualEffects$6,
  PlanningView: PlanningView$6,
  cardUtils: cardUtils$6,
  units: units$6,
  PixiUtils: PixiUtils$6,
  cardsUtil: cardsUtil$5
} = globalThis.SpellmasonsAPI;
const { CardRarity: CardRarity$7, probabilityMap: probabilityMap$7, CardCategory: CardCategory$7, Faction: Faction$6, UnitSubType: UnitSubType$6, UnitType: UnitType$6 } = commonTypes$7;
const { addUnitTarget: addUnitTarget$5, refundLastSpell: refundLastSpell$5, getCurrentTargets: getCurrentTargets$5, addTarget: addTarget$5 } = cards$7;
const { isUnit: isUnit$2, addModifier: addModifier$2 } = Unit$6;
const growthId = "Growth";
const empowerId = "Empower";
const id$5 = "growth";
const spell$7 = {
  card: {
    id: id$5,
    category: CardCategory$7.Blessings,
    supportQuantity: false,
    manaCost: 30,
    healthCost: 0,
    expenseScaling: 1,
    probability: probabilityMap$7[CardRarity$7.SPECIAL],
    thumbnail: "spellmasons-mods/Mana Evolution/images/growth.png",
    replaces: [empowerId],
    requiresFollowingCard: false,
    description: ["Inflicts the Boss Modifier growth, Causing the affected unit to get stronger each turn."],
    allowNonUnitTarget: false,
    effect: async (state, card, quantity, underworld, prediction, outOfRange) => {
      let targets = getCurrentTargets$5(state);
      targets = targets.length ? targets : [state.castLocation];
      targets.forEach((t) => {
        if (isUnit$2(t)) {
          addModifier$2(t, growthId, underworld, prediction, 1);
        }
      });
      return state;
    }
  }
};
const {
  rand: rand$5,
  Unit: Unit$5,
  config: config$6,
  commonTypes: commonTypes$6,
  cards: cards$6,
  VisualEffects: VisualEffects$5,
  PlanningView: PlanningView$5,
  cardUtils: cardUtils$5,
  units: units$5,
  PixiUtils: PixiUtils$5,
  cardsUtil: cardsUtil$4
} = globalThis.SpellmasonsAPI;
const { CardRarity: CardRarity$6, probabilityMap: probabilityMap$6, CardCategory: CardCategory$6, Faction: Faction$5, UnitSubType: UnitSubType$5, UnitType: UnitType$5 } = commonTypes$6;
const { addUnitTarget: addUnitTarget$4, refundLastSpell: refundLastSpell$4, getCurrentTargets: getCurrentTargets$4, addTarget: addTarget$4 } = cards$6;
const { isUnit: isUnit$1, addModifier: addModifier$1 } = Unit$5;
const { getOrInitModifier: getOrInitModifier$1 } = cardsUtil$4;
const rendCardId = "Rend";
function calculateRendDamage(stack) {
  let damage2 = 0;
  for (let i = 1; i < stack + 1; i++) {
    damage2 += i;
  }
  return damage2 * 10;
}
const id$4 = "Damocles";
function add$1(unit2, underworld, prediction, quantity = 1) {
  getOrInitModifier$1(unit2, id$4, { isCurse: true, quantity }, () => {
    Unit$5.addEvent(unit2, id$4);
  });
}
const spell$6 = {
  card: {
    id: id$4,
    category: CardCategory$6.Curses,
    supportQuantity: true,
    manaCost: 10,
    healthCost: 0,
    expenseScaling: 1,
    probability: probabilityMap$6[CardRarity$6.COMMON],
    thumbnail: "spellmasons-mods/Mana Evolution/images/damocles.png",
    replaces: [rendCardId],
    requiresFollowingCard: false,
    description: ["Summons the Sword of Damocles, which deals damage that scales with stacks in the same pattern as rend. Damage is done next time unit takes damage. Stacks increase every turn."],
    allowNonUnitTarget: false,
    effect: async (state, card, quantity, underworld, prediction, outOfRange) => {
      let targets = getCurrentTargets$4(state);
      targets = targets.length ? targets : [state.castLocation];
      targets.forEach((t) => {
        if (isUnit$1(t)) {
          addModifier$1(t, id$4, underworld, prediction, quantity);
        }
      });
      return state;
    }
  },
  modifiers: {
    add: add$1
  },
  events: {
    onTooltip: (unit2, underworld) => {
      const modifier = unit2.modifiers[id$4];
      if (modifier) {
        modifier.tooltip = `${calculateRendDamage(modifier.quantity)} Extra damage taken on next hit`;
      }
    },
    onTurnEnd: async (unit2, underworld, prediction) => {
      const modifier = unit2.modifiers[id$4];
      if (modifier) {
        modifier.quantity++;
      }
    },
    onTakeDamage: (unit2, amount2, underworld, prediction, damageDealer) => {
      const modifier = unit2.modifiers[id$4];
      if (modifier) {
        Unit$5.takeDamage({ unit: unit2, amount: calculateRendDamage(modifier.quantity), sourceUnit: damageDealer }, underworld, prediction);
        Unit$5.removeModifier(unit2, id$4, underworld);
      }
      return amount2;
    }
  }
};
const {
  rand: rand$4,
  Unit: Unit$4,
  config: config$5,
  commonTypes: commonTypes$5,
  cards: cards$5,
  VisualEffects: VisualEffects$4,
  PlanningView: PlanningView$4,
  cardUtils: cardUtils$4,
  units: units$4,
  PixiUtils: PixiUtils$4,
  cardsUtil: cardsUtil$3,
  math: math$2,
  JImage,
  moveWithCollision,
  Vec,
  FloatingText: FloatingText$1
} = globalThis.SpellmasonsAPI;
const { CardRarity: CardRarity$5, probabilityMap: probabilityMap$5, CardCategory: CardCategory$5, Faction: Faction$4, UnitSubType: UnitSubType$4, UnitType: UnitType$4 } = commonTypes$5;
const { containerSpells: containerSpells$1, containerProjectiles } = PixiUtils$4;
const { getOrInitModifier } = cardsUtil$3;
const { makeForceMoveProjectile } = moveWithCollision;
const { subtract, getEndpointOfMagnitudeAlongVector, getAngleBetweenVec2s } = Vec;
const { create } = JImage;
const phantomArrowCardId = "Phantom Arrow";
const freezeCardId = "freeze";
const tranquilizerId = "Tranquilizer";
const sleepStacks = 2;
function add(unit2, underworld, prediction, quantity = 1) {
  getOrInitModifier(unit2, tranquilizerId, { isCurse: true, quantity, originalstat: unit2.attackRange, origanalSpeed: unit2.moveSpeed }, () => {
    Unit$4.addEvent(unit2, tranquilizerId);
    unit2.attackRange = 0;
    unit2.moveSpeed = 0;
  });
}
function remove(unit2, underworld) {
  if (unit2.modifiers && unit2.modifiers[tranquilizerId]) {
    const originalRange = unit2.modifiers[tranquilizerId].originalstat;
    const origanalSpeed = unit2.modifiers[tranquilizerId].origanlSpeed;
    if (originalRange) {
      unit2.attackRange = originalRange;
    }
    if (origanalSpeed) {
      unit2.moveSpeed = origanalSpeed;
    }
  }
}
const spell$5 = {
  card: {
    id: tranquilizerId,
    category: CardCategory$5.Curses,
    supportQuantity: true,
    manaCost: 40,
    healthCost: 0,
    expenseScaling: 1,
    probability: probabilityMap$5[CardRarity$5.RARE],
    thumbnail: "spellmasons-mods/Mana Evolution/images/tranquilizer.png",
    // so that you can fire the arrow at targets out of range
    allowNonUnitTarget: true,
    ignoreRange: true,
    requires: [phantomArrowCardId],
    animationPath: "",
    sfx: "phantomArrow",
    description: ["Fires a tranquilizing dart that deals no damage but inflicts sleep. Sleeping units wake up on taking damage or in a couple turns."],
    // Phantom arrow has "infinte" pierce built in
    effect: async (state, card, quantity, underworld, prediction, outOfRange) => {
      let targets = state.targetedUnits;
      targets = targets.length ? targets : [state.castLocation];
      let timeoutToNextArrow = 200;
      for (let i = 0; i < quantity; i++) {
        for (let target of targets) {
          for (let arrowNumber = 0; arrowNumber < 1; arrowNumber++) {
            let casterPositionAtTimeOfCast = state.casterPositionAtTimeOfCast;
            let castLocation = target;
            if (arrowNumber > 0) {
              const diff = subtract(casterPositionAtTimeOfCast, getEndpointOfMagnitudeAlongVector(casterPositionAtTimeOfCast, (arrowNumber % 2 == 0 ? -1 : 1) * Math.PI / 2 + getAngleBetweenVec2s(state.casterPositionAtTimeOfCast, state.castLocation), arrowNumber > 2 ? 40 : 20));
              casterPositionAtTimeOfCast = subtract(casterPositionAtTimeOfCast, diff);
              castLocation = subtract(castLocation, diff);
            }
            const startPoint = casterPositionAtTimeOfCast;
            const velocity = math$2.similarTriangles(target.x - startPoint.x, target.y - casterPositionAtTimeOfCast.y, math$2.distance(startPoint, target), config$5.ARROW_PROJECTILE_SPEED);
            let image;
            if (!prediction) {
              image = create(casterPositionAtTimeOfCast, "arrow", containerProjectiles);
              if (image) {
                image.sprite.rotation = Math.atan2(velocity.y, velocity.x);
              }
            }
            const pushedObject = {
              x: casterPositionAtTimeOfCast.x,
              y: casterPositionAtTimeOfCast.y,
              radius: 1,
              inLiquid: false,
              image,
              immovable: false,
              beingPushed: false,
              debugName: "arrow"
            };
            makeForceMoveProjectile({
              sourceUnit: state.casterUnit,
              pushedObject,
              startPoint,
              velocity,
              piercesRemaining: 0,
              bouncesRemaining: 0,
              collidingUnitIds: [state.casterUnit.id],
              collideFnKey: tranquilizerId,
              state
            }, underworld, prediction);
            if (!prediction && !globalThis.headless) {
              const timeout = Math.max(0, timeoutToNextArrow);
              await new Promise((resolve) => setTimeout(resolve, timeout));
              timeoutToNextArrow -= 5;
            }
          }
        }
      }
      await underworld.awaitForceMoves();
      return state;
    }
  },
  modifiers: {
    add,
    remove
  },
  events: {
    onTooltip: (unit2, underworld) => {
      const modifier = unit2.modifiers[tranquilizerId];
      if (modifier) {
        modifier.tooltip = `Asleep. Wakes on taking damage or in ${modifier.quantity} turns.`;
      }
    },
    onProjectileCollision: ({ unit: unit2, underworld, projectile, prediction }) => {
      if (unit2) {
        Unit$4.addModifier(unit2, tranquilizerId, underworld, prediction, sleepStacks);
      }
    },
    onTakeDamage: (unit2, amount2, underworld, prediction, damageDealer) => {
      const modifier = unit2.modifiers[tranquilizerId];
      if (modifier) {
        Unit$4.removeModifier(unit2, tranquilizerId, underworld);
        if (!prediction) {
          FloatingText$1.default({ coords: unit2, text: "Woke up!", prediction });
        }
      }
      return amount2;
    },
    onTurnEnd: async (unit2, underworld, prediction) => {
      const modifier = unit2.modifiers[tranquilizerId];
      const frozen = unit2.modifiers[freezeCardId];
      if (modifier && !frozen) {
        modifier.quantity--;
        if (modifier.quantity <= 0) {
          Unit$4.removeModifier(unit2, tranquilizerId, underworld);
          if (!prediction) {
            FloatingText$1.default({ coords: unit2, text: "Woke up!", prediction });
          }
        } else {
          if (!prediction) {
            FloatingText$1.default({ coords: unit2, text: `Sleeping... zzz`, prediction });
          }
        }
      }
    }
  }
};
const {
  rand: rand$3,
  Unit: Unit$3,
  config: config$4,
  commonTypes: commonTypes$4,
  cards: cards$4,
  VisualEffects: VisualEffects$3,
  PlanningView: PlanningView$3,
  cardUtils: cardUtils$3,
  units: units$3,
  PixiUtils: PixiUtils$3,
  Clone
} = globalThis.SpellmasonsAPI;
const { getUniqueSeedString: getUniqueSeedString$1, chooseOneOfSeeded: chooseOneOfSeeded$1, seedrandom: seedrandom$1, randFloat: randFloat$1 } = rand$3;
const { CardRarity: CardRarity$4, probabilityMap: probabilityMap$4, CardCategory: CardCategory$4, Faction: Faction$3, UnitSubType: UnitSubType$3, UnitType: UnitType$3 } = commonTypes$4;
const { playDefaultSpellSFX, oneOffImage } = cardUtils$3;
const { containerSpells } = PixiUtils$3;
const { addUnitTarget: addUnitTarget$3, refundLastSpell: refundLastSpell$3, getCurrentTargets: getCurrentTargets$3, addTarget: addTarget$3 } = cards$4;
const { doCloneUnit } = Clone;
const slashCardId = "Slash";
const id$3 = "Cleave";
const damage = 30;
const delayBetweenAnimationsStart = 400;
const animationPath = "spellHurtCuts";
const scale = 1.5;
const spell$4 = {
  card: {
    id: id$3,
    category: CardCategory$4.Damage,
    supportQuantity: false,
    manaCost: 20,
    healthCost: 0,
    expenseScaling: 1,
    probability: probabilityMap$4[CardRarity$4.SPECIAL],
    thumbnail: "spellmasons-mods/Mana Evolution/images/cleave.png",
    replaces: [slashCardId],
    requiresFollowingCard: false,
    description: ["Deals 30 damage. Units killed by this spell will be split into 2 corpses."],
    allowNonUnitTarget: false,
    effect: async (state, card, quantity, underworld, prediction, outOfRange) => {
      const targets = state.targetedUnits.filter((u) => u.alive);
      let delayBetweenAnimations = delayBetweenAnimationsStart;
      for (let q = 0; q < quantity; q++) {
        let fatalDamage = false;
        if (!prediction && !globalThis.headless) {
          playDefaultSpellSFX(card, prediction);
          for (let unit2 of targets) {
            const spellEffectImage = oneOffImage(unit2, animationPath, containerSpells);
            if (spellEffectImage) {
              spellEffectImage.sprite.rotation = randFloat$1(-Math.PI / 6, Math.PI / 6);
              if (q % 2 == 0) {
                spellEffectImage.sprite.scale.x = -1;
              }
              spellEffectImage.sprite.scale.x *= scale;
              spellEffectImage.sprite.scale.y *= scale;
            }
            if (damage >= unit2.health) {
              fatalDamage = true;
            }
            Unit$3.takeDamage({
              unit: unit2,
              amount: damage,
              sourceUnit: state.casterUnit,
              fromVec2: state.casterUnit
            }, underworld, prediction);
            if (fatalDamage && !unit2.alive) {
              const clone = doCloneUnit(unit2, underworld, prediction, state.casterUnit, { x: unit2.x + 10, y: unit2.y });
              if (clone) {
                addTarget$3(clone, state, underworld, prediction);
              }
            }
          }
          await new Promise((resolve) => setTimeout(resolve, delayBetweenAnimations));
          delayBetweenAnimations *= 0.8;
          delayBetweenAnimations = Math.max(20, delayBetweenAnimations);
        } else {
          for (let unit2 of targets) {
            if (damage > unit2.health) {
              fatalDamage = true;
            }
            Unit$3.takeDamage({
              unit: unit2,
              amount: damage,
              sourceUnit: state.casterUnit,
              fromVec2: state.casterUnit
            }, underworld, prediction);
            if (fatalDamage) {
              const clone = doCloneUnit(unit2, underworld, prediction, state.casterUnit, { x: unit2.x, y: unit2.y });
              if (clone) {
                addTarget$3(clone, state, underworld, prediction);
              }
            }
          }
        }
      }
      if (targets.length == 0) {
        refundLastSpell$3(state, prediction, "No valid targets. Cost refunded.");
      }
      return state;
    }
  }
};
const {
  rand: rand$2,
  Unit: Unit$2,
  config: config$3,
  commonTypes: commonTypes$3,
  cards: cards$3,
  VisualEffects: VisualEffects$2,
  PlanningView: PlanningView$2,
  cardUtils: cardUtils$2,
  units: units$2,
  PixiUtils: PixiUtils$2,
  cardsUtil: cardsUtil$2,
  teleport
} = globalThis.SpellmasonsAPI;
const { CardRarity: CardRarity$3, probabilityMap: probabilityMap$3, CardCategory: CardCategory$3, Faction: Faction$2, UnitSubType: UnitSubType$2, UnitType: UnitType$2 } = commonTypes$3;
const { addUnitTarget: addUnitTarget$2, refundLastSpell: refundLastSpell$2, getCurrentTargets: getCurrentTargets$2, addTarget: addTarget$2 } = cards$3;
const dash_id = "Dash";
const id$2 = "Flurry Dash";
const spell$3 = {
  card: {
    id: id$2,
    category: CardCategory$3.Movement,
    supportQuantity: false,
    manaCost: 20,
    healthCost: 0,
    expenseScaling: 1,
    probability: probabilityMap$3[CardRarity$3.SPECIAL],
    thumbnail: "spellmasons-mods/Mana Evolution/images/flurry_dash.png",
    replaces: [dash_id],
    requiresFollowingCard: false,
    description: ["Teleport to each target in sequence."],
    allowNonUnitTarget: false,
    effect: async (state, card, quantity, underworld, prediction, outOfRange) => {
      const targets = getCurrentTargets$2(state);
      const delayBetweenAnimations = 50;
      for (let target of targets) {
        teleport(state.casterUnit, target, underworld, prediction, true, state.casterUnit);
        await new Promise((resolve) => setTimeout(resolve, delayBetweenAnimations));
      }
      return state;
    }
  }
};
const {
  rand: rand$1,
  Unit: Unit$1,
  config: config$2,
  commonTypes: commonTypes$2,
  cards: cards$2,
  VisualEffects: VisualEffects$1,
  PlanningView: PlanningView$1,
  cardUtils: cardUtils$1,
  units: units$1,
  PixiUtils: PixiUtils$1,
  cardsUtil: cardsUtil$1,
  math: math$1,
  TargetCircle
} = globalThis.SpellmasonsAPI;
const { CardRarity: CardRarity$2, probabilityMap: probabilityMap$2, CardCategory: CardCategory$2, Faction: Faction$1, UnitSubType: UnitSubType$1, UnitType: UnitType$1 } = commonTypes$2;
const { addWarningAtMouse, drawUICirclePrediction } = PlanningView$1;
const { addUnitTarget: addUnitTarget$1, refundLastSpell: refundLastSpell$1, getCurrentTargets: getCurrentTargets$1, addTarget: addTarget$1, defaultTargetsForAllowNonUnitTargetTargetingSpell: defaultTargetsForAllowNonUnitTargetTargetingSpell$1 } = cards$2;
const { sortCosestTo } = math$1;
const { animateTargetCircle } = TargetCircle;
const circleId = "Target Circle";
const baseRadius = 120;
const id$1 = "Target Around";
const spell$2 = {
  card: {
    id: id$1,
    category: CardCategory$2.Targeting,
    supportQuantity: true,
    manaCost: 20,
    healthCost: 0,
    expenseScaling: 1,
    probability: probabilityMap$2[CardRarity$2.COMMON],
    thumbnail: "spellmasons-mods/Mana Evolution/images/target around.png",
    replaces: [circleId],
    requiresFollowingCard: true,
    description: ["Targets entities within a radius around each target, then untargets the initial targets."],
    allowNonUnitTarget: false,
    effect: async (state, card, quantity, underworld, prediction, outOfRange) => {
      const adjustedRange = baseRadius * (quantity + 0.5 * state.aggregator.radiusBoost);
      let targets = getCurrentTargets$1(state);
      const initialTargets = targets;
      targets = defaultTargetsForAllowNonUnitTargetTargetingSpell$1(targets, state.castLocation, card);
      const length = targets.length;
      const animateCircles = [];
      for (let i = 0; i < length; i++) {
        const target = targets[i];
        if (!target) {
          continue;
        }
        if (prediction) {
          drawUICirclePrediction(target, adjustedRange, 16777215, !outOfRange ? "Target Radius" : void 0);
        } else {
          animateCircles.push({ pos: target, radius: adjustedRange });
        }
        const withinRadius = underworld.getEntitiesWithinDistanceOfTarget(
          target,
          adjustedRange,
          prediction
        );
        withinRadius.sort(sortCosestTo(target));
        withinRadius.forEach((e) => addTarget$1(e, state, underworld, prediction));
      }
      await animateTargetCircle(animateCircles, underworld, prediction);
      state.targetedPickups = state.targetedPickups.filter((p) => !initialTargets.includes(p));
      state.targetedUnits = state.targetedUnits.filter((u) => !initialTargets.includes(u));
      return state;
    }
  }
};
const {
  rand,
  Unit,
  config: config$1,
  commonTypes: commonTypes$1,
  cards: cards$1,
  VisualEffects,
  PlanningView,
  cardUtils,
  units,
  PixiUtils,
  cardsUtil,
  math
} = globalThis.SpellmasonsAPI;
const { getUniqueSeedString, chooseOneOfSeeded, seedrandom, randFloat } = rand;
const { CardRarity: CardRarity$1, probabilityMap: probabilityMap$1, CardCategory: CardCategory$1, Faction, UnitSubType, UnitType } = commonTypes$1;
const { addUnitTarget, refundLastSpell, getCurrentTargets, addTarget, defaultTargetsForAllowNonUnitTargetTargetingSpell } = cards$1;
const { isUnit, addModifier } = Unit;
const targetArrowCardId = "Target Arrow";
const id = "Target Random";
const spell$1 = {
  card: {
    id,
    category: CardCategory$1.Targeting,
    supportQuantity: false,
    manaCost: 8,
    healthCost: 0,
    expenseScaling: 1,
    probability: probabilityMap$1[CardRarity$1.SPECIAL],
    thumbnail: "spellmasons-mods/Mana Evolution/images/target around.png",
    replaces: [targetArrowCardId],
    requiresFollowingCard: true,
    description: ["Targets a random entity."],
    allowNonUnitTarget: true,
    effect: async (state, card, quantity, underworld, prediction, outOfRange) => {
      var _a;
      const targets = getCurrentTargets(state);
      const unTargetedUnits = underworld.getPotentialTargets(prediction).filter((hs) => isUnit(hs) && !targets.includes(hs));
      if (unTargetedUnits.length === 0) {
        refundLastSpell(state, prediction, "No untargeted entities remaining, mana refunded");
        return state;
      }
      const seed = seedrandom(`${getUniqueSeedString(underworld, state.casterPlayer)}${state.casterUnit.mana}${state.casterUnit.manaMax}${state.casterUnit.stamina}${(_a = state.casterPlayer) == null ? void 0 : _a.inventory}`);
      addTarget(chooseOneOfSeeded(unTargetedUnits, seed), state, underworld, prediction);
      return state;
    }
  }
};
const mod$1 = {
  modName: "Mana Evolution",
  author: "Bug Jones",
  description: "Adds new upgrades to existing spells that change their playstyles and uses in interesting ways.",
  screenshot: "spellmasons-mods/Mana Evolution/images/growth.png",
  spells: [
    spell$a,
    spell$9,
    spell$8,
    spell$7,
    spell$6,
    spell$5,
    spell$4,
    spell$3,
    spell$2,
    spell$1
  ],
  spritesheet: "spellmasons-mods/Mana_Evolution/images/spritesheet.json",
  sfx: {}
};
const {
  cards,
  FloatingText,
  config,
  CardUI,
  commonTypes
} = globalThis.SpellmasonsAPI;
const { CardRarity, probabilityMap, CardCategory } = commonTypes;
const Cards = cards;
const sellCardId = "Sell For Deathmason";
const spell = {
  card: {
    id: sellCardId,
    replaces: [],
    category: CardCategory.Blessings,
    supportQuantity: false,
    manaCost: 10,
    healthCost: 0,
    expenseScaling: 1,
    probability: probabilityMap[CardRarity.RARE],
    thumbnail: "spellIconSell.png",
    allowNonUnitTarget: true,
    requiresFollowingCard: true,
    ignoreRange: true,
    animationPath: "",
    sfx: "",
    omitForWizardType: ["Spellmason", "Goru"],
    description: ["spell_sell"],
    frontload: true,
    effect: async (state, card, quantity, underworld, prediction) => {
      const sellIndex = state.cardIds.indexOf(sellCardId);
      if (sellIndex !== 0) {
        FloatingText.default({ coords: state.castLocation, text: "sell error" });
        return state;
      }
      if (!prediction && state.casterPlayer) {
        const cardsToSell = Array.from(new Set(state.cardIds.slice(sellIndex + 1)));
        const sellValues = cardsToSell.map((cardId2) => {
          var _a, _b;
          const card2 = Cards.allCards[cardId2];
          if (card2 && state.casterPlayer) {
            if (state.casterPlayer.unit.charges) {
              state.casterPlayer.unit.charges[cardId2] = 0;
            }
            const highestSellVal = underworld.rules.STAT_POINTS_PER_LEVEL * 2;
            let sellValue;
            const isSummonCard = (_a = card2.thumbnail) == null ? void 0 : _a.startsWith("spellIconSummon_");
            if (isSummonCard && !isNullOrUndef(card2.soulFragmentCostOverride)) {
              sellValue = Math.round(Math.min(card2.soulFragmentCostOverride * 10, highestSellVal));
            } else {
              const rarity = ((_b = Object.entries(probabilityMap).find(([rarity2, probability]) => probability === card2.probability)) == null ? void 0 : _b[0]) || CardRarity.COMMON;
              const sellValues2 = {
                [CardRarity.COMMON]: highestSellVal / 8,
                [CardRarity.SPECIAL]: highestSellVal / 6,
                [CardRarity.UNCOMMON]: highestSellVal / 4,
                [CardRarity.RARE]: highestSellVal / 2,
                [CardRarity.FORBIDDEN]: highestSellVal,
                [CardRarity.RUNIC]: highestSellVal / 2
              };
              sellValue = Math.round(sellValues2[rarity]);
            }
            state.casterPlayer.statPointsUnspent += sellValue;
            return `${card2.id}: ${sellValue} SP`;
          } else {
            return "";
          }
        });
        if (!state.casterPlayer.disabledCards) {
          state.casterPlayer.disabledCards = [];
        }
        state.casterPlayer.disabledCards.push(...cardsToSell);
        state.casterPlayer.cardsInToolbar = state.casterPlayer.cardsInToolbar.map((cardId2) => cardsToSell.includes(cardId2) ? "" : cardId2);
        if (state.casterPlayer === globalThis.player) {
          FloatingText.default({ coords: state.castLocation, text: sellValues.join("\n") });
          CardUI.recalcPositionForCards(globalThis.player, underworld);
          CardUI.syncInventory(void 0, underworld);
        }
      }
      state.cardIds = [];
      return state;
    }
  }
};
const mod = {
  modName: "Sell for Deathmason",
  author: "GoldenQuiche",
  description: "Adds Sell for Deathmason, which is not available in vanilla because it would be broken with him",
  screenshot: "spellmasons-mods/SellforDeathmason/SellforDeathmasonImage.png",
  spells: [
    spell
  ]
};
const mods = [
  mod$a,
  mod$9,
  mod$8,
  mod$7,
  mod$6,
  mod$5,
  mod$4,
  mod$3,
  mod$2,
  // Forcefield,
  mod$1,
  mod
];
globalThis.mods = globalThis.mods !== void 0 ? [...globalThis.mods, ...mods] : mods;
console.log("Mods: Add mods!", globalThis.mods);
