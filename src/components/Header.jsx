import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Alert, } from 'react-native';
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

    const handleCreateUser = async () => {
        try {
            // Prepare the form data as a URL-encoded string
            const formBody = new URLSearchParams(formData).toString();

            // Send the data to the API
            const response = await fetch('https://billing.portstay.com/createUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                credentials: 'include', // Ensures cookies are sent with the request if needed
                body: formBody, // Attach the form data
            });

            const responseText = await response.text(); // Get the response text from the backend
            if (response.ok) {
                if (response.status === 201) {
                    Alert.alert('Success', responseText);
                    setFormData({ name: '', email: '', password: '' }); // Reset form data
                    setModalVisible(false); // Close modal
                } else {
                    Alert.alert('Error', responseText || 'An unexpected error occurred.');
                }
            } else if (response.status === 409) {
                Alert.alert('Error', 'Email already exists.');
            } else if (response.status === 400) {
                Alert.alert('Error', 'Organization ID is missing in the session.');
            } else {
                Alert.alert('Error', 'Something went wrong. Please try again later.');
            }
        } catch (error) {
            console.error('Fetch error:', error);
            Alert.alert('Error', 'Something went wrong. Please try again later.');
        }
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

