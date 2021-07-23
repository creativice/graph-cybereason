import { createIntegrationEntity } from '@jupiterone/integration-sdk-core';
import { Sensor } from '../../types';
import { Entities } from '../constants';

function getSensorKey(id: string): string {
  return `sensor:${id}`;
}

export function createSensorEntity(data: Sensor) {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _class: Entities.SENSOR._class,
        _type: Entities.SENSOR._type,
        _key: getSensorKey(data.guid),
        name: data.guid,
        category: ['sensor'],
        // TODO: can you map all the fields in here?
        // Similar to malops/converter.ts (just you don't have use the custom map function)
        sensorId: data.sensorId,
        pylumId: data.pylumId,
        guid: data.guid,
        fqdn: data.fqdn,
        machineName: data.machineName,
        internalIpAddress: data.internalIpAddress,
        externalIpAddress: data.externalIpAddress,
        siteName: data.siteName, // Unclear
        siteId: data.siteId, // Unclear
        ransomwareStatus: data.ransomwareStatus,
        preventionStatus: data.preventionStatus,
        isolated: data.isolated,
        disconnectionTime: data.disconnectionTime,
        lastPylumInfoMsgUpdateTime: data.lastPylumInfoMsgUpdateTime,
        status: data.status,
        onlineTimeMS: data.onlineTimeMS,
        offlineTimeMS: data.offlineTimeMS,
        staleTimeMS: data.staleTimeMS,
        archiveTimeMS: data.archiveTimeMS,
        statusTimeMS: data.statusTimeMS,
        lastStatusAction: data.lastStatusAction,
        archivedOrUnarchiveComment: data.archivedOrUnarchiveComment,
        sensorArchivedByUser: data.sensorArchivedByUser,
        serverName: data.serverName,
        serverId: data.serverId,
        osType: data.osType,
        osVersionType: data.osVersionType,
        collectionStatus: data.collectionStatus,
        version: data.version,
        firstSeenTime: data.firstSeenTime,
        upTime: data.upTime,
        cpuUsage: data.cpuUsage,
        memoryUsage: data.memoryUsage,
        outdated: data.outdated,
        amStatus: data.amStatus,
        powerShellStatus: data.powerShellStatus,
        antiMalwareStatus: data.antiMalwareStatus,
        organization: data.organization,
        proxyAddress: data.proxyAddress, // Unclear
        preventionError: data.preventionError, // Unclear
        exitReason: data.exitReason,
        actionsInProgess: data.actionsInProgess,
        pendingActions: data.pendingActions, // Unclear
        lastUpgradeResult: data.lastUpgradeResult, // Unclear
        lastUpgradeSteps: data.lastUpgradeSteps, // Unclear
        disconnected: data.disconnected,
        sensorLastUpdate: data.sensorLastUpdate,
        fullScanStatus: data.fullScanStatus,
        quickScanStatus: data.quickScanStatus,
        lastFullScheduleScanSuccessTime: data.lastFullScheduleScanSuccessTime,
        lastQuickScheduleScanSuccessTime: data.lastQuickScheduleScanSuccessTime,
      },
    },
  });
}
