import React, { useEffect } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import DrawerContent from '../components/user/DrawerContent';
import Header from '../components/user/Header';

import { HeaderProvider } from '../context/HeaderContext';
import UsersDashboardScreen from '../screens/dashboard/UsersDashboardScreen';
import CustomerList from '../screens/customer/Party';
import CustomerDetails from '../screens/customer/CustomerDetails';
import InvoiceCards from '../screens/sales/InvoiceList';
import InvoiceForm from '../screens/sales/InvoiceForm';
import InvoiceTemp from '../screens/sales/InvoiceTemp';
import PaymentForm from '../screens/payment/PaymentForm';
import PaymentDetails from '../screens/payment/PaymentDetails';
import PaymentList from '../screens/payment/PaymentList';
import ItemScreen from '../screens/stocks/ItemScreen';
import ItemDetails from '../screens/stocks/ItemsDetail';
import AddItemForm from '../screens/stocks/AddItemForm';
import EnhancedAddCustomerForm from '../screens/customer/AddCustomerForm';
import ProformaInvoiceForm from '../screens/proformaInvoice/ProformaInvoiceForm';
import ProformaInvoiceDetails from '../screens/proformaInvoice/ProformaInvoiceDetails';
import ProformaInvoice from '../screens/proformaInvoice/ProformaInvoice';
import BankScreen from '../screens/bank/BankScreen';
import BankForm from '../screens/bank/BankForm';
import VendorForm from '../screens/vendor/VendorForm';
import VendorDetails from '../screens/vendor/VendorDetails';
import VendorScreen from '../screens/vendor/VendorScreen';
import ExpenseForm from '../screens/expesne/ExpenseForm';
import Expense from '../screens/expesne/Expense';
import PurchaseDetails from '../screens/purchase/PurchaseDetails';
import PurchaseForm from '../screens/purchase/PurchaseForm';
import PurchaseList from '../screens/purchase/PurchaseList';
import EditCustomerForm from '../screens/customer/editCustomerForm';
import EditItemForm from '../screens/stocks/EditItemForm';
import EditVendor from '../screens/vendor/EditVendor';
import { TaxProvider, useTax } from '../context/TaxContext';


const Drawer = createDrawerNavigator();

export default function EmployeeNavigator() {

    return (
        <HeaderProvider>
            <TaxProvider>
                <Drawer.Navigator
                    drawerContent={(props) => <DrawerContent {...props} />}
                    screenOptions={{
                        headerShown: true,
                        drawerStyle: {
                            width: '60%',
                            backgroundColor: "#282e3b",
                        },
                        header: () => <Header />,
                    }}
                >
                    <Drawer.Screen name="Dashboard" component={UsersDashboardScreen} />
                    <Drawer.Screen name="Parties" component={CustomerList} />
                    <Drawer.Screen name="CustomerDetails" component={CustomerDetails} />
                    <Drawer.Screen name="sales" component={InvoiceCards} />
                    <Drawer.Screen name="InvoiceForm" component={InvoiceForm} />
                    <Drawer.Screen name="InvoiceTemp" component={InvoiceTemp} />
                    <Drawer.Screen name="PaymentForm" component={PaymentForm} />
                    <Drawer.Screen name="PaymentDetails" component={PaymentDetails} />
                    <Drawer.Screen name="Payment" component={PaymentList} />
                    <Drawer.Screen name="ItemScreen" component={ItemScreen} />
                    <Drawer.Screen name="ItemsDetail" component={ItemDetails} />
                    <Drawer.Screen name="Purchase" component={PurchaseList} />
                    <Drawer.Screen name="PurchaseForm" component={PurchaseForm} />
                    <Drawer.Screen name="PurchaseDetails" component={PurchaseDetails} />
                    <Drawer.Screen name="Expense" component={Expense} />
                    <Drawer.Screen name="ExpenseForm" component={ExpenseForm} />
                    <Drawer.Screen name="Vendor" component={VendorScreen} />
                    <Drawer.Screen name="EditVendor" component={EditVendor} />
                    <Drawer.Screen name="VendorDetails" component={VendorDetails} />
                    <Drawer.Screen name="VendorForm" component={VendorForm} />
                    <Drawer.Screen name="Bank" component={BankScreen} />
                    <Drawer.Screen name="BankForm" component={BankForm} />
                    <Drawer.Screen name="Pinvoice" component={ProformaInvoice} />
                    <Drawer.Screen name="PinvoiceDetails" component={ProformaInvoiceDetails} />
                    <Drawer.Screen name="PinvoiceForm" component={ProformaInvoiceForm} />
                    <Drawer.Screen name="AddCustomerForm" component={EnhancedAddCustomerForm} />
                    <Drawer.Screen name="EditCustomerForm" component={EditCustomerForm} />
                    <Drawer.Screen name="AddItemForm" component={AddItemForm} />
                    <Drawer.Screen name="EditItemForm" component={EditItemForm} />
                </Drawer.Navigator>
            </TaxProvider>
        </HeaderProvider>
    );
}
