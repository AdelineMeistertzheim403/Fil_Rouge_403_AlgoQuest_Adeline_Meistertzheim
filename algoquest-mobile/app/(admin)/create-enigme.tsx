import React, { useState } from 'react'
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
} from 'react-native'
import { useRouter, Href } from 'expo-router'
import { api } from '../../src/api/client'
import { globalStyles } from '../../src/styles/globalStyles'
import Toast from 'react-native-toast-message'
import Logo from '../../assets/images/logoAlgoQuest.svg'
import { LinearGradient } from 'expo-linear-gradient'

export default function RegisterScreen() {
    const router = useRouter()
    const [titre, setTitre] = useState('')
    const [enonce, setEnonce] = useState('')
    const [entree, setEntree] = useState('')
    const [sortieAttendue, setSortieAttendu] = useState('')

    const handleEnregistrerEnigme = async () => {
        try {
            const response = await api.post('/enigmes', {
                titre,
                enonce,
                entree,
                sortieAttendue,
            })

            Toast.show({
                type: 'success',
                text1: 'Enigme enregistrée',
                text2: 'Votre énigme à bien été créée',
            })

            setTitre('')
            setEnonce('')
            setEntree('')
            setSortieAttendu('')
        } catch (err: any) {
            console.error(err)
            Toast.show({
                type: 'error',
                text1: 'Erreur',
                text2: 'Impossible d’enregistrer l’énigme.',
            })
        }
    }

    return (
        <View style={globalStyles.container}>
            <Logo width={180} height={80} style={globalStyles.logo} />
            <Text style={globalStyles.title}>Créer une énigme</Text>

            <Text style={globalStyles.label}>Titre</Text>
            <TextInput
                style={globalStyles.input}
                placeholder="Titre"
                value={titre}
                onChangeText={setTitre}
            />
            <Text style={globalStyles.label}>Enoncé</Text>
            <TextInput
                style={globalStyles.input}
                placeholder="Enoncé"
                value={enonce}
                onChangeText={setEnonce}
            />
            <Text style={globalStyles.label}>Entrée</Text>
            <TextInput
                style={globalStyles.input}
                placeholder="Entrée"
                value={entree}
                onChangeText={setEntree}
            />
            <Text style={globalStyles.label}>Sortie attendue</Text>
            <TextInput
                style={globalStyles.input}
                placeholder="Sortie attendue"
                value={sortieAttendue}
                onChangeText={setSortieAttendu}
            />
            <View style={globalStyles.rowButtons}>
    {/* Bouton Valider */}
    <TouchableOpacity onPress={handleEnregistrerEnigme} style={{ flex: 1, marginHorizontal: 5 }}>
        <LinearGradient
            colors={['#4CAF50', '#2E7D32']} // vert clair -> vert foncé
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={globalStyles.gradientButton}
        >
            <Text style={globalStyles.buttonText}>Valider</Text>
        </LinearGradient>
    </TouchableOpacity>

    {/* Bouton Retour */}
    <TouchableOpacity onPress={() => router.push('/(admin)/dashboard')} style={{ flex: 1, marginHorizontal: 5 }}>
        <LinearGradient
            colors={['#FF5252', '#B71C1C']} // rouge clair -> rouge foncé
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={globalStyles.gradientButton}
        >
            <Text style={globalStyles.buttonText}>Retour</Text>
        </LinearGradient>
    </TouchableOpacity>
</View>

        </View>
    )
}
