import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

// Types for QuickActionButton props
type QuickActionButtonProps = {
  icon: React.ComponentProps<typeof Ionicons>["name"]; // Ensures the icon name matches Ionicons
  label: string;
};

const QuickActionButton: React.FC<QuickActionButtonProps> = ({
  icon,
  label,
}) => (
  <TouchableOpacity className="items-center">
    <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mb-1">
      <Ionicons name={icon} size={24} color="#3b82f6" />
    </View>
    <Text className="text-xs text-gray-600">{label}</Text>
  </TouchableOpacity>
);

// Types for TransactionItem props
type TransactionItemProps = {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  title: string;
  amount: string;
  date: string;
};

const TransactionItem: React.FC<TransactionItemProps> = ({
  icon,
  title,
  amount,
  date,
}) => (
  <View className="flex-row items-center justify-between py-3 border-b border-gray-200">
    <View className="flex-row items-center">
      <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mr-3">
        <Ionicons name={icon} size={20} color="#4b5563" />
      </View>
      <View>
        <Text className="font-semibold text-gray-800">{title}</Text>
        <Text className="text-xs text-gray-500">{date}</Text>
      </View>
    </View>
    <Text
      className={`font-semibold ${
        amount.startsWith("-") ? "text-red-500" : "text-green-500"
      }`}
    >
      {amount}
    </Text>
  </View>
);

export default function Dashboard() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView>
        <View className="p-6">
          <Text className="text-2xl font-bold text-gray-800 mb-2">
            Hello, John
          </Text>
          <Text className="text-gray-600 mb-6">
            Welcome back to your financial overview
          </Text>

          <View className="bg-blue-500 p-6 rounded-xl mb-6">
            <Text className="text-white text-lg mb-2">Total Balance</Text>
            <Text className="text-white text-3xl font-bold">$12,345.67</Text>
          </View>

          <View className="flex-row justify-between mb-6">
            <QuickActionButton icon="send" label="Send" />
            <QuickActionButton icon="card" label="Pay" />
            <QuickActionButton icon="cash" label="Top Up" />
            <QuickActionButton icon="pie-chart" label="Invest" />
          </View>

          <View>
            <Text className="text-xl font-semibold text-gray-800 mb-4">
              Recent Transactions
            </Text>
            <TransactionItem
              icon="cart"
              title="Grocery Shopping"
              amount="-$56.32"
              date="Today, 2:30 PM"
            />
            <TransactionItem
              icon="business"
              title="Salary Deposit"
              amount="+$2,500.00"
              date="Yesterday, 9:00 AM"
            />
            <TransactionItem
              icon="fast-food"
              title="Restaurant Bill"
              amount="-$42.50"
              date="22 May, 7:30 PM"
            />
            <TransactionItem
              icon="car"
              title="Uber Ride"
              amount="-$12.99"
              date="21 May, 3:15 PM"
            />
          </View>
        </View>
      </ScrollView>

      <View className="flex-row justify-around py-3 bg-white border-t border-gray-200">
        <TouchableOpacity className="items-center">
          <Ionicons name="home" size={24} color="#3b82f6" />
          <Text className="text-xs text-blue-500">Home</Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center">
          <Ionicons name="stats-chart" size={24} color="#6b7280" />
          <Text className="text-xs text-gray-500">Statistics</Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center">
          <Ionicons name="card" size={24} color="#6b7280" />
          <Text className="text-xs text-gray-500">Cards</Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center">
          <Ionicons name="person" size={24} color="#6b7280" />
          <Text className="text-xs text-gray-500">Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
