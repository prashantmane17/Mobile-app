import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { useHeader } from '../../context/HeaderContext';

export default function DrawerContent(props) {
    const navigation = useNavigation();
    const [activeScreen, setActiveScreen] = useState('Dashboard');
    const { setHeaderName } = useHeader();
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
        <View className="flex-1 rounded-none bg-[#06607a]">
            <DrawerContentScrollView {...props}>
                <TouchableOpacity
                    className={`flex-row items-center rounded px-4 py-3 ${activeScreen === 'Dashboard' ? 'bg-indigo-50' : ''}`}
                    onPress={() => {
                        props.navigation.navigate('Dashboard');
                        handleActiveScreen("Dashboard")
                        setHeaderName("Dashboard");
                    }}
                >
                    <Feather name="home" size={20} color={`${activeScreen === 'Dashboard' ? '#4F46E5' : '#ffffff'}`} />
                    <Text className={`ml-3 text-base font-semibold ${activeScreen === 'Dashboard' ? 'text-indigo-600' : 'text-white'}`}>Dashboard</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className={`flex-row items-center rounded px-4 py-3 ${activeScreen === 'sales' ? 'bg-indigo-50' : ''}`}
                    onPress={() => {
                        props.navigation.navigate('sales')
                        handleActiveScreen("sales")
                        setHeaderName("Sales");
                    }}
                >
                    <Feather name="activity" size={20} color={`${activeScreen === 'sales' ? '#4F46E5' : '#ffffff'}`} />
                    <Text className={`ml-3 text-base font-semibold ${activeScreen === 'sales' ? 'text-indigo-600' : 'text-white'}`} >Sales</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className={`flex-row items-center rounded px-4 py-3 ${activeScreen === 'payment' ? 'bg-indigo-50' : ''}`}
                    onPress={() => navigation.navigate('payment')}
                >
                    <FontAwesome name="rupee" size={20} color={`${activeScreen === 'payment' ? '#4F46E5' : '#ffffff'}`} />
                    <Text className={`ml-3 text-base font-semibold ${activeScreen === 'payment' ? 'text-indigo-600' : 'text-white'}`} >Payment</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className={`flex-row items-center rounded px-4 py-3 ${activeScreen === 'Parties' ? 'bg-indigo-50' : ''}`}
                    onPress={() => {
                        props.navigation.navigate('Parties')
                        handleActiveScreen("Parties")
                        setHeaderName("Customers");
                    }}
                >
                    <Feather name="users" size={20} color={`${activeScreen === 'Parties' ? '#4F46E5' : '#ffffff'}`} />
                    <Text className={`ml-3 text-base font-semibold ${activeScreen === 'Parties' ? 'text-indigo-600' : 'text-white'}`} >Customers</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className={`flex-row items-center rounded px-4 py-3 ${activeScreen === 'ItemScreen' ? 'bg-indigo-50' : ''}`}
                    onPress={() => {
                        props.navigation.navigate('ItemScreen')
                        handleActiveScreen("ItemScreen")
                        setHeaderName("Stock");
                    }}
                >
                    <Feather name="layers" size={20} color={`${activeScreen === 'ItemScreen' ? '#4F46E5' : '#ffffff'}`} />
                    <Text className={`ml-3 text-base font-semibold ${activeScreen === 'ItemScreen' ? 'text-indigo-600' : 'text-white'}`} >Stocks</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className={`flex-row items-center rounded px-4 py-3 ${activeScreen === 'Purchase' ? 'bg-indigo-50' : ''}`}
                    onPress={() => {
                        navigation.navigate('Purchase')
                        setHeaderName("Purchase");
                    }}
                >
                    <Feather name="truck" size={20} color={`${activeScreen === 'Purchase' ? '#4F46E5' : '#ffffff'}`} />
                    <Text className={`ml-3 text-base font-semibold ${activeScreen === 'Purchase' ? 'text-indigo-600' : 'text-white'}`} >Purchase</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className={`flex-row items-center rounded px-4 py-3 ${activeScreen === 'Vendor' ? 'bg-indigo-50' : ''}`}
                    onPress={() => {
                        navigation.navigate('Vendor')
                        setHeaderName("Vendor");
                    }}
                >
                    <Feather name="user" size={20} color={`${activeScreen === 'Vendor' ? '#4F46E5' : '#ffffff'}`} />
                    <Text className={`ml-3 text-base font-semibold ${activeScreen === 'Vendor' ? 'text-indigo-600' : 'text-white'}`} >Vendor</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className={`flex-row items-center rounded px-4 py-3 ${activeScreen === 'Pinvoice' ? 'bg-indigo-50' : ''}`}
                    onPress={() => navigation.navigate('Pinvoice')}
                >
                    <Feather name="file-text" size={20} color={`${activeScreen === 'Pinvoice' ? '#4F46E5' : '#ffffff'}`} />
                    <Text className={`ml-3 text-base font-semibold ${activeScreen === 'Pinvoice' ? 'text-indigo-600' : 'text-white'}`} >Proforma Invoice</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className={`flex-row items-center rounded px-4 py-3 ${activeScreen === 'Expenses' ? 'bg-indigo-50' : ''}`}
                    onPress={() => navigation.navigate('Expenses')}
                >
                    <Feather name="bar-chart" size={20} color={`${activeScreen === 'Expenses' ? '#4F46E5' : '#ffffff'}`} className="transform rotate-90" />
                    <Text className={`ml-3 text-base font-semibold ${activeScreen === 'Expenses' ? 'text-indigo-600' : 'text-white'}`} >Expenses</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className={`flex-row items-center rounded px-4 py-3 ${activeScreen === 'Bank' ? 'bg-indigo-50' : ''}`}
                    onPress={() => navigation.navigate('Bank')}
                >
                    <FontAwesome name="university" size={20} color={`${activeScreen === 'Bank' ? '#4F46E5' : '#ffffff'}`} />
                    <Text className={`ml-3 text-base font-semibold ${activeScreen === 'Bank' ? 'text-indigo-600' : 'text-white'}`} >Bank</Text>
                </TouchableOpacity>


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

