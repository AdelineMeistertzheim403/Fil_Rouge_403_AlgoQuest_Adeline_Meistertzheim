import { api } from "../src/api/client";
import { User, LoginResponse } from "../types/api";

export async function login(email: string, password: string): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>("/users/login", { email, password });
    return response.data;
}

export async function register(pseudo: string, email: string, password: string): Promise<User> {
    const response = await api.post<User>("/users/register", { pseudo, email, password: password });
    return response.data;
}

export async function getMe(token: string): Promise<User> {
    const response = await api.get<User>("/users/me", {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
}
