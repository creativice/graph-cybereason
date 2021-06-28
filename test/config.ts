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
const DEFAULT_CYBEREASON_HOST = 'dummy-acme-client-host';
const DEFAULT_CYBEREASON_PORT = 'dummy-acme-client-port';

export const integrationConfig: IntegrationConfig = {
  cybereasonId: process.env.CYBEREASON_ID || DEFAULT_CYBEREASON_ID,
  cybereasonPassword:
    process.env.CYBEREASON_SECRET || DEFAULT_CYBEREASON_SECRET,
  cybereasonHost:
    process.env.DEFAULT_CYBEREASON_HOST || DEFAULT_CYBEREASON_HOST,
  cybereasonPort:
    process.env.DEFAULT_CYBEREASON_PORT || DEFAULT_CYBEREASON_PORT,
};
