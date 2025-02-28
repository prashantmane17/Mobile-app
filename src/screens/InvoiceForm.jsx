import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    Platform,
    KeyboardAvoidingView,
} from 'react-native';
import { ArrowLeft, Calendar, ChevronDown, ChevronUp, Plus, Trash } from 'react-native-feather';
import DateTimePicker from "@react-native-community/datetimepicker";

export default function InvoiceForm() {
    const [showInvoicePicker, setShowInvoicePicker] = useState(false);
    const [showDuePicker, setShowDuePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [invoiceData, setInvoiceData] = useState({
        customerName: '',
        invoiceNo: 'INV/2025/00003',
        orderNumber: '',
        invoiceDate: '02/28/2025',
        termsOfDelivery: '',
        dueDate: '02/28/2025',
        salesperson: 'Harish',
        subject: '',
        items: [
            {
                details: '',
                quantity: '1',
                price: '0.00',
                tax: '0',
                amount: '0.00',
            },
        ],
        termsAndConditions: '',
        customerNotes: 'Thanks for your business.',
        subTotal: '0.00',
        discount: '0',
        adjustment: '0',
        total: '0.00',
    });

    const addItem = () => {
        setInvoiceData({
            ...invoiceData,
            items: [
                ...invoiceData.items,
                {
                    details: '',
                    quantity: '1',
                    price: '0.00',
                    tax: '0',
                    amount: '0.00',
                },
            ],
        });
    };

    const deleteItem = (index) => {
        const updatedItems = [...invoiceData.items];
        updatedItems.splice(index, 1);
        setInvoiceData({
            ...invoiceData,
            items: updatedItems,
        });
    };
    const handleDateChange = (event, date, type) => {
        if (date) {
            const formattedDate =
                date.getDate().toString().padStart(2, "0") +
                "/" +
                (date.getMonth() + 1).toString().padStart(2, "0") +
                "/" +
                date.getFullYear();

            setInvoiceData({ ...invoiceData, [type]: formattedDate });
            setSelectedDate(date);
        }

        if (type === "invoiceDate") {
            setShowInvoicePicker(false);
        } else {
            setShowDuePicker(false);
        }
    };
    const renderQuantityControl = (value, index, field) => {
        return (
            <View className="flex-row items-center border border-gray-300 rounded-md">
                <TextInput
                    className="flex-1 py-1 px-2 text-center"
                    value={value}
                    keyboardType="numeric"
                    onChangeText={(text) => {
                        const updatedItems = [...invoiceData.items];
                        updatedItems[index][field] = text;
                        setInvoiceData({ ...invoiceData, items: updatedItems });
                    }}
                />
                <View className="flex-col border-l border-gray-300">
                    <TouchableOpacity
                        className="p-0.5 items-center justify-center"
                        onPress={() => {
                            const updatedItems = [...invoiceData.items];
                            updatedItems[index][field] = String(Number(value) + 1);
                            setInvoiceData({ ...invoiceData, items: updatedItems });
                        }}
                    >
                        <ChevronUp width={12} height={12} color="#666" />
                    </TouchableOpacity>
                    <View className="border-t border-gray-300" />
                    <TouchableOpacity
                        className="p-0.5 items-center justify-center"
                        onPress={() => {
                            if (Number(value) > 1) {
                                const updatedItems = [...invoiceData.items];
                                updatedItems[index][field] = String(Number(value) - 1);
                                setInvoiceData({ ...invoiceData, items: updatedItems });
                            }
                        }}
                    >
                        <ChevronDown width={12} height={12} color="#666" />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView className="flex-1">
                    {/* Header */}
                    <View className="flex-row items-center p-4 border-b border-gray-200">
                        <TouchableOpacity className="mr-4">
                            <ArrowLeft width={24} height={24} color="#2563eb" />
                        </TouchableOpacity>
                        <Text className="text-xl font-bold text-gray-800">Create Invoice</Text>
                    </View>

                    {/* Form Content */}
                    <View className="p-4 space-y-4">
                        {/* Customer Name & Invoice No */}
                        <View className="space-y-4">
                            <View>
                                <Text className="text-gray-700 mb-1">
                                    Customer Name<Text className="text-red-500">*</Text>
                                </Text>
                                <TextInput
                                    className="border border-gray-300 rounded-md p-3 bg-white"
                                    placeholder="Search Or Select A Customer"
                                    value={invoiceData.customerName}
                                    onChangeText={(text) => setInvoiceData({ ...invoiceData, customerName: text })}
                                />
                            </View>

                            <View>
                                <Text className="text-gray-700 mb-1">
                                    Invoice No.<Text className="text-red-500">*</Text>
                                </Text>
                                <TextInput
                                    className="border border-gray-300 rounded-md p-3 bg-white"
                                    value={invoiceData.invoiceNo}
                                    onChangeText={(text) => setInvoiceData({ ...invoiceData, invoiceNo: text })}
                                />
                            </View>
                        </View>

                        {/* Order Number & Invoice Date */}
                        <View className="space-y-4">
                            <View>
                                <Text className="text-gray-700 mb-1">Order Number</Text>
                                <TextInput
                                    className="border border-gray-300 rounded-md p-3 bg-white"
                                    value={invoiceData.orderNumber}
                                    onChangeText={(text) => setInvoiceData({ ...invoiceData, orderNumber: text })}
                                />
                            </View>

                            <View>
                                <Text className="text-gray-700 mb-1">
                                    Invoice Date<Text className="text-red-500">*</Text>
                                </Text>
                                <View className="relative">
                                    <TextInput
                                        className="border border-gray-300 rounded-md p-3 bg-white"
                                        value={invoiceData.invoiceDate}
                                        editable={false} // Prevent manual typing
                                    />
                                    <TouchableOpacity
                                        className="absolute right-3 top-3"
                                        onPress={() => setShowInvoicePicker(true)}
                                    >
                                        <Calendar width={20} height={20} color="#666" />
                                    </TouchableOpacity>
                                </View>
                                {showInvoicePicker && (
                                    <DateTimePicker
                                        value={selectedDate}
                                        mode="date"
                                        display={Platform.OS === "ios" ? "spinner" : "default"}
                                        onChange={(event, date) => handleDateChange(event, date, "invoiceDate")}
                                    />
                                )}
                            </View>
                        </View>

                        {/* Terms of Delivery & Due Date */}
                        <View className="space-y-4">


                            <View>
                                <Text className="text-gray-700 mb-1">Due Date</Text>
                                <View className="relative">
                                    <TextInput
                                        className="border border-gray-300 rounded-md p-3 bg-white"
                                        value={invoiceData.dueDate}
                                        editable={false} // Prevent manual typing
                                    />
                                    <TouchableOpacity
                                        className="absolute right-3 top-3"
                                        onPress={() => setShowDuePicker(true)}
                                    >
                                        <Calendar width={20} height={20} color="#666" />
                                    </TouchableOpacity>
                                </View>

                                {showDuePicker && (
                                    <DateTimePicker
                                        value={selectedDate}
                                        mode="date"
                                        display={Platform.OS === "ios" ? "spinner" : "default"}
                                        onChange={(event, date) => handleDateChange(event, date, "dueDate")}
                                    />
                                )}
                            </View>
                            <View>
                                <Text className="text-gray-700 mb-1">Terms of Delivery</Text>
                                <TextInput
                                    className="border border-gray-300 rounded-md p-3 bg-white"
                                    value={invoiceData.termsOfDelivery}
                                    onChangeText={(text) => setInvoiceData({ ...invoiceData, termsOfDelivery: text })}
                                />
                            </View>

                        </View>

                        {/* Salesperson & Subject */}
                        <View className="space-y-4">
                            <View>
                                <Text className="text-gray-700 mb-1">Salesperson</Text>
                                <TextInput
                                    className="border border-gray-300 rounded-md p-3 bg-white"
                                    value={invoiceData.salesperson}
                                    onChangeText={(text) => setInvoiceData({ ...invoiceData, salesperson: text })}
                                />
                            </View>

                            <View>
                                <Text className="text-gray-700 mb-1">Subject</Text>
                                <TextInput
                                    className="border border-gray-300 rounded-md p-3 bg-white"
                                    placeholder="Let Your Customer Know What This Invoice Is For"
                                    value={invoiceData.subject}
                                    onChangeText={(text) => setInvoiceData({ ...invoiceData, subject: text })}
                                />
                            </View>
                        </View>

                        {/* Item Details Table */}
                        <View className="mt-4">
                            <View className="bg-blue-50 p-3 rounded-t-md">
                                <View className="flex-row">
                                    <Text className="flex-1 font-medium text-gray-700">
                                        ITEM DETAILS<Text className="text-red-500">*</Text>
                                    </Text>
                                    <Text className="w-20 text-center font-medium text-gray-700">QUANTITY</Text>
                                    <Text className="w-20 text-center font-medium text-gray-700">PRICE</Text>
                                    <Text className="w-16 text-center font-medium text-gray-700">TAX %</Text>
                                    <Text className="w-20 text-center font-medium text-gray-700">AMOUNT</Text>
                                </View>
                            </View>

                            {invoiceData.items.map((item, index) => (
                                <View key={index} className="border border-gray-200 p-3 mb-2 rounded-md">
                                    <View className="mb-3 flex-row items-center gap-2">
                                        <TextInput
                                            className="border border-gray-300 rounded-md p-3 bg-white mb-2 w-72"
                                            placeholder="Search or select an item"
                                            value={item.details}
                                            onChangeText={(text) => {
                                                const updatedItems = [...invoiceData.items];
                                                updatedItems[index].details = text;
                                                setInvoiceData({ ...invoiceData, items: updatedItems });
                                            }}
                                        />
                                        <TouchableOpacity
                                            className=" bg-red-100 p-3 rounded-lg mb-2 "
                                            onPress={() => deleteItem(index)}
                                        >
                                            <Trash width={20} height={20} color="red" />
                                        </TouchableOpacity>
                                    </View>

                                    <View className="flex-row items-center justify-between">
                                        <View className="w-24 mr-2">
                                            {renderQuantityControl(item.quantity, index, 'quantity')}
                                        </View>

                                        <View className="flex-row items-center w-24 mr-2">
                                            <Text className="mr-1">₹</Text>
                                            {renderQuantityControl(item.price, index, 'price')}
                                        </View>

                                        <View className="flex-row items-center w-16 mr-2">
                                            <Text className="flex-1  text-right">{item.amount}</Text>
                                            <Text className="ml-1">%</Text>
                                        </View>

                                        <View className="flex-row items-center w-20 ml-2">
                                            <Text className="mr-1">₹</Text>
                                            <Text className=" text-center">{item.amount}</Text>
                                        </View>


                                    </View>
                                </View>
                            ))}

                            <TouchableOpacity
                                className="flex-row items-center mt-2 mb-4"
                                onPress={addItem}
                            >
                                <Plus width={20} height={20} color="#4f46e5" />
                                <Text className="ml-2 text-indigo-600 font-medium">Add another Item</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Terms & Conditions */}
                        <View>
                            <Text className="text-gray-700 mb-1">Terms & Conditions</Text>
                            <TextInput
                                className="border border-gray-300 rounded-md p-3 bg-white h-24"
                                multiline
                                placeholder="Enter the terms and conditions of your business to be displayed in your transaction"
                                value={invoiceData.termsAndConditions}
                                onChangeText={(text) => setInvoiceData({ ...invoiceData, termsAndConditions: text })}
                            />
                        </View>

                        {/* Customer Notes */}
                        <View>
                            <Text className="text-gray-700 mb-1">Customer Notes</Text>
                            <TextInput
                                className="border border-gray-300 rounded-md p-3 bg-white h-24"
                                multiline
                                value={invoiceData.customerNotes}
                                onChangeText={(text) => setInvoiceData({ ...invoiceData, customerNotes: text })}
                            />
                            <Text className="text-gray-500 text-xs mt-1">Will be displayed on the invoice</Text>
                        </View>

                        {/* Summary Section */}
                        <View className="bg-gray-50 p-4 rounded-md mt-4">
                            <View className="flex-row justify-between items-center mb-3">
                                <Text className="text-gray-700">Sub Total</Text>
                                <Text className="font-medium">₹{invoiceData.subTotal}</Text>
                            </View>

                            <View className="flex-row justify-between items-center mb-3">
                                <View className="flex-row items-center">
                                    <Text className="text-gray-700 mr-2">Discount</Text>
                                    <View className="flex-row items-center border border-gray-300 rounded-md bg-white">
                                        <TextInput
                                            className="w-12 p-1 text-center"
                                            value={invoiceData.discount}
                                            keyboardType="numeric"
                                            onChangeText={(text) => setInvoiceData({ ...invoiceData, discount: text })}
                                        />
                                        <View className="border-l border-gray-300 p-1">
                                            <ChevronDown width={16} height={16} color="#666" />
                                        </View>
                                    </View>
                                    <Text className="ml-1">%</Text>
                                </View>
                                <Text className="font-medium">-0.00</Text>
                            </View>

                            <View className="flex-row justify-between items-center mb-3">
                                <View className="flex-row items-center">
                                    <Text className="text-gray-700 mr-2">Adjustment</Text>
                                    <View className="flex-row items-center border border-gray-300 rounded-md bg-white">
                                        <TextInput
                                            className="w-12 p-1 text-center"
                                            value={invoiceData.adjustment}
                                            keyboardType="numeric"
                                            onChangeText={(text) => setInvoiceData({ ...invoiceData, adjustment: text })}
                                        />
                                        <View className="border-l border-gray-300 p-1">
                                            <ChevronDown width={16} height={16} color="#666" />
                                        </View>
                                    </View>
                                </View>
                                <Text className="font-medium">0.00</Text>
                            </View>

                            <View className="flex-row justify-between items-center pt-3 border-t border-gray-300">
                                <Text className="text-gray-700 font-medium">Total</Text>
                                <Text className="font-bold">0.00</Text>
                            </View>
                        </View>

                        {/* Action Buttons */}
                        <View className="flex-row justify-end space-x-3 mt-4 mb-8">
                            <TouchableOpacity className="bg-blue-600 py-3 px-6 rounded-md">
                                <Text className="text-white font-medium">Create Invoice</Text>
                            </TouchableOpacity>

                            <TouchableOpacity className="border border-gray-300 py-3 px-6 rounded-md">
                                <Text className="text-gray-700">Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}