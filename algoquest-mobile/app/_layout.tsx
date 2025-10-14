import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import 'react-native-reanimated'
import Toast from 'react-native-toast-message'
import { AuthProvider } from '../src/context/AuthContext'
import { Slot } from 'expo-router'

import { useColorScheme } from '@/hooks/useColorScheme'
import { useEffect } from 'react'
import { initDB } from '@/src/db/database'

export default function RootLayout() {
    const colorScheme = useColorScheme()
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    })

    useEffect(() => {
        initDB()
    }, [])

    if (!loaded) return null

    return (
        <ThemeProvider
            value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
        >
            <AuthProvider>
                <Stack>
                    <Stack.Screen
                        name="index"
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="(auth)"
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="(admin)"
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen name="+not-found" />
                </Stack>
                <Toast />
                <StatusBar style="auto" />
            </AuthProvider>
        </ThemeProvider>
    )
}
