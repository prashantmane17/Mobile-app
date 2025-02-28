import React, { useState, useEffect } from "react";
import { View, ScrollView, RefreshControl } from "react-native";
import Header from "../components/Header";
import UserCard from "../components/UserCard";

const SAMPLE_USERS = [
    {
        name: "Portstay Technology Pvt Ltd",
        email: "admin@lenova.com",
    },
    {
        name: "Ola Pvt Limited",
        email: "admidsffdn@lenova.com",
    },
    {
        name: "prashant",
        email: "prashant@lenova.com",
    },
    {
        name: "manoj",
        email: "manoj@lenova.com",
    },
    {
        name: "Book and author",
        email: "Book&Author@lenova.com",
    },
];

export default function UsersScreen() {
    const [users, setUsers] = useState(SAMPLE_USERS);
    const [refreshing, setRefreshing] = useState(false);

    const fetchAdminDashboard = async () => {
        try {
            const response = await fetch("http://192.168.1.25:8080/admin-dashbord", {
                method: "GET",
                credentials: "include",
            });

            if (response.ok) {
                const data = await response.text();
                console.log("Dashboard Data:",);
                // Update state with new data (if applicable)
            } else {
                console.error("Failed to load dashboard:", response.status);
            }
        } catch (error) {
            console.error("Error fetching dashboard:", error);
        }
    };

    // Fetch data when the component mounts
    useEffect(() => {
        fetchAdminDashboard();
    }, []);

    // Handle pull-to-refresh
    const onRefresh = () => {
        setRefreshing(true);
        fetchAdminDashboard(); // Fetch new data

        // Simulate data reload (if needed)
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    };

    return (
        <View className="flex-1 bg-gray-100">
            <Header />
            <ScrollView
                className="flex-1"
                contentContainerClassName="py-4"
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {users.map((user, index) => (
                    <UserCard key={index} name={user.name} email={user.email} />
                ))}
            </ScrollView>
        </View>
    );
}
