import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation, DrawerActions } from '@react-navigation/native';

export default function Header() {
    const navigation = useNavigation();

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
                    onPress={() => navigation.navigate('AddUser')}
                >
                    <Feather name="user-plus" size={20} color="#fff" />
                    <Text className="text-white text-sm font-semibold ml-1">Add User</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
