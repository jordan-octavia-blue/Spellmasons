import * as storage from '../storage';

export interface IGameRules {
  PLAYER_BASE_HEALTH: number;
  UNIT_MOVE_SPEED: number;
  UNIT_BASE_DAMAGE: number;
  UNIT_BASE_RANGE: number;
  UNIT_BASE_STAMINA: number;
  UNIT_BASE_HEALTH: number;
  UNIT_BASE_MANA: number;
  PLAYER_BASE_ATTACK_RANGE: number;
  PLAYER_BASE_STAMINA: number;
  STARTING_CARD_COUNT: number;
  STAT_POINTS_PER_LEVEL: number;
  RUNES_PER_LEVEL: number;
  DEATHMASON_DISCARD_DRAW_RATIO: number;
  GORU_PLAYER_STARTING_SOUL_FRAGMENTS: number;
  GORU_SOUL_COLLECT_RADIUS: number;
  SOUL_FRAGMENTS_MAX_STARTING: number;
}

// Note: UNIT_BASE_RANGE was originally 10 + COLLISION_MESH_RADIUS * 2 where COLLISION_MESH_RADIUS = 32
export function getDefaultGameRules(): IGameRules {
  return {
    PLAYER_BASE_HEALTH: 60,
    UNIT_MOVE_SPEED: 0.15,
    UNIT_BASE_DAMAGE: 30,
    UNIT_BASE_RANGE: 74, // 10 + 32 * 2 (COLLISION_MESH_RADIUS * 2)
    UNIT_BASE_STAMINA: 300,
    UNIT_BASE_HEALTH: 40,
    UNIT_BASE_MANA: 60,
    PLAYER_BASE_ATTACK_RANGE: 200,
    PLAYER_BASE_STAMINA: 200,
    STARTING_CARD_COUNT: 3,
    STAT_POINTS_PER_LEVEL: 120,
    RUNES_PER_LEVEL: 6,
    DEATHMASON_DISCARD_DRAW_RATIO: 2,
    GORU_PLAYER_STARTING_SOUL_FRAGMENTS: 2,
    GORU_SOUL_COLLECT_RADIUS: 100,
    SOUL_FRAGMENTS_MAX_STARTING: 10,
  };
}

export function getStoredCustomRules(): IGameRules {
  const storedOptions = storage.get(storage.STORAGE_OPTIONS);
  if (storedOptions) {
    const options = JSON.parse(storedOptions);
    if (options.customRules) {
      console.trace('[SETUP] Load custom rules');
      return { ...getDefaultGameRules(), ...options.customRules };
    }
  }
  return getDefaultGameRules();
}
