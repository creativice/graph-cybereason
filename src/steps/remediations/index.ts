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

  // A lot of rememdiation calls end up with empty []
  // E.g. there are no remediations for such malop
  // Would be great if we can find if there's some link between malop and its remediations
  // For example, if the malop has some field value of X, maybe that means remediation exists for it

  // TODO: Find link between malop and existance of remediation, if any exists
  // TODO: Furthermore this endpoint takes a while because we have to ask it for every single malop, would be great if there exists a more generic endpoint that returns all remediations and
  // then we can manually connect them with all the malops we've fetched

  // Placeholder for now, so that we don't have to wait a long time
  let count = 0;

  await jobState.iterateEntities(Entities.MALOP, async (malop) => {
    if (count >= 5) {
      return;
    }

    const remediations = await apiClient.getRemediations(malop.id as string);
    for (const remediation of remediations || []) {
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
    }

    count++;
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
