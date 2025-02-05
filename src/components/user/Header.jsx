import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { Bell, Plus } from 'lucide-react-native';

export default function Header() {
    const navigation = useNavigation();
    const [showDropdown, setShowDropdown] = useState(false);

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const closeDropdown = () => {
        if (showDropdown) {
            setShowDropdown(false);
        }
    };
    const handleOptionSelect = (option) => {
        console.log(`Selected option: ${option}`);
        setShowDropdown(false); // Close dropdown after selection
    };

    return (
        <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
            <View className="flex-row items-center gap-1">
                <TouchableOpacity
                    onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                    className="p-2"
                >
                    <Feather name="menu" size={24} color="#4F46E5" />
                </TouchableOpacity>

                <Text className="text-xl font-bold text-indigo-600">Customers</Text>
            </View>

            <View className="flex-row items-center gap-2">
                <View className="flex-row items-center space-x-4">
                    {/* <TouchableOpacity>
                        <Bell className="w-6 h-6 text-gray-600" />
                    </TouchableOpacity> */}
                    <View className=" flex-row justify-center items-center bg-gray-50 relative">
                        <TouchableOpacity
                            className="bg-blue-500 rounded-full p-2"
                            onPress={(e) => {
                                e.stopPropagation(); // Prevent the click from propagating
                                toggleDropdown();
                            }}
                        >
                            <Plus className="w-5 h-5 text-white" />
                        </TouchableOpacity>
                        {showDropdown && (
                            <TouchableWithoutFeedback onPress={closeDropdown}>
                                <View className="bg-gray-800/50 absolute w-[100vw] top-[6vh] right-[-66px] h-[94vh] z-10"></View>
                            </TouchableWithoutFeedback>
                        )}
                        {/* Dropdown */}
                        {showDropdown && (
                            <View className="absolute z-20 top-10 mt-2  bg-white border border-gray-200 rounded-lg shadow-lg w-36">
                                <TouchableOpacity
                                    className="p-4  flex-row items-center justify-start"
                                    onPress={() => handleOptionSelect('Option 1')}
                                >
                                    <View className=" px-1 mr-2 rounded-md  flex-row items-center justify-center bg-blue-500">
                                        <Feather name="plus" size={18} color="#fff" />
                                    </View>
                                    <Text className="text-gray-700 ">Customers</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    className="p-4  flex-row items-center justify-start"
                                    onPress={() => handleOptionSelect('Option 2')}
                                >
                                    <View className=" px-1 mr-2 rounded-md  flex-row items-center justify-center bg-blue-500">
                                        <Feather name="plus" size={18} color="#fff" />
                                    </View>
                                    <Text className="text-gray-700 ">Items</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    className="p-4  flex-row items-center justify-start"
                                    onPress={() => handleOptionSelect('Option 3')}
                                >
                                    <View className=" px-1 mr-2 rounded-md  flex-row items-center justify-center bg-blue-500">
                                        <Feather name="plus" size={18} color="#fff" />
                                    </View>
                                    <Text className="text-gray-700 ">Invoice</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </View>
                <TouchableOpacity
                    className="flex-row items-center bg-blue-600 px-3 py-2 rounded-lg"
                    onPress={() => navigation.navigate('AddUser')}
                >
                    <Feather name="user" size={18} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

