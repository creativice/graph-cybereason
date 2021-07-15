import { accountSteps } from './account';
import { accessSteps } from './access';
import { malopSteps } from './malops';
import { sensorSteps } from './sensors';

const integrationSteps = [
  ...accountSteps,
  ...accessSteps,
  ...sensorSteps,
  ...malopSteps,
];

export { integrationSteps };
