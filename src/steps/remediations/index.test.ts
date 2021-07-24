import {
  createMockStepExecutionContext,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import { fetchRemediations } from '.';
import { integrationConfig } from '../../../test/config';
import { setupCybereasonRecording } from '../../../test/recording';
import { IntegrationConfig } from '../../config';

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
      e._class.includes('Control'),
    );
    expect(malops.length).toBeGreaterThan(0);
    expect(malops).toMatchGraphObjectSchema({
      _class: ['Control'],
      schema: {
        additionalProperties: false,
        properties: {
          _rawData: {
            type: 'array',
            items: { type: 'object' },
          },
          _type: { const: 'cybereason_remediation' },
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
