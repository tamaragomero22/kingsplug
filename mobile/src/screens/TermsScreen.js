import React from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView } from 'react-native';
import { COLORS } from '../constants/theme';

const TermsScreen = () => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>Terms of Service</Text>

                <Text style={styles.introText}>
                    Welcome to Kingsplug.com. By using our services, you agree to be bound by these Terms.
                </Text>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>1. Eligibility</Text>
                    <Text style={styles.sectionText}>
                        You must be at least 18 years old and have full legal capacity to enter into this agreement.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>2. Account Registration</Text>
                    <Text style={styles.sectionText}>
                        You must provide true and accurate information during registration and KYC verification.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>3. Prohibited Activities</Text>
                    <Text style={styles.sectionText}>
                        Our platform must not be used for money laundering, fraud, or any illegal activities under Nigerian or international laws.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>4. Limitation of Liability</Text>
                    <Text style={styles.sectionText}>
                        Kingsplug shall not be liable for losses resulting from technical failures or user negligence.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>5. Governing Law</Text>
                    <Text style={styles.sectionText}>
                        These Terms are governed by the laws of the Federal Republic of Nigeria.
                    </Text>
                </View>

                <View style={styles.divider} />

                <Text style={styles.footer}>
                    Last updated: February 2026
                </Text>
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
        padding: 24,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 15,
        color: COLORS.text,
    },
    introText: {
        fontSize: 17,
        color: COLORS.textSecondary,
        marginBottom: 35,
        lineHeight: 26,
    },
    section: {
        marginBottom: 30,
        backgroundColor: COLORS.card,
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 10,
    },
    sectionText: {
        fontSize: 15,
        color: COLORS.textSecondary,
        lineHeight: 22,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginVertical: 20,
    },
    footer: {
        fontSize: 13,
        color: COLORS.textMuted,
        textAlign: 'center',
        paddingBottom: 40,
    },
});

export default TermsScreen;
