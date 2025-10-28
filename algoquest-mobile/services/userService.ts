import { api } from "../src/api/client";
import { LoginResponse, User } from "../types/api";


// ✅ Connexion utilisateur
export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>(
    "/users/login",
    { email, password }
  );
  console.log("LOGIN RESPONSE:", response.data);
  return response.data;
};
// ✅ Inscription utilisateur
export const register = async (pseudo: string, email: string, password: string): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>(
    "/users/register",
    { pseudo, email, password }
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
