// src/utils/apiClient.ts

const API_BASE_URL = '/api/v1';

export class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse(response: Response) {
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new ApiError(response.status, errorBody.message || response.statusText);
  }
  return response.json();
}

type ApiClientOptions<T> = Omit<RequestInit, 'body'> & {
  body?: T;
};

export async function apiClient<T, R = any>(
  endpoint: string,
  options: ApiClientOptions<T> = {}
): Promise<R> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Pisahkan 'body' dari 'options' untuk mencegah tipe 'T' masuk ke 'config'
  const { body, ...otherOptions } = options;

  const config: RequestInit = {
    ...otherOptions, // 'body' tidak disertakan di sini
    headers,
  };

  // Tambahkan 'body' ke 'config' dengan tipe yang sesuai
  if (body !== undefined) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, config);
    return handleResponse(response);
  } catch (error) {
    console.error('API request failed:', error);
    throw new ApiError(500, 'Network error occurred');
  }
}
