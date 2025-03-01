import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import UsersDashboardScreen from '../screens/UsersDashboardScreen';
import Party from '../screens/Party';
import DrawerContent from '../components/user/DrawerContent';
import { View } from 'react-native';
import Header from '../components/user/Header';
import CustomerList from '../screens/Party';
import AddCustomerForm from '../screens/AddCustomerForm';
import AddItemForm from '../screens/AddItemForm';
import ItemScreen from '../screens/ItemScreen';
import InvoiceList from '../screens/InvoiceList';
import { HeaderProvider } from '../context/HeaderContext';
import PaymentList from '../screens/PaymentList';
import PurchaseList from '../screens/PurchaseList';
import VendorScreen from '../screens/VendorScreen';
import Expense from '../screens/Expense';
import BankScreen from '../screens/BankScreen';
import ProformaInvoice from '../screens/ProformaInvoice';
import InvoiceForm from '../screens/InvoiceForm';
import PaymentForm from '../screens/PaymentForm';
import ExpenseForm from '../screens/ExpenseForm';
import BankForm from '../screens/BankForm';
import InvoiceTemp from '../screens/InvoiceTemp';

const Drawer = createDrawerNavigator();

export default function EmployeeNavigator() {
    return (
        <HeaderProvider>
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
                <Drawer.Screen name="Parties" component={CustomerList} />
                <Drawer.Screen name="sales" component={InvoiceList} />
                {/* <Drawer.Screen name="InvoiceForm" component={InvoiceForm} /> */}
                <Drawer.Screen name="InvoiceForm" component={InvoiceTemp} />
                <Drawer.Screen name="PaymentForm" component={PaymentForm} />
                <Drawer.Screen name="Payment" component={PaymentList} />
                <Drawer.Screen name="ItemScreen" component={ItemScreen} />
                <Drawer.Screen name="Purchase" component={PurchaseList} />
                <Drawer.Screen name="Expense" component={Expense} />
                <Drawer.Screen name="ExpenseForm" component={ExpenseForm} />
                <Drawer.Screen name="Vendor" component={VendorScreen} />
                <Drawer.Screen name="Bank" component={BankScreen} />
                <Drawer.Screen name="BankForm" component={BankForm} />
                <Drawer.Screen name="Pinvoice" component={ProformaInvoice} />
                <Drawer.Screen name="AddCustomerForm" component={AddCustomerForm} />
                <Drawer.Screen name="AddItemForm" component={AddItemForm} />
            </Drawer.Navigator>
        </HeaderProvider>
    );
}
