import { StepEntityMetadata } from '@jupiterone/integration-sdk-core';

export const MALOP_ENTITY_KEY = 'entity:malop';

export const Entities: Record<'MALOP', StepEntityMetadata> = {
  MALOP: {
    resourceName: 'Malop',
    _type: 'malop',
    _class: 'Risk',
  },
};

export enum IntegrationSteps {
  MALOPS = 'fetch-malops',
}
