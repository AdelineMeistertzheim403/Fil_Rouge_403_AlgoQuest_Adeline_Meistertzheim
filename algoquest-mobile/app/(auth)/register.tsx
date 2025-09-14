import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, Href } from "expo-router";
import { api } from "../../src/api/client";
import { login } from "@/services/userService";

export default function RegisterScreen() {
    const router = useRouter();
    const [pseudo, setPseudo] = useState("");
    const [email, setEmail] = useState("");
    const [password, setpassword] = useState("");

    const handleRegister = async () => {
        try {
            const response = await api.post("/users/register", { pseudo, email, password, role: "UTILISATEUR" });
            const { token, user } = await login(email, password);

            await AsyncStorage.setItem("token", token);

            Alert.alert("Inscription réussie", `Bienvenue ${user.pseudo}`);
            router.replace("/(user)/enigmes/index" as Href);
        } catch (err: any) {
            console.error(err);
            Alert.alert("Erreur", "Impossible de créer le compte");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Inscription</Text>
            <TextInput
                style={styles.input}
                placeholder="Pseudo"
                value={pseudo}
                onChangeText={setPseudo}
            />
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
            <Button title="S'inscrire" onPress={handleRegister} />
            <Button
                title="Déjà un compte ? Se connecter"
                onPress={() => router.push("./login" as Href)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", padding: 20 },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
    input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10, borderRadius: 5 },
});
