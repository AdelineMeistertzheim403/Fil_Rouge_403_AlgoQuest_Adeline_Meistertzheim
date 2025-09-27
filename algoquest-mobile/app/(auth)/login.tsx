import React, { useState } from 'react'
import { useRouter, Href } from 'expo-router'
import {
    View,
    Text,
    TextInput,
    Alert,
    TouchableOpacity,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { api } from '../../src/api/client'
import { login as loginService } from '@/services/userService'
import { globalStyles } from '@/src/styles/globalStyles'
import Logo from '../../assets/images/logoAlgoQuest.svg';
import { useAuth } from '@/src/context/AuthContext'

export default function LoginScreen() {
    const router = useRouter();
    const { login } = useAuth()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const { token, user } = await loginService(email, password)
            await AsyncStorage.setItem('user', JSON.stringify(user))

            await AsyncStorage.setItem('token', token)
            login(user, token)
            Alert.alert('Connexion réussie', `Bienvenue ${user.pseudo}`)
            if (user.role === 'ADMIN') {
                router.replace('/(admin)/dashboard' as Href)
            } else {
                router.replace('/(user)/enigmes/listEnigme' as Href)
            }
        } catch (err: any) {
            console.error('Erreur', 'Identifiants incorrects')
        }
    }

    return (
        <View style={globalStyles.container}>
            <Logo
                width={180}
                height={80}
                style={globalStyles.logo}
            />
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
    )
}
