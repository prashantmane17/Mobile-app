import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Sharing from "expo-sharing";
import * as Print from "expo-print";
import { ArrowLeft } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { getAllItems } from "../api/user/items";

export default function ItemDetails({ route }) {
    const navigation = useNavigation();
    const { id } = route.params;
    const [itemData, setItemData] = useState({});
    const [loading, setLoading] = useState(false);

    // Fetch item details
    const fetchItemData = async () => {
        setLoading(true);
        try {
            const response = await getAllItems();
            const data = response.items.find((item) => item.id === id);
            setItemData(data);
        } catch (error) {
            console.error("Error fetching item:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItemData();
    }, [id]);

    // Generate PDF
    const generatePDF = async () => {
        const htmlContent = `
            <html>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
                <style>
                    body {
                        font-family: 'Helvetica', Arial, sans-serif;
                        padding: 0;
                        margin: 0;
                        background-color: #f9fafb;
                    }
                    .container {
                        width: 100%;
                        max-width: 800px;
                        margin: 0 auto;
                        padding: 40px 20px;
                    }
                    .card {
                        background: white;
                        border-radius: 12px;
                        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                        overflow: hidden;
                        margin-bottom: 30px;
                    }
                    .header {
                        background: #f8fafc;
                        padding: 25px 30px;
                        border-bottom: 1px solid #e2e8f0;
                    }
                    .header h1 {
                        margin: 0;
                        color: #1e293b;
                        font-size: 24px;
                        font-weight: 700;
                    }
                    .content {
                        padding: 30px;
                    }
                    .detail-row {
                        display: flex;
                        border-bottom: 1px solid #f1f5f9;
                        padding: 16px 0;
                    }
                    .detail-row:last-child {
                        border-bottom: none;
                    }
                    .detail-label {
                        flex: 1;
                        color: #64748b;
                        font-size: 16px;
                        font-weight: 500;
                    }
                    .detail-value {
                        flex: 1;
                        color: #0f172a;
                        font-size: 16px;
                        font-weight: 400;
                        text-align: right;
                    }
                    .tax-section {
                        margin-top: 30px;
                    }
                    .tax-section h2 {
                        color: #334155;
                        font-size: 18px;
                        margin-bottom: 20px;
                        font-weight: 600;
                    }
                    .tax-cards {
                        display: flex;
                        gap: 20px;
                    }
                    .tax-card {
                        flex: 1;
                        background: #f8fafc;
                        border-radius: 8px;
                        padding: 20px;
                        border: 1px solid #e2e8f0;
                    }
                    .tax-label {
                        color: #64748b;
                        font-size: 14px;
                        margin-bottom: 8px;
                    }
                    .tax-value {
                        color: #0f172a;
                        font-size: 24px;
                        font-weight: 600;
                    }
                    .footer {
                        text-align: center;
                        padding: 20px;
                        color: #94a3b8;
                        font-size: 12px;
                        border-top: 1px solid #e2e8f0;
                    }
                    .badge {
                        display: inline-block;
                        background: #e0f2fe;
                        color: #0369a1;
                        padding: 4px 12px;
                        border-radius: 9999px;
                        font-size: 14px;
                        font-weight: 500;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="card">
                        <div class="header">
                            <h1>Item Details</h1>
                        </div>
                        <div class="content">
                            <div class="detail-row">
                                <div class="detail-label">Item Name</div>
                                <div class="detail-value">${itemData.itemName || '-'}</div>
                            </div>
                            <div class="detail-row">
                                <div class="detail-label">Item Code</div>
                                <div class="detail-value">${itemData.itemCode || '-'}</div>
                            </div>
                            <div class="detail-row">
                                <div class="detail-label">HSN Code</div>
                                <div class="detail-value">${itemData.itemHsn || '-'}</div>
                            </div>
                            <div class="detail-row">
                                <div class="detail-label">Purchase Price</div>
                                <div class="detail-value">₹ ${itemData.purchasePrice || '-'}</div>
                            </div>
                            <div class="detail-row">
                                <div class="detail-label">Tax Preference</div>
                                <div class="detail-value">
                                    <span class="badge">${itemData.taxPreference || '-'}</span>
                                </div>
                            </div>
                            
                            <div class="tax-section">
                                <h2>Tax Information</h2>
                                <div class="tax-cards">
                                    <div class="tax-card">
                                        <div class="tax-label">Intra State Tax</div>
                                        <div class="tax-value">${itemData.intraStateTax || '0'}%</div>
                                    </div>
                                    <div class="tax-card">
                                        <div class="tax-label">Inter State Tax</div>
                                        <div class="tax-value">${itemData.interStateTax || '0'}%</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="footer">
                            <p>This is a computer generated document and does not require a physical signature.</p>
                            <p>Generated on ${new Date().toLocaleDateString()}</p>
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
        }
    };

    // Download PDF
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

    // Reusable detail row component
    const DetailRow = ({ label, value, isLast = false }) => (
        <View className={`flex-row justify-between py-3 ${!isLast ? 'border-b border-gray-100' : ''}`}>
            <Text className="text-gray-500 font-medium">{label}</Text>
            <Text className="text-gray-800 font-normal">{value || '-'}</Text>
        </View>
    );

    return (
        <ScrollView className="flex-1 bg-gray-50">
            {/* Header with back button */}
            <View className="bg-white px-4 py-4 flex-row items-center justify-between border-b border-gray-100">
                <View className="flex-row items-center">
                    <TouchableOpacity
                        className="mr-3 p-2 rounded-full bg-gray-50"
                        onPress={() => navigation.navigate('ItemScreen')}
                    >
                        <ArrowLeft size={20} color="#3b82f6" />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold text-gray-800">Item Details</Text>
                </View>

                {/* Action buttons */}
                <View className="flex-row space-x-2">
                    <TouchableOpacity
                        onPress={handleDownloadPDF}
                        className="p-2 rounded-full bg-gray-100"
                    >
                        <Ionicons name="download-outline" size={20} color="#3b82f6" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleSharePDF}
                        className="p-2 rounded-full bg-gray-100"
                    >
                        <Ionicons name="share-social-outline" size={20} color="#3b82f6" />
                    </TouchableOpacity>
                </View>
            </View>

            {loading ? (
                <View className="flex-1 justify-center items-center p-10">
                    <ActivityIndicator size="large" color="#3b82f6" />
                    <Text className="mt-4 text-gray-500">Loading item details...</Text>
                </View>
            ) : (
                <View className="p-4">
                    {/* Item details card */}
                    <View className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
                        <View className="p-4 bg-blue-50 border-b border-blue-100">
                            <Text className="text-xl font-bold text-gray-800">{itemData.itemName || 'Item Details'}</Text>
                        </View>

                        <View className="p-4">
                            <DetailRow label="Item Code" value={itemData.itemCode} />
                            <DetailRow label="HSN Code" value={itemData.itemHsn} />
                            <DetailRow label="Selling Price" value={`₹ ${itemData.sellingPrice ? itemData.sellingPrice : "--"}`} />
                            <DetailRow label="Purchase Price" value={`₹ ${itemData.purchasePrice ? itemData.purchasePrice : "--"}`} />
                            <DetailRow
                                label="Tax Preference"
                                value={
                                    <View className="bg-blue-50 px-3 py-1 rounded-full">
                                        <Text className="text-blue-600 text-sm">{itemData.taxPreference}</Text>
                                    </View>
                                }
                            />
                        </View>
                    </View>

                    {/* Tax information section */}
                    <Text className="text-lg font-bold text-gray-800 mb-3 px-1">Tax Information</Text>
                    <View className="flex-row space-x-4 mb-6">
                        <View className="flex-1 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                            <Text className="text-gray-500 text-sm mb-1">Intra State Tax</Text>
                            <Text className="text-2xl font-bold text-gray-800">{itemData.intraStateTax || '0'}%</Text>
                        </View>
                        <View className="flex-1 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                            <Text className="text-gray-500 text-sm mb-1">Inter State Tax</Text>
                            <Text className="text-2xl font-bold text-gray-800">{itemData.interStateTax || '0'}%</Text>
                        </View>
                    </View>

                    {/* Additional information or actions can be added here */}
                    <View className="bg-blue-50 p-4 rounded-xl mb-6 flex-row items-center">
                        <Ionicons name="information-circle-outline" size={24} color="#3b82f6" className="mr-3" />
                        <Text className="text-blue-800 flex-1">
                            You can download or share this item's details as a PDF using the buttons above.
                        </Text>
                    </View>
                </View>
            )}
        </ScrollView>
    );
}