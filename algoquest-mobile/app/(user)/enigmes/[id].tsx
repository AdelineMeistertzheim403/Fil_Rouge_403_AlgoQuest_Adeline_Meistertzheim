import { router, useLocalSearchParams } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import { View, Text, TouchableOpacity, Button } from 'react-native'
import { api } from '@/src/api/client'
import { globalStyles } from '@/src/styles/globalStyles'
import { LinearGradient } from 'expo-linear-gradient'
import { useAuth } from '@/src/context/AuthContext'
import { WebView } from 'react-native-webview'
import Toast from 'react-native-toast-message'

type Enigme = {
    id: string
    titre: string
    enonce: string
    entree: string
    sotieAttendue: string
}

type ResolutionResponse = {
    id: string
    codeSoumis: string
    estCorrecte: boolean
    status: 'A_FAIRE' | 'ECHEC' | 'REUSSI'
    enigmeId: string
    userId: string
    dateSoumission: string
}

export default function DetailEnigme() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { id } = useLocalSearchParams()
    const [enigme, setEnigme] = useState<Enigme | null>(null)
    const { user } = useAuth()
    const currentUserId = user?.id
    const [loading, setLoading] = useState(true)
    const initialCode = `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello world");
    }
}`

    const webviewRef = useRef<any>(null)
    const codeRef = useRef<string>('')

    const submitCode = async () => {
        setIsSubmitting(true)
        try {
            const response = await api.post<ResolutionResponse>(
                `/resolutions`,
                {
                    userId: currentUserId,
                    enigmeId: id,
                    codeSoumis: codeRef.current, // récupère le code actuel
                },
            )
            console.log('Résultat:', response.data)
            const estCorrect = response.data.estCorrecte

            if (estCorrect) {
                Toast.show({
                    type: 'success',
                    text1: 'Bravo 🎉',
                    text2: "Tu as réussi l'énigme !",
                    position: "bottom",
                })
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Raté ❌',
                    text2: 'Essaie encore !',
                    position: "bottom",
                })
            }
        } catch (err) {
            console.error('Erreur :', err)
            Toast.show({
                type: 'error',
                text1: 'Erreur',
                text2: 'Impossible de soumettre ton code',
                position: "bottom",
            })
        } finally {
            setIsSubmitting(false)
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
    <!-- CodeMirror core + thème Dracula -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/codemirror.min.css"/>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/theme/dracula.min.css"/>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/codemirror.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/mode/clike/clike.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/addon/edit/closebrackets.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/addon/selection/active-line.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/addon/edit/matchbrackets.min.js"></script>

    <!-- Police Fira Code avec ligatures -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/firacode/6.2.0/fira_code.min.css"/>

    <style>
      body { margin:0; height:100%; background-color: #1e1e1e; }
      .CodeMirror {
        height: 100vh;
        font-size: 34 px;
        font-family: "Fira Code", monospace;
        color: #f8f8f2;
        line-height: 1.4;
      }
      /* Curseur bloc néon cyan */
      .CodeMirror-cursor {
        border-left: none !important;
        background: #00ffff !important;
        width: 6px !important;
        opacity: 0.9;
      }
      /* Surbrillance de la ligne active */
      .CodeMirror-activeline-background {
        background: rgba(0, 255, 255, 0.1) !important;
      }
    </style>
  </head>
      <body>
        <textarea id="editor"></textarea>
        <script>
          var editor = CodeMirror.fromTextArea(document.getElementById("editor"), {
            lineNumbers: true,
            mode: "text/x-java",
            theme: "dracula",
            styleActiveLine: true,
            matchBrackets: true,
            indentUnit: 4,
            tabSize: 4,
            indentWithTabs: false,
            autoCloseBrackets: true,
          });
          editor.setValue(${JSON.stringify(initialCode)});
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
                        ref={webviewRef}
                        originWhitelist={['*']}
                        source={{ html: editorHtml }}
                        javaScriptEnabled
                        onMessage={(event) => {
                            codeRef.current = event.nativeEvent.data // stocke sans déclencher rerender
                        }}
                    />
                </View>

                <TouchableOpacity
                    disabled={isSubmitting}
                    onPress={submitCode}
                    style={{
                        backgroundColor: isSubmitting ? '#aaa' : '#5DADE2',
                        padding: 10,
                        marginTop: 5,
                        borderRadius: 5,
                    }}
                >
                    <Text style={{ color: '#fff', textAlign: 'center' }}>
                        {isSubmitting
                            ? 'En attente de réponse...'
                            : 'Soumettre'}
                    </Text>
                </TouchableOpacity>

                <Toast />

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
