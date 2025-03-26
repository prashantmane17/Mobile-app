"use client"

import { useCallback, useEffect, useState } from "react"
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    ActivityIndicator,
    Alert,
} from "react-native"
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons"
import DropDownPicker from "react-native-dropdown-picker"
import { TextInput } from "react-native-gesture-handler"
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import { getAllItems, deleteItem } from "../../api/user/items"
import { useTax } from "../../context/TaxContext"

export default function ItemScreen() {
    const navigation = useNavigation()
    const { isTaxCompany } = useTax()
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState(10)
    const [dropdownItems, setDropdownItems] = useState([
        { label: "10", value: 10 },
        { label: "25", value: 25 },
        { label: "50", value: 50 },
    ])
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1)

    const fetchItems = async () => {
        setLoading(true)
        try {
            const response = await getAllItems()
            if (response && response.items && response.items.length > 0) {
                setItems(response.items)
            } else {
                setItems([])
            }
        } catch (error) {
            console.error("Error fetching items:", error)
            setItems([])
        } finally {
            setLoading(false)
        }
    }

    const filteredItems = items.filter((item) => item.itemName.toLowerCase().includes(searchQuery.toLowerCase()))

    // Calculate pagination values
    const totalItems = filteredItems.length
    const totalPages = Math.ceil(totalItems / value)
    const startIndex = (currentPage - 1) * value
    const endIndex = Math.min(startIndex + value, totalItems)
    const currentItems = filteredItems.slice(startIndex, endIndex)

    // Reset to first page when items per page changes or search query changes
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
            "Confirm Delete", // Title
            "Are you sure you want to delete this Vendor?", // Message
            [
                { text: "Cancel", style: "cancel" }, // Cancel button
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const response = await deleteItem(id)
                            if (response.status === 200) {
                                fetchItems()
                            }
                        } catch (error) {
                            console.log("❌ Error deleting vendor", error)
                        }
                    },
                },
            ],
            { cancelable: true },
        )
    }

    useFocusEffect(
        useCallback(() => {
            fetchItems()
        }, []),
    )

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

                <View className="bg-white p-4 shadow-sm rounded-lg mb-2">
                    <View className=" flex-row items-center bg-gray-100 rounded-md px-3 py-1 mb-4">
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
                <ScrollView showsVerticalScrollIndicator={false}>
                    {loading ? (
                        <View className="flex-1 justify-center items-center py-20">
                            <ActivityIndicator size="large" color="#3b82f6" />
                            <Text className="mt-4 text-gray-500">Loading items...</Text>
                        </View>
                    ) : (
                        <>
                            {filteredItems.length > 0 ? (
                                <>
                                    {currentItems.map((item) => (
                                        <View
                                            key={item.id}
                                            className="bg-white rounded-xl shadow-sm mb-4 overflow-hidden border border-gray-100"
                                        >
                                            {/* Card Header */}
                                            <View className="flex-row justify-between items-center p-4 border-b border-gray-100 bg-blue-50">
                                                <View className="flex-row items-center flex-1">
                                                    <MaterialCommunityIcons name={getIconForItemType(item.type)} size={20} color="#3b82f6" />
                                                    <Text
                                                        className="ml-2 text-lg font-semibold text-blue-600 flex-1 capitalize"
                                                        onPress={() => navigation.navigate("ItemsDetail", { id: item.id })}
                                                    >
                                                        {item.itemName}
                                                    </Text>
                                                    <View className="bg-green-100 px-3 py-1 rounded-full">
                                                        <Text className="text-green-700 font-medium">{item.type}</Text>
                                                    </View>
                                                </View>
                                                <View className="flex-row items-center ml-2">
                                                    <TouchableOpacity
                                                        className="mr-2 bg-blue-100 p-2 rounded-full"
                                                        onPress={() => navigation.navigate("EditItemForm", { id: item.id })}
                                                    >
                                                        <MaterialCommunityIcons name="pencil" size={18} color="#3b82f6" />
                                                    </TouchableOpacity>
                                                    <TouchableOpacity
                                                        className="bg-red-100 p-2 rounded-full"
                                                        onPress={() => handleDelete(item.id)}
                                                    >
                                                        <MaterialCommunityIcons name="delete" size={18} color="#ef4444" />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>

                                            {/* Card Body */}
                                            <View className="p-4">
                                                <View className="grid grid-cols-2 gap-3">
                                                    {isTaxCompany && (
                                                        <View className="bg-blue-100 px-3 py-1 rounded-full w-1/3">
                                                            <Text className="text-blue-700 font-medium text-center">{item.taxPreference}</Text>
                                                        </View>
                                                    )}
                                                    <View className="mb-1 flex-row w-full gap-2">
                                                        <Text className="text-gray-500 font-medium">Item Code:</Text>
                                                        <Text className="text-gray-800">{item.itemCode ? item.itemCode : "--"}</Text>
                                                    </View>

                                                    <View className="mb-1 flex-row w-full gap-2">
                                                        <Text className="text-gray-500 font-medium">Quantity:</Text>
                                                        <Text className="text-gray-800">{item.quantity}</Text>
                                                    </View>

                                                    <View className="mb-2 flex-row w-full gap-2">
                                                        <Text className="text-gray-500 font-medium">Account:</Text>
                                                        <Text className="text-gray-800">{item.account ? item.account : "--"}</Text>
                                                    </View>

                                                    <View className="mb-1 flex-row w-full gap-2">
                                                        <Text className="text-gray-500 font-medium">Selling Price:</Text>
                                                        <Text className="text-gray-800 font-bold">{item.sellingPrice}</Text>
                                                    </View>

                                                    <View className="mb-1 flex-row w-full gap-2">
                                                        <Text className="text-gray-500 font-medium">Purchase Price:</Text>
                                                        <Text className="text-gray-800">{item.purchasePrice ? item.purchasePrice : "--"}</Text>
                                                    </View>
                                                </View>

                                                {/* Tax Information */}
                                                {isTaxCompany && (
                                                    <View className="mt-3 pt-3 border-t border-gray-100">
                                                        <View className="flex-row justify-between items-center">
                                                            <View className="w-1/2 flex-row items-center justify-start border border-transparent">
                                                                <Text className="text-gray-500 font-medium">Within State Tax:</Text>
                                                                <Text className="text-gray-800 ml-2">{item.intraStateTax}%</Text>
                                                            </View>
                                                            <View className="w-1/2 flex-row items-center justify-start border border-transparent">
                                                                <Text className="text-gray-500 font-medium">Out of State Tax:</Text>
                                                                <Text className="text-gray-800 ml-2">{item.interStateTax}%</Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                )}
                                            </View>
                                        </View>
                                    ))}

                                    {/* Pagination Controls */}

                                </>
                            ) : (
                                <View className="flex-1 justify-center items-center py-20">
                                    <MaterialCommunityIcons name="package-variant-removed" size={64} color="#9ca3af" />
                                    <Text className="mt-4 text-gray-500 text-lg">Items not found</Text>
                                </View>
                            )}
                        </>
                    )}
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}

