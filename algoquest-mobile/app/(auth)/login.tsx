import React, { useEffect, useState } from 'react'
import { useRouter, Href } from 'expo-router'
import { View, Text, TextInput, Alert, TouchableOpacity } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { api } from '../../src/api/client'
import { login as loginService } from '@/services/userService'
import { globalStyles } from '@/src/styles/globalStyles'
import Logo from '../../assets/images/logoAlgoQuest.svg'
import { useAuth } from '@/src/context/AuthContext'
import { synchronize } from '@/src/db/sync'

interface User {
  id: string;
  pseudo: string;
  email: string;
  role: string;
}

export default function LoginScreen() {
  const router = useRouter()
  const { login } = useAuth();
    const { user } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async () => {
    try {
      // 💡 Dis à TS que data est de type User & { token: string }
      const data: User & { token: string } = await loginService(email, password);

      // 👉 Sépare le token du reste des données
      const { token, ...user } = data;

      // 🔒 Sauvegarde dans le stockage local
      await AsyncStorage.setItem('user', JSON.stringify(user));
      await AsyncStorage.setItem('token', token);

      // 🔐 Met à jour le contexte
      login(user, token);

      // ✅ Message de succès
      Alert.alert('Connexion réussie', `Bienvenue ${user.pseudo}`);

      // 🚀 Redirection selon le rôle
      if (user.role === 'ADMIN') {
        router.replace('/(admin)/dashboard' as Href);
      } else {
        router.replace('/(user)/enigmes/listEnigme' as Href);
      }
    } catch (err: any) {
      console.error('Erreur de connexion :', err.response?.data || err.message);
      Alert.alert('Erreur', 'Identifiants incorrects ou problème de connexion');
    }

    useEffect(() => {
        if (user?.id) {
            synchronize(user.id)
        }
    }, [user?.id])
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

      <TouchableOpacity style={globalStyles.button}>
        <Text style={globalStyles.buttonText} onPress={handleLogin}>
          Se connecter
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={globalStyles.button}>
        <Text
          style={globalStyles.buttonText}
          onPress={() => router.push('./register' as Href)}
        >
          Pas de compte ? S'inscrire
        </Text>
      </TouchableOpacity>
    </View>
  );
}
