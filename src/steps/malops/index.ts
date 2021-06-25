import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';
import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { Entities, IntegrationSteps } from '../constants';
import { createMalopEntity } from './converters';

export async function fetchMalops({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);
  await apiClient.iterateMalops(async (malop) => {
    const malopEntity = createMalopEntity(malop);
    await jobState.addEntity(malopEntity);
  });
}

export const malopSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: IntegrationSteps.MALOPS,
    name: 'Fetch Malops',
    entities: [Entities.MALOP],
    relationships: [],
    executionHandler: fetchMalops,
  },
];
