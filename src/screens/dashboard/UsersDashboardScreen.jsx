import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, Platform, StatusBar, Dimensions } from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { getAllInvoices } from '../../api/user/invoice';
import { useFocusEffect } from '@react-navigation/native';
import { getAllPayments } from '../../api/user/payment';

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
    const [invoices, setInvoices] = useState([])
    const [revenue, setRevenue] = useState('')
    const [paidAmount, setPaidAmount] = useState('')
    const [invoiceStatus, setInvoiceStatus] = useState({ paid: 0, pending: 0 })
    const [dueAmount, setDueAmount] = useState('')
    const allInvoiceData = async () => {
        try {

            const response = await getAllInvoices();
            const paymentResponse = await getAllPayments();
            const data = response.invoices;
            const paymentData = paymentResponse.payments;
            setInvoices(data)
            const totalRevenue = data.reduce((total, item) => {
                if (item.invoiceStatus !== "VOID") {
                    return total + Number(item.totalAmount);
                }
                return total;
            }, 0);
            const totalPaidStatus = data.reduce((total, item) => {
                return item.invoiceStatus === "Paid" ? total + 1 : total;
            }, 0);

            const totalPendingStatus = data.reduce((total, item) => {
                return item.invoiceStatus !== "Paid" && item.invoiceStatus !== "VOID" ? total + 1 : total;
            }, 0);

            setInvoiceStatus({ ...invoiceStatus, paid: totalPaidStatus, pending: totalPendingStatus });

            const totalPaid = data.reduce((total, item) => {
                if (item.invoiceStatus === "Paid") {
                    return total + Number(item.totalAmount);
                }
                return total;
            }, 0);

            setRevenue(totalRevenue)
            setPaidAmount(totalPaid.toFixed(2));
            const totalDue = Number(totalRevenue) - Number(totalPaid);
            setDueAmount(totalDue.toFixed(2));
        } catch (error) {

        }
    }

    const monthMap = {
        "January": 0, "February": 1, "March": 2, "April": 3, "May": 4, "June": 5,
        "July": 6, "August": 7, "September": 8, "October": 9, "November": 10, "December": 11
    };

    const calculateTotalForFinancialYear = (invoices, finYear, startYear) => {
        const [startMonthName, endMonthName] = finYear.split(" - ");
        const startMonth = monthMap[startMonthName];
        const endMonth = monthMap[endMonthName];

        const startDate = new Date(startYear, startMonth, 1);
        const endDate = new Date(startYear + 1, endMonth + 1, 0, 23, 59, 59, 999);

        const filteredInvoices = invoices.filter((invoice) => {
            const invoiceDate = new Date(Number(invoice.createdAt)); // Convert timestamp to Date
            return invoiceDate >= startDate && invoiceDate <= endDate;
        });

        const totalAmount = filteredInvoices.reduce((total, invoice) => {
            return total + (Number(invoice.totalAmount) || 0);
        }, 0);

        return totalAmount.toFixed(2);
    };
    const monthNames = [
        "April", "May", "June", "July", "August", "September",
        "October", "November", "December", "January", "February", "March"
    ];
    const calculateMonthlyRevenueData = (invoices, finYear, startYear) => {
        const monthNames = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];

        // Initialize revenue data structure
        const monthlyTotals = Array(12).fill(0);

        const startMonth = 3; // April (0-based index)
        const endMonth = 2;   // March

        const startDate = new Date(startYear, startMonth, 1);
        const endDate = new Date(startYear + 1, endMonth + 1, 0, 23, 59, 59, 999);

        invoices.forEach((invoice) => {
            const invoiceDate = new Date(Number(invoice.createdAt)); // Convert timestamp to Date
            if (invoiceDate >= startDate && invoiceDate <= endDate) {
                const monthIndex = (invoiceDate.getMonth() - 3 + 12) % 12; // Map months correctly
                monthlyTotals[monthIndex] += parseFloat(invoice.totalAmount) || 0;
            }
        });

        return {
            labels: monthNames,
            datasets: [{ data: monthlyTotals }]
        };
    };

    const finYear = "April - March";
    const startYear = 2024;
    const revenueData = calculateMonthlyRevenueData(invoices, finYear, startYear);

    // const totalAmountForYear = calculateTotalForFinancialYear(invoices, finYear, startYear);
    // console.log("Total Amount for Financial Year:", totalAmountForYear);
    // const monthlyTotals = calculateMonthlyTotalForFinancialYear(invoices, finYear, startYear);
    // console.log("Monthly Totals for Financial Year:", monthlyTotals);

    useFocusEffect(
        useCallback(() => {
            allInvoiceData();
        }, [])
    )

    // const revenueData = {
    //     labels: ["Jans", "Feb", "Mar", "Apr", "May", "Jun"],
    //     datasets: [{
    //         data: [4500, 5200, 4800, 5900, 6400, 7200]
    //     }]
    // };

    // Invoice status data for pie chart
    const invoiceData = [
        {
            name: "Paid",
            amount: invoiceStatus.paid,
            color: "#22c55e",
            legendFontColor: "#7F7F7F",
        },
        {
            name: "pending",
            amount: invoiceStatus.pending,
            color: "#eab308",
            legendFontColor: "#7F7F7F",
        },

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
                        value={revenue}
                        icon={<FontAwesome name="dollar" size={24} color="#4F46E5" />}
                        iconBgColor="bg-indigo-100"
                    />
                </View>

                <View className="flex-row px-2 py-2">
                    <MetricCard
                        title="Recieved Amount"
                        value={paidAmount}
                        icon={<Feather name="check" size={24} color="#22C55E" />}
                        iconBgColor="bg-green-100"
                    />
                </View>
                <View className="flex-row px-2 py-2">
                    <MetricCard
                        title="Due Amount"
                        value={dueAmount}
                        icon={<Feather name="clock" size={24} color="#EAB308" />}
                        iconBgColor="bg-yellow-100"
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

