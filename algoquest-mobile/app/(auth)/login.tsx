import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, Href } from "expo-router";
import { api } from "../../src/api/client";
import { login } from "@/services/userService";

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setpassword] = useState("");

    const handleLogin = async () => {
        try {
            const response = await api.post("/users/login", { email, password });
            const { token, user } = await login(email, password);

            await AsyncStorage.setItem("token", token);

            Alert.alert("Connexion réussie", `Bienvenue ${user.pseudo}`);
            router.replace("/(admin)/dashboard" as Href);
        } catch (err: any) {
            console.error("Erreur", 'Identifiants incorrects');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Connexion</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Mot de passe"
                value={password}
                onChangeText={setpassword}
                secureTextEntry
            />
            <Button title="Se connecter" onPress={handleLogin} />
            <Button
                title="Pas de compte ? S'inscrire"
                onPress={() => router.push("/auth/register" as Href)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", padding: 20 },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
    input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10, borderRadius: 5 },
});
