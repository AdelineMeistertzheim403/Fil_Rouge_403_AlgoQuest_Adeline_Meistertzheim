import { useEffect, useState } from 'react'
import { globalStyles } from '@/src/styles/globalStyles'
import { Href, router } from 'expo-router'
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    Alert,
} from 'react-native'
import Logo from '../../../assets/images/logoAlgoQuest.svg'
import { LinearGradient } from 'expo-linear-gradient'
import { useAuth } from '@/src/context/AuthContext'
import { useEnigmes } from '@/hooks/useEnigmes'
import { synchronize } from '@/src/db/sync'

export default function ListEnigme() {
    const { user, logout } = useAuth()
    const currentUserId = user?.id
    const [syncing, setSyncing] = useState(false)
    const [isConnected, setIsConnected] = useState(true)
    const [refreshTrigger, setRefreshTrigger] = useState(0)
    const { enigmes, loading } = useEnigmes(refreshTrigger)

   useEffect(() => {
  let isMounted = true;

  const checkNetwork = async () => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4000);
      const response = await fetch('https://clients3.google.com/generate_204', {
        method: 'GET',
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (isMounted) setIsConnected(response.ok);
    } catch {
      if (isMounted) setIsConnected(false);
    }
  };

  checkNetwork();

  // 🔁 Vérifie toutes les 10 secondes
  const interval = setInterval(checkNetwork, 10000);
  return () => {
    isMounted = false;
    clearInterval(interval);
  };
}, []);



    useEffect(() => {
        if (!currentUserId) return

        const runSync = async () => {
            if (!isConnected) {
                console.log("Hors ligne : synchro reportée.")
                return
            }
            try {
                setSyncing(true)
                await synchronize(currentUserId)
                setRefreshTrigger((p) => p + 1)
                console.log("Synchro automatique terminée")
            } catch (err) {
                console.error("Erreur lors de la synchro automatique :", err)
            } finally {
                setSyncing(false)
            }
        }

        //  Synchro au montage
        runSync()

        //  Synchro toutes les 60 secondes
        const interval = setInterval(runSync, 60000)
        return () => clearInterval(interval)
    }, [currentUserId, isConnected])



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

    if (loading) {
        return (
            <View style={globalStyles.container}>
                <Text>Chargement...</Text>
            </View>
        )
    }

    const handleLogout = async () => {
        Alert.alert('Déconnexion', 'Voulez-vous vraiment vous déconnecter ?', [
            { text: 'Annuler', style: 'cancel' },
            {
                text: 'Oui',
                style: 'destructive',
                onPress: async () => {
                    await logout()
                    router.replace('/(auth)/login' as Href)
                },
            },
        ])
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
            <Text style={globalStyles.title}>Liste des énigmes</Text>

            {/* Indicateur synchro */}
            {syncing && (
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginVertical: 10,
                    }}
                >
                    <ActivityIndicator color="#5DADE2" />
                    <Text style={{ marginLeft: 8 }}>
                        Synchronisation en cours...
                    </Text>
                </View>
            )}

            {/*Indicateur hors ligne */}
            {!isConnected && (
                <View
                    style={{
                        backgroundColor: '#f39c12',
                        padding: 10,
                        borderRadius: 8,
                        marginVertical: 10,
                    }}
                >
                    <Text style={{ color: '#fff', textAlign: 'center' }}>
                        ⚠️ Mode hors ligne — les données seront synchronisées dès que vous serez reconnecté.
                    </Text>
                </View>
            )}


            <TouchableOpacity
                style={{
                    backgroundColor: '#E74C3C',
                    borderRadius: 8,
                    padding: 10,
                    marginVertical: 10,
                    alignItems: 'center',
                }}
                onPress={handleLogout}
            >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                    🚪 Se déconnecter
                </Text>
            </TouchableOpacity>

            {/* Liste des énigmes */}
            <FlatList
                data={enigmes}
                keyExtractor={(item) => item.id}
                extraData={enigmes} // pour re-render après synchro
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
                                    router.push({
                                        pathname: '/enigmes/[id]',
                                        params: { id: item.id },
                                    })
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
                                        marginHorizontal: 5,
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
                                    router.push({
                                        pathname: '/enigmes/historique/[id]',
                                        params: { id: item.id },
                                    })
                                }
                            >
                                <LinearGradient
                                    colors={['#8e44ad', '#000']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={{
                                        flex: 1,
                                        padding: 10,
                                        borderRadius: 5,
                                        marginHorizontal: 5,
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

            {/* Barre de progression */}
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
