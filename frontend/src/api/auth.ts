import apiClient from './client';

export interface LoginBody {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export async function login(body: LoginBody): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>('/auth/login', body);
  return data;
}
