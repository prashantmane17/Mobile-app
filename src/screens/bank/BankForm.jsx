import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Platform, ScrollView, Modal, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { Calendar, ChevronLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

export default function BankForm() {
    const navigation = useNavigation();
    const intialData = {
        transactionId: '',
        transactionDate: new Date(),
        transactionType: 'credit',
        amount: '',
        description: ''
    }
    const [formData, setFormData] = useState(intialData);

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date(2025, 2, 2));

    const transactionTypes = [
        { label: 'Credit (+)', value: 'credit' },
        { label: 'Debit (-)', value: 'debit' },
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
            setFormData({ ...formData, transactionDate: date });
        }
    };

    const handleSubmit = async () => {
        // setFormData({ ...formData, transactionDate: formattedDate });
        const data = new FormData();
        Object.keys(formData).forEach((key) => {
            if (typeof formData[key] !== "object" || formData[key] === null) {
                data.append(key, formData[key]);
            }
        });
        try {
            const response = await fetch('https://billing.portstay.com/save-BankDetails', {
                method: 'POST',
                body: data,
                credentials: "include",
                headers: {},
            });
            const result = await response.json();

            if (response.ok) {
                Alert.alert('Success', 'Transaction saved successfully');
                setFormData(intialData)
                navigation.navigate('Bank')

            } else {
                Alert.alert('Error', result || 'Something went wrong');
            }
        } catch (error) {
            console.error('Error:', error);
            Alert.alert('Error', 'Failed to save transaction');
        }
    };

    return (
        <View className="flex-1 bg-white">
            {/* Header */}
            <View className="flex-row items-center p-4 border-b border-gray-200">
                <TouchableOpacity className="mr-4"
                    onPress={() => navigation.navigate('Bank')}>
                    <ChevronLeft width={24} height={24} color="#3b82f6" />
                </TouchableOpacity>
                <Text className="text-xl font-semibold">Create Entry</Text>
            </View>

            <ScrollView className="flex-1 p-4">
                {/* Transaction ID */}
                <View className="mb-4">
                    <Text className="text-gray-700 mb-1">Transaction Id<Text className="text-red-500">*</Text></Text>
                    <TextInput
                        className="border border-gray-300 rounded-md p-3 bg-white"
                        placeholder="Enter Transaction Id"
                        value={formData.transactionId}
                        onChangeText={(text) => setFormData({ ...formData, transactionId: text })}
                    />
                </View>

                {/* Transaction Date */}
                <View className="mb-4">
                    <Text className="text-gray-700 mb-1">Transaction Date<Text className="text-red-500">*</Text></Text>
                    <View className="relative">
                        <TextInput className="border border-gray-300 rounded-md p-3 bg-white" value={parseDateToDDMMYYYY(formData.transactionDate)} editable={false} />
                        <TouchableOpacity className="absolute right-3 top-3" onPress={() => setShowDatePicker(true)}>
                            <Calendar width={20} height={20} color="#666" />
                        </TouchableOpacity>
                    </View>
                    {showDatePicker && (
                        <DateTimePicker value={selectedDate} mode="date" display="default" onChange={handleDateChange} />
                    )}
                </View>

                {/* Transaction Type */}
                <View className="mb-4">
                    <Text className="text-gray-700 mb-1">Transaction Type<Text className="text-red-500">*</Text></Text>
                    <Picker selectedValue={formData.transactionType} onValueChange={(itemValue) => setFormData({ ...formData, transactionType: itemValue })}>
                        {transactionTypes.map((type) => (
                            <Picker.Item key={type.value} label={type.label} value={type.value} />
                        ))}
                    </Picker>
                </View>

                {/* Amount */}
                <View className="mb-4">
                    <Text className="text-gray-700 mb-1">Amount<Text className="text-red-500">*</Text></Text>
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
                    <Text className="text-gray-700 mb-1">Description</Text>
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
                    <TouchableOpacity className="bg-blue-500 rounded-md py-3 px-6 mr-2" onPress={handleSubmit}>
                        <Text className="text-white font-medium">Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="border border-gray-300 rounded-md py-3 px-6">
                        <Text className="text-gray-700 font-medium">Close</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}
