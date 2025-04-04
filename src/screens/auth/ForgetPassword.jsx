import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Animated, Alert, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function ForgetPassword() {
    const navigation = useNavigation();
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const otpInputs = useRef([]);

    const handleSendOTP = async () => {
        try {
            const response = await fetch("https://billing.portstay.com/send-otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }), // Ensure correct formatting
            });
            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    Alert.alert("OTP Sent", "Please check your email for the OTP");
                    setStep(2);
                }
            } else {
                const error = await response.json();
                Alert.alert("Error", error.message || "Failed to send OTP");
            }
        } catch (error) {
            Alert.alert("Error", error.message || "Network error");
        }
    };


    const handleVerifyOTP = async () => {
        try {
            const response = await fetch("https://billing.portstay.com/verify-otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ otp: otp.join("") }), // Join OTP array into a single string
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    Alert.alert("OTP Verified", "Please set your new password");
                    setStep(3);
                }
            } else {
                const error = await response.json();
                Alert.alert("Error", error.message || "Invalid OTP");
            }
        } catch (error) {
            Alert.alert("Error", error.message || "Network error");
        }
    };


    const handleResetPassword = async () => {
        if (newPassword !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match");
            return;
        }

        try {
            const response = await fetch("https://billing.portstay.com/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ password: newPassword }),
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    Alert.alert("Success", "Your password has been reset successfully");
                    navigation.navigate("Login");
                }
            } else {
                const error = await response.json();
                Alert.alert("Error", error.message || "Failed to reset password");
            }
        } catch (error) {
            Alert.alert("Error", error.message || "Network error");
        }
    };

    const handleOtpChange = (index, value) => {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value !== '' && index < 5) {
            otpInputs.current[index + 1].focus();
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1 justify-center items-center bg-gray-100"
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} className="w-full">
                <Animated.View className="w-11/12 max-w-md p-8 bg-white rounded-3xl shadow-lg mx-auto">
                    <Text className="text-3xl font-bold mb-8 text-indigo-600 text-center">Forgot Password</Text>

                    {step === 1 && (
                        <View>
                            <Text className="text-sm font-medium text-gray-600 mb-2">Email</Text>
                            <View className="flex-row items-center border-b-2 border-gray-300 py-2 mb-6">
                                <Feather name="mail" size={24} color="#4F46E5" />
                                <TextInput
                                    placeholder="Enter your email"
                                    className="flex-1 ml-2 text-base"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                />
                            </View>
                            <TouchableOpacity
                                onPress={handleSendOTP}
                                className="bg-indigo-600 py-4 rounded-full mb-4"
                            >
                                <Text className="text-center text-white text-lg font-bold">Send OTP</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {step === 2 && (
                        <View>
                            <Text className="text-sm font-medium text-gray-600 mb-2">Enter OTP</Text>
                            <View className="flex-row justify-between mb-6">
                                {otp.map((digit, index) => (
                                    <TextInput
                                        key={index}
                                        ref={ref => otpInputs.current[index] = ref}
                                        className="w-12 h-12 border-2 border-gray-300 rounded-lg text-center text-xl"
                                        maxLength={1}
                                        keyboardType="number-pad"
                                        value={digit}
                                        onChangeText={(value) => handleOtpChange(index, value)}
                                    />
                                ))}
                            </View>
                            <TouchableOpacity
                                onPress={handleVerifyOTP}
                                className="bg-indigo-600 py-4 rounded-full mb-4"
                            >
                                <Text className="text-center text-white text-lg font-bold">Verify OTP</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {step === 3 && (
                        <View>
                            <View className="mb-6">
                                <Text className="text-sm font-medium text-gray-600 mb-2">New Password</Text>
                                <View className="flex-row items-center border-b-2 border-gray-300 py-2">
                                    <Feather name="lock" size={24} color="#4F46E5" />
                                    <TextInput
                                        placeholder="Enter new password"
                                        secureTextEntry={!isPasswordVisible}
                                        className="flex-1 ml-2 text-base"
                                        value={newPassword}
                                        onChangeText={setNewPassword}
                                    />
                                    <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                                        <Feather name={isPasswordVisible ? "eye-off" : "eye"} size={24} color="#4F46E5" />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View className="mb-6">
                                <Text className="text-sm font-medium text-gray-600 mb-2">Confirm New Password</Text>
                                <View className="flex-row items-center border-b-2 border-gray-300 py-2">
                                    <Feather name="lock" size={24} color="#4F46E5" />
                                    <TextInput
                                        placeholder="Confirm new password"
                                        secureTextEntry={!isPasswordVisible}
                                        className="flex-1 ml-2 text-base"
                                        value={confirmPassword}
                                        onChangeText={setConfirmPassword}
                                    />
                                </View>
                            </View>

                            <TouchableOpacity
                                onPress={handleResetPassword}
                                className="bg-indigo-600 py-4 rounded-full mb-4"
                            >
                                <Text className="text-center text-white text-lg font-bold">Reset Password</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text className="text-center text-indigo-600 text-base">Back to Login</Text>
                    </TouchableOpacity>
                </Animated.View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

