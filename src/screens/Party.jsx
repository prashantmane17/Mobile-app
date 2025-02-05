import React, { useState } from 'react';
import { View, ScrollView, Text, TextInput, TouchableOpacity, SafeAreaView, TouchableWithoutFeedback, FlatList } from 'react-native';
import { Plus, Search, Import, User, Building, Mail, Phone, ChevronDown, MoreVertical } from 'lucide-react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function CustomerList() {
    const [selectedNumber, setSelectedNumber] = useState(25);
    const [isDropdownVisible, setDropdownVisible] = useState(false);

    const numbers = [25, 50, 100];
    const navigation = useNavigation();
    const customers = [
        {
            name: 'sales jr',
            company: 'wipro',
            email: 'fopor13313@kwalah.com',
            phone: '919940712326',
            gstType: 'consumer',
            receivables: '0.0'
        },
    ];

    return (
        <TouchableWithoutFeedback onPress={() => setDropdownVisible(false)}>
            <SafeAreaView className="flex-1 bg-gray-50">
                <View className="p-4 bg-white space-y-4">
                    <View className="flex-row items-center px-3 py-2 bg-gray-100 rounded-lg">
                        <Search className="w-5 h-5 text-gray-400 mr-2" />
                        <TextInput
                            placeholder="Search Customers"
                            className="flex-1 text-gray-700"
                        />
                    </View>

                    <View className="flex-row gap-2  items-center justify-between">

                        <TouchableOpacity onPress={() => navigation.navigate('AddCustomerForm')}
                            className="flex-row items-center px-3 py-2 bg-blue-500 rounded-lg">
                            <Plus className="w-4 h-4 text-white mr-1" />
                            <Text className="text-white">Create Customer</Text>
                        </TouchableOpacity>
                        <View className="flex-row items-center relative">
                            <Text>Show : </Text>
                            <TouchableOpacity
                                className="flex-row justify-between items-center px-2 py-1 border border-gray-200 rounded-lg"
                                onPress={() => setDropdownVisible(!isDropdownVisible)}
                            >
                                <Text>{selectedNumber}</Text>
                                <Feather name="chevron-down" size={18} color="gray" />
                            </TouchableOpacity>
                            {isDropdownVisible && (

                                <View className="absolute z-10 top-full right-0 bg-white px-2 py-1 border border-gray-300 rounded-lg w-14">
                                    {numbers.map((num) => (
                                        <TouchableOpacity
                                            key={num}
                                            className="py-1  border-gray-300 last:border-b-0"
                                            onPress={() => {
                                                setSelectedNumber(num);
                                                setDropdownVisible(false);
                                            }}
                                        >
                                            <Text className="text-center">{num}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}

                        </View>
                        <Text>Total: 0</Text>

                        <TouchableOpacity className="flex-row items-center px-1 py-2  rounded-lg">
                            <Import className="w-4 h-4 text-green-500 mr-1" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Customer List */}
                <ScrollView className="flex-1 p-3">
                    {customers.map((customer, index) => (
                        <View key={index} className="p-4 mb-3 mx-2 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 shadow-sm border border-blue-100">
                            <View className="space-y-3">
                                {/* Name Section */}
                                <View className="flex-row items-center">
                                    <View className="w-8 h-8 rounded bg-blue-400 items-center justify-center mr-2">
                                        <User className="text-white w-4 h-4" />
                                    </View>
                                    <Text className="text-xl font-bold text-gray-800">{customer.name}</Text>
                                </View>

                                {/* Company Section */}
                                <View className="flex-row items-center  p-2 rounded-lg">
                                    <View className="w-6 h-6 rounded bg-purple-400 items-center justify-center mr-2">
                                        <Building className="text-white w-3 h-3" />
                                    </View>
                                    <Text className="text-gray-700 font-medium">{customer.company}</Text>
                                </View>

                                {/* Email Section */}
                                <View className="flex-row items-center p-2 rounded-lg">
                                    <View className="w-6 h-6 rounded bg-green-400 items-center justify-center mr-2">
                                        <Mail className="text-white w-3 h-3" />
                                    </View>
                                    <Text className="text-gray-700 flex-1 font-medium">{customer.email}</Text>
                                </View>

                                {/* Phone & Receivables Section */}
                                <View className="flex-row items-center justify-between">
                                    <View className="flex-row items-center  p-2 rounded-lg flex-1 mr-2">
                                        <View className="w-6 h-6 rounded bg-orange-400 items-center justify-center mr-2">
                                            <Phone className="text-white w-3 h-3" />
                                        </View>
                                        <Text className="text-gray-700 font-medium">{customer.phone}</Text>
                                    </View>
                                    <View className="bg-blue-500 px-4 py-2 rounded-lg">
                                        <Text className="text-white font-bold">₹ {customer.receivables}</Text>
                                    </View>
                                </View>

                                {/* GST Type Section */}
                                <View className="mt-2">
                                    <View className="flex-row items-center">
                                        <View className="bg-gray-100 px-3 py-1 rounded-full">
                                            <Text className="text-sm font-medium"
                                                style={{
                                                    color: customer.gstType === 'consumer' ? '#16a34a' : '#4f46e5'
                                                }}>
                                                {customer.gstType.toUpperCase()}
                                            </Text>
                                        </View>
                                        <View className="bg-blue-500 flex-row items-center justify-between  rounded-full px-2 py-1">
                                            <Feather name="eye" size={18} color="#ffffff" />
                                            <Text className="text-white">View</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>

                        </View>
                    ))}
                </ScrollView>

                {/* Footer */}
                <View className="p-4 bg-white border-t border-gray-200">
                    <Text className="text-center text-gray-600">Showing page 1 of 1</Text>
                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}