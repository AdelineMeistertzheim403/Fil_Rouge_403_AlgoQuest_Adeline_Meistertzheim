// app/(admin)/dashboard.tsx
import { globalStyles } from '@/src/styles/globalStyles'
import { router } from 'expo-router'
import { View, Text, Button, Image, TouchableOpacity } from 'react-native'

export default function Dashboard() {
    return (
        <View style={globalStyles.container}>
            <Image
                source={require('../../assets/images/logoAlgoQuest.svg')}
                style={globalStyles.logo}
            />
            <Text style={globalStyles.title}>Tableau de bord Admin</Text>
            <TouchableOpacity style={globalStyles.button}>
                <Text style={globalStyles.buttonText}>
                    Gérer les utilisateur
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style={globalStyles.button}>
                <Text style={globalStyles.buttonText}>Liste des énigmes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={globalStyles.button}>
                <Text
                    style={globalStyles.buttonText}
                    onPress={() => router.push('/(admin)/create-enigme')}
                >
                    Créer une nouvelle énigme
                </Text>
            </TouchableOpacity>
        </View>
    )
}
