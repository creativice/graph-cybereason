import { StepEntityMetadata } from '@jupiterone/integration-sdk-core';

export const Entities: Record<
  'MALOP' | 'SENSOR' | 'MALWARE',
  StepEntityMetadata
> = {
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
  MALWARE: {
    resourceName: 'Malware',
    _type: 'malware',
    _class: 'Finding',
  },
};

export enum IntegrationSteps {
  MALOPS = 'fetch-malops',
  SENSORS = 'fetch-sensors',
  MALWARES = 'fetch-malwares',
}
