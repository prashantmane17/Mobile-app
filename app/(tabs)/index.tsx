import { Link } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

export default function Login() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-gray-50"
    >
      <StatusBar style="dark" />
      <View className="flex-1 justify-center px-6">
        <View className="bg-white p-8 rounded-2xl shadow-md">
          <Text className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Welcome Back
          </Text>

          <View className="space-y-4">
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-1">
                Name
              </Text>
              <TextInput
                className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg focus:border-blue-500 focus:bg-white focus:outline-none"
                placeholder="Enter your name"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>

            <View>
              <Text className="text-sm font-medium text-gray-700 mb-1">
                Password
              </Text>
              <View className="relative">
                <TextInput
                  className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg focus:border-blue-500 focus:bg-white focus:outline-none pr-10"
                  placeholder="Enter your password"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity
                  className="absolute right-3 top-3"
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye-off" : "eye"}
                    size={24}
                    color="gray"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <Link href="/dashboard" asChild>
            <TouchableOpacity
              className="bg-blue-500 rounded-lg py-3 mt-6"
              activeOpacity={0.7}
            >
              <Text className="text-center text-white text-lg font-semibold">
                Login
              </Text>
            </TouchableOpacity>
          </Link>
          <View className="mt-6">
            <Text className="text-center text-gray-600">
              Don't have an account?
            </Text>
            <Link href="/signUp" asChild>
              <TouchableOpacity className="mt-2">
                <Text className="text-center text-blue-500 font-semibold">
                  Create Account
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
