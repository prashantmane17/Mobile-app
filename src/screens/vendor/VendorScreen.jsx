import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, Alert, RefreshControl } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import { TextInput } from 'react-native-gesture-handler';
import { deleteVendor, getAllVendors } from '../../api/user/vendor';
import { useNavigation } from '@react-navigation/native';


export default function VendorScreen() {
    const navigation = useNavigation();

    const [vendors, setVendors] = useState([])
    const [invoices, setInvoices] = useState([])
    const [searchQuery, setSearchQuery] = useState('');
    const [open, setOpen] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [value, setValue] = useState(25);
    const [items, setItems] = useState([
        { label: '25', value: 25 },
        { label: '50', value: 50 },
        { label: '100', value: 100 }
    ]);
    const vendorData = async () => {
        try {
            const response = await getAllVendors();
            setVendors(response.vendors)
            setInvoices(response.invoices)
        } catch (error) {
            console.error("Error fetching Vendors:", error);
        }
    };

    useEffect(() => {
        vendorData();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await vendorData();
        setRefreshing(false);
    };
    const filteredInvoices = vendors.filter(invoice =>
        invoice.displayName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDelete = async (id) => {
        Alert.alert(
            "Confirm Delete", // Title
            "Are you sure you want to delete this Vendor?", // Message
            [
                { text: "Cancel", style: "cancel" }, // Cancel button
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const response = await deleteVendor(id);
                        } catch (error) {
                            console.log("❌ Error deleting vendor", error);
                        }
                    },
                },
            ],
            { cancelable: true }
        );
    };


    return (
        <SafeAreaView className="flex-1 bg-gray-100">
            <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />

            <View className="flex-1 p-4">
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#3b82f6"]} />
                    }
                >
                    <View className="bg-white p-4 shadow-sm rounded-lg mb-4">
                        <View className="flex-1 flex-row items-center bg-gray-100 rounded-md px-3 py-1 mb-4">
                            <Feather name="search" size={20} color="#9CA3AF" />
                            <TextInput
                                className="flex-1 ml-2 text-base"
                                placeholder="Search vendors..."
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                            />
                        </View>

                        <View className="flex-row items-center justify-between space-x-2">
                            <View className="flex-row items-center justify-between gap-3">
                                <TouchableOpacity
                                    className="bg-blue-500 px-4 py-2 rounded-md"
                                    onPress={() => navigation.navigate('VendorForm')}
                                >
                                    <Text className="text-white font-medium">+ Create Vendor</Text>
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

                    {filteredInvoices.map((customer) => {
                        const totalAmount = invoices.reduce((total, invoice) => {
                            if (invoice.vendor.id === customer.id) {
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
                                        onPress={() => navigation.navigate("VendorDetails", { id: customer.id })}>{customer.displayName}</Text>
                                </View>
                                <View className="flex-row items-center">
                                    <TouchableOpacity
                                        className="mr-4 bg-blue-100 p-2 rounded-full"
                                        onPress={() => {/* Edit functionality */ }}
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
                                <View className="flex-row justify-between items-center mb-3">

                                    <View className="bg-blue-50 px-3 py-1 rounded-full">
                                        <Text className="text-blue-700 font-medium w-full">
                                            GST: <Text className="capitalize">{customer.gstTreatment}</Text>
                                        </Text>
                                    </View>
                                </View>

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
                    })}

                    {vendors.length === 0 && (
                        <View className="flex-1 justify-center items-center py-20">
                            <MaterialCommunityIcons name="account-off" size={64} color="#9ca3af" />
                            <Text className="mt-4 text-gray-500 text-lg">Vendors not found</Text>
                        </View>
                    )}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}