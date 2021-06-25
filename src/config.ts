import {
  IntegrationExecutionContext,
  IntegrationValidationError,
  IntegrationInstanceConfigFieldMap,
  IntegrationInstanceConfig,
} from '@jupiterone/integration-sdk-core';
import { createAPIClient } from './client';

/**
 * A type describing the configuration fields required to execute the
 * integration for a specific account in the data provider.
 *
 * When executing the integration in a development environment, these values may
 * be provided in a `.env` file with environment variables. For example:
 *
 * - `CLIENT_ID=123` becomes `instance.config.clientId = '123'`
 * - `CLIENT_SECRET=abc` becomes `instance.config.clientSecret = 'abc'`
 *
 * Environment variables are NOT used when the integration is executing in a
 * managed environment. For example, in JupiterOne, users configure
 * `instance.config` in a UI.
 */
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

/**
 * Properties provided by the `IntegrationInstance.config`. This reflects the
 * same properties defined by `instanceConfigFields`.
 */
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
