import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { ArrowLeft, Download, Share2 } from 'react-native-feather';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
import * as MediaLibrary from 'expo-media-library';

const invoiceData = {
    company: {
        name: 'NIGUS',
        address: 'No-8, 20th Main Road, Koramangala, Block-5th',
        city: 'Bangalore',
        state: 'Karnataka',
        country: 'India',
        email: 'admin@taxcompany.com',
        taxId: '29AADCN7222P1ZX'
    },
    invoice: {
        number: 'INV/2025/00002',
        date: '28 Feb 2025',
        dueDate: '28 Feb 2025',
    },
    customer: {
        name: 'Ganesh Popup',
        address: 'No-4, Ganesh Street, Bejavada, AP',
        city: 'Bejavada',
        state: 'AP',
        country: 'India',
    },
    items: [
        { id: 1, description: 'Product 1', quantity: 2, price: 100, tax: 18, total: 236 },
        { id: 2, description: 'Product 2', quantity: 1, price: 200, tax: 18, total: 236 },
    ],
    subtotal: 400,
    taxTotal: 72,
    total: 472
};

const InvoiceTemp = () => {
    const [loading, setLoading] = useState(false);

    const generateHTML = () => {
        return `
    <html>
      <head></head>
      <body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f9f9f9;">
        <div style="width: 800px; margin: 0 auto; background: #ffffff; padding: 20px; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid #ddd;">
            <div style="font-size: 28px; font-weight: bold; color: #333333;">TAX INVOICE</div>
            <div style="text-align: right; font-size: 14px; color: #555555;">
              <div>${invoiceData.company.name}</div>
              <div>${invoiceData.company.address}</div>
              <div>${invoiceData.company.city}, ${invoiceData.company.state}</div>
              <div>${invoiceData.company.country}</div>
              <div>${invoiceData.company.email}</div>
              <div>GSTIN: ${invoiceData.company.taxId}</div>
            </div>
          </div>
          
          <div style="background-color: #f0f0f0; padding: 10px; margin-bottom: 20px;">
            <div>Invoice Number: ${invoiceData.invoice.number}</div>
            <div>Invoice Date: ${invoiceData.invoice.date}</div>
            <div>Due Date: ${invoiceData.invoice.dueDate}</div>
          </div>
          
          <div>
            <h3>Bill To</h3>
            <div>${invoiceData.customer.name}</div>
            <div>${invoiceData.customer.address}</div>
            <div>${invoiceData.customer.city}, ${invoiceData.customer.state}</div>
            <div>${invoiceData.customer.country}</div>
          </div>
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr>
                <th style="background-color: #f0f0f0; text-align: left; padding: 10px; font-weight: bold; border-bottom: 2px solid #ddd;">Item</th>
                <th style="background-color: #f0f0f0; text-align: left; padding: 10px; font-weight: bold; border-bottom: 2px solid #ddd;">Description</th>
                <th style="background-color: #f0f0f0; text-align: left; padding: 10px; font-weight: bold; border-bottom: 2px solid #ddd;">Quantity</th>
                <th style="background-color: #f0f0f0; text-align: left; padding: 10px; font-weight: bold; border-bottom: 2px solid #ddd;">Price</th>
                <th style="background-color: #f0f0f0; text-align: left; padding: 10px; font-weight: bold; border-bottom: 2px solid #ddd;">Tax (%)</th>
                <th style="background-color: #f0f0f0; text-align: left; padding: 10px; font-weight: bold; border-bottom: 2px solid #ddd;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${invoiceData.items
                .map(
                    (item) => `
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.id}</td>
                  <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.description}</td>
                  <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.quantity}</td>
                  <td style="padding: 10px; border-bottom: 1px solid #ddd;">₹${item.price.toFixed(2)}</td>
                  <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.tax}%</td>
                  <td style="padding: 10px; border-bottom: 1px solid #ddd;">₹${item.total.toFixed(2)}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
          
          <div style="text-align: right; margin-top: 20px;">
            <div style="margin-bottom: 5px; font-size: 16px;">Subtotal: ₹${invoiceData.subtotal.toFixed(2)}</div>
            <div style="margin-bottom: 5px; font-size: 16px;">Tax: ₹${invoiceData.taxTotal.toFixed(2)}</div>
            <div style="font-size: 20px; color: #333333;"><strong>Total: ₹${invoiceData.total.toFixed(2)}</strong></div>
          </div>
        </div>
      </body>
    </html>
  `;
    };



    const requestStoragePermission = async () => {
        if (Platform.OS !== 'android') return true; // No need for iOS

        try {
            const { status } = await MediaLibrary.requestPermissionsAsync();

            if (status === 'granted') {
                console.log("✅ Storage permission granted!");
                return true;
            } else {
                Alert.alert('Permission Required', 'Please enable storage permissions in settings.');
                return false;
            }
        } catch (error) {
            console.error("❌ Error requesting storage permission:", error);
            return false;
        }
    };

    const generatePDF = async () => {
        try {
            setLoading(true);
            console.log("📄 Generating PDF...");

            // Generate PDF
            const { uri } = await Print.printToFileAsync({
                html: generateHTML(),
                base64: false,
            });

            console.log("✅ PDF Generated at:", uri);

            if (Platform.OS === 'android') {
                console.log("📂 Attempting to move file to Downloads...");

                // ✅ Directly move to the Downloads folder
                const downloadsFolder = FileSystem.documentDirectory.replace('files/', 'downloads/'); // ✅ Get actual Downloads folder
                const newFilePath = downloadsFolder + "invoice.pdf";

                await FileSystem.moveAsync({
                    from: uri,
                    to: newFilePath,
                });

                console.log("✅ PDF saved to:", newFilePath);
                Alert.alert('Success', 'PDF saved to Downloads folder');

                setLoading(false);
                return newFilePath;
            }

            setLoading(false);
            return uri;
        } catch (error) {
            setLoading(false);
            Alert.alert('Error', 'Failed to generate PDF');
            console.error("❌ PDF Generation Error:", error);
            return null;
        }
    };

    const sharePDF = async () => {
        try {
            setLoading(true);
            console.log("📤 Preparing to share PDF...");

            const filePath = await generatePDF();
            if (filePath && (await Sharing.isAvailableAsync())) {
                await Sharing.shareAsync(filePath);
                console.log("✅ PDF shared successfully.");
            } else {
                Alert.alert('Error', 'Sharing is not available on this device');
            }

            setLoading(false);
        } catch (error) {
            setLoading(false);
            Alert.alert('Error', 'Failed to share PDF');
            console.error("❌ PDF Sharing Error:", error);
        }
    };

    return (
        <View className="flex-1 bg-white">
            <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
                <TouchableOpacity className="p-2">
                    <ArrowLeft stroke="skyblue" width={24} height={24} />
                </TouchableOpacity>
                <Text className="text-lg font-bold">Invoice</Text>
                <View className="flex-row">
                    <TouchableOpacity className="p-2 mr-2" onPress={generatePDF}>
                        <Download stroke="#000" width={24} height={24} />
                    </TouchableOpacity>
                    <TouchableOpacity className="p-2" onPress={sharePDF}>
                        <Share2 stroke="#000" width={24} height={24} />
                    </TouchableOpacity>
                </View>
            </View>

            {loading ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#0000ff" />
                    <Text className="mt-2">Processing...</Text>
                </View>
            ) : (
                <ScrollView className="flex-1  bg-gray-100 ">
                    <View className="flex-1 mb-10 m-3 p-2 rounded-md bg-white">
                        {/* Header Section */}
                        <View className="flex-row justify-between items-center mb-8">
                            <Text className="text-2xl font-bold text-gray-800 w-1/2">TAX INVOICE</Text>
                            <View className="items-end w-1/2 p-1">
                                <Text className="text-xl font-semibold text-gray-900">{invoiceData.company.name}</Text>
                                <Text className="text-gray-600 text-right">{invoiceData.company.address}</Text>
                                <Text className="text-gray-600 text-right">{invoiceData.company.city}, {invoiceData.company.state}</Text>
                                <Text className="text-gray-600 text-right">{invoiceData.company.country}</Text>
                                <Text className="text-gray-600 text-right">{invoiceData.company.email}</Text>
                                <Text className="text-gray-600 text-right">GSTIN: {invoiceData.company.taxId}</Text>
                            </View>
                        </View>

                        {/* Invoice Details */}
                        <View className="bg-white  rounded-lg shadow-md mb-6">
                            <View className="bg-gray-300  p-1">
                                <Text className="font-bold text-gray-800">Invoice Number: <Text className="font-medium text-gray-600">{invoiceData.invoice.number}</Text></Text>

                            </View>
                            <View className="p-1 flex-row gap-2">
                                <View className="w-1/2">
                                    <Text className="font-bold text-gray-800 text-[13px]">Invoice Date: <Text className="font-medium text-gray-600">{invoiceData.invoice.date}</Text></Text>
                                    <Text className="font-bold text-gray-800 text-[13px]">Terms of Delivery: <Text className="font-medium text-gray-600">30Days</Text></Text>
                                </View>
                                <View className="w-1/2">
                                    <Text className="font-bold text-gray-800 text-[13px]">Due Date: <Text className="font-medium text-gray-600">{invoiceData.invoice.dueDate}</Text></Text>
                                    <Text className="font-bold text-gray-800 text-[13px]">Place Of Supply: <Text className="font-medium text-gray-600">Belagavi</Text></Text>
                                </View>
                            </View>
                        </View>

                        {/* Customer Details */}
                        <View className="bg-white p-1 rounded-lg mb-6 flex-row  ">
                            <View className="w-1/2 border border-gray-200 rounded-md ">
                                <Text className="font-bold text-gray-900 mb-1 p-1 bg-gray-200">Bill To</Text>
                                <Text className="text-blue-600 px-1 font-medium text-lg">{invoiceData.customer.name}</Text>
                                <Text className="text-gray-600 px-1">{invoiceData.customer.address}</Text>
                                <Text className="text-gray-600 px-1">{invoiceData.customer.city}, {invoiceData.customer.state}</Text>
                                <Text className="text-gray-600 px-1">{invoiceData.customer.country}</Text>
                            </View>
                            <View className="w-1/2 ml-2 border border-gray-200 rounded-md ">
                                <Text className="font-bold text-gray-900 mb-1 p-1 bg-gray-200">Ship To</Text>
                                <Text className="text-gray-600 px-1">{invoiceData.customer.address}</Text>
                                <Text className="text-gray-600 px-1">{invoiceData.customer.city}, {invoiceData.customer.state}</Text>
                                <Text className="text-gray-600 px-1">{invoiceData.customer.country}</Text>
                            </View>

                        </View>

                        {/* Items Table */}
                        <View className="bg-white rounded-sm border border-gray-200 shadow-md overflow-hidden ">

                            {/* Table Header */}
                            <View className="flex-row bg-gray-200 p-3 border-b border-gray-300">
                                <Text className="flex-1 font-bold text-gray-800 text-[13px]">Item</Text>
                                <Text className="flex-2 font-bold text-gray-800 text-[13px]">Description</Text>
                                <Text className="flex-1 font-bold text-center text-gray-800 text-[13px]">Qty</Text>
                                <Text className="flex-1 font-bold text-center text-gray-800 text-[13px]">Price</Text>
                                <Text className="flex-1 font-bold text-center text-gray-800 text-[13px]">Tax</Text>
                                <Text className="flex-1 font-bold text-center text-gray-800 text-[13px]">Total</Text>
                            </View>

                            {/* Items List */}
                            {invoiceData.items.map((item, index) => (
                                <View key={item.id} className={`flex-row py-3 px-1 ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}>
                                    <Text className="flex-1  text-gray-700 text-[13px]">{item.id}</Text>
                                    <Text className="flex-2 text-gray-700 text-[13px]">{item.description}</Text>
                                    <Text className="flex-1 text-center text-gray-700 text-[13px]">{item.quantity}</Text>
                                    <Text className="flex-1 text-right text-gray-700 text-[13px]">₹{item.price.toFixed(2)}</Text>
                                    <Text className="flex-1 text-center text-gray-700 text-[13px]">{item.tax}%</Text>
                                    <Text className="flex-1 text-right text-gray-900 font-medium text-[13px]">₹{item.total.toFixed(2)}</Text>
                                </View>
                            ))}
                        </View>

                        {/* Summary Section */}
                        <View className="bg-white p-4 rounded-lg mt-6 ">
                            <View className="flex-row justify-between mb-2">
                                <Text className="font-medium text-gray-800">Subtotal:</Text>
                                <Text className="text-gray-800">₹{invoiceData.subtotal.toFixed(2)}</Text>
                            </View>
                            <View className="flex-row justify-between mb-2">
                                <Text className="font-medium text-gray-800">Tax:</Text>
                                <Text className="text-gray-800">₹{invoiceData.taxTotal.toFixed(2)}</Text>
                            </View>
                            <View className="flex-row justify-between mt-3 pt-3 border-t border-gray-300">
                                <Text className="font-bold text-xl text-gray-900">Total:</Text>
                                <Text className="font-bold text-xl text-green-600">₹{invoiceData.total.toFixed(2)}</Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            )}
        </View>
    );
};

export default InvoiceTemp;
