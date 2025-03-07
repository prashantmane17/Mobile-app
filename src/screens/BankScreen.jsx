import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
// import { Checkbox } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { getAllBankData } from '../api/user/bank_Expense';




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
                <View className="ml-2 flex-1">
                    <Text className="text-lg font-semibold">{formatDate(transaction.createdAt)}</Text>
                </View>
                <Text
                    className={`font-semibold capitalize rounded-full px-3 w-16 text-center text-sm ${transaction.transactionType === "credit" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                        }`}
                >
                    {transaction.transactionType}
                </Text>
            </View>

            <View className="pl-5 pr-4 py-1  ">
                <View className="bg-gray-50 border-l-2 p-2">
                    <Text className="text-gray-600">{transaction.description}</Text>
                </View>
            </View>

            <View className="mx-2 p-3 flex-row justify-between">
                <Text className="text-lg font-bold text-gray-600">Amount</Text>
                <Text className="text-lg font-bold text-blue-600">₹ {transaction.amount}</Text>
            </View>
        </View>
    );
};

const BankScreen = () => {
    const navigation = useNavigation();
    const [transactionData, setTransactionData] = React.useState([]);
    const bankData = async () => {
        try {
            const response = await getAllBankData();
            setTransactionData(response.payments)
        } catch (error) {
            // console.error("Error fetching Customer:", error);
        }
    };

    useEffect(() => {
        bankData();
    }, []);
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
    const filteredInvoices = transactionData.filter(invoice =>
        invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <View className="flex-1 bg-gray-100">

            <ScrollView className="flex-1 p-4">
                <View className="bg-white p-4 shadow-sm rounded-lg mb-4">


                    <View className="flex-row items-center justify-between space-x-2">
                        <View className="flex-row items-center justify-between gap-3">
                            <TouchableOpacity
                                className="bg-blue-500 px-4 py-2 rounded-md"
                                onPress={() => navigation.navigate('BankForm')}
                            >
                                <Text className="text-white font-medium">+ Create Entry</Text>
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
                {filteredInvoices.map(transaction => (
                    <TransactionCard
                        key={transaction.id}
                        transaction={transaction}
                        onToggleSelect={handleToggleSelect}
                    />
                ))}
            </ScrollView>
        </View>
    );
};

export default BankScreen;