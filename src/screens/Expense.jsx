// TransactionCard.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
// import { Checkbox } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';


// Sample transaction data
const transactions = [
    { id: '1', date: '27 Feb 2025', name: 'Food & Beverages', description: 'Luncha  with team', amount: '₹4000.0', selected: false },
    { id: '2', date: '26 Feb 2025', name: 'Transportation', description: 'Uber ride', amount: '₹350.0', selected: false },
    { id: '3', date: '25 Feb 2025', name: 'Shopping', description: 'New headphones', amount: '₹2500.0', selected: false },
    { id: '4', date: '24 Feb 2025', name: 'Utilities', description: 'Electricity  bill', amount: '₹1200.0', selected: false },
];

const TransactionCard = ({ transaction, onToggleSelect }) => {

    return (
        <View className="bg-white rounded-xl shadow-md mb-4 overflow-hidden">
            <View className="flex-row items-center p-4 border-b border-gray-100">
                {/* <Checkbox
                    status={transaction.selected ? 'checked' : 'unchecked'}
                    onPress={() => onToggleSelect(transaction.id)}
                    color="#3b82f6"
                /> */}
                <View className="ml-2 flex-1">
                    <Text className="text-lg font-semibold text-gray-800">{transaction.name}</Text>
                    <Text className="text-sm text-gray-500">{transaction.date}</Text>
                </View>
                <View className="flex-row items-center">
                    <TouchableOpacity
                        className="mr-4 bg-blue-100 p-2 rounded-full"
                    // onPress={() => { }}
                    >
                        <MaterialCommunityIcons name="pencil" size={18} color="#3b82f6" />
                    </TouchableOpacity>
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
                    <Text className="text-gray-600">{transaction.description}</Text>
                </View>
            </View>

            <View className="mx-2 p-3 flex-row justify-between">
                <Text className="text-lg font-bold text-gray-600">Amount</Text>
                <Text className="text-lg font-bold text-blue-600">{transaction.amount}</Text>
            </View>
        </View>
    );
};

const Expense = () => {
    const [transactionData, setTransactionData] = React.useState(transactions);
    const navigation = useNavigation();
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
                    <View className="flex-1 flex-row items-center bg-gray-100  rounded-md px-3 py-1 mb-4">
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

export default Expense;