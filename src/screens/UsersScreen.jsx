import React, { useState, useEffect } from "react";
import { View, ScrollView, RefreshControl, Text, TouchableOpacity } from "react-native";
import UserCard from "../components/UserCard";
import { Ionicons } from '@expo/vector-icons';
import TimeZoneForm from "../components/timeZoneSetting";
import { getSession } from "../api/admin/adminApi";

export default function UsersScreen() {
    const [modalVisible, setModalVisible] = useState(false);
    const [users, setUsers] = useState([]);
    const [isTimeZoneSet, setIsTimeZoneSet] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const fetchAdminDashboard = async () => {
        try {
            const response = await fetch("http://192.168.1.25:8080/admin-dashbordMobileApp", {
                method: "GET",
                credentials: "include",
            });

            if (response.ok) {
                const data = await response.json([]);
                if (data.timeZoneSettings.length === 0) {
                    setIsTimeZoneSet(true);
                    setModalVisible(true)
                } else {
                    setIsTimeZoneSet(false);
                    setModalVisible(false)
                }

                setUsers(data.users)
            } else {
                console.error("Failed to load dashboard:", response.status);
            }
        } catch (error) {
            console.error("Error fetching dashboard:", error);
        }
    };

    useEffect(() => {
        fetchAdminDashboard();
    }, []);


    const onRefresh = () => {
        setRefreshing(true);
        fetchAdminDashboard();


        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    };


    return (
        <View className="flex-1 bg-gray-100 relative">
            {isTimeZoneSet && modalVisible && (
                <View className="absolute top-0 left-0 z-40 flex-1 w-full h-screen">
                    <View className="flex-1 bg-gray-100 ">
                        <View className="flex-1  justify-center items-center bg-black/50">
                            <View className="w-11/12 bg-white rounded-lg p-5 ">
                                {/* Header with close button */}
                                <View className="flex-row justify-between items-center mb-6">
                                    <Text className="text-2xl font-bold text-center text-gray-800">Set Time Zone</Text>
                                    <TouchableOpacity onPress={() => setModalVisible(false)}>
                                        <Ionicons name="close" size={24} color="#6b7280" />
                                    </TouchableOpacity>
                                </View>
                                <TimeZoneForm onClose={() => setModalVisible(false)} />
                            </View>
                        </View>
                    </View>
                </View>)}
            <ScrollView
                className="flex-1"
                contentContainerClassName="py-4"
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {users.map((user, index) => (
                    <UserCard key={index} name={user.name} email={user.email} id={user.id} />
                ))}
            </ScrollView>
        </View>
    );
}
