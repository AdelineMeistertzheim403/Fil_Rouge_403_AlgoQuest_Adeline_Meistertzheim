import { globalStyles } from '@/src/styles/globalStyles'
import { router } from 'expo-router'
import { View, Text, Button, Image, TouchableOpacity } from 'react-native'
import Logo from '../../assets/images/logoAlgoQuest.svg';
import { LinearGradient } from 'expo-linear-gradient'

export default function Gestion_users() {
    return (
        <View style={globalStyles.container}>
            <Logo
                width={180}
                height={80}
                style={globalStyles.logo}
            />
            <Text style={globalStyles.title}>Gestion des utilisateurs</Text>

            <TouchableOpacity onPress={() => router.push('/(admin)/dashboard')} >
                <LinearGradient
                    colors={['#5DADE2', '#00008B']} // vert clair -> vert foncé
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={globalStyles.gradientButton}
                >
                    <Text style={globalStyles.buttonText}>Retour</Text>
                </LinearGradient>
            </TouchableOpacity>
        </View>
    )
}
