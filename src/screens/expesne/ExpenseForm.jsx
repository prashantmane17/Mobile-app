import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Platform, ScrollView, Modal, FlatList, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar, ChevronLeft, ChevronDown } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

export default function ExpenseForm() {
    const [formData, setFormData] = useState({
        date: new Date(),
        category: '',
        amount: '',
        paymentMethod: '',
        description: '',
        invoiceId: ''
    });
    const navigation = useNavigation();
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date(2025, 2, 1)); // March 1, 2025

    // For dropdowns
    const [ShowCatForm, setShowCatForm] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [showPaymentMethodModal, setShowPaymentMethodModal] = useState(false);

    // Sample data for dropdowns
    const categories = [
        "Office Expense",
        "Travel & Transportation",
        "Food & Beverages",
        "Utilities",
        "Salary & Wages",
        "Miscellaneous"
    ];

    const paymentMethods = [
        "Cash",
        "Card",
        "Bank Transfer",
    ];
    const parseDateToDDMMYYYY = (inputDate) => {
        if (inputDate) {
            const formattedDate =
                inputDate.getDate().toString().padStart(2, "0") +
                "/" +
                (inputDate.getMonth() + 1).toString().padStart(2, "0") +
                "/" +
                inputDate.getFullYear();
            return formattedDate;
        }
        return inputDate;
    };
    const handleDateChange = (event, date) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (date) {
            setSelectedDate(date);
            setFormData({ ...formData, date: date });
        }
    };


    const saveExpense = async () => {
        if (!formData.category || !formData.amount || !formData.paymentMethod) {
            Alert.alert("Validation Error", "Please fill in all required fields.");
            return;
        }

        const requestBody = {
            date: selectedDate.toISOString().split('T')[0], // Format date as "YYYY-MM-DD"
            category: formData.category,
            amount: parseFloat(formData.amount),
            paymentMethod: formData.paymentMethod,
            description: formData.description,
            invoiceId: formData.invoiceId || null
        };

        try {
            const response = await fetch('https://billing.portstay.com/save-Expenses-mobileApp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });
            const data = await response.json();
            if (response.ok) {
                Alert.alert("Success", "Expense saved successfully!");
                setFormData({ date: formData.date, category: '', amount: '', paymentMethod: '', description: '', invoiceId: '' });
                navigation.navigate('Expense')

            } else {
                Alert.alert("Error", data.message || "Failed to save expense.");
            }
        } catch (error) {
            Alert.alert("Network Error", "Something went wrong. Please try again later.");
        }
    };

    const renderDropdownItem = (item, onSelect, closeModal) => {
        return (
            <TouchableOpacity
                className="p-4 border-b border-gray-200"
                onPress={() => {
                    onSelect(item);
                    closeModal();
                }}
            >
                <Text className="text-gray-800">{item}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <View className="flex-1 bg-white">
            {/* Header */}
            <View className="flex-row items-center p-4 border-b border-gray-200">
                <TouchableOpacity className="mr-4"
                    onPress={() => navigation.navigate('Expense')}>
                    <ChevronLeft width={24} height={24} color="#3b82f6" />
                </TouchableOpacity>
                <Text className="text-xl font-semibold">Create Expenses</Text>
            </View>

            <ScrollView className="flex-1 p-4">
                {/* Date */}
                <View className="mb-4">
                    <Text className="text-gray-700 mb-1">
                        Date<Text className="text-red-500">*</Text>
                    </Text>
                    <View className="relative">
                        <TextInput
                            className="border border-gray-300 rounded-md p-3 bg-white"
                            value={parseDateToDDMMYYYY(formData.date)}
                            editable={false} // Prevent manual typing
                        />
                        <TouchableOpacity
                            className="absolute right-3 top-3"
                            onPress={() => setShowDatePicker(true)}
                        >
                            <Calendar width={20} height={20} color="#666" />
                        </TouchableOpacity>
                    </View>
                    {showDatePicker && (
                        <DateTimePicker
                            value={selectedDate}
                            mode="date"
                            display={Platform.OS === "ios" ? "spinner" : "default"}
                            onChange={handleDateChange}
                        />
                    )}
                </View>

                {/* Category */}
                <View className="mb-4">
                    <Text className="text-gray-700 mb-1">
                        Category<Text className="text-red-500">*</Text>
                    </Text>
                    <TouchableOpacity
                        className="border border-gray-300 rounded-md p-3 bg-white flex-row justify-between items-center"
                        onPress={() => setShowCategoryModal(true)}
                    >
                        <Text className={formData.category ? "text-gray-800" : "text-gray-500"}>
                            {formData.category || "Select a Category"}
                        </Text>
                        <ChevronDown width={20} height={20} color="#666" />
                    </TouchableOpacity>
                </View>

                <View className="mb-4">
                    <Text className="text-gray-700 mb-1">
                        Amount<Text className="text-red-500">*</Text>
                    </Text>
                    <TextInput
                        className="border border-gray-300 rounded-md p-3 bg-white"
                        placeholder="Enter amount"
                        value={formData.amount}
                        onChangeText={(text) => setFormData({ ...formData, amount: text })}
                        keyboardType="numeric"
                    />
                </View>

                {/* Payment Method */}
                <View className="mb-4">
                    <Text className="text-gray-700 mb-1">
                        Payment Method<Text className="text-red-500">*</Text>
                    </Text>
                    <TouchableOpacity
                        className="border border-gray-300 rounded-md p-3 bg-white flex-row justify-between items-center"
                        onPress={() => setShowPaymentMethodModal(true)}
                    >
                        <Text className={formData.paymentMethod ? "text-gray-800" : "text-gray-500"}>
                            {formData.paymentMethod || "Select payment method"}
                        </Text>
                        <ChevronDown width={20} height={20} color="#666" />
                    </TouchableOpacity>
                </View>

                {/* Description */}
                <View className="mb-4">
                    <Text className="text-gray-700 mb-1">
                        Description
                    </Text>
                    <TextInput
                        className="border border-gray-300 rounded-md p-3 bg-white h-24"
                        placeholder="Enter description"
                        value={formData.description}
                        onChangeText={(text) => setFormData({ ...formData, description: text })}
                        multiline={true}
                        textAlignVertical="top"
                    />
                </View>

                {/* Invoice ID */}
                <View className="mb-6">
                    <Text className="text-gray-700 mb-1">
                        Invoice ID
                    </Text>
                    <TextInput
                        className="border border-gray-300 rounded-md p-3 bg-white"
                        placeholder="Enter invoice ID (if applicable)"
                        value={formData.invoiceId}
                        onChangeText={(text) => setFormData({ ...formData, invoiceId: text })}
                    />
                </View>

                {/* Buttons */}
                <View className="flex-row justify-end mb-4">
                    <TouchableOpacity className="bg-blue-500 rounded-md py-3 px-6 mr-2" onPress={saveExpense}>
                        <Text className="text-white font-medium">Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="border border-gray-300 rounded-md py-3 px-6">
                        <Text className="text-gray-700 font-medium">Close</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Category Modal */}
            <Modal
                visible={showCategoryModal}
                transparent={true}
                animationType="slide"
            >
                <View className="flex-1 bg-black/30 justify-end">
                    <View className="bg-white rounded-t-lg">
                        <View className="p-4 border-b border-gray-200 flex-row justify-between items-center">
                            <Text className="text-lg font-semibold">Select Category</Text>
                            <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                                <Text className="text-blue-500">Close</Text>
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={categories}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) =>
                                renderDropdownItem(
                                    item,
                                    (selected) => setFormData({ ...formData, category: selected }),
                                    () => setShowCategoryModal(false)
                                )
                            }
                            style={{ maxHeight: 300 }}
                        />
                    </View>
                </View>
            </Modal>

            {/* Payment Method Modal */}
            <Modal
                visible={showPaymentMethodModal}
                transparent={true}
                animationType="slide"
            >
                <View className="flex-1 bg-black/30 justify-end">
                    <View className="bg-white rounded-t-lg">
                        <View className="p-4 border-b border-gray-200 flex-row justify-between items-center">
                            <Text className="text-lg font-semibold">Select Payment Method</Text>
                            <TouchableOpacity onPress={() => setShowPaymentMethodModal(false)}>
                                <Text className="text-blue-500">Close</Text>
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={paymentMethods}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) =>
                                renderDropdownItem(
                                    item,
                                    (selected) => setFormData({ ...formData, paymentMethod: selected }),
                                    () => setShowPaymentMethodModal(false)
                                )
                            }
                            style={{ maxHeight: 300 }}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
}