import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import { captureRef } from "react-native-view-shot";
import * as Print from "expo-print";
import { getAllPayments } from "../api/user/payment";
import { getOrgProfie } from "../api/admin/adminApi";
import { ArrowLeft } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";

export default function PaymentDetails({ route }) {
    const navigation = useNavigation()
    const { id } = route.params;
    const receiptRef = useRef();
    const [receiptData, setReceiptDatas] = useState({})
    const [orgDatas, setOrgDatas] = useState({})
    const [loading, setLoading] = useState(false)
    const paymentData = async () => {
        setLoading(true)
        try {
            const response = await getAllPayments();
            const adminResponse = await getOrgProfie();
            const data = response.payments.find((payment) => payment.id === id);
            setOrgDatas(adminResponse.organizationList[0])
            setReceiptDatas(data)
        } catch (error) {
            console.error("Error fetching payment:", error);
        }
        finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        paymentData();
    }, [id]);


    const generatePDF = async () => {
        const htmlContent = `
            <html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            padding: 40px;
            background-color: white;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: auto;
            background: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            border:1px solid #f8f8f8;
        }
        .header {
            text-align: center;
            padding-bottom: 15px;
            border-bottom: 2px solid #007bff;
        }
        .header h2 {
            margin: 0;
            color: #007bff;
            font-size: 22px;
        }
        .header p {
            margin: 5px 0;
            font-size: 14px;
            color: #555;
        }
        .section {
            padding: 15px 0;
            border-bottom: 1px solid #ddd;
        }
        .row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            font-size: 16px;
        }
        .row strong {
            color: #333;
        }
        .footer {
            text-align: center;
            font-size: 12px;
            color: #777;
            padding-top: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h2>${orgDatas.businessName}</h2>
            <p>${orgDatas.address}</p>
            <p>${orgDatas.city}, ${orgDatas.state}</p>
            <p>${orgDatas.country} - ${orgDatas.email}</p>
        </div>

        <!-- Receipt Details -->
        <div class="section">
            <div class="row"><strong>Receipt No:</strong> ${receiptData.paymentNumber}</div>
            <div class="row"><strong>Receipt Name:</strong> ${receiptData.customerName}</div>
            <div class="row"><strong>Date:</strong> ${receiptData.paymentDate}</div>
        </div>

        <!-- Payment Details -->
        <div class="section">
            <h3 style="text-align: center; color: #444;">Payment Details</h3>
            <div class="row"><strong>Payment Mode:</strong> ${receiptData.paymentMode}</div>
            <div class="row"><strong>Amount Received:</strong> ₹ ${receiptData.amountReceived}</div>
            <div class="row"><strong>Amount in Words:</strong> ${receiptData.amountInWords}</div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>This is a computer-generated receipt and does not require a physical signature.</p>
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

    // Function to download PDF
    const handleDownloadPDF = async () => {
        const pdfUri = await generatePDF();
        if (pdfUri) {
            Alert.alert("Success", `PDF saved at: ${pdfUri}`);
        }
    };

    // Function to share PDF
    const handleSharePDF = async () => {
        const pdfUri = await generatePDF();
        if (pdfUri) {
            await Sharing.shareAsync(pdfUri);
        }
    };

    return (
        <ScrollView className="flex-1 bg-white">
            <View className="px-5 py-4 bg-white shadow-sm">
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                        <TouchableOpacity
                            className="p-2 rounded-full bg-gray-50"
                            onPress={() => navigation.navigate('Payment')}
                        >
                            <ArrowLeft size={20} color="#3b82f6" />
                        </TouchableOpacity>
                        <Text className="ml-3 text-xl font-bold text-gray-800">Payment Receipt</Text>
                    </View>

                    <View className="flex-row space-x-2">
                        <TouchableOpacity
                            onPress={handleDownloadPDF}
                            className="p-2.5 rounded-full bg-blue-50"
                        >
                            <Ionicons name="download-outline" size={20} color="#3b82f6" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleSharePDF}
                            className="p-2.5 rounded-full bg-blue-50"
                        >
                            <Ionicons name="share-social-outline" size={20} color="#3b82f6" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Receipt Preview */}
            <View className="p-5">
                <View
                    ref={receiptRef}
                    className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden"
                >
                    {/* Company Details */}
                    <View className="p-5 border-b border-gray-100 bg-blue-50">
                        <Text className="text-2xl font-bold text-blue-600">{orgDatas.businessName}</Text>
                        <Text className="text-sm text-gray-600">{orgDatas.address}</Text>
                        <Text className="text-sm text-gray-600">{orgDatas.city}, {orgDatas.state}</Text>
                        <Text className="text-sm text-gray-600">{orgDatas.country} - {orgDatas.email}</Text>
                    </View>

                    {/* Receipt Info */}
                    <View className="p-5 border-b border-gray-100">
                        <View className="flex-row justify-between items-center mb-1.5">
                            <Text className="text-gray-500">Receipt No:</Text>
                            <Text className="font-medium text-gray-800">{receiptData.paymentNumber}</Text>
                        </View>
                        <View className="flex-row justify-between items-center mb-1.5">
                            <Text className="text-gray-500">Receipt Name:</Text>
                            <Text className="font-medium text-gray-800">{receiptData.customerName}</Text>
                        </View>
                        <View className="flex-row justify-between items-center">
                            <Text className="text-gray-500">Date:</Text>
                            <Text className="font-medium text-gray-800">{receiptData.paymentDate}</Text>
                        </View>
                    </View>

                    {/* Payment Details */}
                    <View className="p-5">
                        <Text className="text-lg font-bold text-center mb-4 text-gray-800">Payment Details</Text>

                        <View className="bg-gray-50 rounded-lg overflow-hidden">
                            <View className="p-4 border-b border-gray-100">
                                <View className="flex-row justify-between items-center">
                                    <Text className="text-gray-500">Payment Mode:</Text>
                                    <Text className="font-medium text-gray-800">{receiptData.paymentMode}</Text>
                                </View>
                            </View>

                            <View className="p-4 border-b border-gray-100">
                                <View className="flex-row justify-between items-center">
                                    <Text className="text-gray-500">Amount Received:</Text>
                                    <Text className="font-medium text-blue-600">₹ {receiptData.amountReceived}</Text>
                                </View>
                            </View>

                            <View className="p-4">
                                <View className="flex-row justify-between items-center">
                                    <Text className="text-gray-500">Amount in words:</Text>
                                    <Text className="font-medium text-gray-800 text-right flex-1 ml-2">
                                        {receiptData.amountInWords ? receiptData.amountInWords : "--"}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Footer Note */}
                    <View className="p-5 bg-gray-50 border-t border-gray-100">
                        <Text className="text-center text-gray-400 text-xs">
                            This is a computer-generated receipt and does not require a physical signature.
                        </Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}