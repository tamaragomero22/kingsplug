import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import QRCode from 'react-native-qrcode-svg';
import { Copy } from 'lucide-react-native';
import apiClient from '../services/apiClient';
import AddBankAccount from './AddBankAccount';
import { COLORS } from '../constants/theme';

const SendBitcoin = () => {
    const [address, setAddress] = useState("");
    const [loading, setLoading] = useState(false);
    const [showBtcDetails, setShowBtcDetails] = useState(false);
    const [bankAccount, setBankAccount] = useState(null);
    const [showBankForm, setShowBankForm] = useState(false);

    useEffect(() => {
        fetchBankDetails();
    }, []);

    const fetchBankDetails = async () => {
        try {
            const res = await apiClient.get('/api/user/bank-account');
            if (res.data.success && res.data.bankAccount) {
                setBankAccount(res.data.bankAccount);
            }
        } catch (err) {
            console.error("Failed to fetch bank details:", err);
        }
    };

    const fetchAddress = async () => {
        if (!bankAccount) {
            Alert.alert("Notice", "Please add a bank account first before you can convert bitcoin to cash.");
            return;
        }
        setLoading(true);
        try {
            const res = await apiClient.get('/api/bitcoin/address');
            setAddress(res.data.address);
            setShowBtcDetails(true);
        } catch (err) {
            Alert.alert("Error", "Failed to fetch Bitcoin address. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = async () => {
        await Clipboard.setStringAsync(address);
        Alert.alert("Copied", "Bitcoin address copied to clipboard");
    };

    if (showBankForm) {
        return (
            <AddBankAccount
                onSave={(data) => {
                    setBankAccount(data);
                    setShowBankForm(false);
                }}
                onCancel={() => setShowBankForm(false)}
            />
        );
    }

    return (
        <View style={styles.container}>
            {bankAccount ? (
                <View style={styles.bankInfoBox}>
                    <Text style={styles.bankLabel}>Saved Bank Account</Text>
                    <Text style={styles.bankNameText}>{bankAccount.accountName}</Text>
                    <Text style={styles.bankDetailsText}>{bankAccount.bankName} - {bankAccount.accountNumber}</Text>
                    <TouchableOpacity onPress={() => setShowBankForm(true)} style={styles.changeBtn}>
                        <Text style={styles.changeAccountText}>Change Account</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <TouchableOpacity style={styles.bankBtn} onPress={() => setShowBankForm(true)}>
                    <Text style={styles.bankBtnText}>+ Add Bank Account</Text>
                </TouchableOpacity>
            )}

            <TouchableOpacity
                style={[styles.sendBtn, loading && styles.disabled]}
                onPress={fetchAddress}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color={COLORS.background} />
                ) : (
                    <Text style={styles.sendBtnText}>Convert Bitcoin to Cash</Text>
                )}
            </TouchableOpacity>

            {showBtcDetails && (
                <View style={styles.addressBox}>
                    <Text style={styles.addressTitle}>Deposit Bitcoin</Text>
                    <Text style={styles.addressSubtitle}>Send the amount of BTC you wish to convert to the address below.</Text>

                    <View style={styles.btcAddressContainer}>
                        <Text style={styles.btcAddress} selectable={true}>{address}</Text>
                        <TouchableOpacity style={styles.copyIconBtn} onPress={copyToClipboard}>
                            <Copy size={20} color={COLORS.primary} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.qrWrapper}>
                        {address ? <QRCode value={address} size={200} backgroundColor="transparent" color={COLORS.text} /> : null}
                    </View>

                    <TouchableOpacity style={styles.copyBtn} onPress={copyToClipboard}>
                        <Text style={styles.copyBtnText}>Copy Address</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    bankInfoBox: {
        backgroundColor: COLORS.card,
        padding: 24,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: 20,
    },
    bankLabel: {
        color: COLORS.textMuted,
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginBottom: 12,
    },
    bankNameText: {
        color: COLORS.text,
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 6,
    },
    bankDetailsText: {
        color: COLORS.textSecondary,
        fontSize: 16,
    },
    changeBtn: {
        marginTop: 15,
        alignSelf: 'flex-start',
    },
    changeAccountText: {
        color: COLORS.secondary,
        fontSize: 14,
        fontWeight: '600',
    },
    bankBtn: {
        backgroundColor: COLORS.inputBg,
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderStyle: 'dashed',
        alignItems: 'center',
        marginBottom: 20,
    },
    bankBtnText: {
        color: COLORS.primary,
        fontWeight: 'bold',
        fontSize: 16,
    },
    sendBtn: {
        backgroundColor: COLORS.primary,
        padding: 20,
        borderRadius: 16,
        alignItems: 'center',
        elevation: 4,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    sendBtnText: {
        color: COLORS.background,
        fontWeight: 'bold',
        fontSize: 18,
    },
    disabled: {
        opacity: 0.6,
    },
    addressBox: {
        marginTop: 30,
        padding: 24,
        backgroundColor: COLORS.card,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: COLORS.border,
        alignItems: 'center',
    },
    addressTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 8,
    },
    addressSubtitle: {
        fontSize: 14,
        color: COLORS.textMuted,
        textAlign: 'center',
        marginBottom: 25,
        lineHeight: 20,
    },
    btcAddressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        padding: 12,
        paddingLeft: 20,
        borderRadius: 12,
        width: '100%',
        marginBottom: 25,
    },
    btcAddress: {
        flex: 1,
        fontSize: 13,
        color: COLORS.textSecondary,
        fontWeight: '500',
    },
    copyIconBtn: {
        padding: 8,
    },
    copyBtn: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: COLORS.primary,
        paddingVertical: 14,
        paddingHorizontal: 30,
        borderRadius: 12,
        marginTop: 25,
        width: '100%',
        alignItems: 'center',
    },
    copyBtnText: {
        color: COLORS.primary,
        fontWeight: 'bold',
        fontSize: 16,
    },
    qrWrapper: {
        padding: 20,
        backgroundColor: '#fff', // Keep QR background white for scanability
        borderRadius: 20,
        elevation: 2,
    },
});

export default SendBitcoin;
