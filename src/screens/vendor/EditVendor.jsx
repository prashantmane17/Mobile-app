import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, TextInput, TouchableOpacity, SafeAreaView, Image, Alert } from 'react-native';
import { ArrowLeft, Building, Mail, Phone, User, MapPin, Users, Info, Upload, ChevronDown, Copy } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { getAllVendors } from '../../api/user/vendor';
import { useTax } from '../../context/TaxContext';


export default function EditVendor({ route }) {
    const { id } = route.params;
    const { isTaxCompany } = useTax();

    console.log("datata-----", id)
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({});
    const [billingAddress, setBillingAddress] = useState({});
    const [shippingAddress, setShippingAddress] = useState({});
    const [contactInfo, setContactInfo] = useState({});

    const fetchCustomerData = async () => {
        setLoading(true);
        try {
            const response = await getAllVendors();
            const data = response.vendors.find((customer) => customer.id === id);
            setFormData({
                firstName: data.firstName,
                lastName: data.lastName,
                companyName: data.companyName,
                displayName: data.displayName,
                emailAddress: data.emailAddress,
                phone: data.phone,
                gstTreatment: data.gstTreatment,
                gstin: data.gstin,
                placeOfSupply: data.placeOfSupply,
                pan: data.pan,
                taxPreference: data.taxPreference,
            });
            setBillingAddress({
                addressLine1: data.billingAddress.addressLine1,
                addressLine2: data.billingAddress.addressLine2,
                city: data.billingAddress.city,
                state: data.billingAddress.state,
                country: data.billingAddress.country,
                zipCode: data.billingAddress.zipCode,
                phone: data.billingAddress.phone,
            });
            setShippingAddress({
                addressLine1: data.shippingAddress?.addressLine1,
                addressLine2: data.shippingAddress?.addressLine2,
                city: data.shippingAddress?.city,
                state: data.shippingAddress?.state,
                country: data.shippingAddress?.country,
                zipCode: data.shippingAddress?.zipCode,
                phone: data.shippingAddress?.phone
            });
            setContactInfo({
                contactPersonName: data.contactPersonName,
                contactPersonEmail: data.contactPersonEmail,
                contactPersonPhone: data.contactPersonPhone
            })
        } catch (error) {
            console.error("Error fetching vendor:", error);
            Alert.alert("Error", "Failed to load vendor details");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchCustomerData();
    }, [id])

    const [activeTab, setActiveTab] = useState('details');
    const [taxPreference, setTaxPreference] = useState('Taxable');
    const [gstType, setGstType] = useState("");

    const states = [
        { label: "[AP] - Andhra Pradesh", value: "Andhra Pradesh" },
        { label: "[AR] - Arunachal Pradesh", value: "Arunachal Pradesh" },
        { label: "[AS] - Assam", value: "Assam" },
        { label: "[BR] - Bihar", value: "Bihar" },
        { label: "[CG] - Chhattisgarh", value: "Chhattisgarh" },
        { label: "[DN] - Dadra and Nagar Haveli and Daman and Diu", value: "Dadra and Nagar Haveli and Daman and Diu" },
        { label: "[DD] - Daman and Diu", value: "Daman and Diu" },
        { label: "[DL] - Delhi", value: "Delhi" },
        { label: "[FC] - Foreign Country", value: "Foreign Country" },
        { label: "[GA] - Goa", value: "Goa" },
        { label: "[GJ] - Gujarat", value: "Gujarat" },
        { label: "[HR] - Haryana", value: "Haryana" },
        { label: "[HP] - Himachal Pradesh", value: "Himachal Pradesh" },
        { label: "[JK] - Jammu and Kashmir", value: "Jammu and Kashmir" },
        { label: "[JH] - Jharkhand", value: "Jharkhand" },
        { label: "[KA] - Karnataka", value: "Karnataka" },
        { label: "[KL] - Kerala", value: "Kerala" },
        { label: "[LA] - Ladakh", value: "Ladakh" },
        { label: "[LD] - Lakshadweep", value: "Lakshadweep" },
        { label: "[MP] - Madhya Pradesh", value: "Madhya Pradesh" },
        { label: "[MH] - Maharashtra", value: "Maharashtra" },
        { label: "[MN] - Manipur", value: "Manipur" },
        { label: "[ML] - Meghalaya", value: "Meghalaya" },
        { label: "[MZ] - Mizoram", value: "Mizoram" },
        { label: "[NL] - Nagaland", value: "Nagaland" },
        { label: "[OD] - Odisha", value: "Odisha" },
        { label: "[OT] - Other Territory", value: "Other Territory" },
        { label: "[PY] - Puducherry", value: "Puducherry" },
        { label: "[PB] - Punjab", value: "Punjab" },
        { label: "[RJ] - Rajasthan", value: "Rajasthan" },
        { label: "[SK] - Sikkim", value: "Sikkim" },
        { label: "[TN] - Tamil Nadu", value: "Tamil Nadu" },
        { label: "[TS] - Telangana", value: "Telangana" },
        { label: "[TR] - Tripura", value: "Tripura" },
        { label: "[UP] - Uttar Pradesh", value: "Uttar Pradesh" },
        { label: "[UK] - Uttarakhand", value: "Uttarakhand" },
        { label: "[WB] - West Bengal", value: "West Bengal" },
    ];


    const copyFromBilling = () => {
        setShippingAddress({ ...billingAddress });
    };

    const handleSubmit = async () => {
        const customerData = {
            billingAddress,
            shippingAddress
        }
        const combinedForm = {
            formData,
            customerData,
            contactInfo
        }
        console.log("combinedForm---", combinedForm)
        try {
            const response = await fetch(`https://billing.portstay.com/editeachvendorbyid/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(combinedForm)
            });

            const data = await response.text();
            if (response.ok) {

                Alert.alert("Sucess", "Vendor details updated Successfully");
                navigation.navigate('Vendor')
            } else {
                console.error("Failed:", data);
                Alert.alert("Error", "Failed to update customer details");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };



    const renderTabContent = () => {
        switch (activeTab) {
            case 'details':
                return (
                    <View className="space-y-4">
                        {isTaxCompany && (<View className="space-y-2">
                            <Text className="text-sm font-medium text-gray-600">GST Type <Text className="text-red-500">*</Text></Text>
                            <View className="border border-gray-200 rounded-lg bg-white overflow-hidden h-11 flex">
                                <Picker
                                    selectedValue={formData.gstTreatment}
                                    onValueChange={(itemValue) => setFormData({ ...formData, gstTreatment: itemValue })}
                                    className="h-5 w-full text-gray-700 "
                                >
                                    <Picker.Item label="Select GST Type" value="" enabled={gstType !== ""} />
                                    <Picker.Item label="Registered Business - Regular" value="registered" />
                                    <Picker.Item label="Unregistered Business" value="unregistered" />
                                    <Picker.Item label="Overseas" value="overseas" />
                                </Picker>
                            </View>
                        </View >)}
                        {/* Show GSTIN field only if "Registered Business - Regular" is selected */}
                        {gstType === "registered" && isTaxCompany && (
                            <View className="space-y-2">
                                <Text className="text-sm font-medium text-gray-600">GSTIN <Text className="text-red-500">*</Text></Text>
                                <TouchableOpacity className="px-1 p-1 border border-gray-200 rounded-lg bg-white flex-row justify-between items-center">
                                    <TextInput className="text-gray-700 text-[12px]" keyboardType=""
                                        placeholder="Enter your GSTIN/UIN"
                                        value={formData.gstin}
                                        onChangeText={(text) => setFormData({ ...formData, gstin: text })}
                                    />
                                </TouchableOpacity>
                            </View>
                        )}

                        <View className="space-y-2 p-0 ">
                            <Text className="text-sm font-medium text-gray-600">Place of Supply <Text className="text-red-500">*</Text></Text>
                            <View className="border border-gray-200 rounded-lg bg-white h-11 ">
                                <Picker
                                    selectedValue={formData.placeOfSupply}
                                    onValueChange={(itemValue) => setFormData({ ...formData, placeOfSupply: itemValue })}
                                    className="h-5 w-full text-gray-700 p-[0px] "
                                >
                                    {states.map((state, index) => (
                                        <Picker.Item key={index} label={state.label} value={state.value} />
                                    ))}
                                </Picker>
                            </View>
                        </View>

                        {isTaxCompany && (<View className="space-y-2">
                            <Text className="text-sm font-medium text-gray-600">PAN</Text>
                            <TextInput
                                className="p-3 border border-gray-200 rounded-lg bg-white"
                                placeholder="Enter PAN number"
                                autoCapitalize="characters"
                                maxLength={10}
                                value={formData.pan}
                                onChangeText={(text) => setFormData({ ...formData, pan: text })}
                            />
                        </View>)}

                        {isTaxCompany && (<View className="space-y-2">
                            <Text className="text-sm font-medium text-gray-600">Tax Preference</Text>
                            <View className="flex-row space-x-4">
                                <TouchableOpacity
                                    className="flex-row items-center"
                                    onPress={() => {
                                        setTaxPreference('Taxable')
                                        setFormData({ ...formData, taxPreference: 'Taxable' })
                                    }}
                                >
                                    <View className={`h-5 w-5 rounded-full border-2 ${taxPreference === 'Taxable' ? 'border-blue-500' : 'border-gray-300'} mr-2 items-center justify-center`}>
                                        {taxPreference === 'Taxable' && <View className="h-3 w-3 rounded-full bg-blue-500" />}
                                    </View>
                                    <Text className="text-gray-700">Taxable</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    className="flex-row items-center"
                                    onPress={() => {
                                        setTaxPreference('Tax Exempt')
                                        setFormData({ ...formData, taxPreference: 'Tax Exempt' })
                                    }}
                                >
                                    <View className={`h-5 w-5 rounded-full border-2 ${taxPreference === 'Tax Exempt' ? 'border-blue-500' : 'border-gray-300'} mr-2 items-center justify-center`}>
                                        {taxPreference === 'Tax Exempt' && <View className="h-3 w-3 rounded-full bg-blue-500" />}
                                    </View>
                                    <Text className="text-gray-700">Tax Exempt</Text>
                                </TouchableOpacity>
                            </View>
                        </View>)}


                    </View >
                );
            case 'address':
                return (
                    <View className="space-y-6">
                        <View className="space-y-4">
                            <Text className="text-lg font-semibold text-gray-800">Billing Address</Text>
                            <View className="space-y-4">
                                <View className="space-y-2">
                                    <Text className="text-sm font-medium text-gray-600">Address Line 1</Text>
                                    <TextInput
                                        className="p-3 border border-gray-200 rounded-lg bg-white"
                                        placeholder="Enter address line 1"
                                        value={billingAddress.addressLine1}
                                        onChangeText={(text) => setBillingAddress({ ...billingAddress, addressLine1: text })}
                                    />
                                </View>

                                <View className="space-y-2">
                                    <Text className="text-sm font-medium text-gray-600">Address Line 2</Text>
                                    <TextInput
                                        className="p-3 border border-gray-200 rounded-lg bg-white"
                                        placeholder="Enter address line 2"
                                        value={billingAddress.addressLine2}
                                        onChangeText={(text) => setBillingAddress({ ...billingAddress, addressLine2: text })}
                                    />
                                </View>

                                <View className="space-y-2">
                                    <Text className="text-sm font-medium text-gray-600">City</Text>
                                    <TextInput
                                        className="p-3 border border-gray-200 rounded-lg bg-white"
                                        placeholder="Enter city"
                                        value={billingAddress.city}
                                        onChangeText={(text) => setBillingAddress({ ...billingAddress, city: text })}
                                    />
                                </View>

                                <View className="space-y-2">
                                    <Text className="text-sm font-medium text-gray-600">State</Text>

                                    <TextInput
                                        className="p-3 border border-gray-200 rounded-lg bg-white"
                                        placeholder="Enter State"
                                        value={billingAddress.state}
                                        onChangeText={(text) => setBillingAddress({ ...billingAddress, state: text })}
                                    />
                                </View>

                                <View className="space-y-2">
                                    <Text className="text-sm font-medium text-gray-600">Country</Text>
                                    <TextInput
                                        className="p-3 border border-gray-200 rounded-lg bg-white"
                                        placeholder="Enter Country"
                                        value={billingAddress.country}
                                        onChangeText={(text) => setBillingAddress({ ...billingAddress, country: text })}
                                    />
                                </View>

                                <View className="space-y-2">
                                    <Text className="text-sm font-medium text-gray-600">ZIP Code</Text>
                                    <TextInput
                                        className="p-3 border border-gray-200 rounded-lg bg-white"
                                        placeholder="Enter ZIP code"
                                        keyboardType="numeric"
                                        value={billingAddress.zipCode}
                                        onChangeText={(text) => setBillingAddress({ ...billingAddress, zipCode: text })}
                                    />
                                </View>

                                <View className="space-y-2">
                                    <Text className="text-sm font-medium text-gray-600">Phone</Text>
                                    <TextInput
                                        className="p-3 border border-gray-200 rounded-lg bg-white"
                                        placeholder="Enter phone number"
                                        keyboardType="phone-pad"
                                        value={billingAddress.phone}
                                        onChangeText={(text) => setBillingAddress({ ...billingAddress, phone: text })}
                                    />
                                </View>
                            </View>
                        </View>

                        {/* Shipping Address Section */}
                        <View className="space-y-4">
                            <View className="flex-row justify-between items-center">
                                <Text className="text-lg font-semibold text-gray-800">Shipping Address</Text>
                                <TouchableOpacity
                                    className="flex-row items-center space-x-2 px-3 py-2 bg-blue-50 rounded-lg"
                                    onPress={copyFromBilling}
                                >
                                    <Copy className="w-4 h-4 text-blue-500" />
                                    <Text className="text-blue-500 text-sm font-medium">Copy from Billing</Text>
                                </TouchableOpacity>
                            </View>

                            <View className="space-y-4">
                                <View className="space-y-2">
                                    <Text className="text-sm font-medium text-gray-600">Address Line 1</Text>
                                    <TextInput
                                        className="p-3 border border-gray-200 rounded-lg bg-white"
                                        placeholder="Enter address line 1"
                                        value={shippingAddress.addressLine1}
                                        onChangeText={(text) => setShippingAddress({ ...shippingAddress, addressLine1: text })}
                                    />
                                </View>

                                <View className="space-y-2">
                                    <Text className="text-sm font-medium text-gray-600">Address Line 2</Text>
                                    <TextInput
                                        className="p-3 border border-gray-200 rounded-lg bg-white"
                                        placeholder="Enter address line 2"
                                        value={shippingAddress.addressLine2}
                                        onChangeText={(text) => setShippingAddress({ ...shippingAddress, addressLine2: text })}
                                    />
                                </View>

                                <View className="space-y-2">
                                    <Text className="text-sm font-medium text-gray-600">City</Text>
                                    <TextInput
                                        className="p-3 border border-gray-200 rounded-lg bg-white"
                                        placeholder="Enter city"
                                        value={shippingAddress.city}
                                        onChangeText={(text) => setShippingAddress({ ...shippingAddress, city: text })}
                                    />
                                </View>

                                <View className="space-y-2">
                                    <Text className="text-sm font-medium text-gray-600">State</Text>
                                    {/* <TouchableOpacity className="p-3 border border-gray-200 rounded-lg bg-white flex-row justify-between items-center">
                                         <Text className="text-gray-700">{shippingAddress.state || 'Select State'}</Text>
                                         <ChevronDown className="w-5 h-5 text-gray-400" />
                                    </TouchableOpacity> */}
                                    <TextInput
                                        className="p-3 border border-gray-200 rounded-lg bg-white"
                                        placeholder="Enter state"
                                        value={shippingAddress.state}
                                        onChangeText={(text) => setShippingAddress({ ...shippingAddress, state: text })}
                                    />
                                </View>

                                <View className="space-y-2">
                                    <Text className="text-sm font-medium text-gray-600">Country</Text>
                                    <TextInput
                                        className="p-3 border border-gray-200 rounded-lg bg-white"
                                        placeholder="Enter country"
                                        value={shippingAddress.country}
                                        onChangeText={(text) => setShippingAddress({ ...shippingAddress, country: text })}
                                    />
                                </View>

                                <View className="space-y-2">
                                    <Text className="text-sm font-medium text-gray-600">ZIP Code</Text>
                                    <TextInput
                                        className="p-3 border border-gray-200 rounded-lg bg-white"
                                        placeholder="Enter ZIP code"
                                        keyboardType="numeric"
                                        value={shippingAddress.zipCode}
                                        onChangeText={(text) => setShippingAddress({ ...shippingAddress, zipCode: text })}
                                    />
                                </View>

                                <View className="space-y-2">
                                    <Text className="text-sm font-medium text-gray-600">Phone</Text>
                                    <TextInput
                                        className="p-3 border border-gray-200 rounded-lg bg-white"
                                        placeholder="Enter phone number"
                                        keyboardType="phone-pad"
                                        value={shippingAddress.phone}
                                        onChangeText={(text) => setShippingAddress({
                                            ...shippingAddress, phone: text
                                        })}
                                    />
                                </View>
                            </View>
                        </View >
                    </View >
                );
            case 'contacts':
                return (
                    <View className="space-y-4">
                        <View className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                            <View cl assName="space-y-4">
                                <View className="space-y-2">
                                    <Text className="text-sm font-medium text-gray-600">Contact Name</Text>
                                    <TextInput
                                        className="p-3 border border-gray-200 rounded-lg bg-white"
                                        placeholder="Enter contact name"
                                        value={contactInfo.contactPersonName}
                                        onChangeText={(text) => setContactInfo({ ...contactInfo, contactPersonName: text })}
                                    />
                                </View>

                                <View className="space-y-2">
                                    <Text className="text-sm font-medium text-gray-600">Email</Text>
                                    <TextInput
                                        className="p-3 border border-gray-200 rounded-lg bg-white"
                                        placeholder="Enter Email"
                                        keyboardType="email-address"
                                        value={contactInfo.contactPersonEmail}
                                        onChangeText={(text) => setContactInfo({ ...contactInfo, contactPersonEmail: text })}
                                    />
                                </View>

                                <View className="space-y-2">
                                    <Text className="text-sm font-medium text-gray-600">Phone Number</Text>
                                    <TextInput
                                        className="p-3 border border-gray-200 rounded-lg bg-white"
                                        placeholder="Enter phone number"
                                        keyboardType="phone-pad"
                                        value={contactInfo.contactPersonPhone}
                                        onChangeText={(text) => setContactInfo({ ...contactInfo, contactPersonPhone: text })}
                                    />
                                </View>

                            </View>
                        </View>

                    </View>
                );
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="p-4 flex-row items-center bg-white border-b border-gray-200">
                <TouchableOpacity className="mr-3" onPress={() => navigation.navigate('Vendor')}>
                    <ArrowLeft className="w-6 h-6 text-blue-500" />
                </TouchableOpacity>
                <View>
                    <Text className="text-xl font-bold text-gray-800">Edit  Venodr</Text>
                </View>
            </View>
            <ScrollView>
                <View className="bg-white">

                    <View className="p-4 space-y-4">


                        <View className="space-y-2">
                            <Text className="text-sm font-medium text-gray-600">Display Name <Text className="text-red-500">*</Text></Text>
                            <TextInput
                                className="p-3 border border-gray-200 rounded-lg bg-white"
                                placeholder="Enter display name"
                                value={formData.displayName}
                                onChangeText={(text) => setFormData({ ...formData, displayName: text })}
                            />
                        </View>
                        <View className="space-y-2">
                            <Text className="text-sm font-medium text-gray-600">Company Name</Text>
                            <TextInput
                                className="p-3 border border-gray-200 rounded-lg bg-white"
                                placeholder="Enter company name"
                                value={formData.companyName}
                                onChangeText={(text) => setFormData({ ...formData, companyName: text })}
                            />
                        </View>

                        <View className="space-y-2">
                            <Text>Contact Information</Text>
                            <View className="flex-row gap-2">
                                < View className="flex-1 space-y-2">
                                    <Text className="text-sm font-medium text-gray-600">First Name</Text>
                                    <TextInput
                                        className="p-3 border border-gray-200 rounded-lg bg-white"
                                        placeholder="Enter first name"
                                        value={formData.firstName}
                                        onChangeText={(text) => setFormData({ ...formData, firstName: text })}
                                    />
                                </View>
                                <View className="flex-1 space-y-2">
                                    <Text classNam e="text-sm font-medium text-gray-600">Last Name</Text>
                                    <TextInput
                                        className="p-3 border border-gray-200 rounded-lg bg-white"
                                        placeholder="Enter last name"
                                        value={formData.lastName}
                                        onChangeText={(text) => setFormData({ ...formData, lastName: text })}
                                    />
                                </View>
                            </View>
                        </View>
                        <View className="space-y-2">
                            <Text className="text-sm font-medium text-gray-600">Email Address</Text>
                            <TextInput
                                className="p-3 border border-gray-200 rounded-lg bg-white"
                                placeholder="Enter email address"
                                keyboardType="email-address"
                                value={formData.emailAddress}
                                onChangeText={(text) => setFormData({ ...formData, emailAddress: text })}
                            />
                        </View>

                        <View className="space-y-2">
                            <Text className="text-sm font-medium text-gray-600">Phone</Text>
                            <TextInput
                                className="p-3 border border-gray-200 rounded-lg bg-white"
                                placeholder="Enter phone number"
                                keyboardType="phone-pad"
                                value={formData.phone}
                                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                            />
                        </View>
                    </View>
                </View>

                {/* Tabs */}
                <View className="flex-row border-b border-gray-200 bg-white">
                    <TouchableOpacity
                        onPress={() => setActiveTab('details')}
                        className={`flex-1 p-4 flex-row items-center justify-center space-x-2 ${activeTab === 'details' ? 'border-b-2 border-blue-500' : ''}`}
                    >
                        <Info className={`w-5 h-5 ${activeTab === 'details' ? 'text-blue-500' : 'text-gray-500'}`} />
                        <Text className={activeTab === 'details' ? 'text-blue-500 font-medium' : 'text-gray-500'}>Other Details</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setActiveTab('address')}
                        className={`flex-1 p-4 flex-row items-center justify-center space-x-2 ${activeTab === 'address' ? 'border-b-2 border-blue-500' : ''}`}
                    >
                        <MapPin className={`w-5 h-5 ${activeTab === 'address' ? 'text-blue-500' : 'text-gray-500'}`} />
                        <Text className={activeTab === 'address' ? 'text-blue-500 font-medium' : 'text-gray-500'}>Address</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setActiveTab('contacts')}
                        className={`flex-1 p-4 flex-row items-center justify-center space-x-2 ${activeTab === 'contacts' ? 'border-b-2 border-blue-500' : ''}`}
                    >
                        <Users className={`w-5 h-5 ${activeTab === 'contacts' ? 'text-blue-500' : 'text-gray-500'}`} />
                        <Text className={activeTab === 'contacts' ? 'text-blue-500 font-medium' : 'text-gray-500'}>Contact Persons</Text>
                    </TouchableOpacity>
                </View>

                {/* Tab Content */}
                <ScrollView className="flex-1 p-4">
                    {renderTabContent()}
                </ScrollView>

                {/* Footer */}
                <View className="p-4 bg-white border-t border-gray-200">
                    <TouchableOpacity className="bg-blue-500 p-4 rounded-lg" onPress={handleSubmit}>
                        <Text className="text-white font-medium text-center">Save Customer</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView >
        </SafeAreaView >
    );
}

