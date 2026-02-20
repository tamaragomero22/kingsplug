import React, { useState, useEffect } from 'react';
import {
    StyleSheet, View, Text, TouchableOpacity,
    ActivityIndicator, Alert
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { CheckCircle, Square, CheckSquare, Copy, RefreshCw } from 'lucide-react-native';
import apiClient from '../services/apiClient';
import AddBankAccount from './AddBankAccount';
import { COLORS } from '../constants/theme';

const CURRENCY_OPTIONS = [
    { label: 'Nigerian Naira (NGN)', value: 'NGN', symbol: '₦' },
];

const SendBitcoin = () => {
    const [bankAccount, setBankAccount] = useState(null);
    const [showBankForm, setShowBankForm] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedCurrency, setSelectedCurrency] = useState(null);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [showAgreement, setShowAgreement] = useState(false);
    const [agreeNetwork, setAgreeNetwork] = useState(false);
    const [agreeMinPayout, setAgreeMinPayout] = useState(false);
    const [loading, setLoading] = useState(false);
    const [walletAddress, setWalletAddress] = useState(null);
    const [copied, setCopied] = useState(false);
    const [generatingNew, setGeneratingNew] = useState(false);

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
            console.error('Failed to fetch bank details:', err);
        }
    };

    const handleConvertPress = () => {
        setShowDropdown((prev) => !prev);
        setSelectedCurrency(null);
        setSelectedAccount(null);
        setShowAgreement(false);
        setAgreeNetwork(false);
        setAgreeMinPayout(false);
        setWalletAddress(null);
    };

    const handleCurrencySelect = (opt) => {
        setSelectedCurrency(opt);
        setSelectedAccount(null);
        setShowAgreement(false);
        setAgreeNetwork(false);
        setAgreeMinPayout(false);
        setWalletAddress(null);
    };

    const handleConfirmAccount = () => {
        if (!selectedAccount) {
            Alert.alert('Notice', 'Please select a payout account to proceed.');
            return;
        }
        setShowAgreement(true);
    };

    const handleContinue = async () => {
        setLoading(true);
        try {
            const res = await apiClient.post('/api/bitcoin/generate-address');
            if (res.data.success) {
                setWalletAddress(res.data.address);
                setShowAgreement(false);
            }
        } catch (err) {
            Alert.alert('Error', err.response?.data?.message || 'Failed to generate wallet address.');
        } finally {
            setLoading(false);
        }
    };

    const handleRequestNewAddress = async () => {
        setGeneratingNew(true);
        setCopied(false);
        try {
            const res = await apiClient.post('/api/bitcoin/new-address');
            if (res.data.success) {
                setWalletAddress(res.data.address);
            }
        } catch (err) {
            Alert.alert('Error', err.response?.data?.message || 'Failed to generate new address.');
        } finally {
            setGeneratingNew(false);
        }
    };

    const handleCopy = async () => {
        try {
            await Clipboard.setStringAsync(walletAddress);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            Alert.alert('Error', 'Failed to copy address.');
        }
    };

    if (showBankForm) {
        return (
            <AddBankAccount
                onSave={(data) => {
                    setBankAccount(data);
                    setSelectedAccount(data);
                    setShowBankForm(false);
                }}
                onCancel={() => setShowBankForm(false)}
            />
        );
    }

    return (
        <View style={styles.container}>
            {/* Main convert button */}
            <TouchableOpacity style={styles.sendBtn} onPress={handleConvertPress}>
                <Text style={styles.sendBtnText}>
                    {showDropdown ? 'Close' : 'Convert Bitcoin to Cash'}
                </Text>
            </TouchableOpacity>

            {/* Dropdown panel */}
            {showDropdown && (
                <View style={styles.dropdownPanel}>

                    {/* Step 1 — Currency selection */}
                    <Text style={styles.dropdownTitle}>Select your currency</Text>
                    {CURRENCY_OPTIONS.map((opt) => {
                        const isSelected = selectedCurrency?.value === opt.value;
                        return (
                            <TouchableOpacity
                                key={opt.value}
                                style={[styles.currencyOption, isSelected && styles.currencyOptionSelected]}
                                onPress={() => handleCurrencySelect(opt)}
                            >
                                <Text style={styles.currencySymbol}>{opt.symbol}</Text>
                                <Text style={styles.currencyLabel}>{opt.label}</Text>
                                {isSelected && (
                                    <CheckCircle size={20} color={COLORS.primary} />
                                )}
                            </TouchableOpacity>
                        );
                    })}

                    {/* Step 2 — Payout account selection */}
                    {selectedCurrency && !walletAddress && !showAgreement && (
                        <View style={styles.payoutSection}>
                            <Text style={styles.payoutSectionTitle}>Select your Nigerian Payout Account</Text>

                            {bankAccount ? (
                                <>
                                    <TouchableOpacity
                                        style={[
                                            styles.payoutAccountCard,
                                            selectedAccount && styles.payoutAccountCardSelected,
                                        ]}
                                        onPress={() => setSelectedAccount(bankAccount)}
                                    >
                                        <View style={styles.payoutAccountInfo}>
                                            <Text style={styles.payoutBankIcon}>🏦</Text>
                                            <View style={styles.payoutAccountDetails}>
                                                <Text style={styles.payoutAccountName}>{bankAccount.accountName}</Text>
                                                <Text style={styles.payoutAccountSub}>
                                                    {bankAccount.bankName} · {bankAccount.accountNumber}
                                                </Text>
                                            </View>
                                        </View>
                                        {selectedAccount && (
                                            <CheckCircle size={20} color={COLORS.primary} />
                                        )}
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.addPayoutBtn}
                                        onPress={() => setShowBankForm(true)}
                                    >
                                        <Text style={styles.addPayoutBtnText}>+ Add new payout account</Text>
                                    </TouchableOpacity>
                                </>
                            ) : (
                                <TouchableOpacity
                                    style={[styles.addPayoutBtn, styles.addPayoutBtnPrimary]}
                                    onPress={() => setShowBankForm(true)}
                                >
                                    <Text style={styles.addPayoutBtnText}>+ Add new payout account</Text>
                                </TouchableOpacity>
                            )}

                            {selectedAccount && (
                                <TouchableOpacity style={styles.proceedBtn} onPress={handleConfirmAccount}>
                                    <Text style={styles.proceedBtnText}>Confirm payout account</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}

                    {/* Step 3 — Confirmation Agreement */}
                    {showAgreement && !walletAddress && (
                        <View style={styles.agreementSection}>
                            <Text style={styles.agreementTitle}>Confirmation Agreement</Text>
                            <Text style={styles.agreementDesc}>
                                Please agree to the terms and conditions below to generate your wallet address for converting your bitcoin to Naira.
                            </Text>

                            <TouchableOpacity
                                style={styles.checkboxRow}
                                onPress={() => setAgreeNetwork(!agreeNetwork)}
                                activeOpacity={0.7}
                            >
                                {agreeNetwork
                                    ? <CheckSquare size={22} color={COLORS.primary} />
                                    : <Square size={22} color={COLORS.textMuted} />}
                                <Text style={styles.checkboxLabel}>
                                    I agree that I am transferring Bitcoin from the BTC network that supports this wallet address.
                                </Text>
                            </TouchableOpacity>

                            <View style={styles.warningBox}>
                                <Text style={styles.warningText}>
                                    Kingsplug is not responsible for any loss by sending assets to the wrong wallet address or through the wrong network.
                                </Text>
                            </View>

                            <TouchableOpacity
                                style={styles.checkboxRow}
                                onPress={() => setAgreeMinPayout(!agreeMinPayout)}
                                activeOpacity={0.7}
                            >
                                {agreeMinPayout
                                    ? <CheckSquare size={22} color={COLORS.primary} />
                                    : <Square size={22} color={COLORS.textMuted} />}
                                <Text style={styles.checkboxLabel}>
                                    I am aware that the minimum payout is ₦1,000
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.proceedBtn, (!agreeNetwork || !agreeMinPayout || loading) && styles.disabled]}
                                onPress={handleContinue}
                                disabled={!agreeNetwork || !agreeMinPayout || loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.proceedBtnText}>Continue</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Step 4 — Wallet Address Display */}
                    {walletAddress && (
                        <View style={styles.walletSection}>
                            <View style={styles.walletCard}>
                                <Text style={styles.walletLabel}>Your Bitcoin Wallet Address</Text>
                                <View style={styles.walletAddressBox}>
                                    <Text style={styles.walletAddressText} selectable>{walletAddress}</Text>
                                </View>
                                <View style={styles.walletActions}>
                                    <TouchableOpacity style={styles.walletCopyBtn} onPress={handleCopy}>
                                        <Copy size={16} color="#1a1a2e" />
                                        <Text style={styles.walletCopyText}>
                                            {copied ? 'Copied!' : 'Copy Address'}
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.walletNewBtn, generatingNew && styles.disabled]}
                                        onPress={handleRequestNewAddress}
                                        disabled={generatingNew}
                                    >
                                        {generatingNew ? (
                                            <ActivityIndicator size="small" color="#fff" />
                                        ) : (
                                            <>
                                                <RefreshCw size={16} color="#fff" />
                                                <Text style={styles.walletNewText}>New address</Text>
                                            </>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <Text style={styles.walletInfoText}>
                                Send Bitcoin (BTC) to the address above. Only send BTC via the Bitcoin (BTC) network.
                            </Text>
                        </View>
                    )}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
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
    // ─── Dropdown ───
    dropdownPanel: {
        marginTop: 16,
        backgroundColor: COLORS.card,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: COLORS.border,
        padding: 20,
    },
    dropdownTitle: {
        fontSize: 11,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        color: COLORS.textMuted,
        marginBottom: 14,
    },
    currencyOption: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 16,
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: COLORS.border,
        backgroundColor: COLORS.inputBg,
        marginBottom: 8,
    },
    currencyOptionSelected: {
        borderColor: COLORS.primary,
        backgroundColor: 'rgba(149, 128, 255, 0.08)',
    },
    currencySymbol: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.primary,
        width: 28,
    },
    currencyLabel: {
        flex: 1,
        fontSize: 15,
        fontWeight: '500',
        color: COLORS.text,
    },
    // ─── Payout section ───
    payoutSection: {
        marginTop: 20,
        gap: 12,
    },
    payoutSectionTitle: {
        fontSize: 11,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        color: COLORS.textMuted,
        marginBottom: 4,
    },
    payoutAccountCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: COLORS.border,
        backgroundColor: COLORS.inputBg,
    },
    payoutAccountCardSelected: {
        borderColor: COLORS.primary,
        backgroundColor: 'rgba(149, 128, 255, 0.08)',
    },
    payoutAccountInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    payoutBankIcon: {
        fontSize: 24,
    },
    payoutAccountDetails: {
        flex: 1,
    },
    payoutAccountName: {
        fontSize: 15,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: 3,
    },
    payoutAccountSub: {
        fontSize: 13,
        color: COLORS.textSecondary,
    },
    addPayoutBtn: {
        padding: 16,
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: COLORS.border,
        borderStyle: 'dashed',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    addPayoutBtnPrimary: {
        borderStyle: 'solid',
        borderColor: COLORS.primary,
        backgroundColor: 'rgba(149, 128, 255, 0.06)',
    },
    addPayoutBtnText: {
        color: COLORS.primary,
        fontWeight: '600',
        fontSize: 15,
    },
    proceedBtn: {
        backgroundColor: COLORS.primary,
        padding: 18,
        borderRadius: 14,
        alignItems: 'center',
        marginTop: 4,
        elevation: 3,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
    },
    proceedBtnText: {
        color: COLORS.background,
        fontWeight: 'bold',
        fontSize: 16,
    },
    disabled: {
        opacity: 0.6,
    },
    // ─── Agreement section ───
    agreementSection: {
        marginTop: 20,
        backgroundColor: COLORS.card,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
        padding: 20,
        gap: 12,
    },
    agreementTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    agreementDesc: {
        fontSize: 14,
        color: COLORS.textSecondary,
        lineHeight: 22,
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
    },
    checkboxLabel: {
        flex: 1,
        fontSize: 14,
        color: COLORS.text,
        lineHeight: 22,
    },
    warningBox: {
        backgroundColor: 'rgba(255, 59, 48, 0.06)',
        borderWidth: 1,
        borderColor: 'rgba(255, 59, 48, 0.2)',
        borderRadius: 10,
        padding: 14,
    },
    warningText: {
        fontSize: 13,
        color: '#c0392b',
        lineHeight: 20,
    },
    // ─── Wallet Address ───
    walletSection: {
        marginTop: 20,
    },
    walletCard: {
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        backgroundColor: '#1a1a2e',
    },
    walletLabel: {
        fontSize: 11,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        color: 'rgba(255, 255, 255, 0.6)',
        marginBottom: 14,
    },
    walletAddressBox: {
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        borderWidth: 1,
        borderColor: 'rgba(128, 255, 234, 0.2)',
        borderRadius: 10,
        padding: 14,
        width: '100%',
        marginBottom: 16,
    },
    walletAddressText: {
        fontFamily: 'monospace',
        fontSize: 13,
        color: '#80ffea',
        textAlign: 'center',
        lineHeight: 22,
    },
    walletActions: {
        flexDirection: 'row',
        gap: 10,
        width: '100%',
    },
    walletCopyBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        backgroundColor: '#80ffea',
        padding: 14,
        borderRadius: 50,
    },
    walletCopyText: {
        fontWeight: '700',
        fontSize: 14,
        color: '#1a1a2e',
    },
    walletNewBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: 14,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    walletNewText: {
        fontWeight: '600',
        fontSize: 14,
        color: '#fff',
    },
    walletInfoText: {
        fontSize: 13,
        color: COLORS.textMuted,
        textAlign: 'center',
        marginTop: 14,
        lineHeight: 20,
    },
    // ─── Success ───
    successBox: {
        marginTop: 16,
        backgroundColor: 'rgba(34, 197, 94, 0.08)',
        borderWidth: 1,
        borderColor: 'rgba(34, 197, 94, 0.3)',
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        gap: 12,
    },
    successText: {
        color: COLORS.text,
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 22,
    },
});

export default SendBitcoin;
