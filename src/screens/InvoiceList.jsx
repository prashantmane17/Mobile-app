import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import DropDownPicker from 'react-native-dropdown-picker';
import { useNavigation } from '@react-navigation/native';

const invoices = [
    {
        id: 'INV/2025/00003',
        date: '24 Feb 2025',
        customer: 'Amar M',
        email: '- -',
        dueDate: '24 Feb 2025',
        amount: '₹ 268',
        status: 'Pending'
    },
    {
        id: 'INV/2025/00002',
        date: '24 Feb 2025',
        customer: 'Raju M',
        email: '- -',
        dueDate: '24 Feb 2025',
        amount: '₹ 180',
        status: 'Pending'
    },
    {
        id: 'INV/2025/00001',
        date: '24 Feb 2025',
        customer: 'Ganesh k',
        email: '- -',
        dueDate: '24 Feb 2025',
        amount: '₹ 12000',
        status: 'Pending'
    },
];
export default function InvoiceCards() {
    const navigation = useNavigation();
    const [searchQuery, setSearchQuery] = useState('');
    const [itemsPerPage, setItemsPerPage] = useState(25);
    const [currentPage, setCurrentPage] = useState(1);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(25);
    const [items, setItems] = useState([
        { label: '25', value: 25 },
        { label: '50', value: 50 },
        { label: '100', value: 100 }
    ]);

    const filteredInvoices = invoices.filter(invoice =>
        invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.customer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredInvoices.length / value);
    const paginatedInvoices = filteredInvoices.slice(
        (currentPage - 1) * value,
        currentPage * value
    );

    return (
        <View className="flex-1 bg-gray-100">
            <View className="bg-white m-4 mb-1 p-4 shadow-sm rounded-lg">
                <View className=" flex-row items-center bg-gray-100 rounded-md px-3 py-1 mb-4">
                    <Feather name="search" size={20} color="#9CA3AF" />
                    <TextInput
                        className="flex-1 ml-2 text-base"
                        placeholder="Search invoices..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                <View className="flex-row items-center justify-between space-x-2">
                    <View className="flex-row items-center justify-between gap-3">
                        <TouchableOpacity
                            className="bg-blue-500 px-4 py-2 rounded-md"
                            onPress={() => navigation.navigate('InvoiceForm')}
                        >
                            <Text className="text-white font-medium">+ Create Invoice</Text>
                        </TouchableOpacity>
                        <Text className="text-sm text-gray-600">
                            Total: {paginatedInvoices.length}
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

            <ScrollView className="flex-1 bg-gray-100">
                {/* Header */}


                {/* Invoice Cards */}
                <View className="px-4 py-4">
                    <View className="flex-row flex-wrap -mx-2">
                        {paginatedInvoices.map((invoice) => (
                            <View key={invoice.id} className="w-full px-2 mb-4">
                                <TouchableOpacity
                                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                                    activeOpacity={0.7}
                                >
                                    {/* Card Header */}
                                    <View className="p-4 border-b border-gray-100">
                                        <View className="flex-row justify-between items-center">
                                            <View className="flex-row items-center">
                                                <Feather name="file-text" size={20} color="#60A5FA" />
                                                <Text className="ml-2 text-sm font-medium text-gray-900">
                                                    {invoice.id}
                                                </Text>
                                            </View>
                                            <View className="bg-orange-100 px-3 py-1 rounded-full">
                                                <Text className="text-orange-600 text-xs font-medium">
                                                    {invoice.status}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>

                                    {/* Card Content */}
                                    <View className="p-4">
                                        <View className="space-y-3">
                                            {/* Customer Info */}
                                            <View className="flex-row items-center">
                                                <Feather name="user" size={16} color="#60A5FA" />
                                                <Text className="ml-2 text-sm text-gray-600">
                                                    {invoice.customer}
                                                </Text>
                                            </View>

                                            {/* Email */}
                                            <View className="flex-row items-center">
                                                <Feather name="mail" size={16} color="#60A5FA" />
                                                <Text className="ml-2 text-sm text-gray-600">
                                                    {invoice.email}
                                                </Text>
                                            </View>

                                            {/* Dates */}
                                            <View className="flex-row justify-between items-center">
                                                <View>
                                                    <Text className="text-xs text-gray-500">Invoice Date</Text>
                                                    <Text className="text-sm text-gray-900">{invoice.date}</Text>
                                                </View>
                                                <View>
                                                    <Text className="text-xs text-gray-500">Due Date</Text>
                                                    <Text className="text-sm text-gray-900">{invoice.dueDate}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>

                                    {/* Card Footer */}
                                    <View className="p-4 bg-gray-50 border-t border-gray-100">
                                        <View className="flex-row justify-between items-center">
                                            <Text className="text-sm text-gray-500">Total Amount</Text>
                                            <Text className="text-lg font-semibold text-gray-900">
                                                {invoice.amount}
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Pagination */}
                <View className="flex-row justify-center items-center p-4">
                    <TouchableOpacity
                        className="mr-2 px-3 py-1 bg-gray-200 rounded-md"
                        onPress={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        <Text className="text-gray-600">Previous</Text>
                    </TouchableOpacity>
                    <Text className="mx-2 text-gray-600">
                        Page {currentPage} of {totalPages}
                    </Text>
                    <TouchableOpacity
                        className="ml-2 px-3 py-1 bg-gray-200 rounded-md"
                        onPress={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        <Text className="text-gray-600">Next</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}