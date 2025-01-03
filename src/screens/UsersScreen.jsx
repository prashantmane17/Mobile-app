import React from 'react';
import { View, ScrollView } from 'react-native';
import Header from '../components/Header';
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

export default function UsersScreen() {
    return (
        <View className="flex-1 bg-gray-100">
            <Header />
            <ScrollView
                className="flex-1"
                contentContainerClassName="py-4"
            >
                {SAMPLE_USERS.map((user, index) => (
                    <UserCard
                        key={index}
                        name={user.name}
                        email={user.email}
                    />
                ))}
            </ScrollView>
        </View>
    );
}

