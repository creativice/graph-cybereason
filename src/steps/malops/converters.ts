import { createIntegrationEntity } from '@jupiterone/integration-sdk-core';
import { Malop } from '../../types';
import { Entities } from '../constants';

function getMalopKey(id: string): string {
  return `malop:${id}`;
}

export function createMalopEntity(data: Malop) {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _class: Entities.MALOP._class,
        _type: Entities.MALOP._type,
        _key: getMalopKey(data.guidString),
        displayName: data.guidString, // Doubtful if this is needed
      },
    },
  });
}
