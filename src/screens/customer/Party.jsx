import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, Alert, ActivityIndicator, RefreshControl } from 'react-native';
// import { Checkbox } from 'react-native-paper';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import { TextInput } from 'react-native-gesture-handler';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { deleteCustomer, getAllCustomers } from '../../api/user/customer';
import { useTax } from '../../context/TaxContext';

export default function CustomerList() {
    const navigation = useNavigation();
    const { isTaxCompany } = useTax();
    const [customers, setCustomers] = useState([])
    const [loading, setLoading] = useState(false)
    const [refreshing, setRefreshing] = useState(false);
    const [invoices, setInvoices] = useState([])
    const [searchQuery, setSearchQuery] = useState('');
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(25);
    const [items, setItems] = useState([
        { label: '25', value: 25 },
        { label: '50', value: 50 },
        { label: '100', value: 100 }
    ]);
    const [currentPage, setCurrentPage] = useState(1)
    const customerData = async () => {
        setLoading(true)
        try {
            const response = await getAllCustomers();
            setCustomers(response.parties)
            setInvoices(response.invoices)
        } catch (error) {
            console.error("Error fetching Customer:", error);
        }
        finally {
            setLoading(false)
        }
    };
    useFocusEffect(
        useCallback(() => {
            customerData();
        }, []));
    const onRefresh = async () => {
        setRefreshing(true);
        await customerData();
        setRefreshing(false);
    };

    const filteredInvoices = customers?.filter(invoice =>
        invoice?.displayName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalItems = filteredInvoices.length
    const totalPages = Math.ceil(totalItems / value) || 1;
    const startIndex = (currentPage - 1) * value
    const endIndex = Math.min(startIndex + value, totalItems)
    const currentCustomer = filteredInvoices.slice(startIndex, endIndex)

    useEffect(() => {
        setCurrentPage(1)
    }, [value, searchQuery])

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1)
        }
    }

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1)
        }
    }

    const handleDelete = async (id) => {
        Alert.alert(
            "Confirm Delete",
            "Are you sure you want to delete this customer?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const response = await deleteCustomer(id);
                            if (response.status === 200) {
                                customerData();
                            }
                        } catch (error) {
                            console.log("❌ Error deleting customer", error);
                        }
                    },
                },
            ],
            { cancelable: true }
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-100">
            {/* <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" /> */}

            <View className="flex-1 p-4">

                <View className="bg-white p-4 shadow-sm rounded-lg mb-4">
                    <View className=" flex-row items-center bg-gray-100 rounded-md px-3 py-1 mb-4">
                        <Feather name="search" size={20} color="#9CA3AF" />
                        <TextInput
                            className="flex-1 ml-2 text-base"
                            placeholder="Search customer..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>

                    <View className="flex-row items-center justify-between space-x-2">
                        <View className="flex-row items-center justify-between gap-3">
                            <TouchableOpacity
                                className="bg-blue-500 px-4 py-2 rounded-md"
                                onPress={() => navigation.navigate('AddCustomerForm')}
                            >
                                <Text className="text-white font-medium">+ Create Customer</Text>
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
                <View className="flex-row justify-between items-center  rounded-lg shadow-sm p-2 mb-2 bg-white">
                    <TouchableOpacity
                        className={`px-4 py-2 rounded-md flex-row items-center ${currentPage === 1 ? "bg-gray-100" : "bg-blue-100"}`}
                        onPress={handlePrevPage}
                        disabled={currentPage === 1}
                    >
                        <MaterialCommunityIcons
                            name="chevron-left"
                            size={18}
                            color={currentPage === 1 ? "#9CA3AF" : "#3b82f6"}
                        />
                        <Text className={currentPage === 1 ? "text-gray-400 ml-1" : "text-blue-600 ml-1"}>Previous</Text>
                    </TouchableOpacity>

                    <View className="flex-row items-center">
                        <Text className="text-gray-600">
                            Showing Page {currentPage} of {totalPages || 1}
                            {/* <Text className="text-gray-500 text-sm">
                                                    {" "}
                                                    ({startIndex + 1}-{endIndex} of {totalItems})
                                                </Text> */}
                        </Text>
                    </View>

                    <TouchableOpacity
                        className={`px-4 py-2 rounded-md flex-row items-center ${currentPage === totalPages ? "bg-gray-100" : "bg-blue-100"}`}
                        onPress={handleNextPage}
                        disabled={currentPage === totalPages || totalPages === 0}
                    >
                        <Text className={currentPage === totalPages ? "text-gray-400 mr-1" : "text-blue-600 mr-1"}>
                            Next
                        </Text>
                        <MaterialCommunityIcons
                            name="chevron-right"
                            size={18}
                            color={currentPage === totalPages ? "#9CA3AF" : "#3b82f6"}
                        />
                    </TouchableOpacity>
                </View>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#3b82f6"]} />
                    }
                >
                    {loading ? (
                        <View className="flex-1 justify-center items-center py-20">
                            <ActivityIndicator size="large" color="#3b82f6" />
                            <Text className="mt-4 text-gray-500">Loading customer...</Text>
                        </View>
                    ) : (<>
                        {filteredInvoices.length > 0 ? (
                            currentCustomer.map((customer) => {
                                const totalAmount = invoices.reduce((total, invoice) => {
                                    if (invoice.customer.id === customer.id) {
                                        total += invoice.totalAmount;
                                    }
                                    return total;
                                }, 0);

                                return (<View
                                    key={customer.id}
                                    className="bg-white rounded-xl shadow-sm mb-4 overflow-hidden border border-gray-100"
                                >
                                    {/* Card Header */}
                                    <View className="flex-row justify-between items-center p-4  border-b border-gray-100">
                                        <View className="flex-row items-center">
                                            <MaterialCommunityIcons name="account" size={20} color="#3b82f6" />
                                            <Text className="ml-2 text-lg font-semibold text-blue-600 capitalize"
                                                onPress={() => navigation.navigate("CustomerDetails", { id: customer.id })}>{customer.displayName}</Text>
                                        </View>
                                        <View className="flex-row items-center">
                                            <TouchableOpacity
                                                className="mr-4 bg-blue-100 p-2 rounded-full"
                                                onPress={() => navigation.navigate('EditCustomerForm', { id: customer.id })}
                                            >
                                                <MaterialCommunityIcons name="pencil" size={18} color="#3b82f6" />
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                className="bg-red-100 p-2 rounded-full"
                                                onPress={() => handleDelete(customer.id)}
                                            >
                                                <MaterialCommunityIcons name="delete" size={18} color="#ef4444" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>

                                    {/* Card Body */}
                                    <View className="p-4">
                                        {isTaxCompany && (<View className="flex-row justify-between items-center mb-3">

                                            <View className="bg-blue-50 px-3 py-1 rounded-full">
                                                <Text className="text-blue-700 font-medium w-full">
                                                    GST: <Text className="capitalize">{customer.gstTreatment}</Text>
                                                </Text>
                                            </View>
                                        </View>)}

                                        <View className="mb-3">
                                            <View className="flex-row items-center mb-2">
                                                <MaterialCommunityIcons name="office-building" size={18} color="#6b7280" />
                                                <Text className="ml-2 text-gray-500 font-medium">Company:</Text>
                                                <Text className="ml-2 text-gray-700">{customer.companyName}</Text>
                                            </View>

                                            <View className="flex-row items-center mb-2">
                                                <MaterialCommunityIcons name="email" size={18} color="#6b7280" />
                                                <Text className="ml-2 text-gray-500 font-medium">Email:</Text>
                                                <Text className="ml-2 text-gray-700">{customer.emailAddress ? customer.emailAddress : "--"}</Text>
                                            </View>

                                            <View className="flex-row items-center mb-2">
                                                <MaterialCommunityIcons name="phone" size={18} color="#6b7280" />
                                                <Text className="ml-2 text-gray-500 font-medium">Phone:</Text>
                                                <Text className="ml-2 text-gray-700">{customer.phone ? customer.phone : "--"}</Text>
                                            </View>
                                        </View>

                                        <View className="mt-2 pt-3 border-t border-gray-100 flex-row justify-between items-center">
                                            <Text className="text-gray-500 font-medium">Total Pay:</Text>
                                            <Text className="text-xl font-bold text-green-600">₹ {totalAmount ? totalAmount : "0"}</Text>
                                        </View>
                                    </View>
                                </View>
                                )
                            })

                        ) : (
                            <View className="flex-1 justify-center items-center py-20">
                                <MaterialCommunityIcons name="account-off" size={64} color="#9ca3af" />
                                <Text className="mt-4 text-gray-500 text-lg">Customers not found</Text>
                            </View>
                        )}
                    </>
                    )}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}