import {
  IntegrationProviderAPIError,
  IntegrationValidationError,
} from '@jupiterone/integration-sdk-core';
import {
  createMockExecutionContext,
  setupRecording,
} from '@jupiterone/integration-sdk-testing';
import { IntegrationConfig, validateInvocation } from './config';

it('requires valid config', async () => {
  const executionContext = createMockExecutionContext<IntegrationConfig>({
    instanceConfig: {} as IntegrationConfig,
  });

  await expect(validateInvocation(executionContext)).rejects.toThrow(
    IntegrationValidationError,
  );
});

it('auth error', async () => {
  const recording = setupRecording({
    directory: '__recordings__',
    name: 'client-auth-error',
  });

  recording.server.any().intercept((req, res) => {
    res.status(401);
  });

  const executionContext = createMockExecutionContext({
    instanceConfig: {
      cybereasonId: 'INVALID',
      cybereasonPassword: 'INVALID',
      cybereasonHost: 'INVALID',
      cybereasonPort: 'INVALID',
    },
  });

  // Change assertion to expect API error since host and port should be invalid
  await expect(validateInvocation(executionContext)).rejects.toThrow(
    IntegrationProviderAPIError,
  );
});
