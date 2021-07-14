import { accountSteps } from './account';
import { accessSteps } from './access';
import { malopSteps } from './malops';

const integrationSteps = [...accountSteps, ...accessSteps, ...malopSteps];

export { integrationSteps };
