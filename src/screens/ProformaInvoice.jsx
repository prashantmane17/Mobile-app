import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';

const purchaseOrders = [
    {
        date: '25 Feb 2025',
        orderNo: 'PO-2025/00005',
        supplier: 'Gukesh',
        email: '- -',
        dueDate: '25 Feb 2025',
        amount: '₹ 994.74',
        status: 'Pay'
    },
    {
        date: '22 Feb 2025',
        orderNo: 'PO-2025/00004',
        supplier: 'Umesh',
        email: '- -',
        dueDate: '07 Mar 2025',
        amount: '₹ 94.4',
        status: 'Paid'
    },
    {
        date: '21 Feb 2025',
        orderNo: 'PO-2025/00003',
        supplier: 'Amar M',
        email: '- -',
        dueDate: '21 Feb 2025',
        amount: '₹ 1609.52',
        status: 'Paid'
    },
    {
        date: '21 Feb 2025',
        orderNo: 'PO-2025/00001',
        supplier: 'Makarndsdsqw',
        email: '- -',
        dueDate: '06 Mar 2025',
        amount: '₹ 75.52',
        status: 'Paid'
    }
];

export default function ProformaInvoice() {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(25);
    const [items, setItems] = useState([
        { label: '25', value: 25 },
        { label: '50', value: 50 },
        { label: '100', value: 100 }
    ]);

    const filteredOrders = purchaseOrders.filter(order =>
        order.orderNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.supplier.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredOrders.length / value);
    const paginatedOrders = filteredOrders.slice(
        (currentPage - 1) * value,
        currentPage * value
    );

    return (
        <ScrollView className="flex-1 bg-gray-100">
            {/* Header */}
            <View className="bg-white p-4 shadow-sm rounded-lg">
                <View className="flex-1 flex-row items-center bg-gray-100 rounded-md px-3 py-1 mb-4">
                    <Feather name="search" size={20} color="#9CA3AF" />
                    <TextInput
                        className="flex-1 ml-2 text-base"
                        placeholder="Search Invoice..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                <View className="flex-row items-center justify-between space-x-2">
                    <View className="flex-row items-center justify-between gap-3">
                        <TouchableOpacity
                            className="bg-blue-500 px-4 py-2 rounded-md"
                            onPress={() => console.log('Create PO')}
                        >
                            <Text className="text-white font-medium">+ Create PI</Text>
                        </TouchableOpacity>
                        <Text className="text-sm text-gray-600">
                            Total: {paginatedOrders.length}
                        </Text>
                    </View>

                    <View className="flex-row items-center text-black rounded-md px-2 py-2">
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
                                height: 35,
                                minHeight: 35,
                            }}
                            dropDownContainerStyle={{
                                borderColor: '#ccc',
                                zIndex: 2000,
                                maxHeight: 120,
                            }}
                            textStyle={{ fontSize: 14 }}
                        />
                    </View>
                </View>
            </View>

            {/* Purchase Order Cards */}
            <View className="px-4 py-4">
                <View className="flex-row flex-wrap -mx-2">
                    {paginatedOrders.map((order) => (
                        <View key={order.orderNo} className="w-full px-2 mb-4">
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
                                                {order.orderNo}
                                            </Text>
                                        </View>
                                        <View className={`px-3 py-1 rounded-full ${order.status === 'Paid' ? 'bg-green-100' : 'bg-blue-100'}`}>
                                            <Text className={`text-xs font-medium ${order.status === 'Paid' ? 'text-green-600' : 'text-blue-600'}`}>
                                                {order.status}
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                                {/* Card Content */}
                                <View className="p-4">
                                    <View className="space-y-3">
                                        {/* Supplier Info */}
                                        <View className="flex-row items-center">
                                            <Feather name="user" size={16} color="#60A5FA" />
                                            <Text className="ml-2 text-sm text-gray-600">
                                                {order.supplier}
                                            </Text>
                                        </View>

                                        {/* Email */}
                                        <View className="flex-row items-center">
                                            <Feather name="mail" size={16} color="#60A5FA" />
                                            <Text className="ml-2 text-sm text-gray-600">
                                                {order.email}
                                            </Text>
                                        </View>

                                        {/* Dates */}
                                        <View className="flex-row justify-between items-center">
                                            <View>
                                                <Text className="text-xs text-gray-500">Purchase Date</Text>
                                                <Text className="text-sm text-gray-900">{order.date}</Text>
                                            </View>
                                            <View>
                                                <Text className="text-xs text-gray-500">Due Date</Text>
                                                <Text className="text-sm text-gray-900">{order.dueDate}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>

                                {/* Card Footer */}
                                <View className="p-4 bg-gray-50 border-t border-gray-100">
                                    <View className="flex-row justify-between items-center">
                                        <Text className="text-sm text-gray-500">Total Amount</Text>
                                        <Text className="text-lg font-semibold text-gray-900">
                                            {order.amount}
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
    );
}