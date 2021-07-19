import {
  RelationshipClass,
  StepEntityMetadata,
  StepRelationshipMetadata,
} from '@jupiterone/integration-sdk-core';

export const Entities: Record<
  'MALOP' | 'SENSOR' | 'MALWARE' | 'REMEDIATION',
  StepEntityMetadata
> = {
  // Assesment
  // "An object to represent an assessment, including both compliance assessment such as a HIPAA Risk Assessment or a technical assessment such as a Penetration Testing. Each assessment should have findings (e.g. Vulnerability or Risk) associated.",
  MALOP: {
    resourceName: 'Malop',
    _type: 'cybereason_malop',
    _class: 'Assessment',
  },
  SENSOR: {
    resourceName: 'Sensor',
    _type: 'cybereason_sensor',
    _class: 'Scanner',
  },
  MALWARE: {
    resourceName: 'Malware',
    _type: 'cybereason_malware',
    _class: 'Finding',
  },
  REMEDIATION: {
    resourceName: 'Remediation',
    _type: 'cybereason_remediation',
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
