import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, SafeAreaView } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import apiClient from '../services/apiClient';
import { COLORS } from '../constants/theme';

const ForgotPasswordScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleReset = async () => {
        if (!email) {
            Alert.alert('Error', 'Please enter your email address.');
            return;
        }

        setLoading(true);
        try {
            const response = await apiClient.post('/api/auth/forgot-password', { email });
            Alert.alert('Success', response.data.message || 'Reset link sent to your email.');
            setEmail('');
        } catch (err) {
            Alert.alert('Error', err.response?.data?.message || 'Failed to send reset link.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.backBtn}>
                    <ArrowLeft size={24} color={COLORS.text} />
                </TouchableOpacity>

                <View style={styles.header}>
                    <Text style={styles.title}>Reset Password</Text>
                    <Text style={styles.subtitle}>
                        Enter your email address and we will send you a link to reset your password.
                    </Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email Address</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="yourname@gmail.com"
                            placeholderTextColor={COLORS.textMuted}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.button, loading && styles.disabled]}
                        onPress={handleReset}
                        disabled={loading}
                    >
                        {loading ? <ActivityIndicator color={COLORS.background} /> : <Text style={styles.buttonText}>Send Reset Link</Text>}
                    </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.backLink}>
                    <Text style={styles.linkText}>Back to Log In</Text>
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
    },
    backBtn: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        marginTop: 10,
    },
    header: {
        marginTop: 40,
        marginBottom: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.textMuted,
        lineHeight: 24,
    },
    form: {
        width: '100%',
    },
    inputGroup: {
        marginBottom: 25,
    },
    label: {
        fontSize: 14,
        color: COLORS.textMuted,
        fontWeight: '600',
        marginBottom: 10,
    },
    input: {
        backgroundColor: COLORS.inputBg,
        borderWidth: 1,
        borderColor: COLORS.border,
        padding: 18,
        borderRadius: 12,
        fontSize: 16,
        color: COLORS.text,
    },
    button: {
        backgroundColor: COLORS.primary,
        padding: 18,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
        marginTop: 10,
    },
    disabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: COLORS.background,
        fontSize: 18,
        fontWeight: 'bold',
    },
    backLink: {
        marginTop: 40,
        alignItems: 'center',
    },
    linkText: {
        color: COLORS.textSecondary,
        fontSize: 16,
        fontWeight: '600',
    },
});

export default ForgotPasswordScreen;
