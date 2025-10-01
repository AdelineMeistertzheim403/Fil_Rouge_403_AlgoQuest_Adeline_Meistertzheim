import { useEffect, useState } from 'react'
import { globalStyles } from '@/src/styles/globalStyles'
import { router } from 'expo-router'
import { View, Text, TouchableOpacity, FlatList } from 'react-native'
import Logo from '../../../assets/images/logoAlgoQuest.svg'
import { LinearGradient } from 'expo-linear-gradient'
import { api } from '../../../src/api/client'
import { useAuth } from '@/src/context/AuthContext'

type Enigmes = {
    id: string
    titre: string
    status?: 'A_FAIRE' | 'ECHEC' | 'REUSSI'
}

type Resolution = {
  id: string
  status: 'ECHEC' | 'REUSSI'
  dateSoumission: string
  enigme: {
    id: string
    titre: string
  }
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
                const resolutionsResponse = await api.get<Resolution[]>(
                    `/resolutions/user/${currentUserId}`,
                )
                const resolutions = resolutionsResponse.data
                const merged: Enigmes[] = response.data.map((enigme) => {
                    const resolution = resolutions
  .filter((r) => r.enigme.id === enigme.id)
  .sort((a, b) => (a.dateSoumission < b.dateSoumission ? 1 : -1))[0];
                    return {
                        ...enigme,
                        status: (resolution ? resolution.status : 'A_FAIRE') as
                            | 'A_FAIRE'
                            | 'ECHEC'
                            | 'REUSSI',
                    }
                })
                setEnigmes(merged)
            } catch (error) {
                console.error('Erreur récupération users:', error)
            } finally {
                setLoading(false)
            }
        }
        if (currentUserId) {
            fetchEnigmes()
        }
    }, [currentUserId])

    if (loading) {
        return (
            <View style={globalStyles.container}>
                <Text>Chargement...</Text>
            </View>
        )
    }

    const getButtonColor = (status?: string) => {
        switch (status) {
            case 'REUSSI':
                return '#2ECC71'
            case 'ECHEC':
                return '#E74C3C'
            default:
                return '#5DADE2'
        }
    }

    const total = enigmes.length
    const reussies = enigmes.filter((e) => e.status === 'REUSSI').length
    const progression = total > 0 ? (reussies / total) * 100 : 0

    return (
        <View style={globalStyles.container}>
            <Logo width={180} height={80} style={globalStyles.logo} />
            <Text style={globalStyles.title}>
                Bienvenue {user?.pseudo ?? ''}
            </Text>
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
                        <Text style={globalStyles.label}>{item.titre}</Text>

                        <TouchableOpacity
                            onPress={() => router.push(`/enigmes/${item.id}`)}
                            style={{
                                backgroundColor: getButtonColor(item.status),
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
                                {item.status === 'REUSSI'
                                    ? 'Réussi'
                                    : item.status === 'ECHEC'
                                      ? 'Echec'
                                      : 'A faire'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
            <View style={{ marginVertical: 20}}>
                <Text style={{ textAlign: 'center', marginBottom:5}}>
                    Progression : {reussies}/{total}
                </Text>
                <View
                    style={{
                        height: 20,
                        backgroundColor: '#ddd',
                        borderRadius: 10,
                        overflow: 'hidden',
                    }}
                    >
                        <View
                            style={{
                                width: `${progression}%`,
                                height: '100%',
                                backgroundColor: '#2ECC71',
                            }}
                            />
                    </View>
            </View>
        </View>
    )
}
