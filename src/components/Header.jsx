import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation, DrawerActions } from '@react-navigation/native';

export default function Header() {
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const handleInputChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleCreateUser = () => {
        console.log('User Data:', formData);
        // Reset form and close modal
        setFormData({ name: '', email: '', password: '' });
        setModalVisible(false);
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

                <Text className="text-xl font-bold text-indigo-600">Ecommerce</Text>
            </View>
            <View>
                <TouchableOpacity
                    className="flex-row items-center bg-indigo-600 px-3 py-2 rounded"
                    onPress={() => setModalVisible(true)}
                >
                    <Feather name="user-plus" size={20} color="#fff" />
                    <Text className="text-white text-sm font-semibold ml-1">Add User</Text>
                </TouchableOpacity>
            </View>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View className="flex-1 bg-black/50 justify-center items-center">
                    <View className="w-4/5 bg-white rounded-lg p-6">
                        <Text className="text-lg font-bold mb-4 text-center">Add New User</Text>

                        <Text className="mb-1 pl-2 text-base font-bold">Name</Text>
                        <TextInput
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-3"
                            placeholder="Enter Name"
                            value={formData.name}
                            onChangeText={(text) => handleInputChange('name', text)}
                        />
                        <Text className="mb-1 pl-2 text-base font-bold">Email</Text>
                        <TextInput
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-3"
                            placeholder="Enter Email"
                            keyboardType="email-address"
                            value={formData.email}
                            onChangeText={(text) => handleInputChange('email', text)}
                        />

                        <Text className="mb-1 pl-2 text-base font-bold">Password</Text>
                        <TextInput
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-3"
                            placeholder="Enter Password"
                            secureTextEntry
                            value={formData.password}
                            onChangeText={(text) => handleInputChange('password', text)}
                        />

                        {/* Buttons */}
                        <View className="flex-row justify-between mt-4">
                            <TouchableOpacity
                                className="flex-1 bg-indigo-600 px-4 py-2 rounded-lg mr-2"
                                onPress={handleCreateUser}
                            >
                                <Text className="text-white text-center font-semibold">Create</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="flex-1 bg-gray-400 px-4 py-2 rounded-lg ml-2"
                                onPress={() => setModalVisible(false)}
                            >
                                <Text className="text-white text-center font-semibold">Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

        </View>
    );
}

