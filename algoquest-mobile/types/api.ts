export interface User {
  id: string;
  pseudo: string;
  email: string;
  role: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  id: string;
  pseudo: string;
  email: string;
  role: string;
}
