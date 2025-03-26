import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import DropDownPicker from 'react-native-dropdown-picker';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getAllInvoices } from '../../api/user/invoice';


export default function InvoiceCards() {
    const [invoices, setInvoices] = useState([])
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

    const invoiceData = async () => {
        try {
            const response = await getAllInvoices();
            setInvoices(response.invoices)
        } catch (error) {
            console.error("Error fetching invoices:", error);
        }
    };


    useFocusEffect(
        useCallback(() => {
            invoiceData();
        }, [])
    );
    const filteredInvoices = invoices?.filter(invoice =>
        invoice.customer?.displayName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalItems = filteredInvoices.length;
    const totalPages = Math.ceil(totalItems / value) || 1;
    const startIndex = (currentPage - 1) * value
    const endIndex = Math.min(startIndex + value, totalItems)
    const currentInvoices = filteredInvoices.slice(startIndex, endIndex)

    useEffect(() => {
        setCurrentPage(1)
    }, [value, searchQuery])

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1)
        }
    }

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1)
        }
    }

    const formatDate = (timestamp) => {
        const date = new Date(Number(timestamp)); // Convert to Date object
        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }).toUpperCase(); // Convert month to uppercase
    };
    const getStatusLabel = (status) => {
        if (!status) return "Pending"; // Default if status is undefined
        const normalizedStatus = status.toLowerCase();

        if (normalizedStatus === "paid") return { label: "Paid", color: "text-green-600", bg: "bg-green-100" };
        if (normalizedStatus === "void") return { label: "Cancelled", color: "text-red-600", bg: "bg-red-100" };
        return { label: "Pending", color: "text-orange-600", bg: "bg-orange-100" };
    };


    return (
        <View className="flex-1 bg-gray-100">
            <View className="bg-white mx-4 my-2 px-4 py-2 shadow-sm rounded-lg">
                <View className=" flex-row items-center bg-gray-100 rounded-md px-3 py-1 mb-2">
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
                            Total: {filteredInvoices.length}
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
            <View className="flex-row justify-between items-center  rounded-lg shadow-sm p-2 mx-4 mb-2 bg-white">
                <TouchableOpacity
                    className={`px-4 py-2 rounded-md flex-row items-center ${currentPage === 1 ? "bg-gray-100" : "bg-blue-100"}`}
                    onPress={handlePrevPage}
                    disabled={currentPage === 1}
                >
                    <MaterialCommunityIcons
                        name="chevron-left"
                        size={18}
                        color={currentPage === 1 ? "#9CA3AF" : "#3b82f6"}
                    />
                    <Text className={currentPage === 1 ? "text-gray-400 ml-1" : "text-blue-600 ml-1"}>Previous</Text>
                </TouchableOpacity>

                <View className="flex-row items-center">
                    <Text className="text-gray-600">
                        Showing Page {currentPage} of {totalPages || 1}
                        {/* <Text className="text-gray-500 text-sm">
                                                    {" "}
                                                    ({startIndex + 1}-{endIndex} of {totalItems})
                                                </Text> */}
                    </Text>
                </View>

                <TouchableOpacity
                    className={`px-4 py-2 rounded-md flex-row items-center ${currentPage === totalPages ? "bg-gray-100" : "bg-blue-100"}`}
                    onPress={handleNextPage}
                    disabled={currentPage === totalPages || totalPages === 0}
                >
                    <Text className={currentPage === totalPages ? "text-gray-400 mr-1" : "text-blue-600 mr-1"}>
                        Next
                    </Text>
                    <MaterialCommunityIcons
                        name="chevron-right"
                        size={18}
                        color={currentPage === totalPages ? "#9CA3AF" : "#3b82f6"}
                    />
                </TouchableOpacity>
            </View>
            <ScrollView className="flex-1 bg-gray-100">

                <View className="px-4 py-4">
                    <View className="flex-row flex-wrap -mx-2">
                        {currentInvoices.map((invoice) => {
                            const { label, color, bg } = getStatusLabel(invoice.invoiceStatus);
                            return (<View key={invoice.id} className="w-full px-2 mb-4">
                                <TouchableOpacity
                                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                                    activeOpacity={0.7}
                                >
                                    {/* Card Header */}
                                    <View className="p-4 border-b border-gray-100">
                                        <View className="flex-row justify-between items-center">
                                            <View className="flex-row items-center">
                                                <Feather name="file-text" size={20} color="#60A5FA" />
                                                <Text className="ml-2 text-sm font-medium text-gray-900" onPress={() => navigation.navigate('InvoiceTemp', { id: invoice.id })}>
                                                    {invoice.invoiceNumber}
                                                </Text>
                                            </View>
                                            <View className={`${bg} px-3 py-1 rounded-full`}>
                                                <Text className={`${color} text-xs font-medium`}>
                                                    {label}
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
                                                <Text className="ml-2 text-sm text-gray-600 capitalize">
                                                    {invoice.customer?.displayName || "--"}
                                                </Text>
                                            </View>

                                            {/* Email */}
                                            <View className="flex-row items-center">
                                                <Feather name="mail" size={16} color="#60A5FA" />
                                                <Text className="ml-2 text-sm text-gray-900">
                                                    {invoice?.customer?.emailAddress ?? "--"}
                                                </Text>

                                            </View>

                                            {/* Dates */}
                                            <View className="flex-row justify-between items-center">
                                                <View>
                                                    <Text className="text-xs text-gray-500">Invoice Date</Text>
                                                    <Text className="text-sm text-gray-900">{formatDate(invoice.createdAt)}</Text>
                                                </View>
                                                <View>
                                                    <Text className="text-xs text-gray-500">Due Date</Text>
                                                    <Text className="text-sm text-gray-900">{formatDate(invoice.dueDate)}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>

                                    {/* Card Footer */}
                                    <View className="p-4 bg-gray-50 border-t border-gray-100">
                                        <View className="flex-row justify-between items-center">
                                            <Text className="text-sm text-gray-500">Total Amount</Text>
                                            <Text className="text-lg font-semibold text-gray-900">
                                                ₹ {invoice.totalAmount}
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            )
                        })}
                        {filteredInvoices.length === 0 && <View className="flex-1 justify-center items-center py-20">
                            <MaterialCommunityIcons name="animation" size={64} color="#9ca3af" />
                            <Text className="mt-4 text-gray-500 text-lg">Invoices not found</Text>
                        </View>}
                    </View>
                </View>


            </ScrollView>
        </View>
    );
}