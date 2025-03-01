import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Platform, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar } from 'lucide-react-native';

export default function PaymentForm() {
    const [formData, setFormData] = useState({
        customerName: '',
        outstandingAmount: '',
        bankCharges: '',
        paymentDate: '03/01/2025',
        paymentMode: '',
        paymentNumber: 'PAY-250301112203',
        referenceNumber: '',
        notes: ''
    });

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date(2025, 2, 1)); // March 1, 2025

    const handleDateChange = (event, date) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (date) {
            setSelectedDate(date);
            const formattedDate =
                date.getDate().toString().padStart(2, "0") +
                "/" +
                (date.getMonth() + 1).toString().padStart(2, "0") +
                "/" +
                date.getFullYear();
            setFormData({ ...formData, paymentDate: formattedDate });
        }
    };

    return (
        <ScrollView className="flex-1 bg-white p-4">
            {/* Customer Name */}
            <View className="mb-4">
                <Text className="text-gray-700 mb-1">
                    Customer Name<Text className="text-red-500">*</Text>
                </Text>
                <TextInput
                    className="border border-gray-300 rounded-md p-3 bg-white"
                    placeholder="Search Customers"
                    value={formData.customerName}
                    onChangeText={(text) => setFormData({ ...formData, customerName: text })}
                />
            </View>

            {/* Outstanding Amount */}
            <View className="mb-4">
                <Text className="text-gray-700 mb-1">
                    Outstanding Amount<Text className="text-red-500">*</Text>
                </Text>
                <TextInput
                    className="border border-gray-300 rounded-md p-3 bg-white"
                    placeholder="Enter received amount"
                    value={formData.outstandingAmount}
                    onChangeText={(text) => setFormData({ ...formData, outstandingAmount: text })}
                    keyboardType="numeric"
                />
            </View>

            {/* Payment Options */}
            {/* <View className="flex-row mb-4">
                <TouchableOpacity className="py-2 px-4 border-b-2 border-amber-500">
                    <Text className="text-amber-800">Outstanding Invoices</Text>
                </TouchableOpacity>
                <TouchableOpacity className="py-2 px-4">
                    <Text className="text-gray-600">Amount</Text>
                </TouchableOpacity>
                <TouchableOpacity className="py-2 px-4">
                    <Text className="text-gray-600">Receive Payment</Text>
                </TouchableOpacity>
            </View> */}

            {/* Bank Charges */}
            <View className="mb-4">
                <Text className="text-gray-700 mb-1">
                    Bank Charges (if any)
                </Text>
                <TextInput
                    className="border border-gray-300 rounded-md p-3 bg-white"
                    placeholder="Enter bank charges"
                    value={formData.bankCharges}
                    onChangeText={(text) => setFormData({ ...formData, bankCharges: text })}
                    keyboardType="numeric"
                />
            </View>

            {/* Payment Date */}
            <View className="mb-4">
                <Text className="text-gray-700 mb-1">
                    Payment Date<Text className="text-red-500">*</Text>
                </Text>
                <View className="relative">
                    <TextInput
                        className="border border-gray-300 rounded-md p-3 bg-white"
                        value={formData.paymentDate}
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

            {/* Payment Mode */}
            <View className="mb-4">
                <Text className="text-gray-700 mb-1">
                    Payment Mode<Text className="text-red-500">*</Text>
                </Text>
                <TouchableOpacity className="border border-gray-300 rounded-md p-3 bg-white flex-row justify-between items-center">
                    <Text className="text-gray-500">Select payment mode</Text>
                    <Text>▼</Text>
                </TouchableOpacity>
            </View>

            {/* Payment # */}
            <View className="mb-4">
                <Text className="text-gray-700 mb-1">
                    Payment #
                </Text>
                <TextInput
                    className="border border-gray-300 rounded-md p-3 bg-white"
                    value={formData.paymentNumber}
                    onChangeText={(text) => setFormData({ ...formData, paymentNumber: text })}
                />
            </View>

            {/* Reference # */}
            <View className="mb-4">
                <Text className="text-gray-700 mb-1">
                    Reference #
                </Text>
                <TextInput
                    className="border border-gray-300 rounded-md p-3 bg-white"
                    placeholder="Enter reference number"
                    value={formData.referenceNumber}
                    onChangeText={(text) => setFormData({ ...formData, referenceNumber: text })}
                />
            </View>

            {/* Notes */}
            <View className="mb-6">
                <Text className="text-gray-700 mb-1">
                    Notes
                </Text>
                <TextInput
                    className="border border-gray-300 rounded-md p-3 bg-white h-24"
                    placeholder="Enter any additional notes"
                    value={formData.notes}
                    onChangeText={(text) => setFormData({ ...formData, notes: text })}
                    multiline={true}
                    textAlignVertical="top"
                />
            </View>

            {/* Buttons */}
            <View className="flex-row justify-end mb-8">
                <TouchableOpacity className="bg-blue-500 rounded-md py-3 px-6 mr-2">
                    <Text className="text-white font-medium">Submit</Text>
                </TouchableOpacity>
                <TouchableOpacity className="border border-gray-300 rounded-md py-3 px-6">
                    <Text className="text-gray-700 font-medium">Close</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}