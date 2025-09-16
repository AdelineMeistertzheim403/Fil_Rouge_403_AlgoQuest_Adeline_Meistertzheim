import React, { useState } from 'react'
import {
    View,
    Text,
    TextInput,
    Alert,
    Image,
    TouchableOpacity,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter, Href } from 'expo-router'
import { api } from '../../src/api/client'
import { login } from '@/services/userService'
import { globalStyles } from '../../src/styles/globalStyles'
import Toast from 'react-native-toast-message'

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
            <Image
                source={require('../../assets/images/logoAlgoQuest.svg')}
                style={globalStyles.logo}
            />
            <Text style={globalStyles.title}>Créer une énigme</Text>
            <TextInput
                style={globalStyles.input}
                placeholder="Titre"
                value={titre}
                onChangeText={setTitre}
            />
            <TextInput
                style={globalStyles.input}
                placeholder="Enoncé"
                value={enonce}
                onChangeText={setEnonce}
            />
            <TextInput
                style={globalStyles.input}
                placeholder="Entrée"
                value={entree}
                onChangeText={setEntree}
            />
            <TextInput
                style={globalStyles.input}
                placeholder="Sortie attendu"
                value={sortieAttendue}
                onChangeText={setSortieAttendu}
            />
            <TouchableOpacity style={globalStyles.button}>
                <Text
                    style={globalStyles.buttonText}
                    onPress={handleEnregistrerEnigme}
                >
                    Valider
                </Text>
            </TouchableOpacity>
        </View>
    )
}
