// import { PlusIcon } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getAllPayments } from '../../api/user/payment';

const PaymentList = () => {
    const navigation = useNavigation();
    const [payment, setPayments] = useState([])
    const [loading, setLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState('');
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(25);
    const [items, setItems] = useState([
        { label: '25', value: 25 },
        { label: '50', value: 50 },
        { label: '100', value: 100 }
    ]);
    const [currentPage, setCurrentPage] = useState(1)
    const paymentData = async () => {
        setLoading(true)
        try {
            const response = await getAllPayments();
            setPayments(response.payments)
        } catch (error) {
            console.error("Error fetching payment:", error);
        }
        finally {
            setLoading(false)
        }
    };
    useFocusEffect(
        useCallback(() => {
            paymentData();
        }, []));
    const filteredInvoices = payment.filter(invoice =>
        invoice.customerName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const totalItems = filteredInvoices.length
    const totalPages = Math.ceil(totalItems / value) || 1;
    const startIndex = (currentPage - 1) * value
    const endIndex = Math.min(startIndex + value, totalItems)
    const currentPayment = filteredInvoices.slice(startIndex, endIndex)

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
    return (
        <SafeAreaView className="flex-1 bg-gray-100">
            <View className="p-4">
                {/* Header */}

                {/* Payment Cards */}
                <View className="bg-white p-4 shadow-sm rounded-lg mb-4 ">
                    <View className=" flex-row items-center bg-gray-100 rounded-md px-3 py-1 mb-4">
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
                                onPress={() => navigation.navigate('PaymentForm')}
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
                <View className="flex-row justify-between items-center  rounded-lg shadow-sm p-2 mb-2 bg-white">
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
                <ScrollView className="mb-40">
                    <View className="">
                        {loading ? (
                            <View className="flex-1 justify-center items-center py-20">
                                <ActivityIndicator size="large" color="#3b82f6" />
                                <Text className="mt-4 text-gray-500">Loading payment...</Text>
                            </View>
                        ) : (<>
                            {filteredInvoices.length > 0 ? (
                                currentPayment.map((payment, index) => (
                                    <View key={index} className="bg-white rounded-lg shadow-sm p-4 mb-2">
                                        <View className="flex-row justify-between items-start mb-3">
                                            <View>
                                                <Text className="text-lg font-semibold text-gray-900 capitalize" onPress={() => navigation.navigate("PaymentDetails", { id: payment.id })}>{payment.customerName}</Text>
                                                <Text className="text-gray-500 text-sm">{payment.paymentDate?.split("T")[0]}</Text>
                                            </View>
                                            <View className="bg-green-100 px-3 py-1 rounded-full">
                                                <Text className="text-green-600 font-medium">Paid</Text>
                                            </View>
                                        </View>

                                        <View className="space-y-2">
                                            <View className="flex-row justify-between">
                                                <Text className="text-gray-500">Payment Mode</Text>
                                                <Text className="text-gray-900">{payment.paymentMode}</Text>
                                            </View>
                                            <View className="mt-2 pt-3 border-t border-gray-100 flex-row justify-between items-center">
                                                <Text className="text-gray-500 font-medium">Amount:</Text>
                                                <Text className="text-xl font-bold text-gray-600">₹{payment.amountReceived}</Text>
                                            </View>
                                        </View>
                                    </View>
                                ))) : (
                                <View className="flex-1 justify-center items-center py-20">
                                    <MaterialCommunityIcons name="account-off" size={64} color="#9ca3af" />
                                    <Text className="mt-4 text-gray-500 text-lg">Payment not found</Text>
                                </View>
                            )}
                        </>
                        )}
                    </View>

                </ScrollView>

                {/* Pagination */}
            </View>
        </SafeAreaView>
    );
};

export default PaymentList;