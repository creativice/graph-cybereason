import { createIntegrationEntity } from '@jupiterone/integration-sdk-core';
import { Malop, SimpleMalopFeature } from '../../types';
import { Entities } from '../constants';

function getMalopKey(id: string): string {
  return `malop:${id}`;
}

function toBool(val: any) {
  if (val === 'true') {
    return true;
  }

  if (val === 'false') {
    return false;
  }

  return val;
}

function mapMalopSimpleFieldValue(
  value: SimpleMalopFeature,
): boolean | string | string[] | null {
  if (!value) {
    return null;
  }
  // We know the return type isn't going to be an array
  if (value.totalValues && value.totalValues === 1) {
    if (value.values && value.values.length > 0) {
      return toBool(value.values[0]);
    }
  }

  return value.values ? value.values.map((val) => toBool(val)) : null;
}

export function createMalopEntity(data: Malop) {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _class: Entities.MALOP._class,
        _type: Entities.MALOP._type,
        _key: getMalopKey(data.guidString),
        name: data.guidString,
        id: data.guidString,
        hasRansomwareSuspendedProcesses: mapMalopSimpleFieldValue(
          data.simpleValues.hasRansomwareSuspendedProcesses,
        ),
        decisionFeature: mapMalopSimpleFieldValue(
          data.simpleValues.decisionFeature,
        ),
        rootCauseElementCompanyProduct:
          mapMalopSimpleFieldValue(
            data.simpleValues.rootCauseElementCompanyProduct,
          ) || undefined,
        malopActivityTypes: mapMalopSimpleFieldValue(
          data.simpleValues.malopActivityTypes,
        ),
        malopStartTime: mapMalopSimpleFieldValue(
          data.simpleValues.malopStartTime,
        )
          ? parseInt(
              mapMalopSimpleFieldValue(
                data.simpleValues.malopStartTime,
              ) as string,
              10,
            )
          : undefined,
        detectionType: mapMalopSimpleFieldValue(
          data.simpleValues.detectionType,
        ),
        elementDisplayName: mapMalopSimpleFieldValue(
          data.simpleValues.elementDisplayName,
        ),
        creationTime: mapMalopSimpleFieldValue(data.simpleValues.creationTime)
          ? parseInt(
              mapMalopSimpleFieldValue(
                data.simpleValues.creationTime,
              ) as string,
              10,
            )
          : undefined,
        isBlocked: mapMalopSimpleFieldValue(data.simpleValues.isBlocked),
        rootCauseElementTypes: mapMalopSimpleFieldValue(
          data.simpleValues.rootCauseElementTypes,
        ),
        rootCauseElementNames: mapMalopSimpleFieldValue(
          data.simpleValues.rootCauseElementNames,
        ),
        malopLastUpdateTime: mapMalopSimpleFieldValue(
          data.simpleValues.malopLastUpdateTime,
        ),
        allRansomwareProcessesSuspended: mapMalopSimpleFieldValue(
          data.simpleValues.allRansomwareProcessesSuspended,
        ),
        managementStatus: mapMalopSimpleFieldValue(
          data.simpleValues.managementStatus,
        ),
        closeTime: mapMalopSimpleFieldValue(data.simpleValues.closeTime)
          ? parseInt(
              mapMalopSimpleFieldValue(data.simpleValues.closeTime) as string,
              10,
            )
          : undefined,
        closerName:
          mapMalopSimpleFieldValue(data.simpleValues.closerName) || undefined,
        // elementValues seem useful however they're not primitive types and neither arrays of primitive types
        // which means we couldn't just map them like above, it'd be best if we leave them for later and check with J1
        // sometimes this requires us to create new entities (that don't map to any of the endpoint API calls) but
        // that we can connect with this entity
        suspicions: data.suspicions || undefined,
        suspicionCount: data.suspicionCount,
        isMalicious: data.isMalicious,
        malopPriority: data.malopPriority || undefined,
        // Required fields for class "Assessment"
        category: 'Risk Assessment',
        summary:
          data.isMalicious === false ? 'Is not malicious' : 'Is malicious',
        internal: true,
      },
    },
  });
}
