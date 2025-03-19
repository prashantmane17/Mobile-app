import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    Platform,
    Modal,
    KeyboardAvoidingView,
    FlatList,
} from 'react-native';
import { ArrowLeft, Calendar, ChevronDown, ChevronUp, Plus, Trash } from 'react-native-feather';
import DateTimePicker from "@react-native-community/datetimepicker";
import { getAllCustomers } from '../../api/user/customer';
import { getAllItems } from '../../api/user/items';

export default function InvoiceForm() {
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [customers, setCustomers] = useState([])
    const [isLoading, setISLoading] = useState(false)
    const [invoices, setInvoices] = useState([])
    const [inoiceItems, setInvoiceItems] = useState([])
    const getCustomer = async () => {
        setISLoading(true);
        try {
            const response = await getAllCustomers();
            const itemResponse = await getAllItems();
            setCustomers(response.parties)
            setInvoices(response.invoices)
            setInvoiceItems(itemResponse.items)
            setFilteredUsers(response.parties)
        } catch (error) {

        } finally {
            setISLoading(false);
        }
    }
    useEffect(() => {
        getCustomer();

    }, [])

    const [showInvoicePicker, setShowInvoicePicker] = useState(false);
    const [showDuePicker, setShowDuePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [filteredItems, setFilteredItems] = useState([]);
    const [itemModalVisible, setItemModalVisible] = useState(false);
    useEffect(() => {

        console.log("kii----")
    }, [filteredUsers])
    const [invoiceData, setInvoiceData] = useState({
        customerName: '',
        invoiceNumber: 'INV/2025/00003',
        orderNumber: '',
        invoiceDate: '02/28/2025',
        terms: '',
        dueDate: '02/28/2025',
        salesperson: 'Harish',
        subject: '',
        customer: {},
        items: [
            {
                details: '',
                quantity: '1',
                price: '0.00',
                tax: '0',
                amount: '0.00',
            },
        ],
        termsandconditions: '',
        customernote: 'Thanks for your business.',
        totalAmount: '0.00',
        discountInput: '0',
        adjustmentInput: '0',
        invoiceStatus: "VOID",
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
    const handleSearch = (text) => {
        setInvoiceData({ ...invoiceData, customerName: text });
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

        setInvoiceData({ ...invoiceData, customerName: selectedName.displayName });
        setInvoiceData({ ...invoiceData, customer: selectedName })
        setModalVisible(false);
    };
    const parseDateToDDMMYYYY = (inputDate) => {
        if (!inputDate) return ""; // Handle empty input

        // Extract day, month (3-letter), and year
        const dateParts = inputDate.match(/(\d{1,2}) (\w{3}), (\d{4})/);
        if (!dateParts) return "Invalid Date"; // Handle invalid input format

        const [, day, month, year] = dateParts;

        // Convert month from short name to number
        const monthMap = {
            Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06",
            Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12"
        };

        return `${day.padStart(2, "0")}/${monthMap[month]}/${year}`;
    };

    const handleDateChange = (event, date, type) => {
        // if (date) {
        //     console.log("date---", date)
        //     const formattedDate =
        //         date.getDate().toString().padStart(2, "0") +
        //         "/" +
        //         (date.getMonth() + 1).toString().padStart(2, "0") +
        //         "/" +
        //         date.getFullYear();

        //     setInvoiceData({ ...invoiceData, [type]: date });
        //     setSelectedDate(date);
        // }
        if (date) {
            date.setHours(0, 0, 0, 0);
            const formattedDate =
                date.toDateString() + " 00:00:00 IST";


            setInvoiceData({ ...invoiceData, [type]: formattedDate });
            setSelectedDate(date);
        }


        if (type === "invoiceDate") {
            setShowInvoicePicker(false);
        } else {
            setShowDuePicker(false);
        }
    };

    const handleOpenDropdown = (index) => {
        setSelectedIndex(index);
        setFilteredItems(inoiceItems);
        setItemModalVisible(true);
    };
    const handleSelectItem = (selectedItem) => {
        const updatedItems = [...invoiceData.items];
        updatedItems[selectedIndex] = {
            details: selectedItem.itemName,
            quantity: 1,
            price: selectedItem.sellingPrice,
            tax: selectedItem.intraStateTax || 0,
            amount: Number(selectedItem.sellingPrice) * 1,
        };

        setInvoiceData({ ...invoiceData, items: updatedItems });
        setItemModalVisible(false);
    };

    const handleInputChange = (index, field, value) => {
        const updatedItems = [...invoiceData.items];
        updatedItems[index][field] = value ? parseFloat(value) : 0;

        updatedItems[index].amount = updatedItems[index].quantity * updatedItems[index].price;

        setInvoiceData({ ...invoiceData, items: updatedItems });
    };

    const handleSubmit = async () => {
        // console.log("Button clicked", invoiceData.invoiceDate); // Check if function is called

        // if (!invoiceData.invoiceDate || !invoiceData.dueDate) {
        //     console.error("Error: invoiceDate or dueDate is missing");
        //     return;
        // }
        // const updatedInvoiceData = {
        //     ...invoiceData,
        //     invoiceDate: new Date(invoiceData.invoiceDate).toISOString().split("T")[0],
        //     dueDate: new Date(invoiceData.dueDate).toISOString().split("T")[0],
        // };
        const data = new FormData();

        // Append primitive values
        Object.keys(invoiceData).forEach((key) => {
            if (typeof invoiceData[key] !== "object" || invoiceData[key] === null) {
                data.append(key, invoiceData[key]);
            }
        });

        // Append nested objects as JSON strings
        if (invoiceData.items) {
            data.append("items", JSON.stringify(invoiceData.items));
        }
        if (invoiceData.customer) {
            data.append("customer", JSON.stringify(invoiceData.customer));
        }

        try {
            console.log("Invoice Date Before Sending:", invoiceData.invoiceDate);

            const response = await fetch("http://192.168.1.25:8080/save-invoice", {
                method: "POST",
                body: data,
                credentials: "include",
            });

            console.log("Response:", response);
        } catch (error) {
            console.error("Error submitting invoice:", error);
        }
    };


    const renderQuantityControl = (value, index, item) => {
        return (
            <View className="flex-row items-center border border-gray-300 rounded-md">
                <TextInput
                    className="flex-1 py-1 px-2 text-center"
                    value={item.quantity?.toString()}
                    keyboardType="numeric"
                    onChangeText={(value) => handleInputChange(index, "quantity", value)}
                />
                <View className="flex-col border-l border-gray-300">
                    <TouchableOpacity
                        className="p-0.5 items-center justify-center"
                        onPress={() => {
                            const updatedValue = String(Number(value) + 1);
                            handleInputChange(index, "quantity", updatedValue);
                        }}
                    >
                        <ChevronUp width={12} height={12} color="#666" />
                    </TouchableOpacity>
                    <View className="border-t border-gray-300" />
                    <TouchableOpacity
                        className="p-0.5 items-center justify-center"
                        onPress={() => {
                            if (Number(value) > 1) {
                                const updatedValue = String(Number(value) - 1);
                                handleInputChange(index, "quantity", updatedValue);
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
                                <TouchableOpacity
                                    className="border border-gray-300 rounded-md p-3 bg-white"
                                    onPress={() => setModalVisible(true)}
                                >
                                    <Text>{invoiceData.customerName || "Search Or Select A Customer"}</Text>
                                </TouchableOpacity>
                                <Modal visible={modalVisible} animationType="fade" transparent>
                                    <View className="flex-1 justify-center items-center bg-black/50">
                                        <View className="bg-white w-80 p-4 rounded-md">
                                            {/* Search Input */}
                                            <TextInput
                                                className="border border-gray-300 rounded-md p-3 mb-3"
                                                placeholder="Search Customers..."
                                                value={invoiceData.customerName}
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

                            <View>
                                <Text className="text-gray-700 mb-1">
                                    Invoice No.<Text className="text-red-500">*</Text>
                                </Text>
                                <TextInput
                                    className="border border-gray-300 rounded-md p-3 bg-white"
                                    value={invoiceData.invoiceNumber}
                                    onChangeText={(text) => setInvoiceData({ ...invoiceData, invoiceNumber: text })}
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
                                        value={parseDateToDDMMYYYY(invoiceData.invoiceDate)}
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
                                        value={parseDateToDDMMYYYY(invoiceData.dueDate)}
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
                                    {/* Search Box */}
                                    <View className="mb-3 flex-row items-center gap-2">
                                        <TouchableOpacity
                                            className="border border-gray-300 rounded-md p-3 bg-white mb-2 w-72"
                                            onPress={() => handleOpenDropdown(index)}
                                        >
                                            <Text>{item.details || "Search or select an item"}</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            className="bg-red-100 p-3 rounded-lg mb-2"
                                            onPress={() => deleteItem(index)}
                                        >
                                            <Trash width={20} height={20} color="red" />
                                        </TouchableOpacity>
                                    </View>

                                    {/* Quantity, Price, Tax, Total */}
                                    <View className="flex-row items-center justify-between">
                                        {/* Quantity */}
                                        <View className="w-24 mr-2">
                                            {/* <TextInput
                                                className="border border-gray-300 rounded-md p-2 text-center"
                                                keyboardType="numeric"
                                                value={item.quantity.toString()}
                                                onChangeText={(value) => handleInputChange(index, "quantity", value)}
                                            /> */}
                                            {renderQuantityControl(item.quantity, index, item)}
                                        </View>
                                        {/* Price */}
                                        <View className="flex-row items-center w-24 mr-2">
                                            <Text className="mr-1">₹</Text>
                                            <TextInput
                                                className="border flex-1 border-gray-300 rounded-md p-2 text-center"
                                                keyboardType="numeric"
                                                value={item.price?.toString()}
                                                onChangeText={(value) => handleInputChange(index, "price", value)}
                                            />
                                        </View>

                                        {/* Tax */}
                                        <View className="flex-row items-start w-16 ml-2">
                                            <Text className=" text-left">{item.tax}</Text>
                                            <Text className="ml-1">%</Text>
                                        </View>

                                        {/* Total Amount */}
                                        <View className="flex-row items-center w-20 ">
                                            <Text className="mr-1">₹</Text>
                                            <Text className="text-center">{Number(item.amount)?.toFixed(2) || "0.00"}</Text>

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

                            <Modal visible={itemModalVisible} animationType="fade" transparent>
                                <View className="flex-1 justify-center items-center bg-black/50">
                                    <View className="bg-white w-80 p-4 rounded-md">
                                        {/* Search Input */}
                                        <TextInput
                                            className="border border-gray-300 rounded-md p-3 mb-3"
                                            placeholder="Search items..."
                                            onChangeText={(text) => {
                                                setFilteredItems(
                                                    inoiceItems.filter((item) =>
                                                        item.itemName.toLowerCase().includes(text.toLowerCase())
                                                    )
                                                );
                                            }}
                                        />

                                        {/* Dropdown List */}
                                        <FlatList
                                            data={filteredItems}
                                            keyExtractor={(item, index) => index.toString()}
                                            renderItem={({ item }) => (
                                                <TouchableOpacity
                                                    className="p-3 border-b border-gray-200"
                                                    onPress={() => handleSelectItem(item)}
                                                >
                                                    <Text>{item.itemName}</Text>
                                                </TouchableOpacity>
                                            )}
                                            keyboardShouldPersistTaps="handled"
                                        />

                                        {/* Close Button */}
                                        <TouchableOpacity
                                            className="mt-3 p-3 bg-red-500 rounded-md"
                                            onPress={() => setItemModalVisible(false)}
                                        >
                                            <Text className="text-white text-center">Close</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </Modal>
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
                                            value={invoiceData.discountInput}
                                            keyboardType="numeric"
                                            onChangeText={(text) => setInvoiceData({ ...invoiceData, discountInput: text })}
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
                                            value={invoiceData.adjustmentInput}
                                            keyboardType="numeric"
                                            onChangeText={(text) => setInvoiceData({ ...invoiceData, adjustmentInput: text })}
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
                            <TouchableOpacity className="bg-blue-600 py-3 px-6 rounded-md" onPress={handleSubmit}>
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