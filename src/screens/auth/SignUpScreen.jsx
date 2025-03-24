"use client"

import { useState, useEffect } from "react"
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Animated,
    ScrollView,
    Alert,
    Modal,
    FlatList,
    ActivityIndicator,
} from "react-native"
import { Feather } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import countryData from "../../../assets/json/countries_states_cities.json"

// Business types
const industryTypes = [
    { id: "1", name: "Technology" },
    { id: "2", name: "Retail" },
    { id: "3", name: "Healthcare" },
    { id: "4", name: "Finance" },
    { id: "5", name: "Education" },
    { id: "6", name: "Manufacturing" },
    { id: "7", name: "Hospitality" },
    { id: "8", name: "Construction" },
    { id: "9", name: "Real Estate" },
    { id: "10", name: "Energy" },
    { id: "11", name: "Transportation" },
    { id: "12", name: "Other" },
]

// GST options
const gstOptions = [
    { id: "1", name: "Yes" },
    { id: "2", name: "No" },
]

export default function SignUpScreen() {
    const navigation = useNavigation()
    const initialData = {
        businessName: "",
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
        country: "",
        countryCode: "",
        state: "",
        city: "",
        address: "",
        industryType: "",
        gstRegistered: "",
        gstin: "",
    }

    const [formData, setFormData] = useState(initialData)
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false)
    const [acceptedTerms, setAcceptedTerms] = useState(false)

    // State for dropdowns
    const [countryModalVisible, setCountryModalVisible] = useState(false)
    const [stateModalVisible, setStateModalVisible] = useState(false)
    const [industryTypeModalVisible, setindustryTypeModalVisible] = useState(false)
    const [gstModalVisible, setGstModalVisible] = useState(false)

    // API data states
    const [countries, setCountries] = useState([])
    const [states, setStates] = useState([])
    const [loadingCountries, setLoadingCountries] = useState(false)
    const [loadingStates, setLoadingStates] = useState(false)
    const [formLoading, setFormLoading] = useState(false)
    const [error, setError] = useState(null)

    // Fetch countries on component mount
    useEffect(() => {
        fetchCountries()
    }, [])

    // Fetch states when country changes
    useEffect(() => {
        if (formData.countryCode) {
            fetchStates(formData.countryCode)
        }
    }, [formData.countryCode])

    // Fetch countries from REST Countries API
    const fetchCountries = async () => {
        setLoadingCountries(true)
        setError(null)
        try {

            const formattedCountries = countryData
                .map((country) => ({
                    id: country.id,
                    name: country.name,
                    code: country.iso3,
                }))
                .sort((a, b) => a.name.localeCompare(b.name))

            setCountries(formattedCountries)
        } catch (err) {
            console.error("Error fetching countries:", err)
            setError("Failed to load countries. Please try again.")
        } finally {
            setLoadingCountries(false)
        }
    }

    const fetchStates = async (countryCode) => {
        setLoadingStates(true)
        setError(null)
        try {
            const matchedCountry = countryData.find(country => country.iso3 === countryCode);
            const formattedStates = matchedCountry.states
                .map((state, index) => ({
                    id: state.id,
                    name: state.name,
                    code: state.state_code || index.toString(),
                }))
                .sort((a, b) => a.name.localeCompare(b.name))

            setStates(formattedStates)

        } catch (err) {
            console.error("Error fetching states:", err)
            setError("Failed to load states. Please try again.")
            setStates([])
        } finally {
            setLoadingStates(false)
        }
    }

    const handleInputChange = (name, value) => {
        setFormData({ ...formData, [name]: value })
    }

    const selectCountry = (country) => {
        setFormData({
            ...formData,
            country: `[${country.code}] - ${country.name}`,
            countryCode: country.code,
            state: "",
        })
        setCountryModalVisible(false)
    }

    const selectState = (state) => {
        setFormData({ ...formData, state: state.name })
        setStateModalVisible(false)
    }

    const selectindustryType = (type) => {
        setFormData({ ...formData, industryType: type.name })
        setindustryTypeModalVisible(false)
    }

    const selectGstOption = (option) => {
        setFormData({ ...formData, gstRegistered: option.name })
        setGstModalVisible(false)
    }

    const handleSignUp = async () => {
        setFormLoading(true)
        const {
            businessName,
            email,
            phoneNumber,
            password,
            confirmPassword,
            country,
            state,
            city,
            address,
            industryType,
            gstRegistered,
        } = formData

        if (
            !businessName ||
            !email ||
            !phoneNumber ||
            !password ||
            !confirmPassword ||
            !country ||
            !state ||
            !city ||
            !address ||
            !industryType ||
            !gstRegistered
        ) {
            Alert.alert("Error", "Please fill all fields.")
            setFormLoading(false)
            return
        }

        if (password !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match.")
            setFormLoading(false)
            return
        }

        if (!acceptedTerms) {
            Alert.alert("Error", "You must accept the Terms and Conditions.")
            setFormLoading(false)
            return
        }

        const formBody = new URLSearchParams({
            businessName,
            email,
            phoneNumber,
            password,
            country,
            state,
            city,
            address,
            industryType,
            gstRegistered,
        }).toString()

        try {
            const response = await fetch("https://billing.portstay.com/createOrganizationForMobileApp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: formBody,
            })

            if (response.ok) {
                Alert.alert("Success", "Account created successfully!")
                setFormLoading(false)
                navigation.navigate("AdminDashboard")
            } else {
                Alert.alert("Error", "Failed to create account.")
                setFormLoading(false)
            }

        } catch (error) {
            console.error("Error:", error)
            Alert.alert("Error", "Something went wrong. Please try again later.")
            setFormLoading(false)
        }
    }

    // Dropdown selector component
    const DropdownSelector = ({ label, placeholder, value, onPress, isLoading }) => (
        <View className="mb-5">
            <Text className="text-sm font-medium text-gray-600">{label}</Text>
            <TouchableOpacity
                onPress={onPress}
                className="flex-row items-center border-b-2 border-gray-300 py-2"
                disabled={isLoading}
            >
                {isLoading ? (
                    <ActivityIndicator size="small" color="#4F46E5" />
                ) : (
                    <Feather name="chevron-down" size={24} color="#4F46E5" />
                )}
                <Text className={`flex-1 ml-2 text-sm ${value ? "text-black" : "text-gray-400"}`}>{value || placeholder}</Text>
            </TouchableOpacity>
        </View>
    )

    // Modal for selection lists
    const SelectionModal = ({ visible, onClose, data, onSelect, title, isLoading, error }) => {
        const [searchText, setSearchText] = useState("");

        // Filter data based on search input
        const filteredData = data.filter((item) =>
            item.name.toLowerCase().includes(searchText.toLowerCase()) ||
            (item.code && item.code.toLowerCase().includes(searchText.toLowerCase()))
        );

        return (
            <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
                <View className="flex-1 justify-end bg-black/50">
                    <View className="bg-white rounded-t-3xl p-5 h-2/3">
                        {/* Header */}
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-xl font-bold text-indigo-600">{title}</Text>
                            <TouchableOpacity onPress={onClose}>
                                <Feather name="x" size={24} color="#4F46E5" />
                            </TouchableOpacity>
                        </View>

                        {/* Search Input */}
                        {(title.includes("Country") || title.includes("State")) && (

                            <View className="mb-3 border border-gray-300 rounded-lg px-3 py-2 flex-row items-center">
                                <Feather name="search" size={18} color="gray" />
                                <TextInput
                                    className="flex-1 ml-2"
                                    placeholder="Search..."
                                    value={searchText}
                                    onChangeText={setSearchText}
                                    autoCapitalize="none"
                                />
                            </View>
                        )}

                        {/* Loading, Error, or Data */}
                        {isLoading ? (
                            <View className="flex-1 justify-center items-center">
                                <ActivityIndicator size="large" color="#4F46E5" />
                                <Text className="mt-4 text-gray-600">Loading...</Text>
                            </View>
                        ) : error ? (
                            <View className="flex-1 justify-center items-center">
                                <Feather name="alert-circle" size={48} color="#EF4444" />
                                <Text className="mt-4 text-red-500">{error}</Text>
                                <TouchableOpacity
                                    onPress={title.includes("Country") ? fetchCountries : () => { }}
                                    className="mt-4 py-2 px-4 bg-indigo-600 rounded-full"
                                >
                                    <Text className="text-white">Retry</Text>
                                </TouchableOpacity>
                            </View>
                        ) : filteredData.length === 0 ? (
                            <View className="flex-1 justify-center items-center">
                                <Text className="text-gray-600">No results found</Text>
                            </View>
                        ) : (
                            <FlatList
                                data={filteredData}
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={({ item }) => (
                                    <TouchableOpacity onPress={() => onSelect(item)} className="py-3 border-b border-gray-200">
                                        <Text className="text-base">{item.code ? `[${item.code}] ` : ""}{item.name}</Text>
                                    </TouchableOpacity>
                                )}
                                initialNumToRender={20}
                                maxToRenderPerBatch={20}
                                windowSize={10}
                            />
                        )}
                    </View>
                </View>
            </Modal>
        );
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1 justify-center items-center bg-gray-100"
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }} className="w-full">
                <Animated.View className="w-11/12 max-w-md mx-auto p-8 bg-white rounded-3xl shadow-lg">
                    <Text className="text-4xl font-bold mb-8 text-indigo-600 text-center">Create Account</Text>

                    {/* Business Name */}
                    <View className="mb-6">
                        <Text className="text-sm font-medium text-gray-600">Business Name</Text>
                        <View className="flex-row items-center border-b-2 border-gray-300 py-1">
                            <Feather name="briefcase" size={24} color="#4F46E5" />
                            <TextInput
                                placeholder="Enter your business name"
                                className="flex-1 ml-2 text-sm"
                                value={formData.businessName}
                                onChangeText={(text) => handleInputChange("businessName", text)}
                            />
                        </View>
                    </View>

                    {/* Email */}
                    <View className="mb-6">
                        <Text className="text-sm font-medium text-gray-600">Email</Text>
                        <View className="flex-row items-center border-b-2 border-gray-300 py-1">
                            <Feather name="mail" size={24} color="#4F46E5" />
                            <TextInput
                                placeholder="Enter your email"
                                className="flex-1 ml-2 text-sm lowercase"
                                value={formData.email}
                                onChangeText={(text) => handleInputChange("email", text)}
                                keyboardType="email-address"
                            />
                        </View>
                    </View>

                    {/* Phone Number */}
                    <View className="mb-5">
                        <Text className="text-sm font-medium text-gray-600">Phone Number</Text>
                        <View className="flex-row items-center border-b-2 border-gray-300 py-1">
                            <Feather name="phone" size={24} color="#4F46E5" />
                            <TextInput
                                placeholder="Enter your phone number"
                                className="flex-1 ml-2 text-sm"
                                value={formData.phoneNumber}
                                onChangeText={(text) => handleInputChange("phoneNumber", text)}
                                keyboardType="phone-pad"
                            />
                        </View>
                    </View>

                    {/* Country Dropdown */}
                    <DropdownSelector
                        label="Country"
                        placeholder="Select your country"
                        value={formData.country}
                        onPress={() => setCountryModalVisible(true)}
                        isLoading={loadingCountries}
                    />

                    {/* State Dropdown */}
                    <DropdownSelector
                        label="State"
                        placeholder="Select your state"
                        value={formData.state}
                        onPress={() => {
                            if (formData.countryCode) {
                                setStateModalVisible(true)
                            } else {
                                Alert.alert("Error", "Please select a country first")
                            }
                        }}
                        isLoading={loadingStates && formData.countryCode}
                    />

                    {/* City */}
                    <View className="mb-5">
                        <Text className="text-sm font-medium text-gray-600">City</Text>
                        <View className="flex-row items-center border-b-2 border-gray-300 py-1">
                            <Feather name="map-pin" size={24} color="#4F46E5" />
                            <TextInput
                                placeholder="Enter your city"
                                className="flex-1 ml-2 text-sm"
                                value={formData.city}
                                onChangeText={(text) => handleInputChange("city", text)}
                            />
                        </View>
                    </View>

                    {/* Address */}
                    <View className="mb-5">
                        <Text className="text-sm font-medium text-gray-600">Address</Text>
                        <View className="flex-row items-center border-b-2 border-gray-300 py-1">
                            <Feather name="home" size={24} color="#4F46E5" />
                            <TextInput
                                placeholder="Enter your address"
                                className="flex-1 ml-2 text-sm"
                                value={formData.address}
                                onChangeText={(text) => handleInputChange("address", text)}
                            />
                        </View>
                    </View>

                    {/* Business Type Dropdown */}
                    <DropdownSelector
                        label="Business Type"
                        placeholder="Select business type"
                        value={formData.industryType}
                        onPress={() => setindustryTypeModalVisible(true)}
                    />

                    {/* GST Registration Dropdown */}
                    <DropdownSelector
                        label="Is your business GST Registered?"
                        placeholder="Select option"
                        value={formData.gstRegistered}
                        onPress={() => setGstModalVisible(true)}
                    />

                    {formData.gstRegistered === "Yes" && (<View className="flex-row items-center border-b-2 border-gray-300 mb-3">
                        <TextInput
                            placeholder="Enter GST Number"
                            className="flex-1 ml-2 text-sm"
                            value={formData.gstin}
                            onChangeText={(text) => handleInputChange("gstin", text)}
                        />
                    </View>)}

                    {/* Password */}
                    <View className="mb-5">
                        <Text className="text-sm font-medium text-gray-600">Password</Text>
                        <View className="flex-row items-center border-b-2 border-gray-300 py-1">
                            <Feather name="lock" size={24} color="#4F46E5" />
                            <TextInput
                                placeholder="Create a password"
                                secureTextEntry={!isPasswordVisible}
                                className="flex-1 ml-2 text-sm"
                                value={formData.password}
                                onChangeText={(text) => handleInputChange("password", text)}
                            />
                            <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                                <Feather name={isPasswordVisible ? "eye-off" : "eye"} size={24} color="#4F46E5" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Confirm Password */}
                    <View className="mb-5">
                        <Text className="text-sm font-medium text-gray-600">Confirm Password</Text>
                        <View className="flex-row items-center border-b-2 border-gray-300 py-1">
                            <Feather name="lock" size={24} color="#4F46E5" />
                            <TextInput
                                placeholder="Confirm your password"
                                secureTextEntry={!isConfirmPasswordVisible}
                                className="flex-1 ml-2 text-sm"
                                value={formData.confirmPassword}
                                onChangeText={(text) => handleInputChange("confirmPassword", text)}
                            />
                            <TouchableOpacity onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}>
                                <Feather name={isConfirmPasswordVisible ? "eye-off" : "eye"} size={24} color="#4F46E5" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Terms and Conditions */}
                    <View className="flex-row items-center mb-5">
                        <TouchableOpacity onPress={() => setAcceptedTerms(!acceptedTerms)}>
                            <View
                                className={`w-6 h-6 mr-2 border-2 rounded ${acceptedTerms ? "bg-indigo-600 border-indigo-600" : "border-gray-400"}`}
                            >
                                {acceptedTerms && <Feather name="check" size={20} color="white" />}
                            </View>
                        </TouchableOpacity>
                        <Text className="text-sm text-gray-600">I accept the Terms and Conditions</Text>
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity
                        onPress={handleSignUp}
                        className={`py-4 rounded-full mb-4 ${acceptedTerms ? "bg-indigo-600" : "bg-gray-400"}`}
                        disabled={!acceptedTerms}
                    >
                        <Text className="text-center text-white text-lg font-bold">Sign Up</Text>
                    </TouchableOpacity>

                    {/* Redirect to Login */}
                    <View className="flex-row justify-center">
                        <Text className="text-gray-600">Already have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                            <Text className="text-indigo-600 font-bold">Log In</Text>
                        </TouchableOpacity>
                    </View>
                    {formLoading && (
                        <View className="absolute top-0 left-0 z-50 w-screen h-screen flex-1 items-center justify-center bg-black opacity-60">
                            <ActivityIndicator size="large" color="#FFFFFF" />
                            {/* <Text className="text-indigo-600 bg-white mt-4">Loading...</Text> */}
                        </View>
                    )}

                    {/* Selection Modals */}
                    <SelectionModal
                        visible={countryModalVisible}
                        onClose={() => setCountryModalVisible(false)}
                        data={countries}
                        onSelect={selectCountry}
                        title="Select Country"
                        isLoading={loadingCountries}
                        error={error}
                    />

                    <SelectionModal
                        visible={stateModalVisible}
                        onClose={() => setStateModalVisible(false)}
                        data={states}
                        onSelect={selectState}
                        title="Select State"
                        isLoading={loadingStates}
                        error={error}
                    />

                    <SelectionModal
                        visible={industryTypeModalVisible}
                        onClose={() => setindustryTypeModalVisible(false)}
                        data={industryTypes}
                        onSelect={selectindustryType}
                        title="Select Business Type"
                    />

                    <SelectionModal
                        visible={gstModalVisible}
                        onClose={() => setGstModalVisible(false)}
                        data={gstOptions}
                        onSelect={selectGstOption}
                        title="GST Registration"
                    />
                </Animated.View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

