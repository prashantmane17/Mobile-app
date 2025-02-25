// import { PlusIcon } from 'lucide-react-native';
import { FilterIcon, PlusIcon, Search } from 'lucide-react-native';
import React from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
// import { MagnifyingGlassIcon, FunnelIcon } from 'react-native-heroicons/outline';

const PaymentList = () => {
    const payments = [
        {
            date: '2025-02-28',
            paymentId: '--',
            customerName: 'gukesh',
            paymentMode: 'Bank Transfer',
            amount: '14160.0',
            status: 'Paid'
        },
        {
            date: '2025-02-20',
            paymentId: '--',
            customerName: 'makarndesh',
            paymentMode: 'Credit Card',
            amount: '1006641.48',
            status: 'Paid'
        },
        {
            date: '2025-02-20',
            paymentId: '--',
            customerName: 'mahesh Babu',
            paymentMode: 'Bank Transfer',
            amount: '3299.28',
            status: 'Paid'
        },
    ];

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <View className="p-4">
                {/* Header */}
                <View className="flex-row justify-between items-center mb-4">
                    <View className="flex-row items-center space-x-2">
                        <Text className="text-blue-600 font-semibold">Filter</Text>
                        <FilterIcon size={20} color="#2563eb" />
                        <Text className="text-gray-600">All</Text>
                    </View>
                    <Text className="text-gray-600">Total: 3</Text>
                </View>

                {/* Search and Actions */}
                <View className="flex-row space-x-2 mb-4">
                    <View className="flex-1 flex-row items-center bg-white rounded-lg border border-gray-200 px-3 py-2">
                        <Search size={20} color="#6b7280" />
                        <TextInput
                            className="flex-1 ml-2 text-gray-900"
                            placeholder="Search Invoices"
                            placeholderTextColor="#9ca3af"
                        />
                    </View>
                    <TouchableOpacity className="bg-blue-600 rounded-lg px-4 py-2 flex-row items-center"
                        activeOpacity={0.8}>
                        <PlusIcon size={20} color="white" />
                        <Text className="text-white ml-2">Update Payment</Text>
                    </TouchableOpacity>
                </View>

                {/* Payment Cards */}
                <ScrollView className="space-y-3">
                    {payments.map((payment, index) => (
                        <View key={index} className="bg-white rounded-lg shadow-sm p-4">
                            <View className="flex-row justify-between items-start mb-3">
                                <View>
                                    <Text className="text-gray-900 font-semibold">{payment.customerName}</Text>
                                    <Text className="text-gray-500 text-sm">{payment.date}</Text>
                                </View>
                                <View className="bg-green-100 px-3 py-1 rounded-full">
                                    <Text className="text-green-600 font-medium">{payment.status}</Text>
                                </View>
                            </View>

                            <View className="space-y-2">
                                <View className="flex-row justify-between">
                                    <Text className="text-gray-500">Payment Mode</Text>
                                    <Text className="text-gray-900">{payment.paymentMode}</Text>
                                </View>
                                <View className="flex-row justify-between">
                                    <Text className="text-gray-500">Amount</Text>
                                    <Text className="text-gray-900 font-semibold">₹{payment.amount}</Text>
                                </View>
                            </View>
                        </View>
                    ))}
                </ScrollView>

                {/* Pagination */}
                <View className="flex-row justify-between items-center mt-4 py-2">
                    <Text className="text-gray-600">Showing page 1 of 1</Text>
                    <View className="flex-row items-center space-x-2">
                        <TouchableOpacity className="w-8 h-8 rounded bg-gray-200 items-center justify-center">
                            <Text className="text-gray-600">1</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default PaymentList;