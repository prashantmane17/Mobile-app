// TransactionCard.tsx
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
// import { Checkbox } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getAllExpenses } from '../../api/user/bank_Expense';

const TransactionCard = ({ transaction, onToggleSelect }) => {
    const formatDate = (timestamp) => {
        const date = new Date(Number(timestamp)); // Convert to Date object
        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }).toUpperCase(); // Convert month to uppercase
    };
    return (
        <View className="bg-white rounded-xl shadow-md mb-4 overflow-hidden">
            <View className="flex-row items-center p-4 border-b border-gray-100">
                {/* <Checkbox
                    status={transaction.selected ? 'checked' : 'unchecked'}
                    onPress={() => onToggleSelect(transaction.id)}
                    color="#3b82f6"
                /> */}
                <View className="ml-2 flex-1">
                    <Text className="text-lg font-semibold text-gray-800">{transaction.category}</Text>
                    <Text className="text-sm text-gray-500">{formatDate(transaction.createdAt)}</Text>
                </View>
                <View className="flex-row items-center">

                    <TouchableOpacity
                        className="bg-red-100 p-2 rounded-full"
                    // onPress={() => deleteCustomer(transaction.id)}
                    >
                        <MaterialCommunityIcons name="delete" size={18} color="#ef4444" />
                    </TouchableOpacity>
                </View>

            </View>

            <View className="pl-5 pr-4 py-1  ">
                <View className="bg-gray-50 border-l-2 p-2">
                    <Text className="text-gray-600">{transaction.description || "--"}</Text>
                </View>
            </View>

            <View className="mx-2 p-3 flex-row justify-between">
                <Text className="text-lg font-bold text-gray-600">Amount</Text>
                <Text className="text-lg font-bold text-blue-600">₹ {transaction.amount}</Text>
            </View>
        </View>
    );
};

const Expense = () => {
    const [transactionData, setTransactionData] = React.useState([]);
    const navigation = useNavigation();
    const expenseData = async () => {
        try {
            const response = await getAllExpenses();
            setTransactionData(response.payments)
        } catch (error) {
            console.error("Error fetching Customer:", error);
        }
    };
    useFocusEffect(useCallback(() => {
        expenseData();
    }, []))

    const handleToggleSelect = (id) => {
        setTransactionData(transactionData.map(item =>
            item.id === id ? { ...item, selected: !item.selected } : item
        ));
    };

    const [searchQuery, setSearchQuery] = useState('');
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(25);
    const [items, setItems] = useState([
        { label: '25', value: 25 },
        { label: '50', value: 50 },
        { label: '100', value: 100 }
    ]);
    const [currentPage, setCurrentPage] = useState(1)
    const filteredInvoices = transactionData.filter(invoice =>
        invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalItems = filteredInvoices.length
    const totalPages = Math.ceil(totalItems / value) || 1;
    const startIndex = (currentPage - 1) * value
    const endIndex = Math.min(startIndex + value, totalItems)
    const currentCustomer = filteredInvoices.slice(startIndex, endIndex)

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
        <View className="flex-1 bg-gray-100">


            <View className="bg-white p-4 shadow-sm rounded-lg mx-4  mb-2">
                <View className=" flex-row items-center bg-gray-100  rounded-md px-3 py-1 mb-2">
                    <Feather name="search" size={20} color="" />
                    <TextInput
                        className="flex-1 ml-2 text-base "
                        placeholder="Search expense..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                <View className="flex-row items-center justify-between space-x-2">
                    <View className="flex-row items-center justify-between gap-3">
                        <TouchableOpacity
                            className="bg-blue-500 px-4 py-2 rounded-md"
                            onPress={() => navigation.navigate('ExpenseForm')}
                        >
                            <Text className="text-white font-medium">+ Create Expense</Text>
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
            <View className="flex-row justify-between items-center mx-4  rounded-lg shadow-sm p-2  mb-2 bg-white">
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
            <ScrollView className="flex-1 p-4">
                {currentCustomer.map(transaction => (
                    <TransactionCard
                        key={transaction.id}
                        transaction={transaction}
                        onToggleSelect={handleToggleSelect}
                    />
                ))}
                {filteredInvoices.length === 0 && <View className="flex-1 justify-center items-center py-20">
                    <MaterialCommunityIcons name="book-off" size={64} color="#9ca3af" />
                    <Text className="mt-4 text-gray-500 text-lg">Expense not found</Text>
                </View>}
            </ScrollView>
        </View>
    );
};

export default Expense;