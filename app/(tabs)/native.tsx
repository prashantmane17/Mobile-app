import React from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";

interface BalanceItemProps {
  label: string;
  value: string;
  trend?: "up" | "down";
}

const BalanceItem: React.FC<BalanceItemProps> = ({ label, value, trend }) => (
  <View className="items-center">
    <Text className="text-sm text-gray-500 mb-1">{label}</Text>
    <Text className="text-2xl font-bold text-gray-800">{value}</Text>
    {trend && (
      <View className="flex-row items-center mt-1">
        <Ionicons
          name={trend === "up" ? "trending-up" : "trending-down"}
          size={16}
          color={trend === "up" ? "#10B981" : "#EF4444"}
        />
        <Text className={trend === "up" ? "text-green-500" : "text-red-500"}>
          {trend === "up" ? "2.5%" : "1.8%"}
        </Text>
      </View>
    )}
  </View>
);

interface ActionButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  icon,
  label,
  onPress,
}) => (
  <TouchableOpacity
    className="flex-row items-center bg-white p-4 rounded-lg shadow-sm mb-3"
    onPress={onPress}
  >
    <View className="w-8 h-8 bg-blue-100 rounded-full items-center justify-center mr-4">
      <Ionicons name={icon} size={18} color="#3b82f6" />
    </View>
    <Text className="flex-1 text-gray-800 font-medium">{label}</Text>
    <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
  </TouchableOpacity>
);

export default function FinancialProfile() {
  return (
    <ScrollView>
      <View className="bg-blue-600 pt-6 pb-16 px-6">
        <View className="flex-row justify-between items-center mb-6">
          <TouchableOpacity>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <View className="items-center">
          <Image
            source={{ uri: "https://randomuser.me/api/portraits/men/32.jpg" }}
            className="w-24 h-24 rounded-full mb-4"
          />
          <Text className="text-white text-2xl font-bold mb-1">John Doe</Text>
          <Text className="text-blue-100">Premium Member</Text>
        </View>
      </View>

      <View className="flex-row justify-around bg-white py-6 px-4 rounded-lg shadow-md mx-4 -mt-12 mb-6">
        <BalanceItem label="Total Balance" value="$12,680.55" trend="up" />
        <BalanceItem label="Monthly Savings" value="$2,194.33" trend="down" />
      </View>

      <View className="px-4 mb-6">
        <Text className="text-lg font-bold text-white mb-4">Quick Actions</Text>
        <ActionButton
          icon="card-outline"
          label="Manage Cards"
          onPress={() => console.log("Manage Cards")}
        />
        <ActionButton
          icon="bar-chart-outline"
          label="Investment Portfolio"
          onPress={() => console.log("Investment Portfolio")}
        />
        <ActionButton
          icon="wallet-outline"
          label="Savings Goals"
          onPress={() => console.log("Savings Goals")}
        />
        <ActionButton
          icon="document-text-outline"
          label="Financial Reports"
          onPress={() => console.log("Financial Reports")}
        />
      </View>

      <View className="px-4 mb-6">
        <Text className="text-lg font-bold text-white mb-4">
          Account Settings
        </Text>
        <ActionButton
          icon="person-outline"
          label="Personal Information"
          onPress={() => console.log("Personal Information")}
        />
        <ActionButton
          icon="lock-closed-outline"
          label="Security Settings"
          onPress={() => console.log("Security Settings")}
        />
        <ActionButton
          icon="notifications-outline"
          label="Notification Preferences"
          onPress={() => console.log("Notification Preferences")}
        />
        <ActionButton
          icon="help-circle-outline"
          label="Help & Support"
          onPress={() => console.log("Help & Support")}
        />
      </View>

      <View className="px-4 mb-8">
        <Link href="/" asChild>
          <TouchableOpacity className="bg-red-500 py-3 rounded-lg">
            <Text className="text-white text-center font-bold">Log Out</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </ScrollView>
  );
}
