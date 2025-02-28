'use client'

import React, { useState } from 'react';
import { View, ScrollView, Text, TextInput, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';


export default function AddItemForm() {
    const navigation = useNavigation();

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="bg-white border-b border-gray-200">
                <View className="p-4 flex-row items-center">
                    <TouchableOpacity className="mr-3" onPress={() => navigation.navigate('ItemScreen')}>
                        <ArrowLeft className="w-6 h-6 text-blue-500" />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold text-gray-800">Add Item</Text>
                </View>
            </View>

            {/* Form */}
            <ScrollView className="flex-1 p-4">
                <View className="space-y-4">
                    {/* Type Selection */}
                    <View className="space-y-2">
                        <Text className="text-sm font-medium text-gray-600">Type</Text>
                        <TouchableOpacity className="p-3 border border-gray-200 rounded-lg bg-white">
                            <Text className="text-gray-700">Product</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Name */}
                    <View className="space-y-2">
                        <Text className="text-sm font-medium text-gray-600">Name<Text className="text-red-500">*</Text></Text>
                        <TextInput
                            className="p-3 border border-gray-200 rounded-lg bg-white"
                            placeholder="Enter item name"
                        />
                    </View>

                    {/* SKU */}
                    <View className="space-y-2">
                        <Text className="text-sm font-medium text-gray-600">Quantity<Text className="text-red-500">*</Text></Text>
                        <TextInput
                            className="p-3 border border-gray-200 rounded-lg bg-white"
                            placeholder="Enter Quantity"
                        />
                    </View>

                    {/* Unit */}
                    <View className="space-y-2">
                        <Text className="text-sm font-medium text-gray-600">Unit</Text>
                        <TextInput
                            className="p-3 border border-gray-200 rounded-lg bg-white"
                            placeholder="Enter unit"
                        />
                    </View>

                    {/* HSN Code */}
                    <View className="space-y-2">
                        <Text className="text-sm font-medium text-gray-600">HSN Code</Text>
                        <TextInput
                            className="p-3 border border-gray-200 rounded-lg bg-white"
                            placeholder="Enter HSN Code"
                        />
                    </View>

                    {/* Item Code */}
                    <View className="space-y-2">
                        <Text className="text-sm font-medium text-gray-600">Item Code</Text>
                        <TextInput
                            className="p-3 border border-gray-200 rounded-lg bg-white"
                            placeholder="Enter Item Code"
                        />
                    </View>

                    {/* Tax Preference */}
                    <View className="space-y-2">
                        <Text className="text-sm font-medium text-gray-600">Tax Preference<Text className="text-red-500">*</Text></Text>
                        <TouchableOpacity className="p-3 border border-gray-200 rounded-lg bg-white">
                            <Text className="text-gray-700">Taxable</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Selling Price */}
                    <View className="space-y-2">
                        <Text className="text-sm font-medium text-gray-600">Selling Price<Text className="text-red-500">*</Text></Text>
                        <TextInput
                            className="p-3 border border-gray-200 rounded-lg bg-white"
                            placeholder="Enter selling price"
                            keyboardType="numeric"
                        />
                    </View>

                    {/* Account */}
                    <View className="space-y-2">
                        <Text className="text-sm font-medium text-gray-600">Account</Text>
                        <TouchableOpacity className="p-3 border border-gray-200 rounded-lg bg-white">
                            <Text className="text-gray-700">Account 1</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Intra State Tax */}
                    <View className="space-y-2">
                        <Text className="text-sm font-medium text-gray-600">Intra State Tax (%)</Text>
                        <TextInput
                            className="p-3 border border-gray-200 rounded-lg bg-white"
                            placeholder="Enter intra state tax"
                            keyboardType="numeric"
                        />
                    </View>

                    {/* Inter State Tax */}
                    <View className="space-y-2">
                        <Text className="text-sm font-medium text-gray-600">Inter State Tax (%)</Text>
                        <TextInput
                            className="p-3 border border-gray-200 rounded-lg bg-white"
                            placeholder="Enter inter state tax"
                            keyboardType="numeric"
                        />
                    </View>

                </View>
            </ScrollView>

            {/* Footer */}
            <View className="p-4 bg-white border-t border-gray-200 flex-row justify-end space-x-3">
                <TouchableOpacity className="px-6 py-2 rounded-lg border border-gray-300">
                    <Text className="text-gray-700 font-medium">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity className="px-6 py-2 rounded-lg bg-blue-500">
                    <Text className="text-white font-medium">Save</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

