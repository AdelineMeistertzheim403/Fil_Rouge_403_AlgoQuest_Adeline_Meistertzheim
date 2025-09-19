import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { api } from '@/src/api/client';
import { globalStyles } from '@/src/styles/globalStyles';
import { LinearGradient } from 'expo-linear-gradient';

type Resolution = {
  id: string;
  estCorrecte: boolean;
  enigme: {
    id: string;
    titre: string;
  };
};

export default function Progression() {
  const { id } = useLocalSearchParams(); // récupère l'id depuis l'URL
  const [resolutions, setResolutions] = useState<Resolution[]>([]);
  const [loading, setLoading] = useState(true);

   useEffect(() => {
    const fetchProgression = async () => {
      try {
        const response = await api.get<Resolution[]>(`/resolutions/user/${id}`);
        setResolutions(response.data);
      } catch (error) {
        console.error("Erreur récupération progression:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgression();
  }, [id]);

  if (loading) {
    return <Text>Chargement...</Text>;
  }

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Progression de l’utilisateur</Text>

      <FlatList
        data={resolutions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ marginVertical: 10, padding: 10, borderWidth: 1, borderRadius: 8 }}>
            <Text>{item.enigme.titre}</Text>
            <Text>
              {item.estCorrecte  ? "✅ Réussi" : "🕓 À faire"}
            </Text>
          </View>
        )}
      />
      <TouchableOpacity onPress={() => router.push('/(admin)/gestion-users')}>
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
  );
}
