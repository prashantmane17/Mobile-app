import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import UsersScreen from '../screens/UsersScreen';
import DrawerContent from '../components/DrawerContent';

const Drawer = createDrawerNavigator();

export default function AppNavigator() {
    return (
        <Drawer.Navigator
            drawerContent={(props) => <DrawerContent {...props} />}
            screenOptions={{
                headerShown: false,
                drawerStyle: {
                    width: '60%',
                    borderCurve: "continuous"
                },
            }}
        >
            <Drawer.Screen name="Users" component={UsersScreen} />
            {/* <Drawer.Screen name="Settings" component={SettingsScreen} /> */}
        </Drawer.Navigator>
    );
}

