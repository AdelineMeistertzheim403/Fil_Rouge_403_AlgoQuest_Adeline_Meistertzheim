import { View, Text, Button, TouchableOpacity, Image } from 'react-native'
import { router } from 'expo-router'
import { globalStyles } from '@/src/styles/globalStyles'
import Logo from '../assets/images/logoAlgoQuest.svg';

export default function Home() {
    return (
        <View style={globalStyles.container}>
            <Logo width={120} height={60} />
            <Text style={globalStyles.title}>Bienvenue sur AlgoQuest</Text>
            <TouchableOpacity style={globalStyles.button}>
                <Text
                    style={globalStyles.buttonText}
                    onPress={() => router.push('/(auth)/login')}
                >
                    Se connecter
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style={globalStyles.button}>
                <Text
                    style={globalStyles.buttonText}
                    onPress={() => router.push('/(auth)/register')}
                >
                    S’inscrire
                </Text>
            </TouchableOpacity>
        </View>
    )
}
