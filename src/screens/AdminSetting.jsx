import React, { useState } from 'react';
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
import { styled } from 'nativewind';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

// Styled components
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledScrollView = styled(ScrollView);
const StyledSafeAreaView = styled(SafeAreaView);
const StyledImage = styled(Image);

export default function AdminSetting() {
    const [businessInfo, setBusinessInfo] = useState({
        businessName: 'HP',
        email: 'yu@g.com',
        phoneNumber: '25484879',
        businessAddress: 'Tyu',
        industryType: '',
        gstRegistration: 'Not Registered',
        bankAccountNumber: 'N/A',
        ifscCode: 'N/A',
        logo: null,
        timeZone: '',
        financialPeriod: '-',
        currency: 'USD'
    });

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
    const handleSave = () => {
        // Validate form
        if (!businessInfo.businessName.trim()) {
            Alert.alert('Error', 'Business name is required');
            return;
        }

        if (!businessInfo.email.trim() || !validateEmail(businessInfo.email)) {
            Alert.alert('Error', 'Please enter a valid email address');
            return;
        }

        // Save changes
        console.log('Saving business information:', businessInfo);
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
        <StyledSafeAreaView className="flex-1 bg-gray-50">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <StyledScrollView className="flex-1 px-4 py-2">
                    {/* Header */}
                    <StyledView className="flex-row justify-between items-center mb-4">
                        <StyledView>
                            <StyledText className="text-2xl font-bold text-gray-800">Business Information</StyledText>
                            <StyledText className="text-gray-500">Update your business details</StyledText>
                        </StyledView>
                        <StyledTouchableOpacity
                            onPress={toggleEditMode}
                            className="p-2 rounded-full bg-blue-50"
                        >
                            <MaterialIcons
                                name={isEditing ? "check" : "edit"}
                                size={24}
                                color="#3b82f6"
                            />
                        </StyledTouchableOpacity>
                    </StyledView>

                    {/* Main content */}<StyledView className="bg-white rounded-xl shadow-sm p-4 mb-4">
                        <StyledText className="text-lg font-semibold text-gray-800 mb-2">Organization Logo</StyledText>
                        <StyledText className="text-gray-500 mb-4">Used in invoices and communications</StyledText>

                        <StyledView className="items-center">
                            {businessInfo.logo ? (
                                <StyledView className="relative">
                                    <StyledImage
                                        source={{ uri: businessInfo.logo }}
                                        className="w-40 h-40 rounded-lg"
                                    />
                                    {isEditing && (
                                        <StyledTouchableOpacity
                                            className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2"
                                            onPress={pickImage}
                                        >
                                            <Ionicons name="camera" size={20} color="white" />
                                        </StyledTouchableOpacity>
                                    )}
                                </StyledView>
                            ) : (
                                <StyledTouchableOpacity
                                    className="bg-gray-200 rounded-lg w-40 h-40 items-center justify-center"
                                    onPress={isEditing ? pickImage : null}
                                    disabled={!isEditing}
                                >
                                    <Ionicons name="image-outline" size={40} color="#6b7280" />
                                    <StyledText className="text-gray-600 mt-2">Upload Image</StyledText>
                                </StyledTouchableOpacity>
                            )}
                        </StyledView>
                    </StyledView>
                    <StyledView className="flex-row flex-wrap">
                        {/* Left column */}
                        <StyledView className="w-full lg:w-1/2 pr-0 lg:pr-2">
                            <StyledView className="bg-white rounded-xl shadow-sm p-4 mb-4">
                                {/* Business Name */}
                                <StyledView className="mb-4">
                                    <StyledText className="text-gray-700 font-medium mb-1">Business Name</StyledText>
                                    <StyledTextInput
                                        className={`border rounded-lg p-3 ${isEditing ? 'border-blue-300 bg-white' : 'border-gray-200 bg-gray-50'}`}
                                        value={businessInfo.businessName}
                                        onChangeText={(text) => handleChange('businessName', text)}
                                        editable={isEditing}
                                        placeholder="Enter business name"
                                    />
                                </StyledView>

                                {/* Email and Phone in a row */}
                                <StyledView className="flex-row mb-4">
                                    <StyledView className="flex-1 mr-2">
                                        <StyledText className="text-gray-700 font-medium mb-1">Email Address</StyledText>
                                        <StyledTextInput
                                            className={`border rounded-lg p-3 ${isEditing ? 'border-blue-300 bg-white' : 'border-gray-200 bg-gray-50'}`}
                                            value={businessInfo.email}
                                            onChangeText={(text) => handleChange('email', text)}
                                            editable={isEditing}
                                            keyboardType="email-address"
                                            placeholder="Enter email"
                                        />
                                    </StyledView>
                                    <StyledView className="flex-1">
                                        <StyledText className="text-gray-700 font-medium mb-1">Phone Number</StyledText>
                                        <StyledTextInput
                                            className={`border rounded-lg p-3 ${isEditing ? 'border-blue-300 bg-white' : 'border-gray-200 bg-gray-50'}`}
                                            value={businessInfo.phoneNumber}
                                            onChangeText={(text) => handleChange('phoneNumber', text)}
                                            editable={isEditing}
                                            keyboardType="phone-pad"
                                            placeholder="Enter phone number"
                                        />
                                    </StyledView>
                                </StyledView>

                                {/* Business Address */}
                                <StyledView className="mb-4">
                                    <StyledText className="text-gray-700 font-medium mb-1">Business Address</StyledText>
                                    <StyledTextInput
                                        className={`border rounded-lg p-3 ${isEditing ? 'border-blue-300 bg-white' : 'border-gray-200 bg-gray-50'}`}
                                        value={businessInfo.businessAddress}
                                        onChangeText={(text) => handleChange('businessAddress', text)}
                                        editable={isEditing}
                                        multiline
                                        numberOfLines={2}
                                        placeholder="Enter business address"
                                    />
                                </StyledView>

                                {/* Industry Type and GST Registration */}
                                <StyledView className="flex-row mb-4">
                                    <StyledView className="flex-1 mr-2">
                                        <StyledText className="text-gray-700 font-medium mb-1">Industry Type</StyledText>
                                        {isEditing ? (
                                            <StyledView className="border border-blue-300 rounded-lg overflow-hidden">
                                                <Picker
                                                    selectedValue={businessInfo.industryType}
                                                    onValueChange={(value) => handleChange('industryType', value)}
                                                    style={{ height: 50 }}
                                                >
                                                    <Picker.Item label="Select Industry" value="" />
                                                    {industryOptions.map((option, index) => (
                                                        <Picker.Item key={index} label={option} value={option} />
                                                    ))}
                                                </Picker>
                                            </StyledView>
                                        ) : (
                                            <StyledTextInput
                                                className="border border-gray-200 rounded-lg p-3 bg-gray-50"
                                                value={businessInfo.industryType || 'Not specified'}
                                                editable={false}
                                            />
                                        )}
                                    </StyledView>
                                    <StyledView className="flex-1">
                                        <StyledText className="text-gray-700 font-medium mb-1">GST Registration</StyledText>
                                        {isEditing ? (
                                            <StyledView className="border border-blue-300 rounded-lg overflow-hidden">
                                                <Picker
                                                    selectedValue={businessInfo.gstRegistration}
                                                    onValueChange={(value) => handleChange('gstRegistration', value)}
                                                    style={{ height: 50 }}
                                                >
                                                    {gstOptions.map((option, index) => (
                                                        <Picker.Item key={index} label={option} value={option} />
                                                    ))}
                                                </Picker>
                                            </StyledView>
                                        ) : (
                                            <StyledTextInput
                                                className="border border-gray-200 rounded-lg p-3 bg-gray-50"
                                                value={businessInfo.gstRegistration}
                                                editable={false}
                                            />
                                        )}
                                    </StyledView>
                                </StyledView>

                                {/* Bank Account and IFSC */}
                                <StyledView className="flex-row mb-4">
                                    <StyledView className="flex-1 mr-2">
                                        <StyledText className="text-gray-700 font-medium mb-1">Bank Account Number</StyledText>
                                        <StyledTextInput
                                            className={`border rounded-lg p-3 ${isEditing ? 'border-blue-300 bg-white' : 'border-gray-200 bg-gray-50'}`}
                                            value={businessInfo.bankAccountNumber}
                                            onChangeText={(text) => handleChange('bankAccountNumber', text)}
                                            editable={isEditing}
                                            placeholder="Enter account number"
                                        />
                                    </StyledView>
                                    <StyledView className="flex-1">
                                        <StyledText className="text-gray-700 font-medium mb-1">IFSC Code</StyledText>
                                        <StyledTextInput
                                            className={`border rounded-lg p-3 ${isEditing ? 'border-blue-300 bg-white' : 'border-gray-200 bg-gray-50'}`}
                                            value={businessInfo.ifscCode}
                                            onChangeText={(text) => handleChange('ifscCode', text)}
                                            editable={isEditing}
                                            placeholder="Enter IFSC code"
                                        />
                                    </StyledView>
                                </StyledView>

                                {/* Save Button */}
                                {isEditing && (
                                    <StyledTouchableOpacity
                                        className="bg-blue-500 rounded-lg py-3 mt-2"
                                        onPress={handleSave}
                                    >
                                        <StyledText className="text-white font-semibold text-center">Save Changes</StyledText>
                                    </StyledTouchableOpacity>
                                )}
                            </StyledView>
                        </StyledView>

                        {/* Right column */}
                        <StyledView className="w-full lg:w-1/2 pl-0 lg:pl-2">
                            {/* Logo Upload */}


                            {/* Time Zone & Currency */}
                            <StyledView className="bg-white rounded-xl shadow-sm p-4 mb-4">
                                <StyledView className="flex-row items-center mb-4">
                                    <StyledView className="w-10 h-10 rounded-full bg-purple-100 items-center justify-center mr-3">
                                        <Ionicons name="time-outline" size={24} color="#8b5cf6" />
                                    </StyledView>
                                    <StyledText className="text-lg font-semibold text-gray-800">Time Zone & Currency</StyledText>
                                </StyledView>

                                {/* Financial Period */}
                                <StyledView className="mb-4">
                                    <StyledText className="text-gray-700 font-medium mb-1">Financial Period</StyledText>
                                    <StyledTextInput
                                        className={`border rounded-lg p-3 ${isEditing ? 'border-blue-300 bg-white' : 'border-gray-200 bg-gray-50'}`}
                                        value={businessInfo.financialPeriod}
                                        onChangeText={(text) => handleChange('financialPeriod', text)}
                                        editable={isEditing}
                                        placeholder="e.g., April - March"
                                    />
                                </StyledView>

                                {/* Currency */}
                                <StyledView className="mb-2">
                                    <StyledText className="text-gray-700 font-medium mb-1">Currency</StyledText>
                                    {isEditing ? (
                                        <StyledView className="border border-blue-300 rounded-lg overflow-hidden">
                                            <Picker
                                                selectedValue={businessInfo.currency}
                                                onValueChange={(value) => handleChange('currency', value)}
                                                style={{ height: 50 }}
                                            >
                                                {currencyOptions.map((option, index) => (
                                                    <Picker.Item key={index} label={option.label} value={option.value} />
                                                ))}
                                            </Picker>
                                        </StyledView>
                                    ) : (
                                        <StyledTextInput
                                            className="border border-gray-200 rounded-lg p-3 bg-gray-50"
                                            value={currencyOptions.find(c => c.value === businessInfo.currency)?.label || businessInfo.currency}
                                            editable={false}
                                        />
                                    )}
                                </StyledView>
                            </StyledView>
                        </StyledView>
                    </StyledView>
                </StyledScrollView>
            </KeyboardAvoidingView>
        </StyledSafeAreaView>
    );
}