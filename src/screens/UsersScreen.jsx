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

    const fetchAdminDashboard = async () => {
        try {
            const response = await fetch('http://192.168.1.25:8080/admin-dashbord', {
                method: 'GET',
                credentials: 'include',
            });
            console.log("res---", response)
            if (response.ok) {
                const data = await response.text();
                console.log('Dashboard Data:', data);
            } else {
                console.error('Failed to load dashboard:', response.status);
            }
        } catch (error) {
            console.error('Error fetching dashboard:', error);
        }
    };
    fetchAdminDashboard();
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

