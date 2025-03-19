import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import DrawerContent from '../components/DrawerContent';
import Header from '../components/Header';
import UsersScreen from '../screens/admin/UsersScreen';
import AdminSetting from '../screens/admin/AdminSetting';

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

