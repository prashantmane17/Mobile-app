import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';

export default function DrawerContent(props) {
    const navigation = useNavigation();

    const handleLogout = () => {
        // TODO: Implement logout logic
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
    };

    return (
        <View className="flex-1 rounded-none">
            <DrawerContentScrollView {...props}>
                <TouchableOpacity
                    className="flex-row items-center rounded px-4 py-3 bg-indigo-50"
                    onPress={() => navigation.navigate('Users')}
                >
                    <Feather name="users" size={20} color="#4F46E5" />
                    <Text className="ml-3 text-base font-semibold text-indigo-600">Users</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="flex-row items-center px-4 py-3"
                    onPress={() => navigation.navigate('Settings')}
                >
                    <Feather name="settings" size={20} color="#666" />
                    <Text className="ml-3 text-base text-gray-600">Settings</Text>
                </TouchableOpacity>
            </DrawerContentScrollView>

            <TouchableOpacity
                className="flex-row items-center px-4 py-3 border-t border-gray-200"
                onPress={handleLogout}
            >
                <Feather name="log-out" size={20} color="#666" />
                <Text className="ml-3 text-base text-gray-600">Logout</Text>
            </TouchableOpacity>
        </View>
    );
}

