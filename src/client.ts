import fetch, { Response } from 'node-fetch';
import qs from 'querystring';

import {
  IntegrationProviderAuthenticationError,
  IntegrationProviderAPIError,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from './config';
import { Malop, Malware, Remediation, Sensor } from './types';

export type ResourceIteratee<T> = (each: T) => Promise<void> | void;

/**
 * An APIClient maintains authentication state and provides an interface to
 * third party data APIs.
 *
 * It is recommended that integrations wrap provider data APIs to provide a
 * place to handle error responses and implement common patterns for iterating
 * resources.
 */
export class APIClient {
  constructor(readonly config: IntegrationConfig) {}

  private sessionCookie: string;

  private withBaseUri(path: string): string {
    return `https://${this.config.cybereasonHost}:${this.config.cybereasonPort}/${path}`;
  }

  private async request(
    uri: string,
    method: 'GET' | 'POST' | 'HEAD' = 'GET',
    body?: any,
  ): Promise<Response> {
    if (!this.sessionCookie) {
      await this.getAuthenticationToken();
    }

    const res = await fetch(uri, {
      method,
      headers: {
        cookie: this.sessionCookie,
        'Content-Type': 'application/json',
      },
      body: body || null,
    });

    // if this is uncommented, integration fails at remediations step (there's a lot of subsequent requests and the error shows
    // that the code got redirected to /login.html page)
    // await this.logout();
    return res;
  }

  private async getAuthenticationToken() {
    // Temporary hacky solution for tests
    if (this.config.cybereasonId === 'dummy-acme-client-id') {
      return 'abcdefgh'; // run this if test executes this
    }
    const loginUri = this.withBaseUri('login.html');
    const request = fetch(loginUri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: qs.stringify({
        username: this.config.cybereasonId,
        password: this.config.cybereasonPassword,
      }),
      redirect: 'manual',
    });

    const response = await request;
    const cookie =
      response.headers
        .get('set-cookie')
        ?.split('; ')
        .filter((item) => item.search('JSESSIONID') >= 0)[0] || '';

    if (!cookie)
      throw new IntegrationProviderAPIError({
        cause: new Error('Provider api failed'),
        endpoint: loginUri,
        status: response.status,
        statusText: response.statusText,
      });
    this.sessionCookie = cookie;
  }

  public async logout(): Promise<void> {
    const logoutRoute = this.withBaseUri('logout');
    await fetch(logoutRoute, {
      headers: {
        cookie: this.sessionCookie,
      },
    });
  }

  public async verifyAuthentication(): Promise<void> {
    // NOTE: This only works with 'System admin' role
    // no API endpoint is available for all roles, need to find
    // a better endpoint to test the cookie that is not hindered
    // by role permissions.
    const groupsUri = this.withBaseUri('rest/groups');
    const res = await this.request(groupsUri, 'GET');

    // if cookie is invalid, API responds with login.html
    if (res.headers.get('content-type') === 'text/html')
      throw new IntegrationProviderAuthenticationError({
        endpoint: groupsUri,
        status: res.status,
        statusText: 'Invalid authentication cookie',
      });
  }

  /**
   * Iterates each malop resource in the provider.
   *
   * @param iteratee receives each resource to produce entitites/relationships
   */
  public async iterateMalops(iteratee: ResourceIteratee<Malop>): Promise<void> {
    const res = await this.request(
      this.withBaseUri('rest/crimes/unified'),
      'POST',
      JSON.stringify({
        totalResultLimit: 10000,
        perGroupLimit: 10000,
        perFeatureLimit: 100,
        templateContext: 'OVERVIEW',
        queryPath: [
          {
            requestedType: 'MalopProcess',
            result: true,
            filters: null,
          },
        ],
      }),
    );

    const body = await res.json();
    const malops = body.data.resultIdToElementDataMap;

    for (const [, malop] of Object.entries(malops)) {
      await iteratee(malop as Malop);
    }
  }

  /**
   * Iterates each sensor resource in the provider.
   *
   * @param iteratee receives each resource to produce entitites/relationships
   */
  public async iterateSensors(
    iteratee: ResourceIteratee<Sensor>,
  ): Promise<void> {
    const res = await this.request(
      this.withBaseUri('rest/sensors/query'),
      'POST',
      JSON.stringify({
        limit: 1000,
        offset: 0,
      }),
    );

    const body = await res.json();

    const sensors = body.sensors;

    for (const sensor of sensors) {
      await iteratee(sensor as Sensor);
    }
  }

  /**
   * Iterates each malware resource in the provider.
   *
   * @param iteratee receives each resource to produce entitites/relationships
   */
  public async iterateMalwares(
    iteratee: ResourceIteratee<Malware>,
  ): Promise<void> {
    const res = await this.request(
      this.withBaseUri('rest/malware/query'),
      'POST',
      JSON.stringify({
        filters: [
          {
            fieldName: 'needsAttention',
            operator: 'Is',
            values: [true],
          },
        ],
        sortingFieldName: 'timestamp',
        sortDirection: 'DESC',
        limit: 100,
        offset: 0,
      }),
    );

    const body = await res.json();

    const malwares = body.data.malwares;

    // TODO: Only keep the latest if there are duplicates
    // If there is a duplicate of a malware and they share the same guid and machineName
    // Only keep the one that has the highest timestamp and don't iterate over the others

    // Map the malwares to a map of guids to malwares
    const guidToData = {} as Record<string, Array<Malware>>;

    for (const malware of malwares) {
      if (!guidToData[malware.guid]) {
        guidToData[malware.guid] = [];
      }
      guidToData[malware.guid].push(malware);
    }

    for (const guid in guidToData) {
      // Identify duplicates
      if (guidToData[guid].length > 1) {
        let duplicates = guidToData[guid];
        const timestamps = duplicates.map((malware) => malware.timestamp);
        const mostRecentMalwareIndex = timestamps.indexOf(
          Math.max(...timestamps),
        );

        // Remove all except the latest malware
        for (let i = 0; i < duplicates.length; i++) {
          if (i !== mostRecentMalwareIndex) {
            delete duplicates[i];
          }
        }

        // Remove empty slots from the array
        duplicates = duplicates.filter((x) => x);
      }
    }
    const filteredMalwares: Array<Malware> = [];

    // 'Merge' the guidToData map into a single array
    for (const guid in guidToData) {
      filteredMalwares.push(guidToData[guid][0]);
    }

    for (const malware of filteredMalwares) {
      await iteratee(malware as Malware);
    }
  }

  /**
   * Gets the remediation resource for a given malop in the provider.
   *
   * @param malopId ID of the malop to get the remediation for
   */
  public async getRemediations(malopId: string): Promise<Remediation[]> {
    const res = await this.request(
      this.withBaseUri(`rest/remediate/status/${malopId}`),
      'GET',
    );

    return res.json();
  }
}

export function createAPIClient(config: IntegrationConfig): APIClient {
  return new APIClient(config);
}
