import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, Href } from 'expo-router';
import { api } from '@/src/api/client';
import { globalStyles } from '@/src/styles/globalStyles';
import Logo from '../../assets/images/logoAlgoQuest.svg';
import { useAuth } from '@/src/context/AuthContext';
import { LoginResponse } from '@/types/api';

export default function RegisterScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [pseudo, setPseudo] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
    useAuth()

  const handleRegister = async () => {
  try {
    // Création du compte
    const registerResponse = await api.post<LoginResponse>("/register", {
      pseudo,
      email,
      password,
      role: 'UTILISATEUR',
    });

    //  Connexion automatique → mais ici, on reçoit déjà les tokens du register
    const data = registerResponse.data;

    // Extraire les données
    const { accessToken, refreshToken, ...user } = data;

    //  Sauvegarde locale
    await AsyncStorage.setItem('user', JSON.stringify(user));
    await AsyncStorage.setItem('accessToken', accessToken);
    await AsyncStorage.setItem('refreshToken', refreshToken);

    //  Met à jour le contexte global
    login(user, accessToken);

    //  Message de succès
    Alert.alert('Inscription réussie', `Bienvenue ${user.pseudo}`);

    //  Redirection
    if (user.role === 'ADMIN') {
      router.replace('/(admin)/dashboard' as Href);
    } else {
      router.replace('/(user)/enigmes/listEnigme' as Href);
    }
  } catch (err: any) {
    console.error('Erreur inscription :', err.response?.data || err.message);
    Alert.alert('Erreur', 'Impossible de créer le compte');
  }
};

  return (
    <View style={globalStyles.container}>
      <Logo width={180} height={80} style={globalStyles.logo} />
      <Text style={globalStyles.title}>Créer un nouveau compte</Text>
      <Text
        style={globalStyles.subtitle}
        onPress={() => router.push('/(auth)/login')}
      >
        Vous êtes déjà inscrit·e ? Connectez-vous ici.
      </Text>

      <TextInput
        style={globalStyles.input}
        placeholder="Pseudo"
        value={pseudo}
        onChangeText={setPseudo}
      />
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
        <Text style={globalStyles.buttonText} onPress={handleRegister}>
          S’inscrire
        </Text>
      </TouchableOpacity>
    </View>
  );
}
