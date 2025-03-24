import React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, SafeAreaView } from "react-native";
import { Receipt, BarChart3, CloudCheck, Shield, Database, Zap } from "lucide-react-native";

const WelcomeScreen = ({ handleContinue }) => {
    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView className="flex-1">
                <View className="flex-1 p-6">
                    {/* Logo/Image */}
                    <View className="items-center my-8">
                        <View className="w-20 h-20 bg-blue-600 rounded-2xl items-center justify-center">
                            <Receipt size={40} color="white" />
                        </View>
                    </View>

                    {/* Main Headline */}
                    <Text className="text-3xl font-bold text-center text-gray-800 mb-4">
                        Transform Your Business with Smart Billing Solutions
                    </Text>

                    {/* Subheading */}
                    <Text className="text-base text-center text-gray-600 mb-10 px-2">
                        India's most comprehensive billing and inventory management software designed for modern businesses. GST, cloud-backed, and built for scale.
                    </Text>

                    {/* Highlight Box */}
                    <View className="bg-blue-50 p-5 rounded-xl mb-8">
                        <Text className="text-blue-800 font-semibold text-lg mb-2 text-center">
                            Trusted by 10,000+ businesses across India
                        </Text>
                        <Text className="text-blue-700 text-center">
                            From small shops to large enterprises
                        </Text>
                    </View>

                    {/* Features */}
                    <Text className="text-xl font-bold text-gray-800 mb-4">
                        Everything you need to succeed
                    </Text>

                    <View className="mb-8 space-y-4">
                        <View className="flex-row items-center">
                            <View className="w-10 h-10 rounded-full bg-green-100 items-center justify-center mr-4">
                                <Receipt size={20} color="#10b981" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-lg font-semibold text-gray-800">GST Compliant</Text>
                                <Text className="text-gray-600">Fully compliant with all GST regulations</Text>
                            </View>
                        </View>

                        <View className="flex-row items-center">
                            <View className="w-10 h-10 rounded-full bg-blue-100 items-center justify-center mr-4">
                                <CloudCheck size={20} color="#3b82f6" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-lg font-semibold text-gray-800">Cloud Backup</Text>
                                <Text className="text-gray-600">Your data is always safe and accessible</Text>
                            </View>
                        </View>

                        <View className="flex-row items-center">
                            <View className="w-10 h-10 rounded-full bg-purple-100 items-center justify-center mr-4">
                                <Database size={20} color="#8b5cf6" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-lg font-semibold text-gray-800">Inventory Management</Text>
                                <Text className="text-gray-600">Track stock levels and automate reordering</Text>
                            </View>
                        </View>

                        <View className="flex-row items-center">
                            <View className="w-10 h-10 rounded-full bg-amber-100 items-center justify-center mr-4">
                                <BarChart3 size={20} color="#f59e0b" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-lg font-semibold text-gray-800">Business Analytics</Text>
                                <Text className="text-gray-600">Gain insights with powerful reporting tools</Text>
                            </View>
                        </View>
                    </View>

                    {/* Buttons */}
                    <View className="space-y-4 mb-8">
                        <TouchableOpacity
                            onPress={handleContinue}
                            className="bg-blue-600 py-4 px-6 rounded-xl items-center"
                        >
                            <Text className="text-white font-bold text-lg">Get Started Now</Text>
                        </TouchableOpacity>

                        {/* <TouchableOpacity
                            onPress={onDemoRequest}
                            className="bg-white py-4 px-6 rounded-xl border border-gray-300 items-center"
                        >
                            <Text className="text-gray-700 font-semibold text-lg">Request a Demo</Text>
                        </TouchableOpacity> */}
                    </View>

                    {/* Trust Indicators */}
                    <View className="flex-row justify-around mb-8">
                        <View className="items-center">
                            <Shield size={24} color="#4b5563" />
                            <Text className="text-gray-600 text-xs mt-1">Secure</Text>
                        </View>
                        <View className="items-center">
                            <Zap size={24} color="#4b5563" />
                            <Text className="text-gray-600 text-xs mt-1">Fast</Text>
                        </View>
                        <View className="items-center">
                            <CloudCheck size={24} color="#4b5563" />
                            <Text className="text-gray-600 text-xs mt-1">Cloud</Text>
                        </View>
                    </View>

                    {/* Footer */}
                    <Text className="text-center text-gray-500 text-sm mb-4">
                        © 2024 Smart Billing Solutions. All rights reserved.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default WelcomeScreen;   