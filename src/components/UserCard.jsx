import React from 'react';
import { View, Text, TouchableHighlight, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';



export default function UserCard({ name, email }) {
    return (
        <View className="flex-row items-center bg-white p-4 rounded-xl mx-4 my-2 shadow-sm">
            <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center">
                <Feather name="user" size={24} color="#666" />
            </View>
            <View className="ml-3 flex-1">
                <Text className="text-base font-semibold text-gray-800">{name}</Text>
                <Text className="text-sm text-gray-600 mt-1">{email}</Text>
            </View>
            <TouchableOpacity>
                <Feather name="trash-2" size={16} color="#eb563f" />
            </TouchableOpacity>
        </View>
    );
}

