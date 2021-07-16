import {
  RelationshipClass,
  StepEntityMetadata,
  StepRelationshipMetadata,
} from '@jupiterone/integration-sdk-core';

export const Entities: Record<
  'MALOP' | 'SENSOR' | 'MALWARE' | 'REMEDIATION',
  StepEntityMetadata
> = {
  MALOP: {
    resourceName: 'Malop',
    _type: 'malop',
    _class: 'Risk',
  },
  SENSOR: {
    resourceName: 'Sensor',
    _type: 'sensor',
    _class: 'Scanner',
  },
  MALWARE: {
    resourceName: 'Malware',
    _type: 'malware',
    _class: 'Finding',
  },
  REMEDIATION: {
    resourceName: 'Remediation',
    _type: 'remediation',
    _class: 'Control',
  },
};

export enum IntegrationSteps {
  MALOPS = 'fetch-malops',
  SENSORS = 'fetch-sensors',
  MALWARES = 'fetch-malwares',
  REMEDIATIONS = 'fetch-remediations',
}

export const Relationships: Record<
  'MALOP_HAS_REMEDIATION',
  StepRelationshipMetadata
> = {
  MALOP_HAS_REMEDIATION: {
    _type: 'malop_has_remediation',
    _class: RelationshipClass.HAS,
    sourceType: Entities.MALOP._type,
    targetType: Entities.REMEDIATION._type,
  },
};
