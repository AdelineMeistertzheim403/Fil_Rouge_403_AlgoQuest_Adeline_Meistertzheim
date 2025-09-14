import { View, Text, Button } from "react-native";
import { router } from "expo-router";

export default function Home() {
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: 20, marginBottom: 20 }}>
                Bienvenue sur AlgoQuest 🚀
            </Text>
            <Button title="Connexion" onPress={() => router.push("/(auth)/login")} />
            <Button title="Inscription" onPress={() => router.push("/(auth)/register")} />
        </View>
    );
}
