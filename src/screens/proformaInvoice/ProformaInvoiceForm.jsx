import React, { useCallback, useEffect, useState } from 'react';
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
    Alert,
} from 'react-native';
import { ArrowLeft, Calendar, ChevronDown, ChevronUp, Plus, Trash } from 'react-native-feather';
import DateTimePicker from "@react-native-community/datetimepicker";
import { getAllCustomers } from '../../api/user/customer';
import { getAllItems } from '../../api/user/items';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getOrgProfie } from '../../api/admin/adminApi';
import { useTax } from '../../context/TaxContext';

export default function ProformaInvoiceForm() {
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [customers, setCustomers] = useState([])
    const navigation = useNavigation();
    const [isLoading, setISLoading] = useState(false)
    const [isSameState, setIsSameSate] = useState(false)
    const [orgState, setOrgState] = useState('');
    const [totalAmt, setTotalAmt] = useState(0);
    const [taxSummary, setTaxSummary] = useState({});
    const [allTaxTotal, setAllTaxTotal] = useState(0);
    const [discountValue, setDiscountValue] = useState(0);
    const { isTaxCompany } = useTax();
    const [inoiceItems, setInvoiceItems] = useState([])
    const getCustomer = async () => {
        setISLoading(true);
        try {
            const response = await getAllCustomers();
            const itemResponse = await getAllItems();
            const orgResponse = await getOrgProfie();
            setCustomers(response.parties)
            setInvoiceItems(itemResponse.items)
            setFilteredUsers(response.parties)
            const org_State = orgResponse.organizationList[0].state;
            setOrgState(org_State)

        } catch (error) {

        } finally {
            setISLoading(false);
        }
    }
    useFocusEffect(
        useCallback(() => {
            getCustomer();
        }, [])
    );

    const [showInvoicePicker, setShowInvoicePicker] = useState(false);
    const [showDuePicker, setShowDuePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [filteredItems, setFilteredItems] = useState([]);
    const [itemModalVisible, setItemModalVisible] = useState(false);

    const intialData = {
        customerName: '',
        invoiceNumber: 'INV/2025/00003',
        orderNumber: '',
        invoiceDate: new Date(),
        terms: '',
        dueDate: new Date(),
        salesperson: 'Harish',
        subject: '',
        customer: {},
        items: [
            {
                id: '',
                itemHsn: "",
                type: "",
                unit: "",
                discount: "0",
                details: '',
                quantity: '1',
                price: '0.00',
                intraStateTax: '0',
                interStateTax: '0',
                amount: '0.00',
            },
        ],
        termsandconditions: '',
        customernote: 'Thanks for your business.',
        discountInput: '0',
        adjustmentInput: '0',
        invoiceStatus: "VOID",
    }

    const [invoiceData, setInvoiceData] = useState(intialData);

    const addItem = () => {
        setInvoiceData({
            ...invoiceData,
            items: [
                ...invoiceData.items,
                {
                    id: '',
                    itemHsn: "",
                    type: "",
                    unit: "",
                    details: '',
                    discount: "0",
                    quantity: '1',
                    price: '0.00',
                    intraStateTax: '0',
                    interStateTax: '0',
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
    useEffect(() => {
        if (invoiceData?.items) {
            const newTotal = invoiceData.items.reduce((total, item) => total + Number(item.amount), 0);
            let newTaxSummary = {};
            let newAllTaxTotal = 0;

            invoiceData.items.forEach((item) => {
                const itemTotal = Number(item.quantity) * Number(item.price);
                const ItaxRate = Number(item.interStateTax);
                const GtaxRate = Number(item.intraStateTax);
                const applicableTaxRate = isSameState ? GtaxRate : ItaxRate;

                if (applicableTaxRate === 0) return;

                let discountedTotal = itemTotal;
                if (invoiceData.discountInput && invoiceData.discountInput !== 0) {
                    const discountAmount = (itemTotal * Number(invoiceData.discountInput)) / 100;
                    discountedTotal -= discountAmount; // Subtract discount from item total
                }

                const totalTax = (discountedTotal * applicableTaxRate) / 100;

                if (!newTaxSummary[applicableTaxRate]) {
                    newTaxSummary[applicableTaxRate] = 0;
                }
                newTaxSummary[applicableTaxRate] += totalTax;
                newAllTaxTotal += totalTax;
            });

            setTaxSummary(newTaxSummary);
            setAllTaxTotal(newAllTaxTotal);
            setTotalAmt(newTotal);
        }
    }, [invoiceData]);

    const handleSelect = (selectedName) => {
        const placeOfSupply = selectedName.placeOfSupply;
        if (orgState === placeOfSupply) {
            setIsSameSate(true)
        } else {
            setIsSameSate(false)
        }
        setInvoiceData({ ...invoiceData, customerName: selectedName.displayName });
        setInvoiceData({ ...invoiceData, customer: selectedName })
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

    const handleDateChange = (event, date, type) => {
        if (date) {
            setInvoiceData({ ...invoiceData, [type]: date });
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
            id: selectedItem.id,
            itemHsn: selectedItem.itemHsn,
            type: selectedItem.type,
            unit: selectedItem.unit,
            details: selectedItem.itemName,
            quantity: 1,
            price: selectedItem.sellingPrice,
            intraStateTax: selectedItem.intraStateTax || 0,
            interStateTax: selectedItem.interStateTax || 0,
            amount: Number(selectedItem.sellingPrice) * 1,
        };

        setInvoiceData({ ...invoiceData, items: updatedItems });
        setItemModalVisible(false);
    };

    const handleInputChange = (index, field, value) => {
        const updatedItems = [...invoiceData.items];
        updatedItems[index][field] = value ? parseFloat(value) : 0;

        const quantity = Number(updatedItems[index].quantity) || 0;
        const price = Number(updatedItems[index].price) || 0;
        const discount = Number(updatedItems[index].discount) || 0;

        if (isTaxCompany) {
            updatedItems[index].amount = quantity * price;
        } else {
            const discountAmount = (quantity * price * discount) / 100;
            updatedItems[index].amount = quantity * price - discountAmount;
        }

        setInvoiceData({ ...invoiceData, items: updatedItems });
    };


    const handleSubmit = async () => {

        const data = new FormData();


        Object.keys(invoiceData).forEach((key) => {
            if (typeof invoiceData[key] !== "object" || invoiceData[key] === null) {
                if (key.toLowerCase().includes("date")) {

                } else {
                    data.append(key, invoiceData[key]);
                }
            }
        });
        if (invoiceData.invoiceDate) {
            const formattedDate = new Date(invoiceData.invoiceDate).toISOString().split("T")[0];
            data.append("invoiceDate", formattedDate);
        }

        if (invoiceData.dueDate) {
            const formattedDate = new Date(invoiceData.dueDate).toISOString().split("T")[0];
            data.append("dueDate", formattedDate); // ✅ Now it's "dueDate"
        }



        // Append nested objects as JSON strings
        if (invoiceData.items) {
            invoiceData.items.forEach((item, index) => {
                data.append(`items[${index}].id`, item.id);
                data.append(`items[${index}].quantity`, item.quantity);
                data.append(`items[${index}].itemName`, item.details);
                data.append(`items[${index}].discount`, item.discount);
                data.append(`items[${index}].sellingPrice`, item.price);
                data.append(`items[${index}].intraStateTax`, item.intraStateTax);
                data.append(`items[${index}].interStateTax`, item.interStateTax);
                data.append(`items[${index}].itemHsn`, item.itemHsn);
                data.append(`items[${index}].type`, item.type);
                data.append(`items[${index}].unit`, item.unit);
            });

        }
        const finalAmount = Number(totalAmt) + Number(allTaxTotal) - Number(discountValue) + Number(invoiceData.adjustmentInput);
        if (invoiceData.customer) {
            data.append("customer.id", invoiceData.customer.id);
            data.append("totalAmount", finalAmount.toFixed(2));
        }

        try {
            const response = await fetch("https://billing.portstay.com/save-proforma-invoice", {
                method: "POST",
                body: data,
                credentials: "include",
            }); console.log("resp-----", response)
            if (response.ok) {
                Alert.alert("Sucess", "Invoice created Successfully");
                setInvoiceData(intialData)
                navigation.navigate('sales')
            }
            else {
                Alert.alert("error", "Failed to create Invoice");
            }


        } catch (error) {
            Alert.alert("error", error);
        }
    };
    const handleDiscountAmount = (value) => {
        let num = Number(value);

        if (isNaN(num) || num < 0) {
            num = 1; // Minimum value is 1
        } else if (num > 100) {
            num = 100; // Maximum value is 100
        }
        setInvoiceData({ ...invoiceData, discountInput: num })
        const discountAmt = num === 0 ? 0 : (totalAmt * num) / 100
        setDiscountValue(discountAmt)
    }

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
                        <TouchableOpacity className="mr-4" onPress={() => navigation.navigate('sales')}>
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
                                    <Text>{invoiceData.customer.displayName || "Search Or Select A Customer"}</Text>
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
                                    value={invoiceData.terms}
                                    onChangeText={(text) => setInvoiceData({ ...invoiceData, terms: text })}
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
                                <View className="flex-row justify-between">
                                    {/* <Text className="flex-1 font-medium text-gray-700">
                                        ITEM DETAILS<Text className="text-red-500">*</Text>
                                    </Text> */}
                                    <Text className="w-20 text-center font-medium text-gray-700">QUANTITY</Text>
                                    <Text className="w-20 text-center font-medium text-gray-700">PRICE</Text>
                                    {isTaxCompany ? (<Text className="w-16 text-center font-medium text-gray-700">TAX %</Text>) : (<Text className="w-16 text-center font-medium text-gray-700">DISCOUNT %</Text>)}
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
                                        <View className={`flex-row items-center ${isTaxCompany ? "w-24" : "w-20"} mr-2`}>
                                            <Text className="mr-1">₹</Text>
                                            <TextInput
                                                className="border flex-1 border-gray-300 rounded-md py-2 text-center"
                                                keyboardType="numeric"
                                                value={item.price?.toString()}
                                                onChangeText={(value) => handleInputChange(index, "price", value)}
                                            />
                                        </View>

                                        {/* Tax */}
                                        {isTaxCompany ? (
                                            <View className="flex-row items-start w-16 ml-2">
                                                <Text className=" text-left">{isSameState ? item.intraStateTax : item.interStateTax}</Text>
                                                <Text className="ml-1">%</Text>
                                            </View>
                                        ) : (<View className="flex-row items-center w-20 mr-2">
                                            <Text className="mr-1">%</Text>
                                            <TextInput
                                                className="border flex-1 border-gray-300 rounded-md p-2 text-center"
                                                keyboardType="numeric"
                                                value={item.discount?.toString()}
                                                onChangeText={(value) => handleInputChange(index, "discount", value)}
                                            />
                                        </View>
                                        )}

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
                        {/* Summary Section */}
                        <View className="bg-gray-50 p-4 rounded-md mt-4">
                            <View className="flex-row justify-between items-center mb-3">
                                <Text className="text-gray-700">Sub Total</Text>
                                <Text className="font-medium">₹ {totalAmt.toFixed(2) || "0.00"}</Text>
                            </View>
                            {isTaxCompany && (<View className="flex-row justify-between items-center mb-3">
                                <View className="flex-row items-center">
                                    <Text className="text-gray-700">Discount %</Text>
                                    <TextInput
                                        className="border w-16 ml-3 border-gray-300 rounded-md p-1.5 text-center"
                                        keyboardType="numeric"
                                        value={invoiceData.discountInput}
                                        onChangeText={(text) => handleDiscountAmount(text)}
                                    />
                                </View>
                                <Text className="font-medium">- ₹ {discountValue || "0.00"}</Text>
                            </View>)}
                            {Object.entries(taxSummary).map(([rate, amount], index) => (
                                <View key={index}>
                                    {isSameState ? (
                                        <View>
                                            <View className="flex-row justify-between items-center mb-2">
                                                <Text className="flex-1 text-left text-[13px]">SGST ({rate}%):</Text>
                                                <Text className="w-20 text-right text-[13px]">{(amount / 2).toFixed(2)}</Text>
                                            </View>
                                            <View className="flex-row justify-between items-center mb-2">
                                                <Text className="flex-1 text-left text-[13px]">CGST ({rate}%):</Text>
                                                <Text className="w-20 text-right text-[13px]">{(amount / 2).toFixed(2)}</Text>
                                            </View>
                                        </View>
                                    ) : (
                                        <View className="flex-row justify-between items-center mb-2">
                                            <Text className="flex-1 text-left text-[13px]">IGST ({rate}%):</Text>
                                            <Text className="w-20 text-right text-[13px]">{amount.toFixed(2)}</Text>
                                        </View>
                                    )}
                                </View>
                            ))}
                            <View className="flex-row justify-between items-center mb-3">
                                <View className="flex-row items-center">
                                    <Text className="text-gray-700">Adjustment</Text>
                                    <TextInput
                                        className="border w-16 ml-3 border-gray-300 rounded-md p-1.5 text-center"
                                        keyboardType="numeric"
                                        value={invoiceData.adjustmentInput}
                                        onChangeText={(text) => setInvoiceData({ ...invoiceData, adjustmentInput: text })}
                                    />
                                </View>
                                <Text className="font-medium">+ ₹ {invoiceData.adjustmentInput || "0.00"}</Text>
                            </View>

                            <View className="flex-row justify-between items-center pt-3 border-t border-gray-300">
                                <Text className="text-gray-700 font-medium">Total</Text>
                                <Text className="font-bold">₹ {(totalAmt + allTaxTotal - discountValue + Number(invoiceData.adjustmentInput)).toFixed(2) || "0.00"}</Text>
                            </View>
                        </View>
                        {/* Terms & Conditions */}
                        <View>
                            <Text className="text-gray-700 mb-1">Terms & Conditions</Text>
                            <TextInput
                                className="border border-gray-300 rounded-md p-3 bg-white h-24"
                                multiline
                                placeholder="Enter the terms and conditions of your business to be displayed in your transaction"
                                value={invoiceData.termsandconditions}
                                onChangeText={(text) => setInvoiceData({ ...invoiceData, termsAndConditions: text })}
                            />
                        </View>

                        {/* Customer Notes */}
                        <View>
                            <Text className="text-gray-700 mb-1">Customer Notes</Text>
                            <TextInput
                                className="border border-gray-300 rounded-md p-3 bg-white h-24"
                                multiline
                                value={invoiceData.customernote}
                                onChangeText={(text) => setInvoiceData({ ...invoiceData, customernote: text })}
                            />
                            <Text className="text-gray-500 text-xs mt-1">Will be displayed on the invoice</Text>
                        </View>

                        {/* Action Buttons */}
                        <View className="flex-row justify-end space-x-3 mt-4 mb-8">
                            <TouchableOpacity className="bg-blue-600 py-3 px-6 rounded-md" onPress={handleSubmit}>
                                <Text className="text-white font-medium">Create Invoice</Text>
                            </TouchableOpacity>

                            {/* <TouchableOpacity className="border border-gray-300 py-3 px-6 rounded-md">
                                <Text className="text-gray-700">Close</Text>
                            </TouchableOpacity> */}
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}