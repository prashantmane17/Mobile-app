
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, ActivityIndicator, ScrollView, SafeAreaView } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { setTimeZone } from '../api/admin/adminApi';


// Time zone API endpoint
const TIME_ZONE_API = 'http://api.timezonedb.com/v2.1/list-time-zone?key=F7PN7NVN1I4U&format=json';

export default function TimeZoneForm({ onClose }) {
    const [timeZones, setTimeZones] = useState([]);
    const [filteredTimeZones, setFilteredTimeZones] = useState([]);
    const [selectedTimeZone, setSelectedTimeZone] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [startMonth, setStartMonth] = useState('');
    const [endMonth, setEndMonth] = useState('');
    const [currency, setCurrency] = useState('United States Dollar (USD) - $');
    const [loading, setLoading] = useState(false);
    const [showTimeZoneList, setShowTimeZoneList] = useState(false);

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const currencies = [
        'United States Dollar (USD) - $',
        'Euro (EUR) - €',
        'British Pound (GBP) - £',
        'Japanese Yen (JPY) - ¥',
        'Canadian Dollar (CAD) - $',
        'Australian Dollar (AUD) - $'
    ];


    useEffect(() => {
        const fetchTimeZones = async () => {
            try {
                setLoading(true);
                const response = await fetch(TIME_ZONE_API);
                const data = await response.json();
                setTimeZones(data.zones);
                setFilteredTimeZones(data.zones);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching time zones:', error);
                setLoading(false);
            }
        };

        fetchTimeZones();
    }, []);

    useEffect(() => {
        if (searchQuery) {
            const filtered = timeZones.filter(zone =>
                zone.countryName.toLowerCase().includes(searchQuery.toLowerCase()) || zone.zoneName.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredTimeZones(filtered);
        } else {
            setFilteredTimeZones(timeZones);
        }
    }, [searchQuery, timeZones]);

    const handleTimeZoneSelect = (zone) => {
        setSelectedTimeZone(zone);
        setShowTimeZoneList(false);
        setSearchQuery('');
    };

    const handleSubmit = async () => {

        const formData = {
            timeZone: selectedTimeZone,
            startMonth: startMonth,
            endMonth: endMonth,
            currency: currency
        };

        try {
            const response = await setTimeZone(formData);
            console.log("Response status:", response.ok);

            // If setTimeZone uses fetch, you may need to parse the JSON response
            console.log("Response data:", data);
        } catch (error) {
            console.error("Error setting time zone:", error);
        }


        onClose();
    };
    function formatGMTOffset(offset) {
        let hours = offset / 3600;
        let sign = hours >= 0 ? "+" : "-";
        return `GMT ${sign}${Math.abs(hours)}`;
    }

    return (
        <View >
            {/* <ScrollView showsVerticalScrollIndicator={false}> */}
            {/* Time Zone Section */}
            <View className="mb-6">
                <Text className="text-lg font-medium mb-2 text-gray-700">Time Zone</Text>
                <View className="relative">
                    <TouchableOpacity
                        className="border border-gray-300 rounded-lg p-3 bg-white"
                        onPress={() => setShowTimeZoneList(!showTimeZoneList)}
                    >
                        {showTimeZoneList ?
                            (<TextInput
                                className="border-b border-gray-300 p-2"
                                placeholder="Search time zones..."
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                            />)
                            :
                            (<Text className="text-gray-500">
                                {selectedTimeZone || "Select or Search Time Zone"}
                            </Text>)
                        }

                    </TouchableOpacity>

                    {/* Time Zone Dropdown */}
                    {showTimeZoneList && (
                        <View className="absolute top-14 left-0 right-0 bg-white border border-gray-300 rounded-lg z-10 max-h-40">

                            {loading ? (
                                <ActivityIndicator size="small" color="#3b82f6" className="py-2" />
                            ) : (
                                <ScrollView className="max-h-52">
                                    {filteredTimeZones.map((zone, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            className="p-3 border-b border-gray-100"
                                            onPress={() => handleTimeZoneSelect(zone.zoneName)}
                                        >
                                            <Text>{`[${formatGMTOffset(zone.gmtOffset)}] ${zone.zoneName}`}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            )}
                        </View>
                    )}
                </View>
            </View>

            {/* Financial Year Section */}
            <View className="mb-6">
                <Text className="text-lg font-medium mb-4 text-gray-700">Financial Year</Text>

                <View className="flex-row justify-between mb-4">
                    {/* Start Month */}
                    <View className="w-[48%]">
                        <Text className="text-base mb-2 text-gray-700">Start / From</Text>
                        <View className="border border-gray-300 rounded-lg overflow-hidden">
                            <View className="relative">
                                <Picker
                                    selectedValue={startMonth}
                                    onValueChange={(itemValue) => setStartMonth(itemValue)}
                                    className="h-12"
                                >
                                    <Picker.Item label="Select Start Month" value="" />
                                    {months.map((month, index) => (
                                        <Picker.Item key={index} label={month} value={month} />
                                    ))}
                                </Picker>
                            </View>
                        </View>
                    </View>

                    {/* End Month */}
                    <View className="w-[48%]">
                        <Text className="text-base mb-2 text-gray-700">End / To</Text>
                        <View className="border border-gray-300 rounded-lg overflow-hidden">
                            <View className="relative">
                                <Picker
                                    selectedValue={endMonth}
                                    onValueChange={(itemValue) => setEndMonth(itemValue)}
                                    className="h-12"
                                >
                                    <Picker.Item label="Select End Month" value="" />
                                    {months.map((month, index) => (
                                        <Picker.Item key={index} label={month} value={month} />
                                    ))}
                                </Picker>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Currency Selection */}
                <View className="mb-6">
                    <Text className="text-base mb-2 text-gray-700">Select Currency</Text>
                    <View className="border border-gray-300 rounded-lg overflow-hidden">
                        <View className="relative">
                            <Picker
                                selectedValue={currency}
                                onValueChange={(itemValue) => setCurrency(itemValue)}
                                className="h-12"
                            >
                                {currencies.map((curr, index) => (
                                    <Picker.Item key={index} label={curr} value={curr} />
                                ))}
                            </Picker>
                        </View>
                    </View>
                </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
                className="bg-blue-500 p-4 rounded-lg mt-4"
                onPress={handleSubmit}
            >
                <Text className="text-white text-center font-semibold text-lg">Submit</Text>
            </TouchableOpacity>
            {/* </ScrollView> */}
        </View>

    );
}