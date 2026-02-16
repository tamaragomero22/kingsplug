import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, Modal, FlatList, SafeAreaView } from 'react-native';
import { ChevronDown, X } from 'lucide-react-native';
import apiClient from '../services/apiClient';
import { COLORS } from '../constants/theme';

const banks = [
    { name: "Access Bank", code: "044" },
    { name: "Citibank Nigeria", code: "023" },
    { name: "Ecobank Nigeria", code: "050" },
    { name: "Fidelity Bank", code: "070" },
    { name: "First Bank of Nigeria", code: "011" },
    { name: "First City Monument Bank (FCMB)", code: "214" },
    { name: "Globus Bank", code: "00103" },
    { name: "Guaranty Trust Bank (GTB)", code: "058" },
    { name: "Heritage Bank", code: "030" },
    { name: "Jaiz Bank", code: "301" },
    { name: "Keystone Bank", code: "082" },
    { name: "Kuda Bank", code: "50211" },
    { name: "Moniepoint MFB", code: "50515" },
    { name: "Opay", code: "999992" },
    { name: "Palmpay", code: "999991" },
    { name: "Polaris Bank", code: "076" },
    { name: "Providus Bank", code: "101" },
    { name: "Stanbic IBTC Bank", code: "221" },
    { name: "Standard Chartered Bank", code: "068" },
    { name: "Sterling Bank", code: "232" },
    { name: "Union Bank of Nigeria", code: "032" },
    { name: "United Bank For Africa (UBA)", code: "033" },
    { name: "Unity Bank", code: "215" },
    { name: "VFD Microfinance Bank", code: "566" },
    { name: "Wema Bank", code: "035" },
    { name: "Zenith Bank", code: "057" },
].sort((a, b) => a.name.localeCompare(b.name));

const AddBankAccount = ({ onSave, onCancel }) => {
    const [accountName, setAccountName] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [bankCode, setBankCode] = useState("");
    const [bankName, setBankName] = useState("");
    const [loading, setLoading] = useState(false);
    const [resolving, setResolving] = useState(false);
    const [showPicker, setShowPicker] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredBanks = banks.filter(bank =>
        bank.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleResolveName = async (num, code) => {
        if (num.length === 10 && code) {
            setResolving(true);
            try {
                const response = await apiClient.post('/api/user/resolve-bank', { accountNumber: num, bankCode: code });
                if (response.data.success) {
                    setAccountName(response.data.accountName);
                }
            } catch (err) {
                setAccountName("");
            } finally {
                setResolving(false);
            }
        }
    };

    const handleNumberChange = (val) => {
        const cleaned = val.replace(/\D/g, "").slice(0, 10);
        setAccountNumber(cleaned);
        if (cleaned.length === 10 && bankCode) {
            handleResolveName(cleaned, bankCode);
        }
    };

    const handleBankSelect = (bank) => {
        setBankCode(bank.code);
        setBankName(bank.name);
        setShowPicker(false);
        setSearchQuery("");
        if (accountNumber.length === 10) {
            handleResolveName(accountNumber, bank.code);
        }
    };

    const handleSubmit = async () => {
        if (!accountName) {
            Alert.alert("Error", "Please ensure the account name is resolved.");
            return;
        }
        setLoading(true);
        try {
            const response = await apiClient.post('/api/user/bank-account', { accountName, accountNumber, bankName });
            if (response.data.success) {
                Alert.alert("Success", "Bank account saved successfully!");
                onSave(response.data.bankAccount);
            }
        } catch (err) {
            Alert.alert("Error", err.response?.data?.message || "Failed to save bank account.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Add Bank Account</Text>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Select Bank</Text>
                <TouchableOpacity style={styles.pickerButton} onPress={() => setShowPicker(true)}>
                    <Text style={[styles.pickerButtonText, !bankName && styles.placeholderText]}>
                        {bankName || "Choose your bank"}
                    </Text>
                    <ChevronDown size={20} color={COLORS.textMuted} />
                </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Account Number</Text>
                <TextInput
                    style={styles.input}
                    placeholder="E.g 0123456789"
                    placeholderTextColor={COLORS.textMuted}
                    value={accountNumber}
                    onChangeText={handleNumberChange}
                    keyboardType="number-pad"
                    maxLength={10}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Account Name</Text>
                <View style={styles.nameContainer}>
                    <TextInput
                        style={[styles.input, styles.readOnly]}
                        placeholder={resolving ? "Resolving..." : "Verified Account Name"}
                        placeholderTextColor={COLORS.textMuted}
                        value={accountName}
                        editable={false}
                    />
                    {resolving && <ActivityIndicator style={styles.loader} size="small" color={COLORS.primary} />}
                </View>
            </View>

            <View style={styles.buttonGroup}>
                <TouchableOpacity
                    style={[styles.saveButton, (loading || resolving || !accountName) && styles.disabled]}
                    onPress={handleSubmit}
                    disabled={loading || resolving || !accountName}
                >
                    {loading ? <ActivityIndicator color={COLORS.background} /> : <Text style={styles.saveButtonText}>Save Details</Text>}
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
            </View>

            <Modal visible={showPicker} animationType="slide" transparent={false}>
                <SafeAreaView style={styles.modalBg}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Bank</Text>
                            <TouchableOpacity onPress={() => { setShowPicker(false); setSearchQuery(""); }}>
                                <X size={24} color={COLORS.text} />
                            </TouchableOpacity>
                        </View>

                        <TextInput
                            style={styles.searchBar}
                            placeholder="Search banks..."
                            placeholderTextColor={COLORS.textMuted}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />

                        <FlatList
                            data={filteredBanks}
                            keyExtractor={(item) => item.code}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={styles.bankItem} onPress={() => handleBankSelect(item)}>
                                    <Text style={styles.bankName}>{item.name}</Text>
                                </TouchableOpacity>
                            )}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                </SafeAreaView>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.card,
        padding: 24,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 25,
        textAlign: 'center',
        color: COLORS.text,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        color: COLORS.textMuted,
        marginBottom: 8,
        fontWeight: '500',
    },
    pickerButton: {
        backgroundColor: COLORS.inputBg,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    pickerButtonText: {
        fontSize: 16,
        color: COLORS.text,
    },
    placeholderText: {
        color: COLORS.textMuted,
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
    readOnly: {
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        color: COLORS.primary,
        fontWeight: 'bold',
    },
    nameContainer: {
        position: 'relative',
    },
    loader: {
        position: 'absolute',
        right: 15,
        top: 15,
    },
    buttonGroup: {
        marginTop: 10,
        gap: 12,
    },
    saveButton: {
        backgroundColor: COLORS.primary,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    saveButtonText: {
        color: COLORS.background,
        fontWeight: 'bold',
        fontSize: 16,
    },
    cancelButton: {
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: COLORS.textMuted,
        fontWeight: '600',
        fontSize: 15,
    },
    disabled: {
        opacity: 0.5,
    },
    modalBg: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    modalContent: {
        flex: 1,
        padding: 24,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    searchBar: {
        backgroundColor: COLORS.inputBg,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 12,
        padding: 14,
        fontSize: 16,
        color: COLORS.text,
        marginBottom: 20,
    },
    bankItem: {
        paddingVertical: 18,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    bankName: {
        fontSize: 16,
        color: COLORS.textSecondary,
    },
});

export default AddBankAccount;
