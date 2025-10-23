// app/(admin)/dashboard.tsx
import { globalStyles } from '@/src/styles/globalStyles'
import { Href, router } from 'expo-router'
import { View, Text, TouchableOpacity, Alert } from 'react-native'
import Logo from '../../assets/images/logoAlgoQuest.svg';
import { LinearGradient } from 'expo-linear-gradient'
import { useAuth } from '@/src/context/AuthContext';

export default function Dashboard() {
    const { user, logout } = useAuth()
    const handleLogout = async () => {
  Alert.alert(
    "Déconnexion",
    "Voulez-vous vraiment vous déconnecter ?",
    [
      { text: "Annuler", style: "cancel" },
      {
        text: "Oui",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/(auth)/login" as Href);
        },
      },
    ]
  );
};
    return (
        <View style={globalStyles.container}>
            <Logo
                width={180}
                height={80}
                style={globalStyles.logo}
            />
            <Text style={globalStyles.title}>Tableau de bord Admin</Text>
            <TouchableOpacity onPress={() => router.push('/(admin)/gestion-users')}>
                <LinearGradient
                    colors={['#5DADE2', '#00008B']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={globalStyles.gradientButton}
                >
                    <Text style={globalStyles.buttonText}>Gérer les utilisateur</Text>
                </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/(admin)/liste-enigmes')}>
                <LinearGradient
                    colors={['#5DADE2', '#00008B']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={globalStyles.gradientButton}
                >
                    <Text style={globalStyles.buttonText}>Liste des énigmes</Text>
                </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/(admin)/create-enigme')} >
                <LinearGradient
                    colors={['#5DADE2', '#00008B']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={globalStyles.gradientButton}
                >
                    <Text style={globalStyles.buttonText}>Créer une nouvelle énigme</Text>
                </LinearGradient>
            </TouchableOpacity>
             <TouchableOpacity
  style={{
    backgroundColor: "#E74C3C",
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
    alignItems: "center",
  }}
  onPress={handleLogout}
>
  <Text style={{ color: "#fff", fontWeight: "bold" }}>🚪 Se déconnecter</Text>
</TouchableOpacity>

        </View>
    )
}
