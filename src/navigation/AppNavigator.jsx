import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import UsersScreen from '../screens/UsersScreen';
import DrawerContent from '../components/DrawerContent';
import AdminSetting from '../screens/AdminSetting';
import Header from '../components/Header';

const Drawer = createDrawerNavigator();

export default function AppNavigator() {
    return (
        <Drawer.Navigator
            drawerContent={(props) => <DrawerContent {...props} />}
            screenOptions={{
                headerShown: true,
                drawerStyle: {
                    width: '60%',
                    borderCurve: "continuous"
                },
                header: () => <Header />,
            }}
        >
            <Drawer.Screen name="Users" component={UsersScreen} />
            <Drawer.Screen name="Settings" component={AdminSetting} />
        </Drawer.Navigator>
    );
}

