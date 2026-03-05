import * as Unit from '../Unit';
import type { UnitSource } from './index';
import { UnitSubType } from '../../types/commonTypes';
import Underworld from '../../Underworld';

export const WARDEN_UNIT_ID = 'Warden';
const unit: UnitSource = {
  id: WARDEN_UNIT_ID,
  info: {
    description: 'warden description',
    image: 'warden/priestIdle',
    subtype: UnitSubType.SUPPORT_CLASS,
  },
  unitProps: {},
  animations: {
    idle: 'warden/priestIdle',
    hit: 'warden/priestHit',
    attack: 'warden/priestAttack',
    die: 'warden/priestDeath',
    walk: 'warden/priestWalk',
  },
  sfx: {
    damage: 'priestHurt',
    death: 'priestDeath',
  },
  action: async (_unit: Unit.IUnit, _attackTargets: Unit.IUnit[], _underworld: Underworld) => {
    // Warden is a player wizard type, not an AI enemy
  },
  getUnitAttackTargets: (_unit: Unit.IUnit, _underworld: Underworld) => {
    return [];
  }
};

export default unit;
