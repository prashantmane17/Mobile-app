import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import UsersDashboardScreen from '../screens/UsersDashboardScreen';
import Party from '../screens/Party';
import DrawerContent from '../components/user/DrawerContent';
import { View } from 'react-native';
import Header from '../components/user/Header';

const Drawer = createDrawerNavigator();

export default function EmployeeNavigator() {
    return (
        <Drawer.Navigator
            drawerContent={(props) => <DrawerContent {...props} />}
            screenOptions={{
                headerShown: true, // Ensure the header is shown globally
                drawerStyle: {
                    width: '60%',
                    backgroundColor: "#282e3b",
                },
                header: () => <Header />, // Set the global header
            }}
        >
            <Drawer.Screen name="Dashboard" component={UsersDashboardScreen} />
            <Drawer.Screen name="Parties" component={Party} />
        </Drawer.Navigator>
    );
}
