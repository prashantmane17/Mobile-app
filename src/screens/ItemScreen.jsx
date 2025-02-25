import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, FlatList, RefreshControl } from 'react-native';
import { Plus, Search, Import, Eye, ChevronDown } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

const ItemCard = ({ item }) => (
    <View className="p-4 mb-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 shadow-sm border border-blue-100">
        <View className="space-y-2">
            <View className="flex-row justify-between">
                <Text className="text-lg font-semibold text-gray-900">Item Name:</Text>
                <Text className="text-lg font-bold text-gray-800">{item.itemName}</Text>
            </View>
            <View className="flex-row justify-between">
                <Text className="text-base text-gray-700">Item Code:</Text>
                <Text className="text-gray-700 font-medium">{item.itemCode}</Text>
            </View>
            <View className="flex-row justify-between">
                <Text className="text-base text-gray-700">HSN Code:</Text>
                <Text className="text-gray-700 font-medium">{item.HSNCode}</Text>
            </View>
            <View className="flex-row justify-between">
                <Text className="text-base text-gray-700">Tax Pref:</Text>
                <Text className="text-gray-700 font-medium">{item.taxPref}</Text>
            </View>
            <View className="flex-row justify-between items-center mt-2">
                <View className="bg-blue-600 px-4 py-1 rounded-lg">
                    <Text className="text-white font-bold">₹ {item.price}</Text>
                </View>
                <TouchableOpacity className="bg-blue-500 flex-row items-center rounded-full px-3 py-1">
                    <Eye size={18} color="#ffffff" />
                    <Text className="text-white ml-1">View</Text>
                </TouchableOpacity>
            </View>
        </View>
    </View>
);

export default function ItemScreen() {
    const [selectedNumber, setSelectedNumber] = useState(25);
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    const navigation = useNavigation();

    const numbers = [25, 50, 100];
    const items = [
        {
            itemName: 'Oil',
            itemCode: '67776',
            HSNCode: '92170872',
            taxPref: 'Taxable',
            price: '9000',
        },
        // Add more items here
    ];

    const filteredItems = items.filter(item =>
        item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.itemCode.includes(searchQuery)
    );

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        // Simulate fetching data
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <View className="p-4 bg-white space-y-4">
                <View className="flex-row items-center px-3 py-2 bg-gray-100 rounded-lg">
                    <Search className="w-5 h-5 text-gray-400 mr-2" />
                    <TextInput
                        placeholder="Search Items"
                        className="flex-1 text-gray-700"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                <View className="flex-row justify-between items-center">
                    <TouchableOpacity
                        onPress={() => navigation.navigate('AddItemForm')}
                        className="flex-row items-center px-3 py-2 bg-blue-500 rounded-lg"
                    >
                        <Plus className="w-4 h-4 text-white mr-1" />
                        <Text className="text-white">Create Items</Text>
                    </TouchableOpacity>

                    <View className="flex-row items-center">
                        <Text className="mr-2">Show:</Text>
                        <TouchableOpacity
                            className="flex-row justify-between items-center px-2 py-1 border border-gray-200 rounded-lg"
                            onPress={() => setDropdownVisible(!isDropdownVisible)}
                        >
                            <Text>{selectedNumber}</Text>
                            <ChevronDown size={18} color="gray" className="ml-1" />
                        </TouchableOpacity>
                        {isDropdownVisible && (
                            <View className="absolute z-10 top-full right-0 bg-white border border-gray-300 rounded-lg w-14">
                                {numbers.map((num) => (
                                    <TouchableOpacity
                                        key={num}
                                        className="py-1 border-b border-gray-300 last:border-b-0"
                                        onPress={() => {
                                            setSelectedNumber(num);
                                            setDropdownVisible(false);
                                        }}
                                    >
                                        <Text className="text-center">{num}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>

                    <TouchableOpacity className="flex-row items-center">
                        <Import className="w-4 h-4 text-green-500 mr-1" />
                        <Text className="text-green-500">Import</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <FlatList
                data={filteredItems}
                renderItem={({ item }) => <ItemCard item={item} />}
                keyExtractor={(item) => item.itemCode}
                contentContainerClassName="p-3"
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListEmptyComponent={
                    <Text className="text-center text-gray-500 mt-4">No items found</Text>
                }
            />

            <View className="p-4 bg-white border-t border-gray-200">
                <Text className="text-center text-gray-600">
                    Showing {filteredItems.length} of {items.length} items
                </Text>
            </View>
        </SafeAreaView>
    );
}