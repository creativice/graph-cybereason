import {
  createMockStepExecutionContext,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import { fetchRemediations } from '.';
import { integrationConfig } from '../../../test/config';
import { setupCybereasonRecording } from '../../../test/recording';
import { IntegrationConfig } from '../../config';
import { Entities } from '../constants';

describe('#fetchRemediations', () => {
  let recording: Recording;

  beforeEach(() => {
    recording = setupCybereasonRecording({
      directory: __dirname,
      name: 'fetchRemediations',
      options: {
        recordFailedRequests: true,
      },
    });
  });

  afterEach(async () => {
    await recording.stop();
  });

  test('should collect data', async () => {
    const context = createMockStepExecutionContext<IntegrationConfig>({
      instanceConfig: integrationConfig,
    });

    await fetchRemediations(context);

    expect({
      numCollectedEntities: context.jobState.collectedEntities.length,
      numCollectedRelationships: context.jobState.collectedRelationships.length,
      collectedEntities: context.jobState.collectedEntities,
      collectedRelationships: context.jobState.collectedRelationships,
      encounteredTypes: context.jobState.encounteredTypes,
    }).toMatchSnapshot();

    const malops = context.jobState.collectedEntities.filter((e) =>
      e._class.includes(Entities.REMEDIATION._class as string),
    );
    expect(malops.length).toBeGreaterThan(0);
    expect(malops).toMatchGraphObjectSchema({
      _class: [Entities.REMEDIATION._class as string],
      schema: {
        additionalProperties: false,
        properties: {
          _rawData: {
            type: 'array',
            items: { type: 'object' },
          },
          _type: { const: Entities.REMEDIATION._type },
          name: { type: 'string' },
          id: { type: 'string' },
          malopId: { type: 'string' },
          start: { type: 'number' },
          end: { type: 'number' },
          initiatingUser: { type: 'string' },
          machineId: { type: 'string' },
          targetId: { type: 'string' },
        },
      },
    });
  });
});
