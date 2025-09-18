import { globalStyles } from "@/src/styles/globalStyles";
import { View, Text } from "react-native";
import Logo from '../../../assets/images/logoAlgoQuest.svg';

export default function ListEnigme() {
    return (
        <View>
             <Logo
  width={180}
  height={80}
  style={globalStyles.logo}
/>
            <Text>Liste des enigmes</Text>
        </View>
    );
}
