import {
  createDirectRelationship,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { Entities, IntegrationSteps, Relationships } from '../constants';
import { createRemediationEntity } from './converters';

export async function fetchRemediations({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  await jobState.iterateEntities(Entities.MALOP, async (malop) => {
    const remediation = await apiClient.getRemediation(malop.id as string);
    const remediationEntity = createRemediationEntity(remediation);
    await jobState.addEntity(remediationEntity);

    if (malop && remediationEntity) {
      await jobState.addRelationship(
        createDirectRelationship({
          _class: RelationshipClass.HAS,
          from: malop,
          to: remediationEntity,
        }),
      );
    }
  });
}

export const remediationSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: IntegrationSteps.REMEDIATIONS,
    name: 'Fetch Remediations',
    entities: [Entities.REMEDIATION],
    relationships: [Relationships.MALOP_HAS_REMEDIATION],
    dependsOn: [IntegrationSteps.MALOPS],
    executionHandler: fetchRemediations,
  },
];
