import { router, useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, Button } from 'react-native'
import { api } from '@/src/api/client'
import { globalStyles } from '@/src/styles/globalStyles'
import { LinearGradient } from 'expo-linear-gradient'
import { useAuth } from '@/src/context/AuthContext'
import { WebView } from 'react-native-webview'

type Enigme = {
  id: string
  titre: string
  enonce: string
  entree: string
  sotieAttendue: string
}

export default function DetailEnigme() {
  const { id } = useLocalSearchParams() // récupère l'id depuis l'URL
  const [enigme, setEnigme] = useState<Enigme | null>(null)
  const { user } = useAuth()
  const currentUserId = user?.id
  const [loading, setLoading] = useState(true)
  const [code, setCode] = useState(`public class Main {
    public static void main(String[] args) {
        System.out.println("Hello world");
    }
}`)

  const submitCode = async () => {
    try {
      const response = await api.post(`/resolutions`, {
        userId: currentUserId,
        enigmeId: id,
        codeSoumis: code,
      })
      console.log("Résultat:", response.data)
    } catch (err) {
      console.error("Erreur :", err)
    }
  }

  useEffect(() => {
    const fetchEnigme = async () => {
      try {
        const response = await api.get<Enigme>(`/enigmes/${id}`)
        setEnigme(response.data)
      } catch (error) {
        console.error('Erreur récupération énigme:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEnigme()
  }, [id])

  if (loading) {
    return <Text>Chargement...</Text>
  }

  // HTML de l’éditeur CodeMirror
  const editorHtml = `
    <html>
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/codemirror.min.css" />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/codemirror.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/mode/clike/clike.min.js"></script>
        <style>
          body { margin:0; height:100%; }
          .CodeMirror { height:100vh; font-size:34px; }
        </style>
      </head>
      <body>
        <textarea id="editor">${code}</textarea>
        <script>
          var editor = CodeMirror.fromTextArea(document.getElementById("editor"), {
            lineNumbers: true,
            mode: "text/x-java",
            theme: "default"
          });
          editor.on("change", function(cm) {
            window.ReactNativeWebView.postMessage(cm.getValue());
          });
        </script>
      </body>
    </html>
  `

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>{enigme?.titre}</Text>

      {enigme ? (
        <View
          style={{
            marginVertical: 10,
            padding: 10,
            borderWidth: 1,
            borderRadius: 8,
          }}
        >
          <Text>Énoncé : {enigme.enonce}</Text>
          <Text>Entrée : {enigme.entree}</Text>
          <Text>Sortie attendue : {enigme.sotieAttendue}</Text>
        </View>
      ) : (
        <Text>Aucune énigme trouvée</Text>
      )}

      {/* Éditeur CodeMirror via WebView */}
      <View style={{ flex: 1, borderWidth: 1, marginVertical: 10 }}>
        <WebView
          originWhitelist={['*']}
          source={{ html: editorHtml }}
          javaScriptEnabled
          onMessage={(event) => {
            setCode(event.nativeEvent.data) // met à jour le state avec le code saisi
          }}
        />
      </View>

      <Button title="Soumettre" onPress={submitCode} />

      <TouchableOpacity
        onPress={() => router.push('/(user)/enigmes/listEnigme')}
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
