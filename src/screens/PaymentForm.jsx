import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Platform, ScrollView, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar } from 'lucide-react-native';
import { Picker } from '@react-native-picker/picker';
import { savePayments } from '../api/user/payment';

export default function PaymentForm() {
    const initialFormData = {
        customerName: '',
        outstandingAmount: '',
        bankCharges: '',
        paymentDate: '03/01/2025',
        paymentMode: '',
        paymentNumber: 'PAY-250301112203',
        referenceNumber: '',
        notes: ''
    };

    const [formData, setFormData] = useState(initialFormData);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date(2025, 2, 1)); // March 1, 2025

    const handleChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    // Handles date selection
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
            handleChange('paymentDate', formattedDate);
        }
    };

    // Handles form submission
    const handleSubmit = async () => {
        try {
            const response = await fetch("http://192.168.1.25:8080/save-payment-mobileApp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Payment saved successfully:", data);
                Alert.alert("Success", "Payment details saved successfully!");
            } else {
                console.error("Error saving payment:", data);
                Alert.alert("Error", data.message || "Failed to save payment details.");
            }
        } catch (error) {
            console.error("Network error:", error);
            Alert.alert("Error", "Something went wrong. Please try again.");
        }
    };


    // Resets the form
    const handleReset = () => {
        setFormData(initialFormData);
    };

    return (
        <ScrollView className="flex-1 bg-white p-4">
            {/* Customer Name */}
            <View className="mb-4">
                <Text className="text-gray-700 mb-1">Customer Name<Text className="text-red-500">*</Text></Text>
                <TextInput
                    className="border border-gray-300 rounded-md p-3 bg-white"
                    placeholder="Search Customers"
                    value={formData.customerName}
                    onChangeText={(text) => handleChange('customerName', text)}
                />
            </View>

            {/* Outstanding Amount */}
            <View className="mb-4">
                <Text className="text-gray-700 mb-1">Outstanding Amount<Text className="text-red-500">*</Text></Text>
                <TextInput
                    className="border border-gray-300 rounded-md p-3 bg-white"
                    placeholder="Enter received amount"
                    value={formData.outstandingAmount}
                    onChangeText={(text) => handleChange('outstandingAmount', text)}
                    keyboardType="numeric"
                />
            </View>

            {/* Bank Charges */}
            <View className="mb-4">
                <Text className="text-gray-700 mb-1">Bank Charges (if any)</Text>
                <TextInput
                    className="border border-gray-300 rounded-md p-3 bg-white"
                    placeholder="Enter bank charges"
                    value={formData.bankCharges}
                    onChangeText={(text) => handleChange('bankCharges', text)}
                    keyboardType="numeric"
                />
            </View>

            {/* Payment Date */}
            <View className="mb-4">
                <Text className="text-gray-700 mb-1">Payment Date<Text className="text-red-500">*</Text></Text>
                <View className="relative">
                    <TextInput
                        className="border border-gray-300 rounded-md p-3 bg-white"
                        value={formData.paymentDate}
                        editable={false} // Prevent manual typing
                    />
                    <TouchableOpacity className="absolute right-3 top-3" onPress={() => setShowDatePicker(true)}>
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
                <Text className="text-gray-700 mb-1">Payment Mode<Text className="text-red-500">*</Text></Text>
                <Picker
                    selectedValue={formData.paymentMode}
                    onValueChange={(value) => handleChange('paymentMode', value)}
                    className="border border-gray-300 rounded-md p-3 bg-white"
                >
                    <Picker.Item label="Select payment mode" value="" />
                    <Picker.Item label="Credit Card" value="credit_card" />
                    <Picker.Item label="Bank Transfer" value="bank_transfer" />
                    <Picker.Item label="Cash" value="cash" />
                </Picker>
            </View>

            {/* Payment # */}
            <View className="mb-4">
                <Text className="text-gray-700 mb-1">Payment #</Text>
                <TextInput
                    className="border border-gray-300 rounded-md p-3 bg-white"
                    value={formData.paymentNumber}
                    onChangeText={(text) => handleChange('paymentNumber', text)}
                />
            </View>

            {/* Reference # */}
            <View className="mb-4">
                <Text className="text-gray-700 mb-1">Reference #</Text>
                <TextInput
                    className="border border-gray-300 rounded-md p-3 bg-white"
                    placeholder="Enter reference number"
                    value={formData.referenceNumber}
                    onChangeText={(text) => handleChange('referenceNumber', text)}
                />
            </View>

            {/* Notes */}
            <View className="mb-6">
                <Text className="text-gray-700 mb-1">Notes</Text>
                <TextInput
                    className="border border-gray-300 rounded-md p-3 bg-white h-24"
                    placeholder="Enter any additional notes"
                    value={formData.notes}
                    onChangeText={(text) => handleChange('notes', text)}
                    multiline={true}
                    textAlignVertical="top"
                />
            </View>

            {/* Buttons */}
            <View className="flex-row justify-end mb-8">
                <TouchableOpacity className="bg-blue-500 rounded-md py-3 px-6 mr-2" onPress={handleSubmit}>
                    <Text className="text-white font-medium">Submit</Text>
                </TouchableOpacity>
                <TouchableOpacity className="border border-gray-300 rounded-md py-3 px-6" onPress={handleReset}>
                    <Text className="text-gray-700 font-medium">Close</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}
