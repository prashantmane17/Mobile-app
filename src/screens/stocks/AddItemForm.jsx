'use client'

import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, TextInput, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { saveItems } from '../../api/user/items';


export default function AddItemForm() {
    const navigation = useNavigation();
    const intialData = {
        type: "Product",
        itemName: "",
        unit: "Units",
        itemHsn: "",
        taxPreference: "Taxable",
        sellingPrice: 0,
        account: "Inventory",
        intraStateTax: 0,
        interStateTax: 0,
        itemCode: "",
        Quantity: "",
        discount: "",
    }
    const [formData, setFormData] = useState(intialData);
    const handleSaveItems = async () => {
        const data = new FormData();

        // Add basic party fields
        Object.keys(formData).forEach((key) => {
            // Don't include nested objects like billingAddress or shippingAddress directly
            if (typeof formData[key] !== "object" || formData[key] === null) {
                data.append(key, formData[key]);
            }
        });
        try {
            const response = await fetch("http://192.168.1.25:8080/save-items", {
                method: "POST",
                credentials: "include",
                body: data,
                headers: {}
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const savedItem = await response.json();
        } catch (error) {
            console.error("Error saving item:", error);
        }
    };


    const taxBreakdown = ["0", "5", "12", "18", "28"]
    const accountsName = ["Inventory", "Raw Materials", "Finished Goods", "Other"]
    const unitsName = ["Units", "Kilogram (kg)", "Liter (L)", "Meter (m)", "Box", "Bag", "Packet", "Piece", "Dozen", "Ounce (oz)", "Pound (lb)"]
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
                <View className="space-y-4 mb-9">
                    {/* Type Selection */}
                    <View className="space-y-2">
                        <Text className="text-sm font-medium text-gray-600">Type</Text>
                        <View className="border border-gray-300 rounded-lg bg-white">
                            <Picker
                                selectedValue={formData.type}
                                onValueChange={(itemValue) => setFormData({ ...formData, type: itemValue })}
                                style={{ height: 50 }}
                            >
                                <Picker.Item label="Product" value="Product" />
                                <Picker.Item label="Service" value="Service" />

                            </Picker>
                        </View>
                    </View>

                    {/* Name */}
                    <View className="space-y-2">
                        <Text className="text-sm font-medium text-gray-600">Name<Text className="text-red-500">*</Text></Text>
                        <TextInput
                            className="p-3 border border-gray-200 rounded-lg bg-white"
                            placeholder="Enter item name"
                            value={formData.itemName}
                            onChangeText={(text) => setFormData({ ...formData, itemName: text })}
                        />
                    </View>

                    {/* SKU */}
                    {formData.type === "Product" && <View className="space-y-2">
                        <Text className="text-sm font-medium text-gray-600">Quantity<Text className="text-red-500">*</Text></Text>
                        <TextInput
                            className="p-3 border border-gray-200 rounded-lg bg-white"
                            placeholder="Enter Quantity"
                            keyboardType='numeric'
                            value={formData.Quantity}
                            onChangeText={(text) => setFormData({ ...formData, Quantity: text })}
                        />
                    </View>}

                    {/* Unit */}
                    <View className="space-y-2">
                        <Text className="text-sm font-medium text-gray-600">Unit</Text>
                        <View className="border border-gray-300 rounded-lg bg-white">
                            <Picker
                                selectedValue={formData.unit}
                                onValueChange={(itemValue) => setFormData({ ...formData, unit: itemValue })}
                                style={{ height: 50 }}
                            >
                                {formData.type !== "Service" ? (unitsName.map((month, index) => (
                                    <Picker.Item key={index} label={month} value={month} />
                                ))) : (<Picker.Item label="Service" value="Service" />)}
                            </Picker>
                        </View>
                    </View>

                    {/* HSN Code */}
                    <View className="space-y-2">
                        <Text className="text-sm font-medium text-gray-600">HSN Code</Text>
                        <TextInput
                            className="p-3 border border-gray-200 rounded-lg bg-white"
                            placeholder="Enter HSN Code"
                            keyboardType='numeric'
                            value={formData.itemHsn}
                            onChangeText={(text) => setFormData({ ...formData, itemHsn: text })}
                        />
                    </View>

                    {/* Item Code */}
                    <View className="space-y-2">
                        <Text className="text-sm font-medium text-gray-600">Item Code</Text>
                        <TextInput
                            className="p-3 border border-gray-200 rounded-lg bg-white"
                            placeholder="Enter Item Code"
                            keyboardType='numeric'
                            value={formData.itemCode}
                            onChangeText={(text) => setFormData({ ...formData, itemCode: text })}
                        />
                    </View>

                    {/* Tax Preference */}
                    <View className="space-y-2">
                        <Text className="text-sm font-medium text-gray-600">Tax Preference<Text className="text-red-500">*</Text></Text>
                        <View className="border border-gray-300 rounded-lg bg-white">
                            <Picker
                                selectedValue={formData.taxPreference}
                                onValueChange={(itemValue) => setFormData({ ...formData, taxPreference: itemValue })}
                                style={{ height: 50 }}
                            >
                                <Picker.Item label="Taxable" value="Taxable" />
                                <Picker.Item label="Non Taxable" value="Non Taxable" />

                            </Picker>
                        </View>
                    </View>

                    {/* Selling Price */}
                    {formData.type === "Product" && <View className="space-y-2">
                        <Text className="text-sm font-medium text-gray-600">Selling Price<Text className="text-red-500">*</Text></Text>
                        <TextInput
                            className="p-3 border border-gray-200 rounded-lg bg-white"
                            placeholder="Enter selling price"
                            keyboardType='numeric'
                            value={formData.sellingPrice}
                            onChangeText={(text) => setFormData({ ...formData, sellingPrice: Number(text) })}
                        />
                    </View>}

                    {/* Account */}
                    {formData.type === "Product" && <View className="space-y-2">
                        <Text className="text-sm font-medium text-gray-600">Account</Text>
                        <View className="border border-gray-300 rounded-lg bg-white">
                            <Picker
                                selectedValue={formData.account}
                                onValueChange={(itemValue) => setFormData({ ...formData, account: itemValue })}
                                style={{ height: 50 }}
                            >
                                {accountsName.map((month, index) => (
                                    <Picker.Item key={index} label={month} value={month} />
                                ))}
                            </Picker>
                        </View>
                    </View>}

                    {/* Intra State Tax */}
                    {formData.type === "Product" && <View className="space-y-2">
                        <Text className="text-sm font-medium text-gray-600">Intra State Tax (%)</Text>
                        <View className="border border-gray-300 rounded-lg bg-white">
                            <Picker
                                selectedValue={formData.intraStateTax}
                                onValueChange={(itemValue) => setFormData({ ...formData, intraStateTax: itemValue })}
                                style={{ height: 50 }}
                            >
                                {taxBreakdown.map((month, index) => (
                                    <Picker.Item key={index} label={`${month}%`} value={Number(month)} />
                                ))}
                            </Picker>
                        </View>
                    </View>}

                    {/* Inter State Tax */}
                    {formData.type === "Product" && <View className="space-y-2">
                        <Text className="text-sm font-medium text-gray-600">Inter State Tax (%)</Text>
                        <View className="border border-gray-300 rounded-lg bg-white">
                            <Picker
                                selectedValue={formData.interStateTax}
                                onValueChange={(itemValue) => setFormData({ ...formData, interStateTax: itemValue })}
                                style={{ height: 50 }}
                            >
                                {taxBreakdown.map((month, index) => (
                                    <Picker.Item key={index} label={`${month}%`} value={Number(month)} />
                                ))}
                            </Picker>
                        </View>
                    </View>
                    }

                </View>
            </ScrollView>

            {/* Footer */}
            <View className="p-4 bg-white border-t border-gray-200 flex-row justify-end space-x-3">
                <TouchableOpacity className="px-6 py-2 rounded-lg border border-gray-300">
                    <Text className="text-gray-700 font-medium">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity className="px-6 py-2 rounded-lg bg-blue-500" onPress={handleSaveItems}>
                    <Text className="text-white font-medium">Save</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

