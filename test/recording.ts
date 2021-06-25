import {
  Recording,
  setupRecording,
  SetupRecordingInput,
} from '@jupiterone/integration-sdk-testing';

export { Recording };

export function setupCybereasonRecording(
  input: Omit<SetupRecordingInput, 'mutateEntry'>,
): Recording {
  return setupRecording({
    ...input,
  });
}
