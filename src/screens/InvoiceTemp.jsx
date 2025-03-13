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

    const generatePDF = async () => {
        const htmlContent = `
    <html>
      <head>
        <style>
          body {
            font-family: 'Helvetica', Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f9f9f9;
            color: #333;
          }
          .container {
            width: 800px;
            margin: 0 auto;
            background: #ffffff;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          }
          .header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #3b82f6;
          }
          .invoice-title {
            font-size: 32px;
            font-weight: bold;
            color: #3b82f6;
            letter-spacing: 1px;
          }
          .company-info {
            text-align: right;
            font-size: 14px;
            color: #555;
            line-height: 1.5;
          }
          .company-name {
            font-size: 18px;
            font-weight: bold;
            color: #333;
            margin-bottom: 5px;
          }
          .invoice-details {
            background-color: #f0f7ff;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 25px;
            border-left: 4px solid #3b82f6;
          }
          .invoice-details div {
            margin-bottom: 5px;
            font-size: 14px;
          }
          .invoice-details strong {
            font-weight: 600;
            margin-right: 5px;
          }
          .customer-section {
            display: flex;
            gap: 20px;
            margin-bottom: 30px;
          }
          .bill-to, .ship-to {
            flex: 1;
            padding: 15px;
            background-color: #f9f9f9;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
          }
          .section-title {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 10px;
            color: #3b82f6;
            padding-bottom: 5px;
            border-bottom: 1px solid #e5e7eb;
          }
          .customer-name {
            font-size: 16px;
            font-weight: 600;
            color: #3b82f6;
            margin-bottom: 5px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
          }
          thead th {
            background-color: #3b82f6;
            color: white;
            text-align: left;
            padding: 12px;
            font-weight: 600;
            font-size: 14px;
          }
          tbody tr:nth-child(even) {
            background-color: #f8fafc;
          }
          tbody tr:hover {
            background-color: #f0f7ff;
          }
          tbody td {
            padding: 12px;
            border-bottom: 1px solid #e5e7eb;
            font-size: 14px;
          }
          .summary {
            margin-left: auto;
            width: 300px;
            margin-top: 20px;
          }
          .summary-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            font-size: 14px;
          }
          .summary-row.total {
            font-size: 18px;
            font-weight: bold;
            color: #3b82f6;
            border-top: 2px solid #e5e7eb;
            padding-top: 10px;
            margin-top: 5px;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            font-size: 12px;
            color: #6b7280;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="invoice-title">TAX INVOICE</div>
            <div class="company-info">
              <div class="company-name">${invoiceData.company.name}</div>
              <div>${invoiceData.company.address}</div>
              <div>${invoiceData.company.city}, ${invoiceData.company.state}</div>
              <div>${invoiceData.company.country}</div>
              <div>${invoiceData.company.email}</div>
              <div><strong>GSTIN:</strong> ${invoiceData.company.taxId}</div>
            </div>
          </div>
          
          <div class="invoice-details">
            <div><strong>Invoice Number:</strong> ${invoiceData.invoice.number}</div>
            <div><strong>Invoice Date:</strong> ${invoiceData.invoice.date}</div>
            <div><strong>Due Date:</strong> ${invoiceData.invoice.dueDate}</div>
            <div><strong>Terms of Delivery:</strong> 30 Days</div>
            <div><strong>Place of Supply:</strong> Belagavi</div>
          </div>
          
          <div class="customer-section">
            <div class="bill-to">
              <div class="section-title">Bill To</div>
              <div class="customer-name">${invoiceData.customer.name}</div>
              <div>${invoiceData.customer.address}</div>
              <div>${invoiceData.customer.city}, ${invoiceData.customer.state}</div>
              <div>${invoiceData.customer.country}</div>
            </div>
            
            <div class="ship-to">
              <div class="section-title">Ship To</div>
              <div>${invoiceData.customer.address}</div>
              <div>${invoiceData.customer.city}, ${invoiceData.customer.state}</div>
              <div>${invoiceData.customer.country}</div>
            </div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Description</th>
                <th style="text-align: center;">Quantity</th>
                <th style="text-align: right;">Price</th>
                <th style="text-align: center;">Tax (%)</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${invoiceData.items
                .map(
                    (item) => `
                <tr>
                  <td>${item.id}</td>
                  <td>${item.description}</td>
                  <td style="text-align: center;">${item.quantity}</td>
                  <td style="text-align: right;">₹${item.price.toFixed(2)}</td>
                  <td style="text-align: center;">${item.tax}%</td>
                  <td style="text-align: right;">₹${item.total.toFixed(2)}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
          
          <div class="summary">
            <div class="summary-row">
              <div>Subtotal:</div>
              <div>₹${invoiceData.subtotal.toFixed(2)}</div>
            </div>
            <div class="summary-row">
              <div>Tax:</div>
              <div>₹${invoiceData.taxTotal.toFixed(2)}</div>
            </div>
            <div class="summary-row total">
              <div>Total:</div>
              <div>₹${invoiceData.total.toFixed(2)}</div>
            </div>
          </div>
          
          <div class="footer">
            <p>Thank you for your business! This is a computer-generated invoice and does not require a signature.</p>
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
        }
    };



    const handleDownloadPDF = async () => {
        const pdfUri = await generatePDF();
        if (pdfUri) {
            Alert.alert("Success", `PDF saved at: ${pdfUri}`);
        }
    };

    // Share PDF
    const handleSharePDF = async () => {
        const pdfUri = await generatePDF();
        if (pdfUri) {
            await Sharing.shareAsync(pdfUri);
        }
    };

    return (
        <View className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="bg-white px-4 py-4 shadow-sm">
                <View className="flex-row justify-between items-center">
                    <TouchableOpacity className="p-2 rounded-full bg-blue-50">
                        <ArrowLeft stroke="#3b82f6" width={22} height={22} />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold text-gray-800">Invoice</Text>
                    <View className="flex-row space-x-3">
                        <TouchableOpacity
                            className="p-2.5 rounded-full bg-blue-50"
                            onPress={handleDownloadPDF}
                        >
                            <Download stroke="#3b82f6" width={20} height={20} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="p-2.5 rounded-full bg-blue-50"
                            onPress={handleSharePDF}
                        >
                            <Share2 stroke="#3b82f6" width={20} height={20} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {loading ? (
                <View className="flex-1 justify-center items-center bg-white">
                    <ActivityIndicator size="large" color="#3b82f6" />
                    <Text className="mt-4 text-gray-600">Generating invoice PDF...</Text>
                </View>
            ) : (
                <ScrollView className="flex-1">
                    <View className="m-4 mb-10 bg-white rounded-xl shadow-sm overflow-hidden">
                        {/* Header Section */}
                        <View className="p-5 border-b border-gray-100 ">
                            <View className="flex-row justify-between items-center w-full">
                                <Text className="text-3xl font-bold text-blue-600 w-1/2">TAX INVOICE</Text>
                                <View className="w-1/2">
                                    <Text className="text-lg font-semibold text-gray-800 text-right">{invoiceData.company.name}</Text>
                                    <Text className="text-gray-500 text-sm text-right">{invoiceData.company.address}</Text>
                                    <Text className="text-gray-500 text-sm text-right">{invoiceData.company.city}, {invoiceData.company.state}</Text>
                                    <Text className="text-gray-500 text-sm text-right">{invoiceData.company.country}</Text>
                                    <Text className="text-gray-500 text-sm text-right">{invoiceData.company.email}</Text>
                                    <Text className="text-gray-500 text-sm text-right mt-1">
                                        <Text className="font-medium"></Text> {invoiceData.company.taxId}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Invoice Details */}
                        <View className="bg-blue-50 p-4 border-l-4 border-blue-500">
                            <View className="flex-row flex-wrap">
                                <View className="w-1/2 mb-2">
                                    <Text className="text-gray-600 text-xs">Invoice Number</Text>
                                    <Text className="font-medium text-gray-800">{invoiceData.invoice.number}</Text>
                                </View>
                                <View className="w-1/2 mb-2">
                                    <Text className="text-gray-600 text-xs">Invoice Date</Text>
                                    <Text className="font-medium text-gray-800">{invoiceData.invoice.date}</Text>
                                </View>
                                <View className="w-1/2 mb-2">
                                    <Text className="text-gray-600 text-xs">Due Date</Text>
                                    <Text className="font-medium text-gray-800">{invoiceData.invoice.dueDate}</Text>
                                </View>
                                <View className="w-1/2 mb-2">
                                    <Text className="text-gray-600 text-xs">Terms of Delivery</Text>
                                    <Text className="font-medium text-gray-800">30 Days</Text>
                                </View>
                                <View className="w-1/2">
                                    <Text className="text-gray-600 text-xs">Place of Supply</Text>
                                    <Text className="font-medium text-gray-800">Belagavi</Text>
                                </View>
                            </View>
                        </View>

                        {/* Customer Details */}
                        <View className="p-4 flex-row space-x-4">
                            <View className="flex-1 bg-gray-50 rounded-lg p-3 border border-gray-100">
                                <Text className="font-bold text-blue-600 text-sm mb-2">Bill To</Text>
                                <Text className="text-gray-800 font-semibold text-base">{invoiceData.customer.name}</Text>
                                <Text className="text-gray-600 text-sm mt-1">{invoiceData.customer.address}</Text>
                                <Text className="text-gray-600 text-sm">{invoiceData.customer.city}, {invoiceData.customer.state}</Text>
                                <Text className="text-gray-600 text-sm">{invoiceData.customer.country}</Text>
                            </View>
                            <View className="flex-1 bg-gray-50 rounded-lg p-3 border border-gray-100">
                                <Text className="font-bold text-blue-600 text-sm mb-2">Ship To</Text>
                                <Text className="text-gray-600 text-sm mt-1">{invoiceData.customer.address}</Text>
                                <Text className="text-gray-600 text-sm">{invoiceData.customer.city}, {invoiceData.customer.state}</Text>
                                <Text className="text-gray-600 text-sm">{invoiceData.customer.country}</Text>
                            </View>
                        </View>

                        {/* Items Table */}
                        <View className="px-4 pb-4">
                            <View className="rounded-lg overflow-hidden border border-gray-200">
                                {/* Table Header */}
                                <View className="flex-row bg-blue-600 py-3 px-4">
                                    <Text className="flex-1 font-medium text-white text-xs">Item</Text>
                                    <Text className="flex-2 font-medium text-white text-xs">Description</Text>
                                    <Text className="flex-1 font-medium text-center text-white text-xs">Qty</Text>
                                    <Text className="flex-1 font-medium text-right text-white text-xs">Price</Text>
                                    <Text className="flex-1 font-medium text-center text-white text-xs">Tax</Text>
                                    <Text className="flex-1 font-medium text-right text-white text-xs">Total</Text>
                                </View>

                                {/* Items List */}
                                {invoiceData.items.map((item, index) => (
                                    <View
                                        key={item.id}
                                        className={`flex-row py-3 px-4 border-b border-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                                            }`}
                                    >
                                        <Text className="flex-1 text-gray-700 text-xs">{item.id}</Text>
                                        <Text className="flex-2 text-gray-700 text-xs">{item.description}</Text>
                                        <Text className="flex-1 text-center text-gray-700 text-xs">{item.quantity}</Text>
                                        <Text className="flex-1 text-right text-gray-700 text-xs">₹{item.price.toFixed(2)}</Text>
                                        <Text className="flex-1 text-center text-gray-700 text-xs">{item.tax}%</Text>
                                        <Text className="flex-1 text-right text-gray-800 font-medium text-xs">₹{item.total.toFixed(2)}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                        {/* Summary Section */}
                        <View className="px-4 pb-6">
                            <View className="ml-auto w-1/2 mt-4">
                                <View className="flex-row justify-between py-2">
                                    <Text className="text-gray-600">Subtotal:</Text>
                                    <Text className="text-gray-800">₹{invoiceData.subtotal.toFixed(2)}</Text>
                                </View>
                                <View className="flex-row justify-between py-2">
                                    <Text className="text-gray-600">Tax:</Text>
                                    <Text className="text-gray-800">₹{invoiceData.taxTotal.toFixed(2)}</Text>
                                </View>
                                <View className="flex-row justify-between py-3 mt-2 border-t border-gray-200">
                                    <Text className="font-bold text-gray-800 text-lg">Total:</Text>
                                    <Text className="font-bold text-blue-600 text-lg">₹{invoiceData.total.toFixed(2)}</Text>
                                </View>
                            </View>
                        </View>

                        {/* Footer */}
                        <View className="p-4 bg-gray-50 border-t border-gray-100">
                            <Text className="text-center text-gray-500 text-xs">
                                Thank you for your business! This is a computer-generated invoice and does not require a signature.
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            )}
        </View>
    );
};

export default InvoiceTemp;