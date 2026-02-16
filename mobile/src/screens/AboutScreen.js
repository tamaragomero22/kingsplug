import React from 'react';
import { StyleSheet, View, Text, ScrollView, Image, SafeAreaView } from 'react-native';
import { COLORS } from '../constants/theme';

const AboutScreen = () => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.hero}>
                    <Text style={styles.heroTitle}>About Us</Text>
                    <Text style={styles.heroSubtitle}>The Future of Digital Finance</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.text}>
                        Welcome to <Text style={styles.bold}>Kingsplug.com</Text> — a trusted and secure platform designed to make cryptocurrency trading simple, fast, and reliable.
                    </Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Who We Are</Text>
                    <Text style={styles.cardText}>
                        Founded by blockchain developers, cybersecurity experts, and financial professionals, Kingsplug was created to bridge the gap between traditional finance and the digital economy.
                    </Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Our Mission</Text>
                    <Text style={styles.cardText}>
                        Our mission is to make digital finance accessible to everyone. We believe in empowering individuals with financial freedom through secure, transparent, and decentralized technology.
                    </Text>
                </View>

                <Text style={styles.sectionTitle}>What We Offer</Text>
                {[
                    { title: "Instant Conversion", desc: "Convert BTC to NGN in minutes at competitive rates." },
                    { title: "Fast Payouts", desc: "Get paid directly into your Nigerian bank account." },
                    { title: "Secure Transactions", desc: "Advanced encryption and strict verification." }
                ].map((item, index) => (
                    <View key={index} style={styles.offerItem}>
                        <Text style={styles.offerTitle}>{item.title}</Text>
                        <Text style={styles.offerDesc}>{item.desc}</Text>
                    </View>
                ))}

                <View style={styles.footer}>
                    <Text style={styles.footerText}>At Kingsplug.com, we’re not just building an exchange — we’re building the future of finance.</Text>
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
        padding: 24,
    },
    hero: {
        paddingVertical: 60,
        backgroundColor: COLORS.header,
        marginHorizontal: -24,
        marginTop: -24,
        alignItems: 'center',
        marginBottom: 30,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    heroTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    heroSubtitle: {
        fontSize: 16,
        color: COLORS.primary,
        marginTop: 10,
        letterSpacing: 1,
        textTransform: 'uppercase',
        fontWeight: '600',
    },
    section: {
        marginBottom: 30,
    },
    text: {
        fontSize: 17,
        lineHeight: 26,
        color: COLORS.textSecondary,
        textAlign: 'center',
    },
    bold: {
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    card: {
        backgroundColor: COLORS.card,
        padding: 24,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: 20,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 12,
    },
    cardText: {
        fontSize: 15,
        color: COLORS.textMuted,
        lineHeight: 22,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 20,
        marginTop: 20,
    },
    offerItem: {
        marginBottom: 20,
        paddingLeft: 20,
        borderLeftWidth: 3,
        borderLeftColor: COLORS.secondary,
    },
    offerTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 4,
    },
    offerDesc: {
        fontSize: 15,
        color: COLORS.textMuted,
        lineHeight: 20,
    },
    footer: {
        marginTop: 40,
        paddingBottom: 40,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        paddingTop: 30,
    },
    footerText: {
        fontSize: 14,
        color: COLORS.textMuted,
        textAlign: 'center',
        fontStyle: 'italic',
        lineHeight: 20,
    },
});

export default AboutScreen;
