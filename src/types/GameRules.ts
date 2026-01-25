import * as config from '../config';

export interface IGameRules {
  PLAYER_BASE_STAMINA: number;
}

export function getDefaultGameRules(): IGameRules {
  return {
    PLAYER_BASE_STAMINA: config.PLAYER_BASE_STAMINA,
  };
}
