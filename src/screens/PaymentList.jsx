// import { PlusIcon } from 'lucide-react-native';
import { FilterIcon, PlusIcon, Search } from 'lucide-react-native';
import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';

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
    const [searchQuery, setSearchQuery] = useState('');
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(25);
    const [items, setItems] = useState([
        { label: '25', value: 25 },
        { label: '50', value: 50 },
        { label: '100', value: 100 }
    ]);
    const filteredInvoices = payments.filter(invoice =>
        invoice.customerName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-100">
            <View className="p-4">
                {/* Header */}

                {/* Payment Cards */}
                <ScrollView className="space-y-3">
                    <View className="bg-white p-4 shadow-sm rounded-lg mb-4">
                        <View className="flex-1 flex-row items-center bg-gray-100 rounded-md px-3 py-1 mb-4">
                            <Feather name="search" size={20} color="#9CA3AF" />
                            <TextInput
                                className="flex-1 ml-2 text-base"
                                placeholder="Search payment..."
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                            />
                        </View>

                        <View className="flex-row items-center justify-between space-x-2">
                            <View className="flex-row items-center justify-between gap-3">
                                <TouchableOpacity
                                    className="bg-blue-500 px-4 py-2 rounded-md"
                                    onPress={() => console.log('Add Customer')}
                                >
                                    <Text className="text-white font-medium">+ Create Payment</Text>
                                </TouchableOpacity>
                                <Text className="text-sm text-gray-600">
                                    Total:{filteredInvoices.length}
                                </Text>
                            </View>

                            <View className="flex-row items-center  text-black rounded-md px-2 py-2">
                                <Text className="text-sm text-gray-600 mr-2">Show:</Text>
                                <DropDownPicker
                                    open={open}
                                    value={value}
                                    items={items}
                                    setOpen={setOpen}
                                    setValue={setValue}
                                    setItems={setItems}
                                    containerStyle={{ width: 80, zIndex: 1000 }}
                                    style={{
                                        borderColor: '#ccc',
                                        height: 35, // Reduced height
                                        minHeight: 35,
                                    }}
                                    dropDownContainerStyle={{
                                        borderColor: '#ccc',
                                        zIndex: 2000, // Even higher zIndex for dropdown
                                        maxHeight: 120, // Control dropdown list height
                                    }}
                                    textStyle={{ fontSize: 14 }} // Adjust font size if needed
                                />


                            </View>
                        </View>
                    </View>
                    {filteredInvoices.map((payment, index) => (
                        <View key={index} className="bg-white rounded-lg shadow-sm p-4">
                            <View className="flex-row justify-between items-start mb-3">
                                <View>
                                    <Text className="text-lg font-semibold text-gray-900 capitalize">{payment.customerName}</Text>
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
                                <View className="mt-2 pt-3 border-t border-gray-100 flex-row justify-between items-center">
                                    <Text className="text-gray-500 font-medium">Amount:</Text>
                                    <Text className="text-xl font-bold text-gray-600">₹{payment.amount}</Text>
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