import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Animated, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
    const navigation = useNavigation();
    const intialData = {
        email: "",
        password: '',
    }

    const [formData, setFormData] = useState(intialData);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const handleChange = (name, value) => {
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleLogin = async () => {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData
                ),
            });

            const data = await response.json();
            console.log("data---", data)
            if (response.ok) {

                Alert.alert('Login Successful', 'You have logged in successfully!');
                // Optionally save user data or token in context, redux, or local storage.
                navigation.navigate('Home'); // Redirect to Home screen after successful login
            } else {
                // Handle errors (e.g., incorrect username/password)
                Alert.alert('Login Failed', data.message || 'An error occurred');
            }
        } catch (error) {
            Alert.alert('Error', 'Something went wrong. Please try again later.');
            console.error(error);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1 justify-center items-center bg-gray-100"
        >
            <Animated.View className="w-11/12 max-w-md p-8 bg-white rounded-3xl shadow-lg">
                <Text className="text-4xl font-bold mb-8 text-indigo-600 text-center">Welcome</Text>

                <View className="mb-6">
                    <Text className="text-sm font-medium text-gray-600 mb-2">Username</Text>
                    <View className="flex-row items-center border-b-2 border-gray-300 py-2">
                        <Feather name="user" size={24} color="#4F46E5" />
                        <TextInput
                            placeholder="Enter your email"
                            className="flex-1 ml-2 text-base"
                            value={formData.email}
                            onChangeText={value => handleChange('email', value)}
                        />
                    </View>
                </View>

                <View className="mb-6">
                    <Text className="text-sm font-medium text-gray-600 mb-2">Password</Text>
                    <View className="flex-row items-center border-b-2 border-gray-300 py-2">
                        <Feather name="lock" size={24} color="#4F46E5" />
                        <TextInput
                            placeholder="Enter your password"
                            secureTextEntry={!isPasswordVisible}
                            className="flex-1 ml-2 text-base"
                            value={formData.password}
                            onChangeText={value => handleChange('password', value)}
                        />
                        <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                            <Feather name={isPasswordVisible ? "eye-off" : "eye"} size={24} color="#4F46E5" />
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity
                    onPress={handleLogin}
                    className="bg-indigo-600 py-4 rounded-full mb-4"
                >
                    <Text className="text-center text-white text-lg font-bold">Login</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('ForgetPassword')}>
                    <Text className="text-center text-indigo-600 text-base mb-4">Forgot Password?</Text>
                </TouchableOpacity>

                <View className="flex-row justify-center">
                    <Text className="text-gray-600">Don't have an account? </Text>
                    <TouchableOpacity onPress={() =>
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Signup' }],
                        })
                    }>
                        <Text className="text-indigo-600 font-bold">Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </KeyboardAvoidingView >
    );
}
