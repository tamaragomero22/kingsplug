import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, SafeAreaView } from 'react-native';
import { useAuth } from '../context/AuthContext';
import apiClient from '../services/apiClient';
import { COLORS } from '../constants/theme';

// Forced refresh to fix syntax error cache
const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const { login } = useAuth();

    const handleLogin = async () => {
        setEmailError('');
        setPasswordError('');
        setLoading(true);

        try {
            console.log("Attempting login for:", email);
            const response = await apiClient.post('/api/auth/login', { email, password });
            const data = response.data;
            console.log("Login response data:", data);

            if (data.token) {
                await login(data.token);
            } else {
                console.error("Login failed: No token in response", data);
                Alert.alert('Login Error', 'Something went wrong. Please try again.');
            }
        } catch (err) {
            console.error("Login catch block error:", err);
            if (err.response) {
                console.error("Error response data:", err.response.data);
                console.error("Error response status:", err.status || err.response.status);

                const errors = err.response.data.errors;
                if (errors) {
                    setEmailError(errors.email || '');
                    setPasswordError(errors.password || '');

                    if (errors.email === "Your account has not been verified." && err.response.data.userId) {
                        Alert.alert(
                            "Account Not Verified",
                            "Your account has not been verified. Go to verification page?",
                            [
                                { text: "Cancel", style: "cancel" },
                                {
                                    text: "OK",
                                    onPress: () => navigation.navigate('VerifyEmail', {
                                        userId: err.response.data.userId,
                                        email: email
                                    })
                                }
                            ]
                        );
                    }
                } else if (err.response.data.message) {
                    Alert.alert('Error', err.response.data.message);
                }
            } else {
                Alert.alert('Error', 'Failed to connect to server. Check your internet connection.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.formContainer}>
                <Text style={styles.title}>Log in to your account</Text>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Email Address</Text>
                    <TextInput
                        style={[styles.input, emailError ? styles.errorInput : null]}
                        placeholder="email@example.com"
                        placeholderTextColor={COLORS.textMuted}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Password</Text>
                    <TextInput
                        style={[styles.input, passwordError ? styles.errorInput : null]}
                        placeholder="••••••••"
                        placeholderTextColor={COLORS.textMuted}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                    {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
                </View>

                <TouchableOpacity
                    style={[styles.loginButton, loading && styles.disabledButton]}
                    onPress={handleLogin}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color={COLORS.background} />
                    ) : (
                        <Text style={styles.buttonText}>Log In</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                    <Text style={styles.forgotText}>Forgotten Password?</Text>
                </TouchableOpacity>

                <View style={styles.divider} />

                <TouchableOpacity
                    style={styles.signupButton}
                    onPress={() => navigation.navigate('Signup')}
                >
                    <Text style={styles.signupButtonText}>Create New Account</Text>
                </TouchableOpacity>

                <View style={styles.footerLinks}>
                    <TouchableOpacity onPress={() => navigation.navigate('About')}>
                        <Text style={styles.footerLinkText}>About Us</Text>
                    </TouchableOpacity>
                    <Text style={styles.footerDivider}> | </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Terms')}>
                        <Text style={styles.footerLinkText}>Terms</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        justifyContent: 'center',
        padding: 20,
    },
    formContainer: {
        width: '100%',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 40,
        textAlign: 'center',
        color: COLORS.text,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        color: COLORS.textMuted,
        marginBottom: 8,
        fontSize: 14,
        fontWeight: '500',
    },
    input: {
        backgroundColor: COLORS.inputBg,
        borderWidth: 1,
        borderColor: COLORS.border,
        padding: 15,
        borderRadius: 12,
        fontSize: 16,
        color: COLORS.text,
    },
    errorInput: {
        borderColor: COLORS.error,
    },
    errorText: {
        color: COLORS.error,
        fontSize: 12,
        marginTop: 5,
    },
    loginButton: {
        backgroundColor: COLORS.primary,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
    },
    disabledButton: {
        opacity: 0.6,
    },
    buttonText: {
        color: COLORS.background,
        fontSize: 18,
        fontWeight: 'bold',
    },
    forgotText: {
        color: COLORS.secondary,
        textAlign: 'center',
        marginTop: 20,
        fontSize: 14,
        fontWeight: '500',
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginVertical: 35,
    },
    signupButton: {
        borderWidth: 1,
        borderColor: COLORS.primary,
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
    },
    signupButtonText: {
        color: COLORS.primary,
        fontSize: 16,
        fontWeight: '600',
    },
    footerLinks: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 40,
        alignItems: 'center',
    },
    footerLinkText: {
        color: COLORS.textMuted,
        fontSize: 14,
    },
    footerDivider: {
        color: COLORS.border,
        marginHorizontal: 10,
    }
});

export default LoginScreen;
