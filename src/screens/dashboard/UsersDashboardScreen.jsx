import React, { useEffect } from 'react';
import { View, Text, ScrollView, SafeAreaView, Platform, StatusBar, Dimensions } from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { getAllInvoices } from '../../api/user/invoice';

// Metric Card Component
function MetricCard({ title, value, icon, iconColor, iconBgColor }) {
    return (
        <View className="bg-white rounded-xl p-4 shadow-sm flex-1 mx-2">
            <View className="flex-row justify-between items-start">
                <View>
                    <Text className="text-gray-600 text-sm mb-1">{title}</Text>
                    <Text className="text-2xl font-bold">₹{value}</Text>
                </View>
                <View className={`w-10 h-10 rounded-full items-center justify-center ${iconBgColor}`}>
                    {icon}
                </View>
            </View>
        </View>
    );
}

// Dashboard Screen Component
export default function UsersDashboardScreen() {
    const screenWidth = Dimensions.get('window').width;
    const allInvoiceData = async () => {
        const response = await getAllInvoices();
    }
    useEffect(() => {
        allInvoiceData();
    }, [])

    const revenueData = {
        labels: ["Jans", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [{
            data: [4500, 5200, 4800, 5900, 6400, 7200]
        }]
    };

    // Invoice status data for pie chart
    const invoiceData = [
        {
            name: "Paid",
            amount: 19327.89,
            color: "#22c55e",
            legendFontColor: "#7F7F7F",
        },
        {
            name: "Outstanding",
            amount: 5240.00,
            color: "#eab308",
            legendFontColor: "#7F7F7F",
        },
        {
            name: "Overdue",
            amount: 2500.00,
            color: "#ef4444",
            legendFontColor: "#7F7F7F",
        }
    ];

    return (
        <SafeAreaView className="flex-1 bg-gray-100" style={{
            paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
        }}>
            <ScrollView className="flex-1">
                {/* Metrics Section */}
                <View className="flex-row px-2 py-4">
                    <MetricCard
                        title="Total Revenue"
                        value="24,567.89"
                        icon={<FontAwesome name="dollar" size={24} color="#4F46E5" />}
                        iconBgColor="bg-indigo-100"
                    />
                </View>

                <View className="flex-row px-2 py-2">
                    <MetricCard
                        title="Outstanding Invoices"
                        value="5,240.00"
                        icon={<Feather name="clock" size={24} color="#EAB308" />}
                        iconBgColor="bg-yellow-100"
                    />
                </View>

                <View className="flex-row px-2 py-2">
                    <MetricCard
                        title="Paid Invoices"
                        value="19,327.89"
                        icon={<Feather name="check" size={24} color="#22C55E" />}
                        iconBgColor="bg-green-100"
                    />
                </View>

                {/* Revenue Chart Section */}
                <View className="bg-white mx-4 my-4 p-4 rounded-xl shadow-sm">
                    <Text className="text-xl font-semibold mb-4">Revenue Overview</Text>
                    <LineChart
                        data={revenueData}
                        width={screenWidth - 48}
                        height={220}
                        chartConfig={{
                            backgroundColor: "#ffffff",
                            backgroundGradientFrom: "#ffffff",
                            backgroundGradientTo: "#ffffff",
                            decimalPlaces: 0,
                            color: (opacity = 1) => `rgba(79, 70, 229, ${opacity})`,
                            style: {
                                borderRadius: 16
                            },
                            propsForDots: {
                                r: "6",
                                strokeWidth: "2",
                                stroke: "#4F46E5"
                            }
                        }}
                        bezier
                        style={{
                            marginVertical: 8,
                            borderRadius: 16
                        }}
                    />
                </View>

                {/* Invoice Status Chart Section */}
                <View className="bg-white mx-4 my-4 p-4 rounded-xl shadow-sm">
                    <Text className="text-xl font-semibold mb-4">Invoice Status</Text>
                    <PieChart
                        data={invoiceData}
                        width={screenWidth - 48}
                        height={220}
                        chartConfig={{
                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        }}
                        accessor="amount"
                        backgroundColor="transparent"
                        paddingLeft="15"
                        center={[10, 0]}
                        absolute
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

