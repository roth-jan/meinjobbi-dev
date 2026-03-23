import { API_ENDPOINTS, getFullApiUrl } from './api-config';

// Client-side token getter
function getClientToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem('jobbi-auth-storage');
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.state?.token || null;
    }
  } catch {
    // Invalid stored data
  }
  return null;
}

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  const text = await response.text();

  let data: T | null = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    // Response is not JSON
  }

  if (!response.ok) {
    const errorData = data as {
      message?: string;
      errors?: Record<string, string[]>;
    } | null;
    throw new ApiError(
      response.status,
      errorData?.message || response.statusText || 'An error occurred',
      errorData?.errors
    );
  }

  return data as T;
}

// Public endpoints that don't require authentication
const PUBLIC_ENDPOINTS = ['/werbung', '/jobad', '/cities', '/schools'];

function isPublicEndpoint(url: string): boolean {
  return PUBLIC_ENDPOINTS.some((endpoint) => url.startsWith(endpoint));
}

async function get<T>(url: string): Promise<T> {
  try {
    const response = await fetch(`${getFullApiUrl(url)}`, {
      method: 'GET',
    });
    return handleResponse<T>(response);
  } catch (error) {
    console.error(`Fetch error for ${getFullApiUrl(url)}:`, error);
    throw new ApiError(
      0,
      `Failed to fetch ${url}: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

async function requestWithBody<T>(
  method: 'POST' | 'PUT',
  url: string,
  body?: unknown,
  contentType?: string
): Promise<T> {
  const token = getClientToken();
  const needsAuth = !isPublicEndpoint(url);
  const apiUrl = getFullApiUrl(url);

  const headers: Record<string, string> = {};

  if (contentType) {
    headers['Content-Type'] = contentType;
  }

  if (needsAuth && token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let requestBody: string | FormData | URLSearchParams;

  if (body instanceof FormData) {
    requestBody = body;
    delete headers['Content-Type'];
  } else if (body instanceof URLSearchParams) {
    requestBody = body;
    if (!headers['Content-Type']) {
      headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }
  } else {
    requestBody = JSON.stringify(body);
    if (!headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }
  }

  try {
    const response = await fetch(apiUrl, {
      method,
      headers,
      body: requestBody,
    });

    return handleResponse<T>(response);
  } catch (error) {
    console.error(`${method} error for ${apiUrl}:`, error);
    throw new ApiError(
      0,
      `Failed to ${method} ${url}: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

async function post<T>(url: string, body?: unknown, contentType?: string): Promise<T> {
  return await requestWithBody<T>('POST', url, body, contentType);
}

async function put<T>(url: string, body?: unknown, contentType?: string): Promise<T> {
  return requestWithBody<T>('PUT', url, body, contentType);
}

async function del<T>(url: string): Promise<T> {
  const token = getClientToken();
  const needsAuth = !isPublicEndpoint(url);

  try {
    const response = await fetch(`${getFullApiUrl(url)}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(needsAuth && token && { Authorization: `Bearer ${token}` }),
      },
    });

    return handleResponse<T>(response);
  } catch (error) {
    console.error(`DELETE error for ${getFullApiUrl(url)}:`, error);
    throw new ApiError(
      0,
      `Failed to DELETE ${url}: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

export const fetchWrapper = {
  get,
  post,
  put,
  del,
};
