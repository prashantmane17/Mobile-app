import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Animated, ScrollView, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function SignUpScreen() {
    const navigation = useNavigation();
    const initialData = {
        businessName: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
    };
    const [formData, setFormData] = useState(initialData);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);

    const handleInputChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleSignUp = async () => {
        const { businessName, email, phoneNumber, password, confirmPassword } = formData;

        // Validate form inputs
        if (!businessName || !email || !phoneNumber || !password || !confirmPassword) {
            Alert.alert('Error', 'Please fill all fields.');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match.');
            return;
        }

        if (!acceptedTerms) {
            Alert.alert('Error', 'You must accept the Terms and Conditions.');
            return;
        }

        const formBody = new URLSearchParams({
            businessName,
            email,
            phoneNumber,
            password,
        }).toString();

        try {
            const response = await fetch('http://192.168.1.25:8080/createOrganization', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formBody,
            });

            const responseText = await response.text();
            console.log(responseText, response);
            if (response.ok && responseText.includes("Successfully Created Business Account!")) {
                Alert.alert('Success', 'Account created successfully!');
                navigation.navigate('Login');
            } else {
                Alert.alert('Error', 'Failed to create account.');
            }
        } catch (error) {
            console.error('Error:', error);
            Alert.alert('Error', 'Something went wrong. Please try again later.');
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1 justify-center items-center bg-gray-100"
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} className="w-full">
                <Animated.View className="w-11/12 max-w-md mx-auto p-8 bg-white rounded-3xl shadow-lg">
                    <Text className="text-4xl font-bold mb-8 text-indigo-600 text-center">Create Account</Text>

                    {/* Business Name */}
                    <View className="mb-6">
                        <Text className="text-sm font-medium text-gray-600 ">Business Name</Text>
                        <View className="flex-row items-center border-b-2 border-gray-300 py-1">
                            <Feather name="briefcase" size={24} color="#4F46E5" />
                            <TextInput
                                placeholder="Enter your business name"
                                className="flex-1 ml-2 text-sm"
                                value={formData.businessName}
                                onChangeText={(text) => handleInputChange('businessName', text)}
                            />
                        </View>
                    </View>

                    {/* Email */}
                    <View className="mb-6">
                        <Text className="text-sm font-medium text-gray-600">Email</Text>
                        <View className="flex-row items-center border-b-2 border-gray-300 py-1">
                            <Feather name="mail" size={24} color="#4F46E5" />
                            <TextInput
                                placeholder="Enter your email"
                                className="flex-1 ml-2 text-sm"
                                value={formData.email}
                                onChangeText={(text) => handleInputChange('email', text)}
                                keyboardType="email-address"
                            />
                        </View>
                    </View>

                    {/* Phone Number */}
                    <View className="mb-5">
                        <Text className="text-sm font-medium text-gray-600 ">Phone Number</Text>
                        <View className="flex-row items-center border-b-2 border-gray-300 py-1">
                            <Feather name="phone" size={24} color="#4F46E5" />
                            <TextInput
                                placeholder="Enter your phone number"
                                className="flex-1 ml-2 text-sm"
                                value={formData.phoneNumber}
                                onChangeText={(text) => handleInputChange('phoneNumber', text)}
                                keyboardType="phone-pad"
                            />
                        </View>
                    </View>

                    {/* Password */}
                    <View className="mb-5">
                        <Text className="text-sm font-medium text-gray-600 ">Password</Text>
                        <View className="flex-row items-center border-b-2 border-gray-300 py-1">
                            <Feather name="lock" size={24} color="#4F46E5" />
                            <TextInput
                                placeholder="Create a password"
                                secureTextEntry={!isPasswordVisible}
                                className="flex-1 ml-2 text-sm"
                                value={formData.password}
                                onChangeText={(text) => handleInputChange('password', text)}
                            />
                            <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                                <Feather name={isPasswordVisible ? "eye-off" : "eye"} size={24} color="#4F46E5" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Confirm Password */}
                    <View className="mb-5">
                        <Text className="text-sm font-medium text-gray-600">Confirm Password</Text>
                        <View className="flex-row items-center border-b-2 border-gray-300 py-1">
                            <Feather name="lock" size={24} color="#4F46E5" />
                            <TextInput
                                placeholder="Confirm your password"
                                secureTextEntry={!isConfirmPasswordVisible}
                                className="flex-1 ml-2 text-sm"
                                value={formData.confirmPassword}
                                onChangeText={(text) => handleInputChange('confirmPassword', text)}
                            />
                            <TouchableOpacity onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}>
                                <Feather name={isConfirmPasswordVisible ? "eye-off" : "eye"} size={24} color="#4F46E5" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Terms and Conditions */}
                    <View className="flex-row items-center mb-5">
                        <TouchableOpacity onPress={() => setAcceptedTerms(!acceptedTerms)}>
                            <View className={`w-6 h-6 mr-2 border-2 rounded ${acceptedTerms ? 'bg-indigo-600 border-indigo-600' : 'border-gray-400'}`}>
                                {acceptedTerms && <Feather name="check" size={20} color="white" />}
                            </View>
                        </TouchableOpacity>
                        <Text className="text-sm text-gray-600">I accept the Terms and Conditions</Text>
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity
                        onPress={handleSignUp}
                        className={`py-4 rounded-full mb-4 ${acceptedTerms ? 'bg-indigo-600' : 'bg-gray-400'}`}
                        disabled={!acceptedTerms}
                    >
                        <Text className="text-center text-white text-lg font-bold">Sign Up</Text>
                    </TouchableOpacity>

                    {/* Redirect to Login */}
                    <View className="flex-row justify-center">
                        <Text className="text-gray-600">Already have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text className="text-indigo-600 font-bold">Log In</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
