import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TouchableWithoutFeedback, Modal } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { Bell, Plus } from 'lucide-react-native';
import { useHeader } from '../../context/HeaderContext';

export default function Header() {
    const navigation = useNavigation();
    const { headerName } = useHeader();
    const [showDropdown, setShowDropdown] = useState(false);

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const closeDropdown = () => {
        setShowDropdown(false);
    };
    const handleLogout = () => {

        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
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

                <Text className="text-xl font-bold text-indigo-600">{headerName}</Text>
            </View>

            <View className="flex-row items-center gap-2">
                <TouchableOpacity onPress={toggleDropdown}
                    className="flex-row items-center bg-blue-600 px-3 py-2 rounded-lg"
                >
                    <Feather name="user" size={18} color="#fff" />
                </TouchableOpacity>
                <Modal
                    visible={showDropdown}
                    transparent
                    animationType="fade"
                    onRequestClose={closeDropdown}
                >
                    <TouchableWithoutFeedback onPress={closeDropdown}>
                        <View className="flex-1 justify-center items-center bg-black/50">
                            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
                                <View className="bg-white p-6 rounded-2xl w-80 shadow-xl">
                                    {/* Profile Header */}
                                    <View className="flex-row items-center justify-between mb-4">
                                        <Text className="text-xl font-bold text-gray-800">Profile</Text>
                                    </View>

                                    {/* Profile Info */}
                                    <View className="space-y-2">
                                        <Text className="text-gray-700 font-medium">
                                            <Text className="text-black font-semibold">Name: </Text>

                                        </Text>
                                        <Text className="text-gray-700 font-medium">
                                            <Text className="text-black font-semibold">Email: </Text>

                                        </Text>
                                        <Text className="text-gray-700 font-medium">
                                            <Text className="text-black font-semibold">Joined: </Text>

                                        </Text>
                                    </View>

                                    {/* Buttons */}
                                    <View className="flex-row justify-end mt-5 space-x-3">
                                        <TouchableOpacity
                                            onPress={closeDropdown}
                                            className="bg-gray-400 px-4 py-2 rounded-lg"
                                        >
                                            <Text className="text-white font-medium">Close</Text>
                                        </TouchableOpacity>


                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
                <TouchableOpacity
                    className="flex-row items-center px-2 py-3 border-t border-gray-200"
                    onPress={handleLogout}
                >
                    <Feather name="log-out" size={20} color="red" />
                    {/* <Text className="ml-3 text-base text-red-600">Logout</Text> */}
                </TouchableOpacity>
            </View>
        </View>
    );
}

