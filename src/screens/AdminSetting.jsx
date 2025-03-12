import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Image,
    Platform,
    KeyboardAvoidingView,
    Alert
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getOrgProfie, updateOrgProfie } from "../api/admin/adminApi";

export default function AdminSetting() {
    const [businessInfo, setBusinessInfo] = useState([]);
    const profileData = async () => {
        const response = await getOrgProfie();
        const data = response.organizationList[0];
        setBusinessInfo(data)
    }
    useEffect(() => {
        profileData();
    }, [])
    const [isEditing, setIsEditing] = useState(false);

    const gstOptions = [
        'Not Registered',
        'Registered - Regular',
        'Registered - Composition',
        'Overseas',
        'SEZ'
    ];

    const currencyOptions = [
        { label: 'US Dollar (USD)', value: 'USD', symbol: '$' },
        { label: 'Euro (EUR)', value: 'EUR', symbol: '€' },
        { label: 'British Pound (GBP)', value: 'GBP', symbol: '£' },
        { label: 'Indian Rupee (INR)', value: 'INR', symbol: '₹' },
        { label: 'Japanese Yen (JPY)', value: 'JPY', symbol: '¥' },
        { label: 'Canadian Dollar (CAD)', value: 'CAD', symbol: 'C$' },
    ];

    const industryOptions = [
        'Technology',
        'Healthcare',
        'Finance',
        'Education',
        'Retail',
        'Manufacturing',
        'Hospitality',
        'Construction',
        'Entertainment',
        'Other'
    ];

    const handleChange = (field, value) => {
        setBusinessInfo({
            ...businessInfo,
            [field]: value
        });
    };

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            Alert.alert('Permission needed', 'Please grant permission to access your media library');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            handleChange('logo', result.assets[0].uri);
        }
    };

    // Handle form submission
    const handleSave = async () => {
        // Validate form
        if (!businessInfo.businessName.trim()) {
            Alert.alert('Error', 'Business name is required');
            return;
        }

        if (!businessInfo.email.trim() || !validateEmail(businessInfo.email)) {
            Alert.alert('Error', 'Please enter a valid email address');
            return;
        }
        console.log("businessInfo---------", businessInfo);

        try {
            const response = await fetch(`http://192.168.1.25:8080/editOrgitembyid/${businessInfo.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(businessInfo),
            });

            if (!response.ok) {
                throw new Error(`Request failed with status: ${response.status}`);
            }

            const data = await response.text(); // or response.json() if the API returns JSON
            console.log("Update Successful:", data);
        } catch (error) {
            console.log("Error updating organization profile:", error);
        }

        Alert.alert('Success', 'Business information updated successfully');
        setIsEditing(false);
    };

    // Email validation
    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    // Toggle edit mode
    const toggleEditMode = () => {
        setIsEditing(!isEditing);
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView className="flex-1 px-4 py-2">
                    {/* Header */}
                    <View className="flex-row justify-between items-center mb-4">
                        <View>
                            <Text className="text-2xl font-bold text-gray-800">Business Information</Text>
                            <Text className="text-gray-500">Update your business details</Text>
                        </View>
                        {!isEditing && <TouchableOpacity
                            onPress={toggleEditMode}
                            className="p-2 rounded-full bg-blue-50"
                        >
                            <MaterialIcons
                                name="edit"
                                size={24}
                                color="#3b82f6"
                            />
                        </TouchableOpacity>}
                    </View>

                    {/* Main content */}<View className="bg-white rounded-xl shadow-sm p-4 mb-4">
                        <Text className="text-lg font-semibold text-gray-800 mb-2">Organization Logo</Text>
                        <Text className="text-gray-500 mb-4">Used in invoices and communications</Text>

                        <View className="items-center">
                            {businessInfo.logo ? (
                                <View className="relative">
                                    <Image
                                        source={{ uri: businessInfo.logo }}
                                        className="w-40 h-40 rounded-lg"
                                    />
                                    {isEditing && (
                                        <TouchableOpacity
                                            className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2"
                                            onPress={pickImage}
                                        >
                                            <Ionicons name="camera" size={20} color="white" />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            ) : (
                                <TouchableOpacity
                                    className="bg-gray-200 rounded-lg w-40 h-40 items-center justify-center"
                                    onPress={isEditing ? pickImage : null}
                                    disabled={!isEditing}
                                >
                                    <Ionicons name="image-outline" size={40} color="#6b7280" />
                                    <Text className="text-gray-600 mt-2">Upload Image</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                    <View className="flex-row flex-wrap">
                        {/* Left column */}
                        <View className="w-full lg:w-1/2 pr-0 lg:pr-2">
                            <View className="bg-white rounded-xl shadow-sm p-4 mb-4">
                                {/* Business Name */}
                                <View className="mb-4">
                                    <Text className="text-gray-700 font-medium mb-1">Business Name</Text>
                                    <TextInput
                                        className={`border rounded-lg p-3 ${isEditing ? 'border-blue-300 bg-white' : 'border-gray-200 bg-gray-50'}`}
                                        value={businessInfo.businessName}
                                        onChangeText={(text) => handleChange('businessName', text)}
                                        editable={isEditing}
                                        placeholder="Enter business name"
                                    />
                                </View>

                                {/* Email and Phone in a row */}
                                <View className="flex-row mb-4">
                                    <View className="flex-1 mr-2">
                                        <Text className="text-gray-700 font-medium mb-1">Email Address</Text>
                                        <TextInput
                                            className={`border rounded-lg p-3 ${isEditing ? 'border-blue-300 bg-white' : 'border-gray-200 bg-gray-50'}`}
                                            value={businessInfo.email}
                                            onChangeText={(text) => handleChange('email', text)}
                                            editable={isEditing}
                                            keyboardType="email-address"
                                            placeholder="Enter email"
                                        />
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-gray-700 font-medium mb-1">Phone Number</Text>
                                        <TextInput
                                            className={`border rounded-lg p-3 ${isEditing ? 'border-blue-300 bg-white' : 'border-gray-200 bg-gray-50'}`}
                                            value={businessInfo.phoneNumber}
                                            onChangeText={(text) => handleChange('phoneNumber', text)}
                                            editable={isEditing}
                                            keyboardType="phone-pad"
                                            placeholder="Enter phone number"
                                        />
                                    </View>
                                </View>

                                {/* Business Address */}
                                <View className="mb-4">
                                    <Text className="text-gray-700 font-medium mb-1">Business Address</Text>
                                    <TextInput
                                        className={`border rounded-lg p-3 ${isEditing ? 'border-blue-300 bg-white' : 'border-gray-200 bg-gray-50'}`}
                                        value={businessInfo.address}
                                        onChangeText={(text) => handleChange('address', text)}
                                        editable={isEditing}
                                        multiline
                                        numberOfLines={2}
                                        placeholder="Enter business address"
                                    />
                                </View>

                                {/* Industry Type and GST Registration */}
                                <View className="flex-row mb-4">
                                    <View className="flex-1 mr-2">
                                        <Text className="text-gray-700 font-medium mb-1">Industry Type</Text>
                                        {isEditing ? (
                                            <View className="border border-blue-300 rounded-lg overflow-hidden">
                                                <Picker
                                                    selectedValue={businessInfo.industryType}
                                                    onValueChange={(value) => handleChange('industryType', value)}
                                                    style={{ height: 50 }}                                                >
                                                    <Picker.Item label="Select Industry" value="" />
                                                    {industryOptions.map((option, index) => (
                                                        <Picker.Item key={index} label={option} value={option} />
                                                    ))}
                                                </Picker>
                                            </View>
                                        ) : (
                                            <TextInput
                                                className="border border-gray-200 rounded-lg p-3 bg-gray-50"
                                                value={businessInfo.industryType || 'Not specified'}
                                                editable={false}
                                            />
                                        )}
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-gray-700 font-medium mb-1">GST Registration</Text>
                                        {isEditing ? (
                                            <View className="border border-blue-300 rounded-lg overflow-hidden">
                                                <Picker
                                                    selectedValue={businessInfo.gstRegistered}
                                                    onValueChange={(value) => handleChange('gstRegistered', value)}
                                                    style={{ height: 50 }}
                                                >
                                                    {gstOptions.map((option, index) => (
                                                        <Picker.Item key={index} label={option} value={option} />
                                                    ))}
                                                </Picker>
                                            </View>
                                        ) : (
                                            <TextInput
                                                className="border border-gray-200 rounded-lg p-3 bg-gray-50"
                                                value={businessInfo.gstRegistered}
                                                editable={false}
                                            />
                                        )}
                                    </View>
                                </View>

                                {/* Bank Account and IFSC */}
                                <View className="flex-row mb-4">
                                    <View className="flex-1 mr-2">
                                        <Text className="text-gray-700 font-medium mb-1">Bank Account Number</Text>
                                        <TextInput
                                            className={`border rounded-lg p-3 ${isEditing ? 'border-blue-300 bg-white' : 'border-gray-200 bg-gray-50'}`}
                                            value={businessInfo.bankAccountNumber}
                                            onChangeText={(text) => handleChange('bankAccountNumber', text)}
                                            editable={isEditing}
                                            placeholder="Enter account number"
                                        />
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-gray-700 font-medium mb-1">IFSC Code</Text>
                                        <TextInput
                                            className={`border rounded-lg p-3 ${isEditing ? 'border-blue-300 bg-white' : 'border-gray-200 bg-gray-50'}`}
                                            value={businessInfo.ifscCode}
                                            onChangeText={(text) => handleChange('ifscCode', text)}
                                            editable={isEditing}
                                            placeholder="Enter IFSC code"
                                        />
                                    </View>
                                </View>

                                {/* Save Button */}
                                {isEditing && (
                                    <TouchableOpacity
                                        className="bg-blue-500 rounded-lg py-3 mt-2"
                                        onPress={handleSave}
                                    >
                                        <Text className="text-white font-semibold text-center">Save Changes</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>

                        {/* Right column */}
                        <View className="w-full lg:w-1/2 pl-0 lg:pl-2">
                            {/* Logo Upload */}


                            {/* Time Zone & Currency */}
                            <View className="bg-white rounded-xl shadow-sm p-4 mb-4">
                                <View className="flex-row items-center mb-4">
                                    <View className="w-10 h-10 rounded-full bg-purple-100 items-center justify-center mr-3">
                                        <Ionicons name="time-outline" size={24} color="#8b5cf6" />
                                    </View>
                                    <Text className="text-lg font-semibold text-gray-800">Time Zone & Currency</Text>
                                </View>

                                {/* Financial Period */}
                                <View className="mb-4">
                                    <Text className="text-gray-700 font-medium mb-1">Financial Period</Text>
                                    <TextInput
                                        className={`border rounded-lg p-3 ${isEditing ? 'border-blue-300 bg-white' : 'border-gray-200 bg-gray-50'}`}
                                        value={businessInfo.financialPeriod}
                                        onChangeText={(text) => handleChange('financialPeriod', text)}
                                        editable={isEditing}
                                        placeholder="e.g., April - March"
                                    />
                                </View>

                                {/* Currency */}
                                <View className="mb-2">
                                    <Text className="text-gray-700 font-medium mb-1">Currency</Text>
                                    {isEditing ? (
                                        <View className="border border-blue-300 rounded-lg overflow-hidden">
                                            <Picker
                                                selectedValue={businessInfo.currency}
                                                onValueChange={(value) => handleChange('currency', value)}
                                                style={{ height: 50 }}
                                            >
                                                {currencyOptions.map((option, index) => (
                                                    <Picker.Item key={index} label={option.label} value={option.value} />
                                                ))}
                                            </Picker>
                                        </View>
                                    ) : (
                                        <TextInput
                                            className="border border-gray-200 rounded-lg p-3 bg-gray-50"
                                            value={currencyOptions.find(c => c.value === businessInfo.currency)?.label || businessInfo.currency}
                                            editable={false}
                                        />
                                    )}
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}