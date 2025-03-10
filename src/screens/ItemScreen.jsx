"use client"

import { useEffect, useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, ActivityIndicator } from "react-native"
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons"
import DropDownPicker from "react-native-dropdown-picker"
import { TextInput } from "react-native-gesture-handler"
import { useNavigation } from "@react-navigation/native"
import { getAllItems } from "../api/user/items"



export default function ItemScreen() {
    const navigation = useNavigation()
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState(25)
    const [dropdownItems, setDropdownItems] = useState([
        { label: "25", value: 25 },
        { label: "50", value: 50 },
        { label: "100", value: 100 },
    ])

    // Sample data based on the screenshot


    const fetchItems = async () => {
        setLoading(true)
        try {
            const response = await getAllItems()
            if (response && response.items && response.items.length > 0) {
                setItems(response.items)
            } else {
            }
        } catch (error) {
            console.error("Error fetching items:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchItems()
    }, [])

    const filteredItems = items.filter((item) => item.itemName.toLowerCase().includes(searchQuery.toLowerCase()))

    const deleteItem = (id) => {
        // Implement delete functionality
        setItems(items.filter((item) => item.id !== id))
    }

    const getIconForItemType = (type) => {
        switch (type.toLowerCase()) {
            case "meter":
                return "gauge"
            case "service":
                return "cogs"
            case "box":
                return "package-variant-closed"
            default:
                return "cube-outline"
        }
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-100">
            <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />

            <View className="flex-1 p-4">
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View className="bg-white p-4 shadow-sm rounded-lg mb-4">
                        <View className="flex-1 flex-row items-center bg-gray-100 rounded-md px-3 py-1 mb-4">
                            <Feather name="search" size={20} color="#9CA3AF" />
                            <TextInput
                                className="flex-1 ml-2 text-base"
                                placeholder="Search items..."
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                            />
                        </View>

                        <View className="flex-row items-center justify-between space-x-2">
                            <View className="flex-row items-center justify-between gap-3">
                                <TouchableOpacity
                                    className="bg-blue-500 px-4 py-2 rounded-md"
                                    onPress={() => navigation.navigate("AddItemForm")}
                                >
                                    <Text className="text-white font-medium">+ Create Item</Text>
                                </TouchableOpacity>
                                <Text className="text-sm text-gray-600">Total: {filteredItems.length}</Text>
                            </View>

                            <View className="flex-row items-center text-black rounded-md px-2 py-2">
                                <Text className="text-sm text-gray-600 mr-2">Show:</Text>
                                <DropDownPicker
                                    open={open}
                                    value={value}
                                    items={dropdownItems}
                                    setOpen={setOpen}
                                    setValue={setValue}
                                    setItems={setDropdownItems}
                                    containerStyle={{ width: 80, zIndex: 1000 }}
                                    style={{
                                        borderColor: "#ccc",
                                        height: 35,
                                        minHeight: 35,
                                    }}
                                    dropDownContainerStyle={{
                                        borderColor: "#ccc",
                                        zIndex: 2000,
                                        maxHeight: 120,
                                    }}
                                    textStyle={{ fontSize: 14 }}
                                />
                            </View>
                        </View>
                    </View>

                    {loading ? (
                        <View className="flex-1 justify-center items-center py-20">
                            <ActivityIndicator size="large" color="#3b82f6" />
                            <Text className="mt-4 text-gray-500">Loading items...</Text>
                        </View>
                    ) : (
                        <>
                            {filteredItems.length > 0 ? (
                                filteredItems.map((item) => (
                                    <View
                                        key={item.id}
                                        className="bg-white rounded-xl shadow-sm mb-4 overflow-hidden border border-gray-100"
                                    >
                                        {/* Card Header */}
                                        <View className="flex-row justify-between items-center p-4 border-b border-gray-100 bg-blue-50">
                                            <View className="flex-row items-center flex-1">
                                                <MaterialCommunityIcons name={getIconForItemType(item.type)} size={20} color="#3b82f6" />
                                                <Text className="ml-2 text-lg font-semibold text-blue-600 flex-1">{item.itemName}</Text>
                                                <View className="bg-blue-100 px-3 py-1 rounded-full">
                                                    <Text className="text-blue-700 font-medium">{item.taxPreference}</Text>
                                                </View>
                                            </View>
                                            <View className="flex-row items-center ml-2">
                                                <TouchableOpacity
                                                    className="mr-2 bg-blue-100 p-2 rounded-full"
                                                    onPress={() => {

                                                    }}
                                                >
                                                    <MaterialCommunityIcons name="pencil" size={18} color="#3b82f6" />
                                                </TouchableOpacity>
                                                <TouchableOpacity className="bg-red-100 p-2 rounded-full" onPress={() => deleteItem(item.id)}>
                                                    <MaterialCommunityIcons name="delete" size={18} color="#ef4444" />
                                                </TouchableOpacity>
                                            </View>
                                        </View>

                                        {/* Card Body */}
                                        <View className="p-4">
                                            <View className="grid grid-cols-2 gap-3">
                                                <View className="mb-2 flex-row w-full gap-2">
                                                    <Text className="text-gray-500 font-medium">Item Code:</Text>
                                                    <Text className="text-gray-800">{item.itemCode}</Text>
                                                </View>

                                                <View className="mb-2 flex-row w-full gap-2">
                                                    <Text className="text-gray-500 font-medium">Quantity:</Text>
                                                    <Text className="text-gray-800">{item.quantity}</Text>
                                                </View>

                                                <View className="mb-2 flex-row w-full gap-2">
                                                    <Text className="text-gray-500 font-medium">Type:</Text>
                                                    <Text className="text-gray-800">{item.type}</Text>
                                                </View>

                                                <View className="mb-2 flex-row w-full gap-2">
                                                    <Text className="text-gray-500 font-medium">Selling Price:</Text>
                                                    <Text className="text-gray-800 font-bold">{item.sellingPrice}</Text>
                                                </View>

                                                <View className="mb-2">
                                                    <Text className="text-gray-500 font-medium">Purchase Price:</Text>
                                                    <Text className="text-gray-800">{item.purchasePrice}</Text>
                                                </View>
                                            </View>

                                            {/* Tax Information */}
                                            <View className="mt-3 pt-3 border-t border-gray-100">
                                                <View className="flex-row justify-between items-center">
                                                    <View>
                                                        <Text className="text-gray-500 font-medium">Within State Tax:</Text>
                                                        <Text className="text-gray-800">{item.withinStateTax}</Text>
                                                    </View>
                                                    <View>
                                                        <Text className="text-gray-500 font-medium">Out of State Tax:</Text>
                                                        <Text className="text-gray-800">{item.outOfStateTax}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                ))
                            ) : (
                                <View className="flex-1 justify-center items-center py-20">
                                    <MaterialCommunityIcons name="package-variant-removed" size={64} color="#9ca3af" />
                                    <Text className="mt-4 text-gray-500 text-lg">No items found</Text>
                                </View>
                            )}
                        </>
                    )}
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}

