import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
    const navigation = useNavigation();

    const handleLogout = () => {
        Alert.alert('Logged Out', 'You have been logged out.');
        navigation.navigate('Login');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.welcomeText}>Welcome to the Home Screen!</Text>
            <Text style={styles.infoText}>You are now logged in and can view your dashboard.</Text>

            <TouchableOpacity style={styles.button} onPress={handleLogout}>
                <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f3f4f6',
        padding: 20,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4F46E5',
        marginBottom: 10,
    },
    infoText: {
        fontSize: 16,
        color: '#555',
        marginBottom: 30,
    },
    button: {
        backgroundColor: '#4F46E5',
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 30,
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
