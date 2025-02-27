import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
// import { Checkbox } from 'react-native-paper';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import { TextInput } from 'react-native-gesture-handler';

// Ensure you have these dependencies installed:
// npm install nativewind
// npm install tailwindcss --save-dev
// npm install react-native-paper
// npm install @expo/vector-icons
// npx tailwindcss init

export default function ItemScreen() {
    const [customers, setCustomers] = useState([
        {
            id: '1',
            name: 'Makarnd',
            companyName: '--',
            email: '--',
            phone: '--',
            gstType: 'registered',
            totalPay: '0',
            selected: false,
        },
        {
            id: '2',
            name: 'Sham',
            companyName: '--',
            email: '--',
            phone: '--',
            gstType: 'registered',
            totalPay: '67200',
            selected: false,
        },
    ]);
    const [searchQuery, setSearchQuery] = useState('');
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(25);
    const [items, setItems] = useState([
        { label: '25', value: 25 },
        { label: '50', value: 50 },
        { label: '100', value: 100 }
    ]);
    const filteredInvoices = customers.filter(invoice =>
        invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.name.toLowerCase().includes(searchQuery.toLowerCase())
    );


    return (
        <SafeAreaView className="flex-1 bg-gray-100">
            <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />

            <View className="flex-1 p-4">
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View className="bg-white p-4 shadow-sm rounded-lg mb-4">
                        <View className="flex-1 flex-row items-center bg-gray-100 rounded-md px-3 py-1 mb-4">
                            <Feather name="search" size={20} color="#9CA3AF" />
                            <TextInput
                                className="flex-1 ml-2 text-base"
                                placeholder="Search items..."
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
                                    <Text className="text-white font-medium">+ Create Invoice</Text>
                                </TouchableOpacity>
                                <Text className="text-sm text-gray-600">
                                    Total:0
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

                    {filteredInvoices.map((customer) => (
                        <View
                            key={customer.id}
                            className="bg-white rounded-xl shadow-sm mb-4 overflow-hidden border border-gray-100"
                        >
                            {/* Card Header */}
                            <View className="flex-row justify-between items-center p-4  border-b border-gray-100">
                                <View className="flex-row items-center">
                                    <MaterialCommunityIcons name="account" size={20} color="#3b82f6" />
                                    <Text className="ml-2 text-lg font-semibold text-blue-600">{customer.name}</Text>
                                </View>
                                <View className="flex-row items-center">
                                    <TouchableOpacity
                                        className="mr-4 bg-blue-100 p-2 rounded-full"
                                        onPress={() => {/* Edit functionality */ }}
                                    >
                                        <MaterialCommunityIcons name="pencil" size={18} color="#3b82f6" />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        className="bg-red-100 p-2 rounded-full"
                                        onPress={() => deleteCustomer(customer.id)}
                                    >
                                        <MaterialCommunityIcons name="delete" size={18} color="#ef4444" />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Card Body */}
                            <View className="p-4">
                                <View className="flex-row justify-between items-center mb-3">

                                    <View className="bg-blue-50 px-3 py-1 rounded-full">
                                        <Text className="text-blue-700 font-medium">
                                            GST: {customer.gstType}
                                        </Text>
                                    </View>
                                </View>

                                <View className="mb-3">
                                    <View className="flex-row items-center mb-2">
                                        <MaterialCommunityIcons name="office-building" size={18} color="#6b7280" />
                                        <Text className="ml-2 text-gray-500 font-medium">Company:</Text>
                                        <Text className="ml-2 text-gray-700">{customer.companyName}</Text>
                                    </View>

                                    <View className="flex-row items-center mb-2">
                                        <MaterialCommunityIcons name="email" size={18} color="#6b7280" />
                                        <Text className="ml-2 text-gray-500 font-medium">Email:</Text>
                                        <Text className="ml-2 text-gray-700">{customer.email}</Text>
                                    </View>

                                    <View className="flex-row items-center mb-2">
                                        <MaterialCommunityIcons name="phone" size={18} color="#6b7280" />
                                        <Text className="ml-2 text-gray-500 font-medium">Phone:</Text>
                                        <Text className="ml-2 text-gray-700">{customer.phone}</Text>
                                    </View>
                                </View>

                                {/* Card Footer */}
                                <View className="mt-2 pt-3 border-t border-gray-100 flex-row justify-between items-center">
                                    <Text className="text-gray-500 font-medium">Total Pay:</Text>
                                    <Text className="text-xl font-bold text-green-600">₹ {customer.totalPay}</Text>
                                </View>
                            </View>
                        </View>
                    ))}

                    {customers.length === 0 && (
                        <View className="flex-1 justify-center items-center py-20">
                            <MaterialCommunityIcons name="account-off" size={64} color="#9ca3af" />
                            <Text className="mt-4 text-gray-500 text-lg">No customers found</Text>
                        </View>
                    )}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}