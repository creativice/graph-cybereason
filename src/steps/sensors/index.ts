import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';
import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { Entities, IntegrationSteps } from '../constants';
import { createSensorEntity } from './converters';

export async function fetchSensors({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);
  await apiClient.iterateSensors(async (sensor) => {
    const sensorEntity = createSensorEntity(sensor);
    await jobState.addEntity(sensorEntity);
  });
}

export const sensorSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: IntegrationSteps.SENSORS,
    name: 'Fetch Sensors',
    entities: [Entities.SENSOR],
    relationships: [],
    executionHandler: fetchSensors,
  },
];
