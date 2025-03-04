import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer, useNavigationState } from "@react-navigation/native";
import { SafeAreaView, StatusBar, BackHandler, ToastAndroid } from "react-native";
import LoginScreen from "./src/screens/Login";
import SignUpScreen from "./src/screens/SignUpScreen";
import HomeScreen from "./src/screens/HomeScreen";
import ForgetPassword from "./src/screens/ForgetPassword";
import AppNavigator from "./src/navigation/AppNavigator";
import EmployeeNavigator from "./src/navigation/EmployeeNavigator";

const Stack = createStackNavigator();

export default function App() {
  const [exitApp, setExitApp] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <NavigationContainer>
        <AppWithBackHandler />
      </NavigationContainer>
    </SafeAreaView>
  );
}

// Separate component to handle back button
function AppWithBackHandler() {
  const navigationState = useNavigationState((state) => state);
  const currentScreen = navigationState?.routes[navigationState.index]?.name || "Login";
  const [exitApp, setExitApp] = useState(false);

  useEffect(() => {
    const backAction = () => {
      if (currentScreen === "Login" || currentScreen === "Signup") {
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
  }, [exitApp, currentScreen]);

  return (
    <Stack.Navigator initialRouteName="Signup">
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Signup" component={SignUpScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ForgetPassword" component={ForgetPassword} options={{ headerShown: false }} />
      <Stack.Screen name="AdminDashboard" component={AppNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="UserDashboard" component={EmployeeNavigator} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
