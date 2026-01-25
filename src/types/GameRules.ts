import * as config from '../config';
import * as storage from '../storage';

export interface IGameRules {
  PLAYER_BASE_STAMINA: number;
}

export function getDefaultGameRules(): IGameRules {
  return {
    PLAYER_BASE_STAMINA: config.PLAYER_BASE_STAMINA,
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
