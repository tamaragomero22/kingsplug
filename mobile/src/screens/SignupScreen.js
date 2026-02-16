import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert, SafeAreaView } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import apiClient from '../services/apiClient';
import { COLORS } from '../constants/theme';

const SignupScreen = ({ navigation }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const [errors, setErrors] = useState({});

    const validatePassword = (pass) => {
        const hasNumber = /\d/.test(pass);
        const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(pass);

        if (!hasNumber || !hasSymbol) {
            return "Password must contain at least one number and one symbol.";
        }
        return null;
    };

    const handleSignup = async () => {
        setErrors({});

        // Basic validation
        let localErrors = {};
        if (!firstName) localErrors.firstName = "First name is required";
        if (!lastName) localErrors.lastName = "Last name is required";
        if (!email) localErrors.email = "Email is required";
        if (!password) {
            localErrors.password = "Password is required";
        } else {
            const passError = validatePassword(password);
            if (passError) localErrors.password = passError;
        }
        if (password !== repeatPassword) localErrors.repeatPassword = "Passwords do not match";

        if (Object.keys(localErrors).length > 0) {
            setErrors(localErrors);
            return;
        }

        setLoading(true);
        try {
            console.log("Attempting signup for:", email);
            const response = await apiClient.post('/api/auth/register', {
                firstName, lastName, email, password
            });

            const data = response.data;
            console.log("Signup response data:", data);

            if (data.warning) {
                Alert.alert('Warning', data.warning);
            }

            const userId = data.user || (data.user && data.user._id);
            console.log("Navigating to VerifyEmail with userId:", userId);
            navigation.navigate('VerifyEmail', { userId, email });
        } catch (err) {
            console.error("Signup catch block error:", err);
            if (err.response) {
                console.error("Error response data:", err.response.data);
                console.error("Error response status:", err.response.status);
            }

            if (err.response && err.response.data && err.response.data.errors) {
                setErrors(err.response.data.errors);
            } else {
                Alert.alert('Error', err.response?.data?.message || err.message || 'Registration failed');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>Create an Account</Text>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>First Name</Text>
                    <TextInput
                        style={[styles.input, errors.firstName ? styles.errorInput : null]}
                        placeholder="John"
                        placeholderTextColor={COLORS.textMuted}
                        value={firstName}
                        onChangeText={setFirstName}
                    />
                    {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Last Name</Text>
                    <TextInput
                        style={[styles.input, errors.lastName ? styles.errorInput : null]}
                        placeholder="Doe"
                        placeholderTextColor={COLORS.textMuted}
                        value={lastName}
                        onChangeText={setLastName}
                    />
                    {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Email Address</Text>
                    <TextInput
                        style={[styles.input, errors.email ? styles.errorInput : null]}
                        placeholder="john@example.com"
                        placeholderTextColor={COLORS.textMuted}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Password</Text>
                    <View style={[styles.passwordWrapper, errors.password ? styles.errorInput : null]}>
                        <TextInput
                            style={styles.passwordInput}
                            placeholder="••••••••"
                            placeholderTextColor={COLORS.textMuted}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            {showPassword ? <EyeOff size={20} color={COLORS.textMuted} /> : <Eye size={20} color={COLORS.textMuted} />}
                        </TouchableOpacity>
                    </View>
                    {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Repeat Password</Text>
                    <View style={[styles.passwordWrapper, errors.repeatPassword ? styles.errorInput : null]}>
                        <TextInput
                            style={styles.passwordInput}
                            placeholder="••••••••"
                            placeholderTextColor={COLORS.textMuted}
                            value={repeatPassword}
                            onChangeText={setRepeatPassword}
                            secureTextEntry={!showRepeatPassword}
                        />
                        <TouchableOpacity onPress={() => setShowRepeatPassword(!showRepeatPassword)}>
                            {showRepeatPassword ? <EyeOff size={20} color={COLORS.textMuted} /> : <Eye size={20} color={COLORS.textMuted} />}
                        </TouchableOpacity>
                    </View>
                    {errors.repeatPassword && <Text style={styles.errorText}>{errors.repeatPassword}</Text>}
                </View>

                <TouchableOpacity
                    style={[styles.signupButton, loading && styles.disabledButton]}
                    onPress={handleSignup}
                    disabled={loading}
                >
                    {loading ? <ActivityIndicator color={COLORS.background} /> : <Text style={styles.buttonText}>Sign Up</Text>}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.loginLink}>Already have an account? <Text style={styles.loginLinkAccent}>Log In</Text></Text>
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
        padding: 20,
        paddingTop: 40,
        flexGrow: 1,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 35,
        textAlign: 'center',
        color: COLORS.text,
    },
    inputGroup: {
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
        padding: 14,
        borderRadius: 12,
        fontSize: 16,
        color: COLORS.text,
    },
    passwordWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.inputBg,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 12,
        paddingRight: 15,
    },
    passwordInput: {
        flex: 1,
        padding: 14,
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
    signupButton: {
        backgroundColor: COLORS.primary,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 15,
        elevation: 2,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    disabledButton: {
        opacity: 0.6,
    },
    buttonText: {
        color: COLORS.background,
        fontSize: 18,
        fontWeight: 'bold',
    },
    loginLink: {
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginTop: 25,
        fontSize: 15,
    },
    loginLinkAccent: {
        color: COLORS.secondary,
        fontWeight: 'bold',
    },
    footerLinks: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 'auto',
        paddingVertical: 30,
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

export default SignupScreen;
