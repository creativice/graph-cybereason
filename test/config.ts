import * as dotenv from 'dotenv';
import * as path from 'path';
import { IntegrationConfig } from '../src/config';

if (process.env.LOAD_ENV) {
  dotenv.config({
    path: path.join(__dirname, '../.env'),
  });
}
const DEFAULT_CYBEREASON_ID = 'dummy-acme-client-id';
const DEFAULT_CYBEREASON_SECRET = 'dummy-acme-client-secret';
const DEFAULT_CYBEREASON_HOST = 'integration.cybereason.net';
const DEFAULT_CYBEREASON_PORT = '8443';

export const integrationConfig: IntegrationConfig = {
  cybereasonId: process.env.CYBEREASON_ID || DEFAULT_CYBEREASON_ID,
  cybereasonPassword:
    process.env.CYBEREASON_PASSWORD || DEFAULT_CYBEREASON_SECRET,
  cybereasonHost: process.env.CYBEREASON_HOST || DEFAULT_CYBEREASON_HOST,
  cybereasonPort: process.env.CYBEREASON_PORT || DEFAULT_CYBEREASON_PORT,
};
