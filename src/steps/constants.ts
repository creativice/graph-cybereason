import { StepEntityMetadata } from '@jupiterone/integration-sdk-core';

export const MALOP_ENTITY_KEY = 'entity:malop';

export const Entities: Record<'MALOP' | 'SENSOR', StepEntityMetadata> = {
  MALOP: {
    resourceName: 'Malop',
    _type: 'malop',
    _class: 'Risk',
  },
  SENSOR: {
    resourceName: 'Sensor',
    _type: 'sensor',
    _class: 'Scanner',
  },
};

export enum IntegrationSteps {
  MALOPS = 'fetch-malops',
  SENSORS = 'fetch-sensors',
}
