import { useEffect, useState } from 'react'
import { globalStyles } from '@/src/styles/globalStyles'
import { router } from 'expo-router'
import { View, Text, TouchableOpacity, FlatList } from 'react-native'
import Logo from '../../../assets/images/logoAlgoQuest.svg'
import { LinearGradient } from 'expo-linear-gradient'
import { useAuth } from '@/src/context/AuthContext'
import { useEnigmes } from "@/hooks/useEnigmes"

export default function Liste_enigmes() {
    const { user } = useAuth()
    const currentUserId = user?.id
    const { enigmes, loading } = useEnigmes()

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

                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'flex-start',
                                marginTop: 10,
                            }}
                        >
                            {/* Bouton statut */}
                            <TouchableOpacity
                                onPress={() =>
                                    router.push(`/enigmes/${item.id}`)
                                }
                            >
                                <LinearGradient
                                    colors={[
                                        getButtonColor(item.status),
                                        '#000',
                                    ]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={{
                                        flex: 1,
                                        padding: 10,
                                        borderRadius: 5,
                                        marginRight: 5,
                                        marginLeft: 5,
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
                                              ? 'Échec'
                                              : 'À faire'}
                                    </Text>
                                </LinearGradient>
                            </TouchableOpacity>

                            {/* Bouton historique */}
                            <TouchableOpacity
                                onPress={() =>
                                    router.push(
                                        `/enigmes/historique/${item.id}`,
                                    )
                                }
                            >
                                <LinearGradient
                                    colors={[
                                        '#8e44ad',
                                        '#000',
                                    ]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={{
                                        flex: 1,
                                        padding: 10,
                                        borderRadius: 5,
                                        marginRight: 5,
                                        marginLeft: 5,
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: '#fff',
                                            textAlign: 'center',
                                        }}
                                    >
                                        Historique
                                    </Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
            <View style={{ marginVertical: 20 }}>
                <Text style={{ textAlign: 'center', marginBottom: 5 }}>
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
