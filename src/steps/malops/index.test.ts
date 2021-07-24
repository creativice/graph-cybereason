import {
  createMockStepExecutionContext,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import { fetchMalops } from '.';
import { integrationConfig } from '../../../test/config';
import { setupCybereasonRecording } from '../../../test/recording';
import { IntegrationConfig } from '../../config';

describe('#fetchMalops', () => {
  let recording: Recording;

  beforeEach(() => {
    recording = setupCybereasonRecording({
      directory: __dirname,
      name: 'fetchMalops',
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

    await fetchMalops(context);

    expect({
      numCollectedEntities: context.jobState.collectedEntities.length,
      numCollectedRelationships: context.jobState.collectedRelationships.length,
      collectedEntities: context.jobState.collectedEntities,
      collectedRelationships: context.jobState.collectedRelationships,
      encounteredTypes: context.jobState.encounteredTypes,
    }).toMatchSnapshot();

    const malops = context.jobState.collectedEntities.filter((e) =>
      e._class.includes('Assessment'),
    );
    expect(malops.length).toBeGreaterThan(0);
    expect(malops).toMatchGraphObjectSchema({
      _class: ['Assessment'],
      schema: {
        additionalProperties: false,
        properties: {
          _rawData: {
            type: 'array',
            items: { type: 'object' },
          },
          _type: { const: 'cybereason_malop' },
          name: { type: 'string' },
          id: { type: 'string' },
          hasRansomwareSuspendedProcesses: { type: 'boolean' },
          decisionFeature: { type: 'string' },
          rootCauseElementCompanyProduct: { type: 'string' },
          malopActivityTypes: { type: 'string' },
          malopStartTime: { type: 'number' },
          detectionType: { type: 'string' },
          elementDisplayName: { type: 'string' },
          creationTime: { type: 'number' },
          isBlocked: { type: 'boolean' },
          rootCauseElementTypes: { type: 'string' },
          rootCauseElementNames: { type: 'string' },
          malopLastUpdateTime: { type: 'string' },
          allRansomwareProcessesSuspended: { type: 'boolean' },
          managementStatus: { type: 'string' },
          closeTime: { type: 'number' },
          closerName: { type: 'string' },
          suspicions: { type: 'string' },
          suspicionCount: { type: 'number' },
          isMalicious: { type: 'boolean' },
          malopPriority: { type: 'string' },
          category: { type: 'string' },
          summary: { type: 'string' },
          internal: { type: 'boolean' },
        },
      },
    });
  });
});
