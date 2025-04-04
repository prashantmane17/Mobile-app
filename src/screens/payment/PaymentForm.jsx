import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Platform, ScrollView, Alert, Modal, FlatList } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar } from 'lucide-react-native';
import { Picker } from '@react-native-picker/picker';
import { savePayments } from '../../api/user/payment';
import { getAllCustomers } from '../../api/user/customer';
import Checkbox from "expo-checkbox";
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'react-native-feather';

export default function PaymentForm() {
    const navigation = useNavigation()
    const [selectedInvoices, setSelectedInvoices] = useState([]);
    const [customers, setCustomers] = useState([])
    const [modalVisible, setModalVisible] = useState(false);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [filteredInvoices, setFilteredInvoices] = useState([]);
    const [loading, setLoading] = useState(false)
    const [invoices, setInvoices] = useState([])
    const [selectedId, setSelectedId] = useState([])

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date(2025, 2, 1));
    const initialFormData = {
        customerName: '',
        amountReceived: '',
        bankCharges: '',
        paymentDate: new Date(),
        paymentMode: '',
        paymentNumber: '',
        referenceNumber: '',
        notes: ''

    };
    const [formData, setFormData] = useState(initialFormData);
    const customerData = async () => {
        setLoading(true)
        try {
            const response = await getAllCustomers();
            setCustomers(response.parties)
            setFilteredUsers(response.parties)
            setInvoices(response.invoices)
        } catch (error) {
            console.error("Error fetching Customer:", error);
        }
        finally {
            setLoading(false)
        }
    };
    const generatePaymentId = () => {
        const now = new Date();
        const dd = String(now.getDate()).padStart(2, '0');
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const yy = String(now.getFullYear()).slice(-2);
        const hh = String(now.getHours()).padStart(2, '0');
        const min = String(now.getMinutes()).padStart(2, '0');
        const sec = String(now.getSeconds()).padStart(2, '0');

        const finalNum = `PAY-${yy}${mm}${dd}${hh}${min}${sec}`;
        setFormData({ ...formData, paymentNumber: finalNum });
    };

    useFocusEffect(
        useCallback(() => {
            generatePaymentId();
            customerData();
        }, []));


    const handleChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
        setSelectedInvoices([]);
    };
    const handleSearch = (text) => {

        if (text.length > 0) {
            const filtered = customers.filter((user) =>
                user.displayName?.toLowerCase().includes(text.toLowerCase())
            );

            setFilteredUsers(filtered);
        } else {
            setFilteredUsers(customers);
        }
    };

    const handleSelect = (selectedName) => {
        setFormData({ ...formData, customerName: selectedName.displayName });
        const filteredIn = invoices.filter((invoice) => invoice.customer.id === selectedName.id);
        setFilteredInvoices(filteredIn);
        setModalVisible(false);
    };
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
            console.log("dta--", date)

            handleChange('paymentDate', date);
        }
    };
    const handleCheckboxSelect = (invoice) => {
        setSelectedInvoices((prev) => {
            const isAlreadySelected = prev.some((item) => item.id === invoice.id);
            let updatedSelectedId;
            if (isAlreadySelected) {
                const updatedSelection = prev.filter((item) => item.id !== invoice.id);
                const newTotal = updatedSelection.reduce((sum, item) => sum + Number(item.totalAmount), 0);
                setFormData({ ...formData, amountReceived: newTotal.toString() });
                updatedSelectedId = selectedId.filter((id) => id !== invoice.id);
                setSelectedId(updatedSelectedId);// Remove ID
                return updatedSelection;
            } else {
                const updatedSelection = [...prev, invoice];
                const newTotal = updatedSelection.reduce((sum, item) => sum + Number(item.totalAmount), 0);
                setFormData({ ...formData, amountReceived: newTotal.toString() });
                updatedSelectedId = [...selectedId, invoice.id];
                setSelectedId(updatedSelectedId);
                return updatedSelection;
            }
        });

    };

    const handleSubmit = async () => {
        const data = new FormData();

        Object.keys(formData).forEach((key) => {
            if (typeof formData[key] !== "object" || formData[key] === null) {
                if (key.toLowerCase().includes("paymentDate")) {
                } else {
                    data.append(key, formData[key]);
                }
            }
        });
        console.log("selec------", selectedId)
        const specificDate = new Date(formData.paymentDate).toISOString();
        data.append("paymentDate", specificDate);
        data.append("invoiceIds", selectedId);
        try {
            const response = await fetch("https://billing.portstay.com/save-payment", {
                method: "POST",
                body: data,
                credentials: "include",
                headers: {},
            });

            if (response.ok) {
                setFormData(initialFormData)
                Alert.alert("Success", "Payment details saved successfully!");
                navigation.navigate('Payment')
            } else {
                console.error("Error saving payment:");
                Alert.alert("Error");
            }
        } catch (error) {
            console.error("Network error:", error);
            Alert.alert("Error", "Something went wrong. Please try again.");
        }
    };



    const handleReset = () => {
        setFormData(initialFormData);
    };

    return (
        <ScrollView className="flex-1 bg-white p-4">
            {/* Customer Name */}
            <View className="flex-row items-center pb-3">
                <TouchableOpacity className="mr-3" onPress={() => navigation.navigate('Payment')}>
                    <ArrowLeft className="w-6 h-6 text-blue-500" />
                </TouchableOpacity>
                <Text className="text-2xl  font-semibold">+ Create Payment</Text>
            </View>
            <View className="mb-4">
                <Text className="text-gray-700 mb-1">
                    Customer Name<Text className="text-red-500">*</Text>
                </Text>
                <TouchableOpacity
                    className="border border-gray-300 rounded-md p-3 bg-white"
                    onPress={() => setModalVisible(true)}
                >
                    <Text>{formData.customerName || "Search Or Select A Customer"}</Text>
                </TouchableOpacity>
                <Modal visible={modalVisible} animationType="fade" transparent>
                    <View className="flex-1 justify-center items-center bg-black/50">
                        <View className="bg-white w-80 p-4 rounded-md">
                            {/* Search Input */}
                            <TextInput
                                className="border border-gray-300 rounded-md p-3 mb-3"
                                placeholder="Search Customers..."
                                value={formData.customerName}
                                onChangeText={handleSearch}
                            />

                            {/* Dropdown List */}
                            <View className="h-52">
                                <FlatList
                                    data={filteredUsers}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            className="p-3 border-b border-gray-200"
                                            onPress={() => handleSelect(item)}
                                        >
                                            <Text>{item.displayName}</Text>
                                        </TouchableOpacity>
                                    )}
                                    keyboardShouldPersistTaps="handled"
                                />
                            </View>


                            {/* Close Button */}
                            <TouchableOpacity
                                className="mt-3 p-3 bg-red-500 rounded-md"
                                onPress={() => setModalVisible(false)}
                            >
                                <Text className="text-white text-center">Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>

            {/* Outstanding Amount */}
            <View className="mb-4">
                <Text className="text-gray-700 mb-1">
                    Outstanding Amount<Text className="text-red-500">*</Text>
                </Text>
                <TextInput
                    className="border border-gray-300 rounded-md p-3 bg-white"
                    placeholder="Enter received amount"
                    value={formData.amountReceived}
                    onChangeText={(text) => handleChange("amountReceived", text)}
                    keyboardType="numeric"
                />

                {filteredInvoices?.map((invoice) => (
                    <View key={invoice.id} className="flex-row items-center gap-2 p-1">
                        <Text>{invoice.invoiceNumber}</Text>
                        <Text>{invoice.totalAmount}</Text>
                        <Checkbox
                            value={selectedInvoices.some((item) => item.id === invoice.id)}
                            onValueChange={() => handleCheckboxSelect(invoice)}
                            className="w-4 h-4"
                        />
                    </View>
                ))}
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
                        value={parseDateToDDMMYYYY(formData.paymentDate)}
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
                <View className="border border-gray-300 rounded-md">
                    <Picker
                        selectedValue={formData.paymentMode}
                        onValueChange={(value) => handleChange('paymentMode', value)}
                        className="border border-gray-300 rounded-md p-3 bg-white"
                    >
                        <Picker.Item label="Select payment mode" value="" />
                        <Picker.Item label="Credit Card" value="Credit Card" />
                        <Picker.Item label="Bank Transfer" value="Bank Transfer" />
                        <Picker.Item label="Cash" value="Cash" />
                        <Picker.Item label="UPI" value="UPI" />
                    </Picker>

                </View>
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
