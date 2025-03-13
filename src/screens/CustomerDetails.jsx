import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { User, Calculator, CreditCard, Truck, Edit2 } from 'lucide-react-native';

const CustomerDetails = () => {
    const customerData = {
        customerType: 'Regular',
        companyName: 'Tech Solutions Inc.',
        contactPerson: 'John Doe',
        email: 'john@techsolutions.com',
        phone: '+1 234 567 8900',
        taxDetails: {
            gstTreatment: 'Unregistered',
            placeOfSupply: 'Haryana',
            pan: 'ABCDE1234F',
            taxPreference: 'Taxable'
        },
        billingAddress: {
            city: 'Mumbai',
            state: 'Maharashtra',
            country: 'India',
            zipCode: '400001',
            phone: '+91 98765 43210'
        },
        shippingAddress: {
            city: 'Mumbai',
            state: 'Maharashtra',
            country: 'India',
            zipCode: '400001',
            phone: '+91 98765 43210'
        }
    };

    return (
        <ScrollView className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="bg-white px-4 py-4 shadow-sm">
                <View className="flex-row justify-between items-center">
                    <View className="flex-row items-center space-x-2">
                        <User size={24} color="#3b82f6" />
                        <Text className="text-xl font-bold text-gray-800">Customer Information</Text>
                    </View>
                    <TouchableOpacity
                        className="flex-row items-center space-x-1 bg-blue-50 px-3 py-2 rounded-lg"
                        onPress={() => {/* Handle edit */ }}
                    >
                        <Edit2 size={16} color="#3b82f6" />
                        <Text className="text-blue-600 font-medium">Edit Details</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View className="p-4 space-y-6">
                {/* Basic Information */}
                <View className="bg-white rounded-xl shadow-sm p-4 space-y-4">
                    <View className="grid grid-cols-2 gap-4">
                        <View className="space-y-1">
                            <Text className="text-sm text-gray-500">Customer Type</Text>
                            <Text className="text-base font-medium text-gray-900">{customerData.customerType}</Text>
                        </View>
                        <View className="space-y-1">
                            <Text className="text-sm text-gray-500">Company Name</Text>
                            <Text className="text-base font-medium text-gray-900">{customerData.companyName}</Text>
                        </View>
                        <View className="space-y-1">
                            <Text className="text-sm text-gray-500">Contact Person</Text>
                            <Text className="text-base font-medium text-gray-900">{customerData.contactPerson}</Text>
                        </View>
                    </View>

                    <View className="grid grid-cols-2 gap-4">
                        <View className="space-y-1">
                            <Text className="text-sm text-gray-500">Email Address</Text>
                            <Text className="text-base font-medium text-gray-900">{customerData.email}</Text>
                        </View>
                        <View className="space-y-1">
                            <Text className="text-sm text-gray-500">Phone</Text>
                            <Text className="text-base font-medium text-gray-900">{customerData.phone}</Text>
                        </View>
                    </View>
                </View>

                {/* Tax & Business Details */}
                <View className="bg-white rounded-xl shadow-sm p-4">
                    <View className="flex-row items-center space-x-2 mb-4">
                        <Calculator size={20} color="#3b82f6" />
                        <Text className="text-lg font-semibold text-gray-800">Tax & Business Details</Text>
                    </View>

                    <View className="grid grid-cols-2 gap-4">
                        <View className="space-y-1">
                            <Text className="text-sm text-gray-500">GST Treatment</Text>
                            <Text className="text-base font-medium text-gray-900">{customerData.taxDetails.gstTreatment}</Text>
                        </View>
                        <View className="space-y-1">
                            <Text className="text-sm text-gray-500">Place of Supply</Text>
                            <Text className="text-base font-medium text-gray-900">{customerData.taxDetails.placeOfSupply}</Text>
                        </View>
                        <View className="space-y-1">
                            <Text className="text-sm text-gray-500">PAN</Text>
                            <Text className="text-base font-medium text-gray-900">{customerData.taxDetails.pan}</Text>
                        </View>
                        <View className="space-y-1">
                            <Text className="text-sm text-gray-500">Tax Preference</Text>
                            <Text className="text-base font-medium text-gray-900">{customerData.taxDetails.taxPreference}</Text>
                        </View>
                    </View>
                </View>

                {/* Address Information */}
                <View className="flex-row space-x-4">
                    {/* Billing Address */}
                    <View className="flex-1 bg-white rounded-xl shadow-sm p-4">
                        <View className="flex-row items-center space-x-2 mb-4">
                            <CreditCard size={20} color="#3b82f6" />
                            <Text className="text-lg font-semibold text-gray-800">Billing Address</Text>
                        </View>

                        <View className="space-y-3">
                            <View className="space-y-1">
                                <Text className="text-sm text-gray-500">City</Text>
                                <Text className="text-base font-medium text-gray-900">{customerData.billingAddress.city}</Text>
                            </View>
                            <View className="space-y-1">
                                <Text className="text-sm text-gray-500">State</Text>
                                <Text className="text-base font-medium text-gray-900">{customerData.billingAddress.state}</Text>
                            </View>
                            <View className="space-y-1">
                                <Text className="text-sm text-gray-500">Country</Text>
                                <Text className="text-base font-medium text-gray-900">{customerData.billingAddress.country}</Text>
                            </View>
                            <View className="space-y-1">
                                <Text className="text-sm text-gray-500">Zip Code</Text>
                                <Text className="text-base font-medium text-gray-900">{customerData.billingAddress.zipCode}</Text>
                            </View>
                            <View className="space-y-1">
                                <Text className="text-sm text-gray-500">Phone</Text>
                                <Text className="text-base font-medium text-gray-900">{customerData.billingAddress.phone}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Shipping Address */}
                    <View className="flex-1 bg-white rounded-xl shadow-sm p-4">
                        <View className="flex-row items-center space-x-2 mb-4">
                            <Truck size={20} color="#3b82f6" />
                            <Text className="text-lg font-semibold text-gray-800">Shipping Address</Text>
                        </View>

                        <View className="space-y-3">
                            <View className="space-y-1">
                                <Text className="text-sm text-gray-500">City</Text>
                                <Text className="text-base font-medium text-gray-900">{customerData.shippingAddress.city}</Text>
                            </View>
                            <View className="space-y-1">
                                <Text className="text-sm text-gray-500">State</Text>
                                <Text className="text-base font-medium text-gray-900">{customerData.shippingAddress.state}</Text>
                            </View>
                            <View className="space-y-1">
                                <Text className="text-sm text-gray-500">Country</Text>
                                <Text className="text-base font-medium text-gray-900">{customerData.shippingAddress.country}</Text>
                            </View>
                            <View className="space-y-1">
                                <Text className="text-sm text-gray-500">Zip Code</Text>
                                <Text className="text-base font-medium text-gray-900">{customerData.shippingAddress.zipCode}</Text>
                            </View>
                            <View className="space-y-1">
                                <Text className="text-sm text-gray-500">Phone</Text>
                                <Text className="text-base font-medium text-gray-900">{customerData.shippingAddress.phone}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

export default CustomerDetails;