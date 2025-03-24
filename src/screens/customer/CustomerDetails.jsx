import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Image, Linking } from "react-native";
import { User, Calculator, CreditCard, Truck, Edit2, ArrowLeft, Download, Share2, Printer, Mail, Phone } from 'lucide-react-native';
import * as Sharing from "expo-sharing";
import * as Print from "expo-print";
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { getAllCustomers } from '../../api/user/customer';
import { useTax } from '../../context/TaxContext';

const CustomerDetails = ({ route, navigation }) => {
    const { id } = route.params;
    const { isTaxCompany } = useTax();
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false);

    const fetchCustomerData = async () => {
        setLoading(true);
        try {
            const response = await getAllCustomers();
            const data = response.parties.find((customer) => customer.id === id);
            setCustomer(data);
        } catch (error) {
            console.error("Error fetching Customer:", error);
            Alert.alert("Error", "Failed to load customer details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomerData();
    }, [id]);

    const generatePDF = async () => {
        if (!customer) return null;

        const companyLogo = 'https://placehold.co/200x80/3b82f6/ffffff?text=CRM+Logo';

        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Customer Details</title>
                <style>
                    :root {
                        --primary-color: #3b82f6;
                        --primary-dark: #2563eb;
                        --text-primary: #1f2937;
                        --text-secondary: #6b7280;
                        --bg-primary: #ffffff;
                        --bg-secondary: #f9fafb;
                        --bg-accent: #eff6ff;
                        --border-color: #e5e7eb;
                    }
                    
                    * {
                        box-sizing: border-box;
                        margin: 0;
                        padding: 0;
                    }
                    
                    body {
                        font-family: 'Helvetica', 'Arial', sans-serif;
                        line-height: 1.5;
                        color: var(--text-primary);
                        background-color: #f3f4f6;
                        padding: 20px;
                    }
                    
                    .container {
                        max-width: 800px;
                        margin: 0 auto;
                        background-color: var(--bg-primary);
                        border-radius: 8px;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                        overflow: hidden;
                    }
                    
                    .header {
                        background-color: var(--primary-color);
                        color: white;
                        padding: 20px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }
                    
                    .logo {
                        height: 60px;
                    }
                    
                    .header-text {
                        text-align: right;
                    }
                    
                    .header-title {
                        font-size: 24px;
                        font-weight: bold;
                        margin-bottom: 5px;
                    }
                    
                    .header-subtitle {
                        font-size: 14px;
                        opacity: 0.9;
                    }
                    
                    .content {
                        padding: 20px;
                    }
                    
                    .section {
                        margin-bottom: 25px;
                        background-color: var(--bg-primary);
                        border-radius: 6px;
                        border: 1px solid var(--border-color);
                        overflow: hidden;
                    }
                    
                    .section-header {
                        background-color: var(--bg-accent);
                        padding: 12px 15px;
                        border-bottom: 1px solid var(--border-color);
                        display: flex;
                        align-items: center;
                    }
                    
                    .section-title {
                        font-size: 16px;
                        font-weight: bold;
                        color: var(--primary-dark);
                        margin-left: 8px;
                    }
                    
                    .section-icon {
                        width: 20px;
                        height: 20px;
                        fill: var(--primary-color);
                    }
                    
                    .section-body {
                        padding: 15px;
                    }
                    
                    .info-grid {
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        gap: 15px;
                    }
                    
                    .info-item {
                        margin-bottom: 10px;
                    }
                    
                    .info-label {
                        font-size: 12px;
                        color: var(--text-secondary);
                        margin-bottom: 3px;
                    }
                    
                    .info-value {
                        font-size: 14px;
                        font-weight: 500;
                        color: var(--text-primary);
                    }
                    
                    .address-grid {
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        gap: 20px;
                    }
                    
                    .address-box {
                        background-color: var(--bg-secondary);
                        border-radius: 6px;
                        padding: 15px;
                    }
                    
                    .address-title {
                        font-size: 14px;
                        font-weight: bold;
                        color: var(--primary-dark);
                        margin-bottom: 10px;
                        padding-bottom: 5px;
                        border-bottom: 1px solid var(--border-color);
                    }
                    
                    .footer {
                        text-align: center;
                        padding: 15px;
                        background-color: var(--bg-secondary);
                        font-size: 12px;
                        color: var(--text-secondary);
                        border-top: 1px solid var(--border-color);
                    }
                    
                    .highlight {
                        color: var(--primary-color);
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <div class="header-title">Customer Profile</div>
                        <div class="header-text">
                            <div class="header-subtitle">Generated on ${new Date().toLocaleDateString()}</div>
                        </div>
                    </div>
                    
                    <div class="content">
                        <!-- Basic Information -->
                        <div class="section">
                            <div class="section-header">
                                <svg class="section-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                                <div class="section-title">Basic Information</div>
                            </div>
                            <div class="section-body">
                                <div class="info-grid">
                                    <div class="info-item">
                                        <div class="info-label">Company Name</div>
                                        <div class="info-value">${customer.companyName || "--"}</div>
                                    </div>
                                    <div class="info-item">
                                        <div class="info-label">Contact Person</div>
                                        <div class="info-value">${customer.contactPersonName || "--"}</div>
                                    </div>
                                    <div class="info-item">
                                        <div class="info-label">Email Address</div>
                                        <div class="info-value highlight">${customer.emailAddress || "--"}</div>
                                    </div>
                                    <div class="info-item">
                                        <div class="info-label">Phone</div>
                                        <div class="info-value">${customer.phone || "--"}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Tax & Business Details -->
                        ${isTaxCompany && (`<div class="section">
                            <div class="section-header">
                                <svg class="section-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                                    <line x1="8" y1="21" x2="16" y2="21"></line>
                                    <line x1="12" y1="17" x2="12" y2="21"></line>
                                </svg>
                                <div class="section-title">Tax & Business Details</div>
                            </div>
                            <div class="section-body">
                                <div class="info-grid">
                                    <div class="info-item">
                                        <div class="info-label">GST Treatment</div>
                                        <div class="info-value">${customer.gstTreatment || "--"}</div>
                                    </div>
                                    <div class="info-item">
                                        <div class="info-label">Place of Supply</div>
                                        <div class="info-value">${customer.placeOfSupply || "--"}</div>
                                    </div>
                                    <div class="info-item">
                                        <div class="info-label">PAN</div>
                                        <div class="info-value">${customer.pan || "--"}</div>
                                    </div>
                                    <div class="info-item">
                                        <div class="info-label">Tax Preference</div>
                                        <div class="info-value">${customer.taxPreference || "--"}</div>
                                    </div>
                                </div>
                            </div>
                        </div>`)}
                        
                        <!-- Address Information -->
                        <div class="section">
                            <div class="section-header">
                                <svg class="section-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                    <circle cx="12" cy="10" r="3"></circle>
                                </svg>
                                <div class="section-title">Address Information</div>
                            </div>
                            <div class="section-body">
                                <div class="address-grid">
                                    <div class="address-box">
                                        <div class="address-title">Billing Address</div>
                                        <div class="info-item">
                                            <div class="info-label">City</div>
                                            <div class="info-value">${customer.billingAddress?.city || "--"}</div>
                                        </div>
                                        <div class="info-item">
                                            <div class="info-label">State</div>
                                            <div class="info-value">${customer.billingAddress?.state || "--"}</div>
                                        </div>
                                        <div class="info-item">
                                            <div class="info-label">Country</div>
                                            <div class="info-value">${customer.billingAddress?.country || "--"}</div>
                                        </div>
                                        <div class="info-item">
                                            <div class="info-label">Zip Code</div>
                                            <div class="info-value">${customer.billingAddress?.zipCode || "--"}</div>
                                        </div>
                                        <div class="info-item">
                                            <div class="info-label">Phone</div>
                                            <div class="info-value">${customer.billingAddress?.phone || "--"}</div>
                                        </div>
                                    </div>
                                    
                                    <div class="address-box">
                                        <div class="address-title">Shipping Address</div>
                                        <div class="info-item">
                                            <div class="info-label">City</div>
                                            <div class="info-value">${customer.shippingAddress?.city || "--"}</div>
                                        </div>
                                        <div class="info-item">
                                            <div class="info-label">State</div>
                                            <div class="info-value">${customer.shippingAddress?.state || "--"}</div>
                                        </div>
                                        <div class="info-item">
                                            <div class="info-label">Country</div>
                                            <div class="info-value">${customer.shippingAddress?.country || "--"}</div>
                                        </div>
                                        <div class="info-item">
                                            <div class="info-label">Zip Code</div>
                                            <div class="info-value">${customer.shippingAddress?.zipCode || "--"}</div>
                                        </div>
                                        <div class="info-item">
                                            <div class="info-label">Phone</div>
                                            <div class="info-value">${customer.shippingAddress?.phone || "--"}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </body>
            </html>
        `;

        try {
            const { uri } = await Print.printToFileAsync({ html: htmlContent });
            return uri;
        } catch (error) {
            console.error("Error generating PDF:", error);
            return null;
        }
    };

    const handleDownloadPDF = async () => {
        setGenerating(true);
        const pdfUri = await generatePDF();
        setGenerating(false);

        if (pdfUri) {
            try {
                const permissions = await MediaLibrary.requestPermissionsAsync();

                if (permissions.granted) {
                    const asset = await MediaLibrary.createAssetAsync(pdfUri);
                    await MediaLibrary.createAlbumAsync('Customer Profiles', asset, false);
                    Alert.alert("Success", "Customer profile saved to gallery");
                } else {
                    Alert.alert("Permission Required", "Storage permission is required to save the profile");
                }
            } catch (error) {
                console.error("Error saving PDF:", error);
                Alert.alert("Error", "Failed to save customer profile");
            }
        }
    };

    const handleSharePDF = async () => {
        setGenerating(true);
        const pdfUri = await generatePDF();
        setGenerating(false);

        if (pdfUri) {
            try {
                await Sharing.shareAsync(pdfUri);
            } catch (error) {
                console.error("Error sharing PDF:", error);
                Alert.alert("Error", "Failed to share customer profile");
            }
        }
    };

    const handlePrintPDF = async () => {
        setGenerating(true);
        try {
            await Print.printAsync({
                html: await generatePDF()
            });
        } catch (error) {
            console.error("Error printing PDF:", error);
            Alert.alert("Error", "Failed to print customer profile");
        } finally {
            setGenerating(false);
        }
    };
    const handleCall = (number) => {
        if (!number) {
            Alert.alert("Error", "Phone number is not available");
            return;
        }
        const phoneNumber = `tel:${number}`;
        Linking.openURL(phoneNumber).catch(() => Alert.alert("Error", "Could not open dialer"));
    };

    const handleEmail = (emailAddress) => {
        if (!emailAddress) {
            Alert.alert("Error", "Email address is not available");
            return;
        }
        const email = `mailto:${emailAddress}`;
        Linking.openURL(email).catch(() => Alert.alert("Error", "Could not open mail app"));
    };

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text className="mt-4 text-gray-600">Loading customer details...</Text>
            </View>
        );
    }

    if (!customer) {
        return (
            <View className="flex-1 justify-center items-center bg-white p-4">
                <Text className="text-lg text-gray-800 text-center mb-4">Customer not found or error loading data</Text>
                <TouchableOpacity
                    className="px-4 py-2 bg-blue-500 rounded-lg"
                    onPress={() => navigation.goBack()}
                >
                    <Text className="text-white font-medium">Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-gray-100">
            {/* Header */}
            <View className="bg-blue-600 px-4  py-5 shadow-md">
                <View className="flex-row justify-between items-center">
                    <TouchableOpacity
                        className="p-2 rounded-full bg-blue-500"
                        onPress={() => navigation.navigate("Parties")}
                    >
                        <ArrowLeft size={22} color="#ffffff" />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold text-white">Customer Profile</Text>
                    <View className="flex-row space-x-2">
                        {generating ? (
                            <ActivityIndicator size="small" color="#ffffff" />
                        ) : (
                            <>
                                <TouchableOpacity
                                    onPress={handleSharePDF}
                                    className="p-2 rounded-full bg-blue-500"
                                >
                                    <Share2 size={20} color="#ffffff" />
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </View>
            </View>

            {/* Customer Summary Card */}
            <View className="mx-4 -mt-4 bg-white rounded-xl shadow-md overflow-hidden">
                <View className="p-4 border-b border-gray-100">
                    <View className="flex-row items-center">
                        <View className="w-14 h-14 rounded-full bg-blue-100 items-center justify-center mr-3">
                            <Text className="text-xl font-bold text-blue-600">
                                {customer.displayName ? customer.displayName.charAt(0).toUpperCase() : 'C'}
                            </Text>
                        </View>
                        <View className="flex-1">
                            <Text className="text-lg font-bold text-gray-900 capitalize">{customer.displayName || "--"}</Text>
                            <Text className="text-sm text-gray-500 capitalize">{customer.companyName || "--"}</Text>
                        </View>
                    </View>
                </View>

                <View className="p-4 flex-row justify-around">
                    <TouchableOpacity className="items-center" onPress={() => handleCall(customer.phone)}>
                        <View className="w-10 h-10 rounded-full bg-blue-50 items-center justify-center mb-1">
                            <Phone size={18} color="#3b82f6" />
                        </View>
                        <Text className="text-xs text-gray-600">Call</Text>
                    </TouchableOpacity>

                    <TouchableOpacity className="items-center" onPress={() => handleEmail(customer.emailAddress)}>
                        <View className="w-10 h-10 rounded-full bg-blue-50 items-center justify-center mb-1">
                            <Mail size={18} color="#3b82f6" />
                        </View>
                        <Text className="text-xs text-gray-600">Email</Text>
                    </TouchableOpacity>

                    {/* <TouchableOpacity className="items-center" onPress={handlePrintPDF}>
                        <View className="w-10 h-10 rounded-full bg-blue-50 items-center justify-center mb-1">
                            <Printer size={18} color="#3b82f6" />
                        </View>
                        <Text className="text-xs text-gray-600">Print</Text>
                    </TouchableOpacity> */}

                    <TouchableOpacity className="items-center" onPress={handleDownloadPDF}>
                        <View className="w-10 h-10 rounded-full bg-blue-50 items-center justify-center mb-1">
                            <Download size={18} color="#3b82f6" />
                        </View>
                        <Text className="text-xs text-gray-600">Save</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView className="flex-1 mt-4">
                <View className="px-4 pb-8 space-y-4">
                    {/* Basic Information */}
                    <View className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <View className="bg-blue-50 px-4 py-3 border-l-4 border-blue-500 flex-row items-center">
                            <User size={18} color="#3b82f6" />
                            <Text className="ml-2 text-base font-semibold text-gray-800">Basic Information</Text>
                        </View>

                        <View className="p-4 divide-y divide-gray-100">
                            <View className="py-2 flex-row">
                                <Text className="w-1/3 text-sm text-gray-500">Company Name</Text>
                                <Text className="w-2/3 text-sm font-medium text-gray-900">{customer.companyName || "--"}</Text>
                            </View>

                            <View className="py-2 flex-row">
                                <Text className="w-1/3 text-sm text-gray-500">Contact Person</Text>
                                <Text className="w-2/3 text-sm font-medium text-gray-900">{customer.contactPersonName || "--"}</Text>
                            </View>

                            <View className="py-2 flex-row">
                                <Text className="w-1/3 text-sm text-gray-500">Email Address</Text>
                                <Text className="w-2/3 text-sm font-medium text-blue-600">{customer.emailAddress || "--"}</Text>
                            </View>

                            <View className="py-2 flex-row">
                                <Text className="w-1/3 text-sm text-gray-500">Phone</Text>
                                <Text className="w-2/3 text-sm font-medium text-gray-900">{customer.phone || "--"}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Tax & Business Details */}
                    {isTaxCompany && (<View className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <View className="bg-blue-50 px-4 py-3 border-l-4 border-blue-500 flex-row items-center">
                            <Calculator size={18} color="#3b82f6" />
                            <Text className="ml-2 text-base font-semibold text-gray-800">Tax & Business Details</Text>
                        </View>

                        <View className="p-4 divide-y divide-gray-100">
                            <View className="py-2 flex-row">
                                <Text className="w-1/3 text-sm text-gray-500">GST Treatment</Text>
                                <Text className="w-2/3 text-sm font-medium text-gray-900 capitalize">{customer.gstTreatment || "--"}</Text>
                            </View>

                            <View className="py-2 flex-row">
                                <Text className="w-1/3 text-sm text-gray-500">Place of Supply</Text>
                                <Text className="w-2/3 text-sm font-medium text-gray-900 capitalize">{customer.placeOfSupply || "--"}</Text>
                            </View>

                            <View className="py-2 flex-row">
                                <Text className="w-1/3 text-sm text-gray-500">PAN</Text>
                                <Text className="w-2/3 text-sm font-medium text-gray-900 uppercase">{customer.pan || "--"}</Text>
                            </View>

                            <View className="py-2 flex-row">
                                <Text className="w-1/3 text-sm text-gray-500">Tax Preference</Text>
                                <Text className="w-2/3 text-sm font-medium text-gray-900 capitalize">{customer.taxPreference || "--"}</Text>
                            </View>
                        </View>
                    </View>)}

                    {/* Address Information */}
                    <View className="space-y-4">
                        {/* Billing Address */}
                        <View className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <View className="bg-blue-50 px-4 py-3 border-l-4 border-blue-500 flex-row items-center">
                                <CreditCard size={18} color="#3b82f6" />
                                <Text className="ml-2 text-base font-semibold text-gray-800">Billing Address</Text>
                            </View>

                            <View className="p-4 divide-y divide-gray-100">
                                <View className="py-2 flex-row">
                                    <Text className="w-1/3 text-sm text-gray-500">City</Text>
                                    <Text className="w-2/3 text-sm font-medium text-gray-900">{customer.billingAddress?.city || "--"}</Text>
                                </View>

                                <View className="py-2 flex-row">
                                    <Text className="w-1/3 text-sm text-gray-500">State</Text>
                                    <Text className="w-2/3 text-sm font-medium text-gray-900">{customer.billingAddress?.state || "--"}</Text>
                                </View>

                                <View className="py-2 flex-row">
                                    <Text className="w-1/3 text-sm text-gray-500">Country</Text>
                                    <Text className="w-2/3 text-sm font-medium text-gray-900">{customer.billingAddress?.country || "--"}</Text>
                                </View>

                                <View className="py-2 flex-row">
                                    <Text className="w-1/3 text-sm text-gray-500">Zip Code</Text>
                                    <Text className="w-2/3 text-sm font-medium text-gray-900">{customer.billingAddress?.zipCode || "--"}</Text>
                                </View>

                                <View className="py-2 flex-row">
                                    <Text className="w-1/3 text-sm text-gray-500">Phone</Text>
                                    <Text className="w-2/3 text-sm font-medium text-gray-900">{customer.billingAddress?.phone || "--"}</Text>
                                </View>
                            </View>
                        </View>

                        {/* Shipping Address */}
                        <View className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <View className="bg-blue-50 px-4 py-3 border-l-4 border-blue-500 flex-row items-center">
                                <Truck size={18} color="#3b82f6" />
                                <Text className="ml-2 text-base font-semibold text-gray-800">Shipping Address</Text>
                            </View>

                            <View className="p-4 divide-y divide-gray-100">
                                <View className="py-2 flex-row">
                                    <Text className="w-1/3 text-sm text-gray-500">City</Text>
                                    <Text className="w-2/3 text-sm font-medium text-gray-900">{customer.shippingAddress?.city || "--"}</Text>
                                </View>

                                <View className="py-2 flex-row">
                                    <Text className="w-1/3 text-sm text-gray-500">State</Text>
                                    <Text className="w-2/3 text-sm font-medium text-gray-900">{customer.shippingAddress?.state || "--"}</Text>
                                </View>

                                <View className="py-2 flex-row">
                                    <Text className="w-1/3 text-sm text-gray-500">Country</Text>
                                    <Text className="w-2/3 text-sm font-medium text-gray-900">{customer.shippingAddress?.country || "--"}</Text>
                                </View>

                                <View className="py-2 flex-row">
                                    <Text className="w-1/3 text-sm text-gray-500">Zip Code</Text>
                                    <Text className="w-2/3 text-sm font-medium text-gray-900">{customer.shippingAddress?.zipCode || "--"}</Text>
                                </View>

                                <View className="py-2 flex-row">
                                    <Text className="w-1/3 text-sm text-gray-500">Phone</Text>
                                    <Text className="w-2/3 text-sm font-medium text-gray-900">{customer.shippingAddress?.phone || "--"}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Edit Button - Floating Action Button */}
            {/* <TouchableOpacity
                className="absolute bottom-6 right-6 w-14 h-14 bg-blue-600 rounded-full items-center justify-center shadow-lg"
            >
                <Edit2 size={24} color="#ffffff" />
            </TouchableOpacity> */}
        </View>
    );
};

export default CustomerDetails;