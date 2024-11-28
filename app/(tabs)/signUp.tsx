import { Link } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-gray-50"
    >
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
      >
        <View className="flex-1 justify-center px-6 py-12">
          <View className="bg-white p-8 rounded-2xl shadow-md">
            <Text className="text-3xl font-bold text-gray-800 mb-6 text-center">
              Create Account
            </Text>

            <View className="space-y-4">
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-1">
                  Name
                </Text>
                <TextInput
                  className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg focus:border-blue-500 focus:bg-white focus:outline-none"
                  placeholder="Enter your full name"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>

              <View>
                <Text className="text-sm font-medium text-gray-700 mb-1">
                  Email
                </Text>
                <TextInput
                  className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg focus:border-blue-500 focus:bg-white focus:outline-none"
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View>
                <Text className="text-sm font-medium text-gray-700 mb-1">
                  Password
                </Text>
                <View className="relative">
                  <TextInput
                    className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg focus:border-blue-500 focus:bg-white focus:outline-none pr-10"
                    placeholder="Create a password"
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

              <View>
                <Text className="text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </Text>
                <View className="relative">
                  <TextInput
                    className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg focus:border-blue-500 focus:bg-white focus:outline-none pr-10"
                    placeholder="Confirm your password"
                    secureTextEntry={!showConfirmPassword}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                  />
                  <TouchableOpacity
                    className="absolute right-3 top-3"
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <Ionicons
                      name={showConfirmPassword ? "eye-off" : "eye"}
                      size={24}
                      color="gray"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <TouchableOpacity
              className="bg-blue-500 rounded-lg py-3 mt-6"
              activeOpacity={0.7}
            >
              <Text className="text-center text-white text-lg font-semibold">
                Sign Up
              </Text>
            </TouchableOpacity>

            <View className="mt-6">
              <Text className="text-center text-gray-600">
                Already have an account?
              </Text>
              <Link href="/native" asChild>
                <TouchableOpacity className="mt-2">
                  <Text className="text-center text-blue-500 font-semibold">
                    Log In
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
