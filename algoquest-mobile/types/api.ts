export interface User {
  id: string;
  pseudo: string;
  email: string;
  role: string;
}

export interface LoginResponse extends User {
  token: string;
}
