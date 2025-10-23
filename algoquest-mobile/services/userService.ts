import { api } from "../src/api/client";
import { LoginResponse, User } from "../types/api";
import axios from "axios";

// ✅ Connexion utilisateur
export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>(
    "http://10.0.2.2:8080/api/v1/users/login",
    { email, password },
    { headers: { "Content-Type": "application/json" } }
  );
  console.log("LOGIN RESPONSE:", response.data);
  return response.data;
};

// ✅ Inscription utilisateur
export const register = async (pseudo: string, email: string, password: string): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>(
    "http://10.0.2.2:8080/api/v1/users/register",
    { pseudo, email, password },
    { headers: { "Content-Type": "application/json" } }
  );
  console.log("REGISTER RESPONSE:", response.data);
  return response.data;
};

// ✅ Récupérer le profil connecté
export async function getMe(token: string): Promise<User> {
  const response = await api.get<User>("/users/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}
