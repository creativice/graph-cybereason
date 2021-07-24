import {
  createMockStepExecutionContext,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import { fetchSensors } from '.';
import { integrationConfig } from '../../../test/config';
import { setupCybereasonRecording } from '../../../test/recording';
import { IntegrationConfig } from '../../config';

describe('#fetchSensors', () => {
  let recording: Recording;

  beforeEach(() => {
    recording = setupCybereasonRecording({
      directory: __dirname,
      name: 'fetchSensors',
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

    await fetchSensors(context);

    expect({
      numCollectedEntities: context.jobState.collectedEntities.length,
      numCollectedRelationships: context.jobState.collectedRelationships.length,
      collectedEntities: context.jobState.collectedEntities,
      collectedRelationships: context.jobState.collectedRelationships,
      encounteredTypes: context.jobState.encounteredTypes,
    }).toMatchSnapshot();

    const malops = context.jobState.collectedEntities.filter((e) =>
      e._class.includes('Sensor'),
    );
    expect(malops.length).toBeGreaterThan(0);
    expect(malops).toMatchGraphObjectSchema({
      _class: ['Sensor'],
      schema: {
        additionalProperties: false,
        properties: {
          _rawData: {
            type: 'array',
            items: { type: 'object' },
          },
          _type: { const: 'cybereason_sensor' },
          name: { type: 'string' },
          id: { type: 'string' },
          sensorId: {
            type: 'string',
          },
          pylumId: {
            type: 'string',
          },
          guid: {
            type: 'string',
          },
          fqdn: {
            type: 'string',
          },
          machineName: {
            type: 'string',
          },
          internalIpAddress: {
            type: 'string',
          },
          externalIpAddress: {
            type: 'string',
          },
          siteName: {
            type: 'string',
          },
          siteId: {
            type: 'string',
          },
          ransomwareStatus: {
            type: 'string',
          },
          preventionStatus: {
            type: 'string',
          },
          isolated: {
            type: 'boolean',
          },
          disconnectionTime: {
            type: 'number',
          },
          lastPylumInfoMsgUpdateTime: {
            type: 'number',
          },
          status: {
            type: 'string',
          },
          onlineTimeMS: {
            type: 'number',
          },
          offlineTimeMS: {
            type: 'number',
          },
          staleTimeMS: {
            type: 'number',
          },
          archiveTimeMS: {
            type: 'number',
          },
          statusTimeMS: {
            type: 'number',
          },
          lastStatusAction: {
            type: 'string',
          },
          archivedOrUnarchiveComment: {
            type: 'string',
          },
          sensorArchivedByUser: {
            type: 'string',
          },
          serverName: {
            type: 'string',
          },
          serverId: {
            type: 'string',
          },
          osType: {
            type: 'string',
          },
          osVersionType: {
            type: 'string',
          },
          collectionStatus: {
            type: 'string',
          },
          version: {
            type: 'string',
          },
          firstSeenTime: {
            type: 'number',
          },
          upTime: {
            type: 'number',
          },
          cpuUsage: {
            type: 'number',
          },
          memoryUsage: {
            type: 'number',
          },
          outdated: {
            type: 'boolean',
          },
          amStatus: {
            type: 'string',
          },
          powerShellStatus: {
            type: 'string',
          },
          antiMalwareStatus: {
            type: 'string',
          },
          organization: {
            type: 'string',
          },
          proxyAddress: {
            type: 'string',
          },
          preventionError: {
            type: 'string',
          },
          exitReason: {
            type: 'string',
          },
          actionsInProgess: {
            type: 'number',
          },
          pendingActions: {
            type: 'number',
          },
          lastUpgradeResult: {
            type: 'string',
          },
          lastUpgradeSteps: {
            type: 'string',
          },
          disconnected: {
            type: 'boolean',
          },
          sensorLastUpdate: {
            type: 'number',
          },
          fullScanStatus: {
            type: 'string',
          },
          quickScanStatus: {
            type: 'string',
          },
          lastFullScheduleScanSuccessTime: {
            type: 'number',
          },
          lastQuickScheduleScanSuccessTime: {
            type: 'number',
          },
          category: { type: 'string' },
        },
      },
    });
  });
});
