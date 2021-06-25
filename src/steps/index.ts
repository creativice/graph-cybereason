import { malopSteps } from './malops';
import { sensorSteps } from './sensors';
import { malwareSteps } from './malwares';
import { remediationSteps } from './remediations';

const integrationSteps = [
  ...sensorSteps,
  ...malopSteps,
  ...malwareSteps,
  ...remediationSteps,
];

export { integrationSteps };
