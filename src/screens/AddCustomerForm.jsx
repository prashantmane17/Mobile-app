import React, { useState } from 'react';
import { View, ScrollView, Text, TextInput, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { ArrowLeft, Building, Mail, Phone, User, MapPin, Users, Info, Upload, ChevronDown, Copy } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from "expo-image-picker";

export default function EnhancedAddCustomerForm() {
    const navigation = useNavigation();
    const [activeTab, setActiveTab] = useState('details');
    const [selectedImage, setSelectedImage] = useState(null);
    const [customerType, setCustomerType] = useState('Business');
    const [taxPreference, setTaxPreference] = useState('Taxable');
    const [billingAddress, setBillingAddress] = useState({
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        country: '',
        pinCode: '',
        phone: ''
    });

    const [shippingAddress, setShippingAddress] = useState({
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        country: '',
        pinCode: '',
        phone: ''
    });

    const copyFromBilling = () => {
        setShippingAddress({ ...billingAddress });
    };

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            alert("Permission to access the gallery is required!");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            base64: false,
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
        }
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'details':
                return (
                    <View className="space-y-4">
                        <View className="space-y-2">
                            <Text className="text-sm font-medium text-gray-600">GST Type <Text className="text-red-500">*</Text></Text>
                            <TouchableOpacity className="p-3 border border-gray-200 rounded-lg bg-white flex-row justify-between items-center">
                                <Text className="text-gray-700">Select GST Type</Text>
                                <ChevronDown className="w-5 h-5 text-gray-400" />
                            </TouchableOpacity>
                        </View>

                        <View className="space-y-2">
                            <Text className="text-sm font-medium text-gray-600">Place of Supply <Text className="text-red-500">*</Text></Text>
                            <TouchableOpacity className="p-3 border border-gray-200 rounded-lg bg-white flex-row justify-between items-center">
                                <Text className="text-gray-700">Select State</Text>
                                <ChevronDown className="w-5 h-5 text-gray-400" />
                            </TouchableOpacity>
                        </View>

                        <View className="space-y-2">
                            <Text className="text-sm font-medium text-gray-600">PAN</Text>
                            <TextInput
                                className="p-3 border border-gray-200 rounded-lg bg-white"
                                placeholder="Enter PAN number"
                                autoCapitalize="characters"
                                maxLength={10}
                            />
                        </View>

                        <View className="space-y-2">
                            <Text className="text-sm font-medium text-gray-600">Tax Preference</Text>
                            <View className="flex-row space-x-4">
                                <TouchableOpacity
                                    className="flex-row items-center"
                                    onPress={() => setTaxPreference('Taxable')}
                                >
                                    <View className={`h-5 w-5 rounded-full border-2 ${taxPreference === 'Taxable' ? 'border-blue-500' : 'border-gray-300'} mr-2 items-center justify-center`}>
                                        {taxPreference === 'Taxable' && <View className="h-3 w-3 rounded-full bg-blue-500" />}
                                    </View>
                                    <Text className="text-gray-700">Taxable</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    className="flex-row items-center"
                                    onPress={() => setTaxPreference('Tax Exempt')}
                                >
                                    <View className={`h-5 w-5 rounded-full border-2 ${taxPreference === 'Tax Exempt' ? 'border-blue-500' : 'border-gray-300'} mr-2 items-center justify-center`}>
                                        {taxPreference === 'Tax Exempt' && <View className="h-3 w-3 rounded-full bg-blue-500" />}
                                    </View>
                                    <Text className="text-gray-700">Tax Exempt</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View className="space-y-2">
                            <Text className="text-sm font-medium text-gray-600">Documents</Text>
                            <TouchableOpacity
                                className="p-6 border-2 border-dashed border-gray-300 rounded-lg items-center justify-center bg-gray-50"
                                onPress={pickImage}
                            >
                                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                <Text className="text-blue-500 font-medium">Upload a file</Text>
                                <Text className="text-gray-500 text-sm">or drag and drop</Text>
                                <Text className="text-gray-400 text-xs mt-1">Up to 10 files, 10MB each</Text>
                            </TouchableOpacity>
                            {selectedImage && (
                                <View className="mt-4">
                                    <Text className="text-gray-600 mb-2">Selected Image:</Text>
                                    <Image
                                        source={{ uri: selectedImage }}
                                        className="w-full h-40 rounded-lg"
                                        resizeMode="cover"
                                    />
                                </View>
                            )}
                        </View>
                    </View>
                );
            case 'address':
                return (
                    <View className="space-y-6">
                        {/* Billing Address Section */}
                        <View className="space-y-4">
                            <Text className="text-lg font-semibold text-gray-800">Billing Address</Text>
                            <View className="space-y-4">
                                <View className="space-y-2">
                                    <Text className="text-sm font-medium text-gray-600">Address Line 1</Text>
                                    <TextInput
                                        className="p-3 border border-gray-200 rounded-lg bg-white"
                                        placeholder="Enter address line 1"
                                        value={billingAddress.addressLine1}
                                        onChangeText={(text) => setBillingAddress({ ...billingAddress, addressLine1: text })}
                                    />
                                </View>

                                <View className="space-y-2">
                                    <Text className="text-sm font-medium text-gray-600">Address Line 2</Text>
                                    <TextInput
                                        className="p-3 border border-gray-200 rounded-lg bg-white"
                                        placeholder="Enter address line 2"
                                        value={billingAddress.addressLine2}
                                        onChangeText={(text) => setBillingAddress({ ...billingAddress, addressLine2: text })}
                                    />
                                </View>

                                <View className="space-y-2">
                                    <Text className="text-sm font-medium text-gray-600">City</Text>
                                    <TextInput
                                        className="p-3 border border-gray-200 rounded-lg bg-white"
                                        placeholder="Enter city"
                                        value={billingAddress.city}
                                        onChangeText={(text) => setBillingAddress({ ...billingAddress, city: text })}
                                    />
                                </View>

                                <View className="space-y-2">
                                    <Text className="text-sm font-medium text-gray-600">State</Text>
                                    {/* <TouchableOpacity className="p-3 border border-gray-200 rounded-lg bg-white flex-row justify-between items-center">
                                        <Text className="text-gray-700">{billingAddress.state || 'Select State'}</Text>
                                        <ChevronDown className="w-5 h-5 text-gray-400" />
                                    </TouchableOpacity> */}
                                    <TextInput
                                        className="p-3 border border-gray-200 rounded-lg bg-white"
                                        placeholder="Enter State"
                                        value={billingAddress.state}
                                        onChangeText={(text) => setBillingAddress({ ...billingAddress, state: text })}
                                    />
                                </View>

                                <View className="space-y-2">
                                    <Text className="text-sm font-medium text-gray-600">Country</Text>
                                    {/* <TouchableOpacity className="p-3 border border-gray-200 rounded-lg bg-white flex-row justify-between items-center">
                                        <Text className="text-gray-700">{billingAddress.country || 'Select Country'}</Text>
                                        <ChevronDown className="w-5 h-5 text-gray-400" />
                                    </TouchableOpacity> */}
                                    <TextInput
                                        className="p-3 border border-gray-200 rounded-lg bg-white"
                                        placeholder="Enter Country"
                                        value={billingAddress.country}
                                        onChangeText={(text) => setBillingAddress({ ...billingAddress, country: text })}
                                    />
                                </View>

                                <View className="space-y-2">
                                    <Text className="text-sm font-medium text-gray-600">PIN Code</Text>
                                    <TextInput
                                        className="p-3 border border-gray-200 rounded-lg bg-white"
                                        placeholder="Enter PIN code"
                                        keyboardType="numeric"
                                        value={billingAddress.pinCode}
                                        onChangeText={(text) => setBillingAddress({ ...billingAddress, pinCode: text })}
                                    />
                                </View>

                                <View className="space-y-2">
                                    <Text className="text-sm font-medium text-gray-600">Phone</Text>
                                    <TextInput
                                        className="p-3 border border-gray-200 rounded-lg bg-white"
                                        placeholder="Enter phone number"
                                        keyboardType="phone-pad"
                                        value={billingAddress.phone}
                                        onChangeText={(text) => setBillingAddress({ ...billingAddress, phone: text })}
                                    />
                                </View>
                            </View>
                        </View>

                        {/* Shipping Address Section */}
                        <View className="space-y-4">
                            <View className="flex-row justify-between items-center">
                                <Text className="text-lg font-semibold text-gray-800">Shipping Address</Text>
                                <TouchableOpacity
                                    className="flex-row items-center space-x-2 px-3 py-2 bg-blue-50 rounded-lg"
                                    onPress={copyFromBilling}
                                >
                                    <Copy className="w-4 h-4 text-blue-500" />
                                    <Text className="text-blue-500 text-sm font-medium">Copy from Billing</Text>
                                </TouchableOpacity>
                            </View>

                            <View className="space-y-4">
                                <View className="space-y-2">
                                    <Text className="text-sm font-medium text-gray-600">Address Line 1</Text>
                                    <TextInput
                                        className="p-3 border border-gray-200 rounded-lg bg-white"
                                        placeholder="Enter address line 1"
                                        value={shippingAddress.addressLine1}
                                        onChangeText={(text) => setShippingAddress({ ...shippingAddress, addressLine1: text })}
                                    />
                                </View>

                                <View className="space-y-2">
                                    <Text className="text-sm font-medium text-gray-600">Address Line 2</Text>
                                    <TextInput
                                        className="p-3 border border-gray-200 rounded-lg bg-white"
                                        placeholder="Enter address line 2"
                                        value={shippingAddress.addressLine2}
                                        onChangeText={(text) => setShippingAddress({ ...shippingAddress, addressLine2: text })}
                                    />
                                </View>

                                <View className="space-y-2">
                                    <Text className="text-sm font-medium text-gray-600">City</Text>
                                    <TextInput
                                        className="p-3 border border-gray-200 rounded-lg bg-white"
                                        placeholder="Enter city"
                                        value={shippingAddress.city}
                                        onChangeText={(text) => setShippingAddress({ ...shippingAddress, city: text })}
                                    />
                                </View>

                                <View className="space-y-2">
                                    <Text className="text-sm font-medium text-gray-600">State</Text>
                                    {/* <TouchableOpacity className="p-3 border border-gray-200 rounded-lg bg-white flex-row justify-between items-center">
                                        <Text className="text-gray-700">{shippingAddress.state || 'Select State'}</Text>
                                        <ChevronDown className="w-5 h-5 text-gray-400" />
                                    </TouchableOpacity> */}
                                    <TextInput
                                        className="p-3 border border-gray-200 rounded-lg bg-white"
                                        placeholder="Enter city"
                                        value={shippingAddress.state}
                                        onChangeText={(text) => setShippingAddress({ ...shippingAddress, state: text })}
                                    />
                                </View>

                                <View className="space-y-2">
                                    <Text className="text-sm font-medium text-gray-600">Country</Text>
                                    {/* <TouchableOpacity className="p-3 border border-gray-200 rounded-lg bg-white flex-row justify-between items-center">
                                        <Text className="text-gray-700">{shippingAddress.country || 'Select Country'}</Text>
                                        <ChevronDown className="w-5 h-5 text-gray-400" />
                                    </TouchableOpacity> */}
                                    <TextInput
                                        className="p-3 border border-gray-200 rounded-lg bg-white"
                                        placeholder="Enter city"
                                        value={shippingAddress.country}
                                        onChangeText={(text) => setShippingAddress({ ...shippingAddress, country: text })}
                                    />
                                </View>

                                <View className="space-y-2">
                                    <Text className="text-sm font-medium text-gray-600">PIN Code</Text>
                                    <TextInput
                                        className="p-3 border border-gray-200 rounded-lg bg-white"
                                        placeholder="Enter PIN code"
                                        keyboardType="numeric"
                                        value={shippingAddress.pinCode}
                                        onChangeText={(text) => setShippingAddress({ ...shippingAddress, pinCode: text })}
                                    />
                                </View>

                                <View className="space-y-2">
                                    <Text className="text-sm font-medium text-gray-600">Phone</Text>
                                    <TextInput
                                        className="p-3 border border-gray-200 rounded-lg bg-white"
                                        placeholder="Enter phone number"
                                        keyboardType="phone-pad"
                                        value={shippingAddress.phone}
                                        onChangeText={(text) => setShippingAddress({ ...shippingAddress, phone: text })}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                );
            case 'contacts':
                return (
                    <View className="space-y-4">
                        <View className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                            <View className="space-y-4">
                                <View className="space-y-2">
                                    <Text className="text-sm font-medium text-gray-600">Contact Name</Text>
                                    <TextInput
                                        className="p-3 border border-gray-200 rounded-lg bg-white"
                                        placeholder="Enter contact name"
                                    />
                                </View>

                                <View className="space-y-2">
                                    <Text className="text-sm font-medium text-gray-600">Designation</Text>
                                    <TextInput
                                        className="p-3 border border-gray-200 rounded-lg bg-white"
                                        placeholder="Enter designation"
                                    />
                                </View>

                                <View className="space-y-2">
                                    <Text className="text-sm font-medium text-gray-600">Phone Number</Text>
                                    <TextInput
                                        className="p-3 border border-gray-200 rounded-lg bg-white"
                                        placeholder="Enter phone number"
                                        keyboardType="phone-pad"
                                    />
                                </View>
                            </View>
                        </View>


                    </View>
                );
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="p-4 flex-row items-center bg-white border-b border-gray-200">
                <TouchableOpacity className="mr-3" onPress={() => navigation.navigate('Parties')}>
                    <ArrowLeft className="w-6 h-6 text-blue-500" />
                </TouchableOpacity>
                <View>
                    <Text className="text-xl font-bold text-gray-800">Add Customer</Text>
                </View>
            </View>
            <ScrollView>
                <View className="bg-white">
                    {/* Basic Info Form */}
                    <View className="p-4 space-y-4">
                        <View className="space-y-2">
                            <Text className="text-sm font-medium text-gray-600">Customer Type</Text>
                            <TouchableOpacity
                                className="p-3 border border-gray-200 rounded-lg bg-white flex-row justify-between items-center"
                                onPress={() => setCustomerType(customerType === 'Business' ? 'Individual' : 'Business')}
                            >
                                <Text className="text-gray-700">{customerType}</Text>
                                <ChevronDown className="w-5 h-5 text-gray-400" />
                            </TouchableOpacity>
                        </View>

                        <View className="flex-row gap-3">
                            <View className="flex-1 space-y-2">
                                <Text className="text-sm font-medium text-gray-600">First Name</Text>
                                <TextInput
                                    className="p-3 border border-gray-200 rounded-lg bg-white"
                                    placeholder="Enter first name"
                                />
                            </View>
                            <View className="flex-1 space-y-2">
                                <Text className="text-sm font-medium text-gray-600">Last Name</Text>
                                <TextInput
                                    className="p-3 border border-gray-200 rounded-lg bg-white"
                                    placeholder="Enter last name"
                                />
                            </View>
                        </View>

                        <View className="space-y-2">
                            <Text className="text-sm font-medium text-gray-600">Company Name</Text>
                            <TextInput
                                className="p-3 border border-gray-200 rounded-lg bg-white"
                                placeholder="Enter company name"
                            />
                        </View>

                        <View className="space-y-2">
                            <Text className="text-sm font-medium text-gray-600">Display Name <Text className="text-red-500">*</Text></Text>
                            <TextInput
                                className="p-3 border border-gray-200 rounded-lg bg-white"
                                placeholder="Enter display name"
                            />
                        </View>

                        <View className="space-y-2">
                            <Text className="text-sm font-medium text-gray-600">Email Address</Text>
                            <TextInput
                                className="p-3 border border-gray-200 rounded-lg bg-white"
                                placeholder="Enter email address"
                                keyboardType="email-address"
                            />
                        </View>

                        <View className="space-y-2">
                            <Text className="text-sm font-medium text-gray-600">Phone</Text>
                            <TextInput
                                className="p-3 border border-gray-200 rounded-lg bg-white"
                                placeholder="Enter phone number"
                                keyboardType="phone-pad"
                            />
                        </View>
                    </View>
                </View>

                {/* Tabs */}
                <View className="flex-row border-b border-gray-200 bg-white">
                    <TouchableOpacity
                        onPress={() => setActiveTab('details')}
                        className={`flex-1 p-4 flex-row items-center justify-center space-x-2 ${activeTab === 'details' ? 'border-b-2 border-blue-500' : ''}`}
                    >
                        <Info className={`w-5 h-5 ${activeTab === 'details' ? 'text-blue-500' : 'text-gray-500'}`} />
                        <Text className={activeTab === 'details' ? 'text-blue-500 font-medium' : 'text-gray-500'}>Other Details</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setActiveTab('address')}
                        className={`flex-1 p-4 flex-row items-center justify-center space-x-2 ${activeTab === 'address' ? 'border-b-2 border-blue-500' : ''}`}
                    >
                        <MapPin className={`w-5 h-5 ${activeTab === 'address' ? 'text-blue-500' : 'text-gray-500'}`} />
                        <Text className={activeTab === 'address' ? 'text-blue-500 font-medium' : 'text-gray-500'}>Address</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setActiveTab('contacts')}
                        className={`flex-1 p-4 flex-row items-center justify-center space-x-2 ${activeTab === 'contacts' ? 'border-b-2 border-blue-500' : ''}`}
                    >
                        <Users className={`w-5 h-5 ${activeTab === 'contacts' ? 'text-blue-500' : 'text-gray-500'}`} />
                        <Text className={activeTab === 'contacts' ? 'text-blue-500 font-medium' : 'text-gray-500'}>Contact Persons</Text>
                    </TouchableOpacity>
                </View>

                {/* Tab Content */}
                <ScrollView className="flex-1 p-4">
                    {renderTabContent()}
                </ScrollView>

                {/* Footer */}
                <View className="p-4 bg-white border-t border-gray-200">
                    <TouchableOpacity className="bg-blue-500 p-4 rounded-lg">
                        <Text className="text-white font-medium text-center">Save Customer</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

