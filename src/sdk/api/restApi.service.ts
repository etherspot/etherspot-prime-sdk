import fetch from 'cross-fetch';
import { stringify } from 'qs';
import { QueryParams } from './interfaces';
import { BACKEND_API_ENDPOINT } from './constants';

export class RestApiService {
  async makeRequest(endpoint: string, method = 'GET', queryParams = {}, body = null) {
    const queryString = stringify(this.buildQueryParams(queryParams), { indices: false });
    const url = new URL(`${BACKEND_API_ENDPOINT}/${endpoint}?${queryString}`);

    const requestOptions = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : null,
    };

    try {
      const response = await fetch(url.toString(), requestOptions);

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Invalid API Key');
        }

        throw new Error(data.message || data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      throw new Error(error.message || 'Something went wrong');
    }
  }

  buildQueryParams(params: QueryParams): QueryParams {
    const queryParams: QueryParams = {};

    for (const key in params) {
      if (params.hasOwnProperty(key) && params[key] !== undefined && params[key] !== null) {
        queryParams[key] = params[key];
      }
    }

    return queryParams;
  }
}
