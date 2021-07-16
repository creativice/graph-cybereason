import { accountSteps } from './account';
import { accessSteps } from './access';
import { malopSteps } from './malops';
import { sensorSteps } from './sensors';
import { malwareSteps } from './malwares';

const integrationSteps = [
  ...accountSteps,
  ...accessSteps,
  ...sensorSteps,
  ...malopSteps,
  ...malwareSteps,
];

export { integrationSteps };
