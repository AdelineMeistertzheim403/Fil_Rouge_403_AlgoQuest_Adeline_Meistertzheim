// app/(admin)/dashboard.tsx
import { globalStyles } from '@/src/styles/globalStyles'
import { router } from 'expo-router'
import { View, Text, Button, Image, TouchableOpacity } from 'react-native'
import Logo from '../../assets/images/logoAlgoQuest.svg';
import { LinearGradient } from 'expo-linear-gradient'

export default function Dashboard() {
    return (
        <View style={globalStyles.container}>
            <Logo
                width={180}
                height={80}
                style={globalStyles.logo}
            />
            <Text style={globalStyles.title}>Tableau de bord Admin</Text>
            <TouchableOpacity style={globalStyles.button}>
                <LinearGradient
                    colors={['#5DADE2', '#00008B']} // vert clair -> vert foncé
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={globalStyles.gradientButton}
                >
                    <Text style={globalStyles.buttonText}>Gérer les utilisateur</Text>
                </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={globalStyles.button}>
                <LinearGradient
                    colors={['#5DADE2', '#00008B']} // vert clair -> vert foncé
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={globalStyles.gradientButton}
                >
                    <Text style={globalStyles.buttonText}>Liste des énigmes</Text>
                </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/(admin)/create-enigme')} style={globalStyles.button}>
                <LinearGradient
                    colors={['#5DADE2', '#00008B']} // vert clair -> vert foncé
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={globalStyles.gradientButton}
                >
                    <Text style={globalStyles.buttonText}>Créer une nouvelle énigme</Text>
                </LinearGradient>
            </TouchableOpacity>
        </View>
    )
}
