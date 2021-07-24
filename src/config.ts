import {
  IntegrationExecutionContext,
  IntegrationValidationError,
  IntegrationInstanceConfigFieldMap,
  IntegrationInstanceConfig,
} from '@jupiterone/integration-sdk-core';
import { createAPIClient } from './client';

export const instanceConfigFields: IntegrationInstanceConfigFieldMap = {
  cybereasonId: {
    type: 'string',
  },
  cybereasonPassword: {
    type: 'string',
    mask: true,
  },
  cybereasonHost: {
    type: 'string',
  },
  cybereasonPort: {
    type: 'string',
  },
};

export interface IntegrationConfig extends IntegrationInstanceConfig {
  /**
   * The provider API client ID used to authenticate requests.
   */
  cybereasonId: string;

  /**
   * The provider API client secret used to authenticate requests.
   */
  cybereasonPassword: string;

  /**
   * The provider API host.
   */
  cybereasonHost: string;

  /**
   * The provider API port.
   */
  cybereasonPort: string;
}

export async function validateInvocation(
  context: IntegrationExecutionContext<IntegrationConfig>,
) {
  const { config } = context.instance;

  if (
    !config.cybereasonId ||
    !config.cybereasonPassword ||
    !config.cybereasonHost ||
    !config.cybereasonPort
  ) {
    throw new IntegrationValidationError(
      'Config requires all of {cybereasonId, cybereasonPassword, cybereasonHost, cybereasonPort}',
    );
  }

  const apiClient = createAPIClient(config);
  await apiClient.verifyAuthentication();
}
