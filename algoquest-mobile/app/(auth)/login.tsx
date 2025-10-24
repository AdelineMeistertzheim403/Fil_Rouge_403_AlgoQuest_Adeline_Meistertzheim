import React, { useState } from 'react'
import { useRouter, Href } from 'expo-router'
import { View, Text, TextInput, Alert, TouchableOpacity } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { login as loginService } from '@/services/userService'
import { globalStyles } from '@/src/styles/globalStyles'
import Logo from '../../assets/images/logoAlgoQuest.svg'
import { useAuth } from '@/src/context/AuthContext'

interface User {
  id: string;
  pseudo: string;
  email: string;
  role: string;
}

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      // 1️⃣ Appel à l’API
      const data = await loginService(email, password);

      // 2️⃣ Extraire les tokens
      const { accessToken, refreshToken, ...userData } = data;

      // 3️⃣ Sauvegarde locale
      await AsyncStorage.setItem("user", JSON.stringify(userData));
      await AsyncStorage.setItem("accessToken", accessToken);
      await AsyncStorage.setItem("refreshToken", refreshToken);

      // 4️⃣ Mise à jour du contexte global
      login(userData, accessToken);

      // 5️⃣ Message de succès
      Alert.alert("Connexion réussie", `Bienvenue ${userData.pseudo}`);

      // 6️⃣ Redirection selon le rôle
      if (userData.role === "ADMIN") {
        router.replace("/(admin)/dashboard" as Href);
      } else {
        router.replace("/(user)/enigmes/listEnigme" as Href);
      }
    } catch (err: any) {
      console.error("Erreur de connexion :", err.response?.data || err.message);
      Alert.alert("Erreur", "Identifiants incorrects ou problème de connexion");
    }
  };

  return (
    <View style={globalStyles.container}>
      <Logo width={180} height={80} style={globalStyles.logo} />
      <Text style={globalStyles.title}>Connexion</Text>

      <TextInput
        style={globalStyles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        style={globalStyles.input}
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={globalStyles.button} onPress={handleLogin}>
        <Text style={globalStyles.buttonText}>Se connecter</Text>
      </TouchableOpacity>

      <TouchableOpacity style={globalStyles.button}>
        <Text
          style={globalStyles.buttonText}
          onPress={() => router.push('./register' as Href)}
        >
          Pas de compte ? S&apos;inscrire
        </Text>
      </TouchableOpacity>
    </View>
  );
}
