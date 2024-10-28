import { LoginResponse, UserResponse } from '@/lib/api/types';
import { useGlobalState } from '@/lib/store/global.store';
import { useUserStore } from '@/lib/store/user.store';

interface WinkRawApiResponse<T> {
  code: number;
  error: string;
  content: T;
}

export class WinkApiRequest {
  private readonly baseUrl: string = 'http://localhost:3000';

  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  public constructor() {
    if (typeof window === 'undefined') {
      return;
    }

    this.baseUrl = window.origin;

    const accessToken: string | null = localStorage.getItem('accessToken');
    const refreshToken: string | null = localStorage.getItem('refreshToken');

    if (accessToken && refreshToken) {
      this.setToken(accessToken, refreshToken);
    } else {
      useGlobalState.getState().setLoaded(true);
    }
  }

  private async request<T>(url: string, options: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}/api${url}`, options);

    const apiResponse: WinkRawApiResponse<T> = await response.json();

    if (apiResponse.error === '엑세스 토큰이 만료되었습니다.' && (await this.refresh())) {
      const headers = options.headers as Headers;
      headers.set('Authorization', `Bearer ${this.accessToken}`);

      return this.request(url, {
        ...options,
        headers,
      });
    }

    if (apiResponse.error) {
      toast.error(apiResponse.error);

      throw new Error(`${url} [${apiResponse.code}] ${apiResponse.error}`);
    }

    return apiResponse.content;
  }

  private async refresh(): Promise<boolean> {
    try {
      const { accessToken, refreshToken } = await this.post<LoginResponse>('/auth/refresh', {
        refreshToken: this.refreshToken,
      });

      this.setToken(accessToken, refreshToken);

      return true;
    } catch (_) {
      this.removeToken();

      return false;
    }
  }

  public async get<T>(url: string, body?: object | FormData): Promise<T> {
    return this.request(url, {
      method: 'GET',
      body: this.generateBody(body),
      headers: this.generateHeaders(body),
    });
  }

  public async post<T>(url: string, body?: object | FormData): Promise<T> {
    return this.request(url, {
      method: 'POST',
      body: this.generateBody(body),
      headers: this.generateHeaders(body),
    });
  }

  public async put<T>(url: string, body?: object | FormData): Promise<T> {
    return this.request(url, {
      method: 'PUT',
      body: this.generateBody(body),
      headers: this.generateHeaders(body),
    });
  }

  public async patch<T>(url: string, body?: object | FormData): Promise<T> {
    return this.request(url, {
      method: 'PATCH',
      body: this.generateBody(body),
      headers: this.generateHeaders(body),
    });
  }

  public async delete<T>(url: string, body?: object | FormData): Promise<T> {
    return this.request(url, {
      method: 'DELETE',
      body: this.generateBody(body),
      headers: this.generateHeaders(body),
    });
  }

  public setToken(accessToken: string, refreshToken: string) {
    if (typeof window === 'undefined') {
      throw new Error('This method is only available in the browser.');
    }

    this.accessToken = accessToken;
    this.refreshToken = refreshToken;

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);

    this.updateMember();
  }

  public removeToken() {
    if (typeof window === 'undefined') {
      throw new Error('This method is only available in the browser.');
    }

    this.accessToken = null;
    this.refreshToken = null;

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    this.updateMember();
  }

  private updateMember() {
    if (!this.accessToken) {
      useUserStore.getState().setUser(null);
      return;
    }

    (async () => {
      const response: UserResponse = await this.get('/auth/me');
      const { user } = response;

      useUserStore.getState().setUser(user);

      if (!useGlobalState.getState().loaded) {
        useGlobalState.getState().setLoaded(true);
      }
    })();
  }

  private generateBody(body?: object | FormData): string | FormData | null {
    if (!body) {
      return null;
    }

    if (body instanceof FormData) {
      return body;
    }

    return JSON.stringify(body);
  }

  private generateHeaders(body?: object | FormData): Headers {
    const headers = new Headers();

    headers.set('Accept', 'application/json');
    headers.set('Content-Type', 'application/json');

    if (this.accessToken) {
      headers.set('Authorization', `Bearer ${this.accessToken}`);
    }

    if (body && body instanceof FormData) {
      headers.delete('Content-Type');
    }

    return headers;
  }
}
