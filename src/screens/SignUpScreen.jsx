import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Animated, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function SignUpScreen() {
    const navigation = useNavigation();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);



    const getPasswordStrength = (password) => {
        const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
        const mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");

        if (strongRegex.test(password)) return "Strong";
        if (mediumRegex.test(password)) return "Medium";
        return "Weak";
    }

    const renderPasswordStrength = () => {
        const strength = getPasswordStrength(password);
        let color = "bg-red-500";
        if (strength === "Medium") color = "bg-yellow-500";
        if (strength === "Strong") color = "bg-green-500";

        return (
            <View className="flex-row items-center mt-2">
                <View className={`h-2 w-16 rounded ${color}`} />
                <Text className="ml-2 text-sm text-gray-600">{strength}</Text>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1 justify-center items-center bg-gray-100"
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} className="w-full">
                <Animated.View className="w-11/12 max-w-md mx-auto p-8 bg-white rounded-3xl shadow-lg" >
                    <Text className="text-4xl font-bold mb-8 text-indigo-600 text-center">Create Account</Text>

                    <View className="mb-6">
                        <Text className="text-sm font-medium text-gray-600 mb-2">Username</Text>
                        <View className="flex-row items-center border-b-2 border-gray-300 py-2">
                            <Feather name="user" size={24} color="#4F46E5" />
                            <TextInput
                                placeholder="Choose a username"
                                className="flex-1 ml-2 text-base"
                                value={username}
                                onChangeText={setUsername}
                            />
                        </View>
                    </View>

                    <View className="mb-6">
                        <Text className="text-sm font-medium text-gray-600 mb-2">Email</Text>
                        <View className="flex-row items-center border-b-2 border-gray-300 py-2">
                            <Feather name="mail" size={24} color="#4F46E5" />
                            <TextInput
                                placeholder="Enter your email"
                                className="flex-1 ml-2 text-base"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                            />
                        </View>
                    </View>

                    <View className="mb-6">
                        <Text className="text-sm font-medium text-gray-600 mb-2">Password</Text>
                        <View className="flex-row items-center border-b-2 border-gray-300 py-2">
                            <Feather name="lock" size={24} color="#4F46E5" />
                            <TextInput
                                placeholder="Create a password"
                                secureTextEntry={!isPasswordVisible}
                                className="flex-1 ml-2 text-base"
                                value={password}
                                onChangeText={setPassword}
                            />
                            <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                                <Feather name={isPasswordVisible ? "eye-off" : "eye"} size={24} color="#4F46E5" />
                            </TouchableOpacity>
                        </View>
                        {password.length > 0 && renderPasswordStrength()}
                    </View>

                    <View className="mb-6">
                        <Text className="text-sm font-medium text-gray-600 mb-2">Confirm Password</Text>
                        <View className="flex-row items-center border-b-2 border-gray-300 py-2">
                            <Feather name="lock" size={24} color="#4F46E5" />
                            <TextInput
                                placeholder="Confirm your password"
                                secureTextEntry={!isConfirmPasswordVisible}
                                className="flex-1 ml-2 text-base"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                            />
                            <TouchableOpacity onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}>
                                <Feather name={isConfirmPasswordVisible ? "eye-off" : "eye"} size={24} color="#4F46E5" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View className="flex-row items-center mb-6">
                        <TouchableOpacity onPress={() => setAcceptedTerms(!acceptedTerms)}>
                            <View className={`w-6 h-6 mr-2 border-2 rounded ${acceptedTerms ? 'bg-indigo-600 border-indigo-600' : 'border-gray-400'}`}>
                                {acceptedTerms && <Feather name="check" size={20} color="white" />}
                            </View>
                        </TouchableOpacity>
                        <Text className="text-sm text-gray-600">I accept the Terms and Conditions</Text>
                    </View>

                    <TouchableOpacity
                        className={`py-4 rounded-full mb-4 ${acceptedTerms ? 'bg-indigo-600' : 'bg-gray-400'}`}
                        disabled={!acceptedTerms}
                    >
                        <Text className="text-center text-white text-lg font-bold">Sign Up</Text>
                    </TouchableOpacity>

                    <View className="flex-row justify-center">
                        <Text className="text-gray-600">Already have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.reset({
                            index: 0,
                            routes: [{ name: 'Login' }],
                        })}>
                            <Text className="text-indigo-600 font-bold">Log In</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

