import { useLocalSearchParams } from "expo-router"
import { useEffect, useState } from "react"
import { View, Text, FlatList } from "react-native"
import { api } from "@/src/api/client"
import { globalStyles } from "@/src/styles/globalStyles"
import { useAuth } from "@/src/context/AuthContext"

export type Resolution = {
  id: string;
  enigmeId: string;
  userId: string;
  estCorrecte: boolean;
  dateSoumission: string;
  status: string;
  codeSoumis: string;
};

export default function HistoriqueEnigme() {
  const { id } = useLocalSearchParams() // id de l'énigme
  const { user } = useAuth()
  const currentUserId = user?.id
  const [resolutions, setResolutions] = useState<Resolution[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHistorique = async () => {
      try {
        const response = await api.get<Resolution[]>(
          `/resolutions/user/${currentUserId}`
        )
        // filtrer uniquement celles de cette énigme
        const filtered = response.data
          .filter((r) => r.enigmeId === id)
          .sort(
            (a, b) =>
              new Date(b.dateSoumission).getTime() -
              new Date(a.dateSoumission).getTime()
          )
        setResolutions(filtered)
      } catch (error) {
        console.error("Erreur récupération historique:", error)
      } finally {
        setLoading(false)
      }
    }
    if (currentUserId && id) {
      fetchHistorique()
    }
  }, [currentUserId, id])

  if (loading) {
    return (
      <View style={globalStyles.container}>
        <Text>Chargement de l'historique...</Text>
      </View>
    )
  }

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Historique des tentatives</Text>
      <FlatList
        data={resolutions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              marginVertical: 10,
              padding: 10,
              borderWidth: 1,
              borderRadius: 8,
            }}
          >
            <Text style={{ fontWeight: "bold" }}>
              Date : {new Date(item.dateSoumission).toLocaleString()}
            </Text>
            <Text>Statut : {item.status}</Text>
            <Text>Code soumis :</Text>
            <Text
              style={{
                backgroundColor: "#2c3e50",
                color: "#ecf0f1",
                padding: 8,
                borderRadius: 4,
                marginTop: 5,
                fontFamily: "monospace",
              }}
            >
              {item.codeSoumis}
            </Text>
          </View>
        )}
      />
    </View>
  )
}
