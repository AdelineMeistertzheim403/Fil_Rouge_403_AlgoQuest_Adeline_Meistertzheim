import { router, useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { api } from '@/src/api/client'
import { globalStyles } from '@/src/styles/globalStyles'
import { LinearGradient } from 'expo-linear-gradient'

type Enigme = {
    id: string
    titre: string
    enonce: string
    entree: string
    sortieAttendue: string
}

export default function DetailEnigme() {
    const { id } = useLocalSearchParams() // récupère l'id depuis l'URL
    const [enigme, setEnigme] = useState<Enigme | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchEnigme = async () => {
            try {
                const response = await api.get<Enigme>(`/enigmes/${id}`)
                setEnigme(response.data)
            } catch (error) {
                console.error('Erreur récupération progression:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchEnigme()
    }, [id])

    if (loading) {
        return <Text>Chargement...</Text>
    }

    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.title}>Detail de l&apos;énigme</Text>

            {enigme ? (
                <View
                    style={{
                        marginVertical: 10,
                        padding: 10,
                        borderWidth: 1,
                        borderRadius: 8,
                    }}
                >
                    <Text>Titre : {enigme.titre}</Text>
                    <Text>Enoncé : {enigme.enonce}</Text>
                    <Text>Entrée : {enigme.entree}</Text>
                    <Text>Sortie attendue : {enigme.sortieAttendue}</Text>
                </View>
            ) : (
                <Text>Aucune énigme trouvée</Text>
            )}
            <TouchableOpacity
                onPress={() => router.push('/(admin)/liste-enigmes')}
            >
                <LinearGradient
                    colors={['#5DADE2', '#00008B']}
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
