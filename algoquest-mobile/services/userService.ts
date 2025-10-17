import { api } from "../src/api/client";
import { User } from "../types/api";
import axios from 'axios'

/*export async function login(email: string, password: string): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>("/users/login", { email, password });
    console.log('LOGIN RESPONSE:', response.data);
    return response.data;
}
*/
export const login = async (email: string, password: string) => {
  return axios.post('https://apialgoquest.adelinemeistertzheim.fr/api/v1/users/login', {
    email,
    password,
  }, {
    headers: { 'Content-Type': 'application/json' },
  })
  .then(res => res.data)
}


export async function register(pseudo: string, email: string, password: string): Promise<User> {
    const response = await api.post<User>("/users/register", { pseudo, email, password: password });
    console.log(response);
    return response.data;
}

export async function getMe(token: string): Promise<User> {
    const response = await api.get<User>("/users/me", {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
}
