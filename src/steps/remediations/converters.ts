import { createIntegrationEntity } from '@jupiterone/integration-sdk-core';
import { Remediation } from '../../types';
import { Entities } from '../constants';

function getRemediationKey(id: string): string {
  return `remediation:${id}`;
}

export function createRemediationEntity(data: Remediation) {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _class: Entities.REMEDIATION._class,
        _type: Entities.REMEDIATION._type,
        _key: getRemediationKey(data.remediationId),
        name: data.remediationId,
        start: data.start,
        end: data.end,
        malopId: data.malopId,
        id: data.remediationId,
        initiatingUser: data.initiatingUser,
        machineId: data.statusLog.length > 0 ? data.statusLog[0].machineId : '',
        targetId: data.statusLog.length > 0 ? data.statusLog[0].targetId : '',
      },
    },
  });
}
