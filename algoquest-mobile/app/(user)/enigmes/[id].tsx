import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function EnigmeDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();

    return (
        <View>
            <Text>Détail de l’énigme {id}</Text>
        </View>
    );
}
