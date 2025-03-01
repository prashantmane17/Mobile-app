import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Platform, ScrollView, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { Calendar, ChevronLeft } from 'lucide-react-native';

export default function BankForm() {
    const [formData, setFormData] = useState({
        transactionId: '',
        transactionDate: '03/02/2025',
        transactionType: 'credit',
        amount: '',
        description: ''
    });

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date(2025, 2, 2)); // March 2, 2025

    const transactionTypes = [
        { label: 'Credit (+)', value: 'credit' },
        { label: 'Debit (-)', value: 'debit' },
    ];

    const handleDateChange = (event, date) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (date) {
            setSelectedDate(date);
            const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
            setFormData({ ...formData, transactionDate: formattedDate });
        }
    };

    return (
        <View className="flex-1 bg-white">
            {/* Header */}
            <View className="flex-row items-center p-4 border-b border-gray-200">
                <TouchableOpacity className="mr-4">
                    <ChevronLeft width={24} height={24} color="#3b82f6" />
                </TouchableOpacity>
                <Text className="text-xl font-semibold">Create Entry</Text>
            </View>

            <ScrollView className="flex-1 p-4">
                {/* Transaction ID */}
                <View className="mb-4">
                    <Text className="text-gray-700 mb-1">
                        Transaction Id<Text className="text-red-500">*</Text>
                    </Text>
                    <TextInput
                        className="border border-gray-300 rounded-md p-3 bg-white"
                        placeholder="Enter Transaction Id"
                        value={formData.transactionId}
                        onChangeText={(text) => setFormData({ ...formData, transactionId: text })}
                    />
                </View>

                {/* Transaction Date */}
                <View className="mb-4">
                    <Text className="text-gray-700 mb-1">
                        Transaction Date<Text className="text-red-500">*</Text>
                    </Text>
                    <View className="relative">
                        <TextInput
                            className="border border-gray-300 rounded-md p-3 bg-white"
                            value={formData.transactionDate}
                            editable={false}
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

                {/* Transaction Type */}
                <View className="mb-4">
                    <Text className="text-gray-700 mb-1">
                        Transaction Type<Text className="text-red-500">*</Text>
                    </Text>

                    <TouchableOpacity className="border border-gray-300 rounded-md bg-white p-1 ">
                        <View style={{ height: 35, justifyContent: 'center' }}>
                            <Picker
                                selectedValue={formData.transactionType}
                                onValueChange={(itemValue) => {
                                    setFormData({ ...formData, transactionType: itemValue });
                                }}

                            >
                                {transactionTypes.map((type) => (
                                    <Picker.Item key={type.value} label={type.label} value={type.value} />
                                ))}
                            </Picker>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Amount */}
                <View className="mb-4">
                    <Text className="text-gray-700 mb-1">
                        Amount<Text className="text-red-500">*</Text>
                    </Text>
                    <TextInput
                        className="border border-gray-300 rounded-md p-3 bg-white"
                        placeholder="Enter Amount"
                        value={formData.amount}
                        onChangeText={(text) => setFormData({ ...formData, amount: text })}
                        keyboardType="numeric"
                    />
                </View>

                {/* Description */}
                <View className="mb-6">
                    <Text className="text-gray-700 mb-1">
                        Description
                    </Text>
                    <TextInput
                        className="border border-gray-300 rounded-md p-3 bg-white h-24"
                        placeholder="Enter Description"
                        value={formData.description}
                        onChangeText={(text) => setFormData({ ...formData, description: text })}
                        multiline={true}
                        textAlignVertical="top"
                    />
                </View>

                {/* Buttons */}
                <View className="flex-row justify-end mb-4">
                    <TouchableOpacity className="bg-blue-500 rounded-md py-3 px-6 mr-2">
                        <Text className="text-white font-medium">Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="border border-gray-300 rounded-md py-3 px-6">
                        <Text className="text-gray-700 font-medium">Close</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Transaction Type Picker Modal */}

        </View>
    );
}