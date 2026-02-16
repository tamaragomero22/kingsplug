import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Modal, FlatList, SafeAreaView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar, ChevronDown, User as UserIcon } from 'lucide-react-native';
import apiClient from '../services/apiClient';
import { COLORS } from '../constants/theme';

const KYCScreen = ({ navigation }) => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        gender: "",
        dateOfBirth: new Date(),
        mobileNumber: "",
    });

    const [loading, setLoading] = useState(false);
    const [fetchingUser, setFetchingUser] = useState(true);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showGenderPicker, setShowGenderPicker] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await apiClient.get('/api/dashboard/data');
                const user = response.data.user;
                setFormData({
                    ...formData,
                    firstName: user.firstName || "",
                    lastName: user.lastName || "",
                    gender: user.gender || "",
                    dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth) : new Date(),
                    mobileNumber: user.mobileNumber || "",
                });
            } catch (error) {
                console.error("Failed to fetch user data for KYC:", error);
            } finally {
                setFetchingUser(false);
            }
        };
        fetchUserData();
    }, []);

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setFormData({ ...formData, dateOfBirth: selectedDate });
        }
    };

    const handleSubmit = async () => {
        if (!formData.gender) {
            Alert.alert("Error", "Please select your gender.");
            return;
        }

        setLoading(true);
        const payload = {
            ...formData,
            dateOfBirth: formData.dateOfBirth.toISOString().split('T')[0],
        };

        try {
            const response = await apiClient.post('/api/user/kyc', payload);
            Alert.alert("Success", response.data.message || "KYC information submitted successfully!");
            navigation.navigate('Dashboard');
        } catch (err) {
            Alert.alert("Error", err.response?.data?.message || "Failed to submit KYC.");
        } finally {
            setLoading(false);
        }
    };

    if (fetchingUser) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>KYC Verification</Text>
                <Text style={styles.subtitle}>Complete your profile to unlock full platform features.</Text>

                <View style={styles.formCard}>
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>First Name</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.firstName}
                            onChangeText={(val) => setFormData({ ...formData, firstName: val })}
                            placeholder="First Name"
                            placeholderTextColor={COLORS.textMuted}
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Last Name</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.lastName}
                            onChangeText={(val) => setFormData({ ...formData, lastName: val })}
                            placeholder="Last Name"
                            placeholderTextColor={COLORS.textMuted}
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Gender</Text>
                        <TouchableOpacity
                            style={styles.pickerTrigger}
                            onPress={() => setShowGenderPicker(true)}
                        >
                            <Text style={[styles.pickerTriggerText, !formData.gender && styles.placeholderText]}>
                                {formData.gender ? formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1) : "Select Gender"}
                            </Text>
                            <ChevronDown size={20} color={COLORS.textMuted} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Date of Birth</Text>
                        <TouchableOpacity
                            style={styles.pickerTrigger}
                            onPress={() => setShowDatePicker(true)}
                        >
                            <Text style={styles.pickerTriggerText}>
                                {formData.dateOfBirth.toDateString()}
                            </Text>
                            <Calendar size={20} color={COLORS.textMuted} />
                        </TouchableOpacity>
                        {showDatePicker && (
                            <DateTimePicker
                                value={formData.dateOfBirth}
                                mode="date"
                                display="default"
                                onChange={handleDateChange}
                                maximumDate={new Date()}
                            />
                        )}
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Mobile Number</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.mobileNumber}
                            onChangeText={(val) => setFormData({ ...formData, mobileNumber: val })}
                            placeholder="E.g +234 800 000 0000"
                            placeholderTextColor={COLORS.textMuted}
                            keyboardType="phone-pad"
                        />
                    </View>
                </View>

                <TouchableOpacity
                    style={[styles.submitBtn, loading && styles.disabled]}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    {loading ? <ActivityIndicator color={COLORS.background} /> : <Text style={styles.submitBtnText}>Submit Verification</Text>}
                </TouchableOpacity>
            </ScrollView>

            <Modal visible={showGenderPicker} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <UserIcon size={24} color={COLORS.primary} style={styles.modalHeaderIcon} />
                            <Text style={styles.modalTitle}>Select Gender</Text>
                        </View>
                        {['male', 'female', 'other'].map((option) => (
                            <TouchableOpacity
                                key={option}
                                style={styles.optionItem}
                                onPress={() => {
                                    setFormData({ ...formData, gender: option });
                                    setShowGenderPicker(false);
                                }}
                            >
                                <Text style={styles.optionText}>{option.charAt(0).toUpperCase() + option.slice(1)}</Text>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity style={styles.closeBtn} onPress={() => setShowGenderPicker(false)}>
                            <Text style={styles.closeBtnText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    container: {
        flex: 1,
    },
    content: {
        padding: 24,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 8,
        color: COLORS.text,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 15,
        color: COLORS.textMuted,
        textAlign: 'center',
        marginBottom: 35,
        lineHeight: 22,
    },
    formCard: {
        backgroundColor: COLORS.card,
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: 30,
    },
    formGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        color: COLORS.textMuted,
        fontWeight: '600',
        marginBottom: 8,
    },
    input: {
        backgroundColor: COLORS.inputBg,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 12,
        padding: 14,
        fontSize: 16,
        color: COLORS.text,
    },
    placeholderText: {
        color: COLORS.textMuted,
    },
    pickerTrigger: {
        backgroundColor: COLORS.inputBg,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 12,
        padding: 14,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    pickerTriggerText: {
        fontSize: 16,
        color: COLORS.text,
    },
    submitBtn: {
        backgroundColor: COLORS.primary,
        padding: 20,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
        marginBottom: 40,
    },
    submitBtnText: {
        color: COLORS.background,
        fontWeight: 'bold',
        fontSize: 18,
    },
    disabled: {
        opacity: 0.6,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: COLORS.card,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 30,
        paddingBottom: 50,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 25,
    },
    modalHeaderIcon: {
        marginRight: 10,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    optionItem: {
        paddingVertical: 18,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    optionText: {
        fontSize: 18,
        textAlign: 'center',
        color: COLORS.textSecondary,
    },
    closeBtn: {
        marginTop: 20,
        padding: 15,
    },
    closeBtnText: {
        color: COLORS.error,
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 16,
    },
});

export default KYCScreen;
