import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import Header from '../components/user/Header';
import UserCard from '../components/UserCard';

const SAMPLE_USERS = [
    {
        name: 'Portstay Technology Pvt Ltd',
        email: 'admin@lenova.com',
    },
    {
        name: 'Ola Pvt Limited',
        email: 'admidsffdn@lenova.com',
    },
    {
        name: 'prashant',
        email: 'prashant@lenova.com',
    },
    {
        name: 'manoj',
        email: 'manoj@lenova.com',
    },
    {
        name: 'Book and author',
        email: 'Book&Author@lenova.com',
    },
];

export default function UsersDashboardScreen() {
    return (
        <View className="flex-1 bg-gray-100">

            <ScrollView
                className="flex-1"
                contentContainerClassName="py-4"
            >
                <Text>Hii</Text>
            </ScrollView>
        </View>
    );
}

