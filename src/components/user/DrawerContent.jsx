import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';

export default function DrawerContent(props) {
    const navigation = useNavigation();
    const [activeScreen, setActiveScreen] = useState('Dashboard');

    const handleLogout = () => {

        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
    };
    const handleActiveScreen = (screen) => {
        setActiveScreen(screen)
    }

    return (
        <View className="flex-1 rounded-none">
            <DrawerContentScrollView {...props}>
                <TouchableOpacity
                    className={`flex-row items-center rounded px-4 py-3 ${activeScreen === 'Dashboard' ? 'bg-indigo-50' : ''}`}
                    onPress={() => {
                        props.navigation.navigate('Dashboard');
                        handleActiveScreen("Dashboard")
                    }}
                >
                    <Feather name="home" size={20} color={`${activeScreen === 'Dashboard' ? '#4F46E5' : '#ffffff'}`} />
                    <Text className={`ml-3 text-base font-semibold ${activeScreen === 'Dashboard' ? 'text-indigo-600' : 'text-white'}`}>Dashboard</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className={`flex-row items-center rounded px-4 py-3 ${activeScreen === 'Parties' ? 'bg-indigo-50' : ''}`}
                    onPress={() => {
                        props.navigation.navigate('Parties')
                        handleActiveScreen("Parties")
                    }}
                >
                    <Feather name="users" size={20} color={`${activeScreen === 'Parties' ? '#4F46E5' : '#ffffff'}`} />
                    <Text className={`ml-3 text-base font-semibold ${activeScreen === 'Parties' ? 'text-indigo-600' : 'text-white'}`} >Customer</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className={`flex-row items-center rounded px-4 py-3 ${activeScreen === 'AddItemForm' ? 'bg-indigo-50' : ''}`}
                    onPress={() => props.navigation.navigate('AddItemForm')}
                >
                    <Feather name="shopping-bag" size={20} color={`${activeScreen === 'AddItemForm' ? '#4F46E5' : '#ffffff'}`} />
                    <Text className={`ml-3 text-base font-semibold ${activeScreen === 'AddItemForm' ? 'text-indigo-600' : 'text-white'}`} >Items</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className={`flex-row items-center rounded px-4 py-3 ${activeScreen === 'Sales' ? 'bg-indigo-50' : ''}`}
                    onPress={() => navigation.navigate('Sales')}
                >
                    <Feather name="shopping-cart" size={20} color={`${activeScreen === 'Sales' ? '#4F46E5' : '#ffffff'}`} />
                    <Text className={`ml-3 text-base font-semibold ${activeScreen === 'Sales' ? 'text-indigo-600' : 'text-white'}`} >Sales</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className={`flex-row items-center rounded px-4 py-3 ${activeScreen === 'Expenses' ? 'bg-indigo-50' : ''}`}
                    onPress={() => navigation.navigate('Expenses')}
                >
                    <Feather name="truck" size={20} color={`${activeScreen === 'Expenses' ? '#4F46E5' : '#ffffff'}`} />
                    <Text className={`ml-3 text-base font-semibold ${activeScreen === 'Expenses' ? 'text-indigo-600' : 'text-white'}`} >Expenses</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity
                    className={`flex-row items-center rounded px-4 py-3 ${activeScreen === 'Dashboard' ? 'bg-indigo-50' : ''}`}
                    onPress={() => navigation.navigate('Settings')}
                >
                    <Feather name="dollar-sign" size={20} color="#ffffff" />
                    <Text className={`ml-3 text-base font-semibold ${activeScreen === 'Dashboard' ? 'text-indigo-600' : 'text-white'}`} >Quick Billing</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className={`flex-row items-center rounded px-4 py-3 ${activeScreen === 'Dashboard' ? 'bg-indigo-50' : ''}`}
                    onPress={() => navigation.navigate('Settings')}
                >
                    <Feather name="bar-chart" size={20} color="#ffffff" />
                    <Text className={`ml-3 text-base font-semibold ${activeScreen === 'Dashboard' ? 'text-indigo-600' : 'text-white'}`} >Expenses</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className={`flex-row items-center rounded px-4 py-3 ${activeScreen === 'Dashboard' ? 'bg-indigo-50' : ''}`}
                    onPress={() => navigation.navigate('Settings')}
                >
                    <Feather name="film" size={20} color="#ffffff" />
                    <Text className={`ml-3 text-base font-semibold ${activeScreen === 'Dashboard' ? 'text-indigo-600' : 'text-white'}`} >Cash & Bank</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className={`flex-row items-center rounded px-4 py-3 ${activeScreen === 'Dashboard' ? 'bg-indigo-50' : ''}`}
                    onPress={() => navigation.navigate('Settings')}
                >
                    <Feather name="settings" size={20} color="#ffffff" />
                    <Text className={`ml-3 text-base font-semibold ${activeScreen === 'Dashboard' ? 'text-indigo-600' : 'text-white'}`} >Report</Text>
                </TouchableOpacity> */}

            </DrawerContentScrollView>

            <TouchableOpacity
                className="flex-row items-center px-7 py-3 border-t border-gray-200"
                onPress={handleLogout}
            >
                <Feather name="log-out" size={20} color="red" />
                <Text className="ml-3 text-base text-red-600">Logout</Text>
            </TouchableOpacity>
        </View>
    );
}

