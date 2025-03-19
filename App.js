import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer, useNavigation, useNavigationState } from "@react-navigation/native";
import { SafeAreaView, StatusBar, BackHandler, ToastAndroid } from "react-native";
import LoginScreen from "./src/screens/auth/Login";
import SignUpScreen from "./src/screens/auth/SignUpScreen";
import ForgetPassword from "./src/screens/auth/ForgetPassword";
import AppNavigator from "./src/navigation/AppNavigator";
import EmployeeNavigator from "./src/navigation/EmployeeNavigator";
import { getSession } from "./src/api/admin/adminApi";

const Stack = createStackNavigator();

export default function App() {


  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <NavigationContainer>
        <AppWithBackHandler />
      </NavigationContainer>
    </SafeAreaView>
  );
}


function AppWithBackHandler() {
  const navigation = useNavigation();
  const [exitApp, setExitApp] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const data = await getSession();
        if (data?.orgId && data?.userId) {
          navigation.navigate("UserDashboard");
        } else if (data?.orgId && data?.userId === null) {
          navigation.navigate("AdminDashboard");
        } else {
          navigation.navigate("Login");
        }
      } catch (error) {
        navigation.navigate("Login");
      }
    };

    checkSession();
  }, [navigation]);

  useEffect(() => {
    const backAction = () => {
      const currentScreen = navigation.getCurrentRoute()?.name || "Login";

      if (["Login", "Signup", "AdminDashboard"].includes(currentScreen)) {
        if (exitApp) {
          BackHandler.exitApp();
          return true;
        } else {
          setExitApp(true);
          ToastAndroid.show("Press back again to exit", ToastAndroid.SHORT);
          setTimeout(() => setExitApp(false), 2000);
          return true;
        }
      }
      return false; // Let React Navigation handle other cases
    };

    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

    return () => backHandler.remove();
  }, [exitApp, navigation]);

  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Signup" component={SignUpScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ForgetPassword" component={ForgetPassword} options={{ headerShown: false }} />
      <Stack.Screen name="AdminDashboard" component={AppNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="UserDashboard" component={EmployeeNavigator} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

