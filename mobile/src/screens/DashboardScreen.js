import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert, SafeAreaView } from 'react-native';
import { useAuth } from '../context/AuthContext';
import apiClient from '../services/apiClient';
import SendBitcoin from '../components/SendBitcoin';
import { LogOut, RefreshCcw } from 'lucide-react-native';
import { COLORS } from '../constants/theme';

const DashboardScreen = ({ navigation }) => {
    const { logout } = useAuth();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [btcPrice, setBtcPrice] = useState(null);
    const [btcPriceLoading, setBtcPriceLoading] = useState(true);
    const [btcPriceError, setBtcPriceError] = useState(false);

    const fetchDashboardData = async () => {
        try {
            const response = await apiClient.get('/api/dashboard/data');
            setUserData(response.data.user);
        } catch (error) {
            console.error("Dashboard error:", error.message);
            if (error.response) {
                console.error("Dashboard error response data:", error.response.data);
                console.error("Dashboard error response status:", error.response.status);
            }

            if (error.response?.status === 401) {
                console.log("Unauthorized! Clearing stale session.");
                Alert.alert("Session Expired", "Please log in again.");
                logout();
            } else {
                Alert.alert("Error", "Failed to fetch dashboard data.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchBtcPrice = async () => {
        setBtcPriceLoading(true);
        setBtcPriceError(false);
        try {
            const res = await fetch(
                'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,ngn'
            );
            if (!res.ok) throw new Error('CoinGecko API error');
            const data = await res.json();
            const usdToNgn = data.bitcoin.ngn / data.bitcoin.usd;
            setBtcPrice(Math.round(usdToNgn));
        } catch (err) {
            console.error('BTC price fetch error:', err);
            setBtcPriceError(true);
        } finally {
            setBtcPriceLoading(false);
        }
    };

    useEffect(() => {
        fetchBtcPrice();
        const interval = setInterval(fetchBtcPrice, 60000); // refresh every 60s
        return () => clearInterval(interval);
    }, []);

    const handleLogout = () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to log out?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Logout", onPress: logout, style: 'destructive' }
            ]
        );
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.welcomeText}>Welcome,</Text>
                        <Text style={styles.nameText}>{userData?.firstName || 'User'}</Text>
                    </View>
                    <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
                        <LogOut size={24} color={COLORS.error} />
                    </TouchableOpacity>
                </View>

                <View style={styles.ratesGrid}>
                    <View style={styles.rateCard}>
                        <Text style={styles.rateLabel}>BTC Rate</Text>
                        <Text style={styles.rateValue}>
                            {btcPriceLoading
                                ? 'Loading...'
                                : btcPriceError
                                    ? 'Error'
                                    : `\u20A6${btcPrice.toLocaleString('en-NG')}`}
                        </Text>
                    </View>
                    <View style={styles.rateCard}>
                        <Text style={styles.rateLabel}>USDT Rate</Text>
                        <Text style={styles.rateValue}>₦1,470</Text>
                    </View>
                    <View style={styles.rateCard}>
                        <Text style={styles.rateLabel}>ETH Rate</Text>
                        <Text style={styles.rateValue}>₦1,420</Text>
                    </View>
                    <View style={styles.rateCard}>
                        <Text style={styles.rateLabel}>USDC Rate</Text>
                        <Text style={styles.rateValue}>₦1,460</Text>
                    </View>
                </View>

                {userData?.isKycVerified ? (
                    <SendBitcoin />
                ) : (
                    <View style={styles.kycNotice}>
                        <Text style={styles.kycTitle}>KYC Verification Required</Text>
                        <Text style={styles.kycText}>
                            KYC completion is necessary! This enables us to verify every user of Kingsplug.
                            Once you have completed KYC, you're protected from fraud and other financial crimes.
                        </Text>
                        <TouchableOpacity
                            style={styles.kycBtn}
                            onPress={() => navigation.navigate('KYC')}
                        >
                            <Text style={styles.kycBtnText}>Complete my KYC</Text>
                        </TouchableOpacity>
                    </View>
                )}

                <TouchableOpacity style={styles.refreshBtn} onPress={fetchDashboardData}>
                    <RefreshCcw size={18} color={COLORS.textSecondary} />
                    <Text style={styles.refreshText}>Refresh Data</Text>
                </TouchableOpacity>

                <View style={styles.footerLinks}>
                    <TouchableOpacity onPress={() => navigation.navigate('About')}>
                        <Text style={styles.footerLinkText}>About Us</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Terms')}>
                        <Text style={styles.footerLinkText}>Terms of Service</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
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
        padding: 20,
        paddingBottom: 40,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 35,
        marginTop: 10,
    },
    welcomeText: {
        fontSize: 16,
        color: COLORS.textMuted,
        marginBottom: 4,
    },
    nameText: {
        fontSize: 26,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    logoutBtn: {
        padding: 12,
        borderRadius: 50,
        backgroundColor: 'rgba(255, 59, 48, 0.1)',
    },
    ratesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    rateCard: {
        width: '48%',
        backgroundColor: COLORS.card,
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: 15,
    },
    rateLabel: {
        fontSize: 14,
        color: COLORS.textMuted,
        marginBottom: 8,
    },
    rateValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    kycNotice: {
        backgroundColor: 'rgba(255, 204, 0, 0.05)',
        padding: 24,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 204, 0, 0.2)',
        marginBottom: 30,
    },
    kycTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.warning,
        marginBottom: 12,
    },
    kycText: {
        fontSize: 14,
        color: COLORS.textSecondary,
        lineHeight: 22,
        marginBottom: 24,
    },
    kycBtn: {
        backgroundColor: COLORS.primary,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    kycBtnText: {
        color: COLORS.background,
        fontWeight: 'bold',
    },
    refreshBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        padding: 15,
    },
    refreshText: {
        marginLeft: 10,
        color: COLORS.textSecondary,
        fontSize: 15,
    },
    footerLinks: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 40,
        paddingTop: 30,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },
    footerLinkText: {
        color: COLORS.textMuted,
        fontSize: 14,
    },
});

export default DashboardScreen;
