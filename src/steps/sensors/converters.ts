import { createIntegrationEntity } from '@jupiterone/integration-sdk-core';
import { Sensor } from '../../types';
import { Entities } from '../constants';

function getSensorKey(id: string): string {
  return `sensor:${id}`;
}

export function createSensorEntity(data: Sensor) {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _class: Entities.SENSOR._class,
        _type: Entities.SENSOR._type,
        _key: getSensorKey(data.guid),
        name: data.guid,
        category: ['sensor'],
        // TODO: can you map all the fields in here?
        // Similar to malops/converter.ts (just you don't have use the custom map function)
      },
    },
  });
}
