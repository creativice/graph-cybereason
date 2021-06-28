import fetch, { Response } from 'node-fetch';
const querystring = require('querystring');

import {
  IntegrationProviderAPIError,
  IntegrationProviderAuthenticationError,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from './config';

export type ResourceIteratee<T> = (each: T) => Promise<void> | void;

type AcmeUser = {
  id: string;
  name: string;
};

type AcmeGroup = {
  id: string;
  name: string;
  users?: Pick<AcmeUser, 'id'>[];
};

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

  private withBaseUri(path: string): string {
    return `https://${this.config.cybereasonHost}:${this.config.cybereasonPort}/${path}`;
  }

  private async getRequest(uri: string, cookie: string): Promise<Response> {
    const response = await fetch(uri, {
      headers: {
        cookie,
      },
    });
    if (!response.ok) {
      throw new IntegrationProviderAPIError({
        endpoint: uri,
        status: response.status,
        statusText: response.statusText,
      });
    }
    return response;
  }

  private async postRequest(
    uri: string,
    body: any,
    dontRedirect?: boolean,
  ): Promise<Response> {
    const redirect = dontRedirect ? 'manual' : 'follow';

    const response = await fetch(uri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: querystring.stringify(body),
      redirect,
    });
    if (!(response.ok || (response.status === 302 && dontRedirect))) {
      throw new IntegrationProviderAPIError({
        endpoint: uri,
        status: response.status,
        statusText: response.statusText,
      });
    }
    return response;
  }

  public async login(): Promise<string> {
    const loginRoute = this.withBaseUri('login.html');
    const res = await this.postRequest(
      loginRoute,
      {
        username: this.config.cybereasonId,
        password: this.config.cybereasonPassword,
      },
      true,
    );
    return (
      res.headers
        .get('set-cookie')
        ?.split('; ')
        .filter((item) => item.search('JSESSIONID') >= 0)[0] || ''
    );
  }

  public async logout(cookie: string): Promise<void> {
    const logoutRoute = this.withBaseUri('logout');
    await this.getRequest(logoutRoute, cookie);
  }

  public async verifyAuthentication(): Promise<void> {
    const cookie = await this.login();

    // NOTE: This only works with 'System admin' role
    // no API endpoint is available for all roles, need to find
    // a better endpoint to test the cookie that is not hindered
    // by role permissions.
    const groupsUri = this.withBaseUri('rest/groups');
    const res = await this.getRequest(groupsUri, cookie);

    // if cookie is invalid, API responds with login.html
    if (res.headers.get('content-type') === 'text/html')
      throw new IntegrationProviderAuthenticationError({
        endpoint: groupsUri,
        status: res.status,
        statusText: res.statusText,
      });

    await this.logout(cookie);
  }

  /**
   * Iterates each user resource in the provider.
   *
   * @param iteratee receives each resource to produce entities/relationships
   */
  public async iterateUsers(
    iteratee: ResourceIteratee<AcmeUser>,
  ): Promise<void> {
    // TODO paginate an endpoint, invoke the iteratee with each record in the
    // page
    //
    // The provider API will hopefully support pagination. Functions like this
    // should maintain pagination state, and for each page, for each record in
    // the page, invoke the `ResourceIteratee`. This will encourage a pattern
    // where each resource is processed and dropped from memory.

    const users: AcmeUser[] = [
      {
        id: 'acme-user-1',
        name: 'User One',
      },
      {
        id: 'acme-user-2',
        name: 'User Two',
      },
    ];

    for (const user of users) {
      await iteratee(user);
    }
  }

  /**
   * Iterates each group resource in the provider.
   *
   * @param iteratee receives each resource to produce entities/relationships
   */
  public async iterateGroups(
    iteratee: ResourceIteratee<AcmeGroup>,
  ): Promise<void> {
    // TODO paginate an endpoint, invoke the iteratee with each record in the
    // page
    //
    // The provider API will hopefully support pagination. Functions like this
    // should maintain pagination state, and for each page, for each record in
    // the page, invoke the `ResourceIteratee`. This will encourage a pattern
    // where each resource is processed and dropped from memory.

    const groups: AcmeGroup[] = [
      {
        id: 'acme-group-1',
        name: 'Group One',
        users: [
          {
            id: 'acme-user-1',
          },
        ],
      },
    ];

    for (const group of groups) {
      await iteratee(group);
    }
  }
}

export function createAPIClient(config: IntegrationConfig): APIClient {
  return new APIClient(config);
}
