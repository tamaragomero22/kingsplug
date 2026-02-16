import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, SafeAreaView } from 'react-native';
import apiClient from '../services/apiClient';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../constants/theme';

const VerifyEmailScreen = ({ route, navigation }) => {
    const { userId, email } = route.params || {};
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(60);
    const { login } = useAuth();

    useEffect(() => {
        let interval = null;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleVerify = async () => {
        if (otp.length !== 6) {
            Alert.alert('Error', 'Please enter a 6-digit OTP');
            return;
        }

        setLoading(true);
        try {
            console.log("Attempting verification for userId:", userId, "with OTP:", otp);
            const response = await apiClient.post('/api/auth/verify-email', { userId, otp });
            console.log("Verification response data:", response.data);

            if (response.data.success) {
                if (response.data.token) {
                    console.log("Token received, logging in...");
                    await login(response.data.token);
                    Alert.alert('Success', 'Email verified successfully! You are now logged in.');
                } else {
                    console.log("No token in response, navigating to Login");
                    Alert.alert('Success', 'Email verified successfully! You can now log in.');
                    navigation.navigate('Login');
                }
            } else {
                Alert.alert('Error', response.data.message || 'Verification failed');
            }
        } catch (err) {
            console.error("Verification catch block error:", err);
            if (err.response) {
                console.error("Error response data:", err.response.data);
                console.error("Error response status:", err.response.status);
            }
            Alert.alert('Error', err.response?.data?.message || 'Connection failed');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        try {
            await apiClient.post('/api/auth/resend-otp', { userId });
            setTimer(60);
            Alert.alert('Success', 'A new OTP has been sent to your email.');
        } catch (err) {
            Alert.alert('Error', err.response?.data?.message || 'Failed to resend OTP');
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.title}>Email Verification</Text>
                <Text style={styles.subtitle}>
                    A verification code has been sent to{'\n'}
                    <Text style={styles.emailText}>{email}</Text>
                </Text>

                <View style={styles.otpContainer}>
                    <TextInput
                        style={styles.otpInput}
                        placeholder="000000"
                        placeholderTextColor={COLORS.textMuted}
                        value={otp}
                        onChangeText={setOtp}
                        keyboardType="number-pad"
                        maxLength={6}
                    />
                </View>

                <TouchableOpacity
                    style={[styles.verifyButton, loading && styles.disabledButton]}
                    onPress={handleVerify}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color={COLORS.background} />
                    ) : (
                        <Text style={styles.buttonText}>Verify Email</Text>
                    )}
                </TouchableOpacity>

                <View style={styles.resendContainer}>
                    <Text style={styles.resendText}>Didn't receive code?</Text>
                    {timer > 0 ? (
                        <Text style={styles.timerText}>Resend in {timer}s</Text>
                    ) : (
                        <TouchableOpacity onPress={handleResend}>
                            <Text style={styles.resendLink}>Resend OTP</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.navigate('Login')}
                >
                    <Text style={styles.backButtonText}>Back to Login</Text>
                </TouchableOpacity>
            </View>
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
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 40,
    },
    emailText: {
        color: COLORS.primary,
        fontWeight: 'bold',
    },
    otpContainer: {
        width: '100%',
        marginBottom: 30,
    },
    otpInput: {
        backgroundColor: COLORS.inputBg,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 12,
        padding: 18,
        fontSize: 24,
        textAlign: 'center',
        letterSpacing: 8,
        color: COLORS.text,
    },
    verifyButton: {
        backgroundColor: COLORS.primary,
        width: '100%',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 24,
    },
    disabledButton: {
        opacity: 0.6,
    },
    buttonText: {
        color: COLORS.background,
        fontSize: 18,
        fontWeight: 'bold',
    },
    resendContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 40,
    },
    resendText: {
        color: '#666',
        textAlign: 'center',
        textDecorationLine: 'underline',
    },
});

export default VerifyEmailScreen;
