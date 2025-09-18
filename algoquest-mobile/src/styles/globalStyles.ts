import { StyleSheet } from 'react-native'

export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 30,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
    },
    logo: {
        resizeMode: 'contain',
        alignSelf: 'flex-start',
        marginBottom: 30,
    },
    title: {
        fontSize: 22,
        fontWeight: '600',
        color: '#555',
        marginBottom: 5,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: '#999',
        marginBottom: 25,
        textAlign: 'center',
    },
    input: {
        width: '100%',
        backgroundColor: '#f0f0f0',
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
        fontSize: 16,
    },
    button: {
        backgroundColor: "#0F2740",
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    rowButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
    },
    gradientButton: {
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        color: "#0F2740",
        marginBottom: 5,
        marginTop: 10,
    },
})
