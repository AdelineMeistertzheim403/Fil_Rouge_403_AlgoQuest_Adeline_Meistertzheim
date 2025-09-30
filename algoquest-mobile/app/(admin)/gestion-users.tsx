import { useEffect, useState } from 'react'
import { globalStyles } from '@/src/styles/globalStyles'
import { router } from 'expo-router'
import { View, Text, TouchableOpacity, FlatList } from 'react-native'
import Logo from '../../assets/images/logoAlgoQuest.svg'
import { LinearGradient } from 'expo-linear-gradient'
import { api } from '../../src/api/client'
import { Picker } from '@react-native-picker/picker'
import { useAuth } from '@/src/context/AuthContext'

type User = {
    id: string
    pseudo: string
    email: string
    role: string
}

export default function Gestion_users() {
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const { user } = useAuth()
    const currentUserId = user?.id
    const [userRoles, setUserRoles] = useState<{ [id: string]: string }>({})

    // Récupération des utilisateurs depuis l’API
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get<User[]>('/users')
                setUsers(response.data)
            } catch (error) {
                console.error('Erreur récupération users:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchUsers()
    }, [])

    const updateUserRole = async (userId: string, newRole: string) => {
        try {
            await api.patch(`/users/users/${userId}`, { role: newRole })
            setUsers((prev) =>
                prev.map((u) =>
                    u.id === userId ? { ...u, role: newRole } : u,
                ),
            )
        } catch (error) {
            console.error('Erreur modification role:', error)
        }
    }

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
            <Text style={globalStyles.title}>Gestion des utilisateurs</Text>

            {/* Liste des utilisateurs */}
            <FlatList
                data={users}
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
                        <Text>Pseudo : {item.pseudo}</Text>
                        <Text>Email : {item.email}</Text>
                        {item.id !== currentUserId ? (
                            <Picker
                                selectedValue={item.role}
                                onValueChange={(newRole) =>
                                    updateUserRole(item.id, newRole)
                                }
                                style={{ height: 50, width: 150 }}
                            >
                                <Picker.Item label="Admin" value="ADMIN" />
                                <Picker.Item
                                    label="Utilisateur"
                                    value="UTILISATEUR"
                                />
                            </Picker>
                        ) : (
                            <Text style={{ color: 'red', marginTop: 5 }}>
                                {item.role}
                            </Text>
                        )}

                        {/* Bouton suivre progression */}
                        {item.role === 'UTILISATEUR' && (
                            <TouchableOpacity
                                onPress={() => router.push(`/progression/${item.id}`)}
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
                                    Suivre progression
                                </Text>
                            </TouchableOpacity>
                        )}
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
