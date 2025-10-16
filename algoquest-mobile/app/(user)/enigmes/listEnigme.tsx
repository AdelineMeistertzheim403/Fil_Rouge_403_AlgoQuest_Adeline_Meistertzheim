import { useState } from 'react'
import { globalStyles } from '@/src/styles/globalStyles'
import { router } from 'expo-router'
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

export default function Liste_enigmes() {
    const { user } = useAuth()
    const currentUserId = user?.id
    const [syncing, setSyncing] = useState(false)
    const [refreshTrigger, setRefreshTrigger] = useState(0)
    const { enigmes, loading } = useEnigmes(refreshTrigger)

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

    const handleSynchronize = async () => {
  if (!currentUserId) return;
  setSyncing(true);
  requestAnimationFrame(async () => {
    try {
      await synchronize(currentUserId);
      setRefreshTrigger(p => p + 1);
      Alert.alert('✅ Synchro terminée');
    } catch (e) {
      Alert.alert('❌ Erreur synchro');
      console.error(e);
    } finally {
      setSyncing(false);
    }
  });
};

    if (loading) {
        return (
            <View style={globalStyles.container}>
                <Text>Chargement...</Text>
            </View>
        )
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

            {/* Bouton Synchroniser */}
            <TouchableOpacity
                style={{
                    backgroundColor: '#5DADE2',
                    borderRadius: 8,
                    padding: 10,
                    marginVertical: 10,
                    alignItems: 'center',
                }}
                onPress={handleSynchronize}
                disabled={syncing}
            >
                {syncing ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                        🔄 Synchroniser
                    </Text>
                )}
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
