import { useEffect, useState } from 'react'
import { globalStyles } from '@/src/styles/globalStyles'
import { router } from 'expo-router'
import { View, Text, TouchableOpacity, FlatList } from 'react-native'
import Logo from '../../assets/images/logoAlgoQuest.svg'
import { LinearGradient } from 'expo-linear-gradient'
import { api } from '../../src/api/client'
import { Picker } from '@react-native-picker/picker'
import { useAuth } from '@/src/context/AuthContext'

type Enigmes = {
    id: string
    titre: string
}

export default function Liste_enigmes() {
    const [enigmes, setEnigmes] = useState<Enigmes[]>([])
    const [loading, setLoading] = useState(true)
    const { user } = useAuth()
    const currentUserId = user?.id

    useEffect(() => {
        const fetchEnigmes = async () => {
            try {
                const response = await api.get<Enigmes[]>('/enigmes')
                setEnigmes(response.data)
            } catch (error) {
                console.error('Erreur récupération users:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchEnigmes()
    }, [])

    if (loading) {
        return (
            <View style={globalStyles.container}>
                <Text>Chargement...</Text>
            </View>
        )
    }

    return (
        <View style={globalStyles.container}>
            <Logo width={180} height={80} style={globalStyles.logo} />
            <Text style={globalStyles.title}>Liste des enigmes</Text>

            {/* Liste des enigmes */}
            <FlatList
                data={enigmes}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View
                        style={{
                            marginVertical: 15,
                            padding: 10,
                            borderWidth: 1,
                            borderRadius: 8,
                        }}
                    >
                        <Text>Titre : {item.titre}</Text>

                            <TouchableOpacity
                                style={{
                                    backgroundColor: '#5DADE2',
                                    padding: 10,
                                    marginTop: 5,
                                    borderRadius: 5,
                                }}
                            >
                                <Text
                                    style={{
                                        color: '#fff',
                                        textAlign: 'center',
                                    }}
                                >
                                    Voir détail de l'énigme
                                </Text>
                            </TouchableOpacity>
                    </View>
                )}
            />

            {/* Bouton retour */}
            <TouchableOpacity onPress={() => router.push('/(admin)/dashboard')}>
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
