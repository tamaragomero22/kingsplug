import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Dimensions,
    StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/theme';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ onFinish }) => {
    // Animation values
    const logoScale = useRef(new Animated.Value(0.3)).current;
    const logoOpacity = useRef(new Animated.Value(0)).current;
    const titleOpacity = useRef(new Animated.Value(0)).current;
    const titleTranslateY = useRef(new Animated.Value(20)).current;
    const taglineOpacity = useRef(new Animated.Value(0)).current;
    const taglineTranslateY = useRef(new Animated.Value(20)).current;
    const glowOpacity = useRef(new Animated.Value(0)).current;
    const containerOpacity = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Glow pulse loop
        const glowPulse = Animated.loop(
            Animated.sequence([
                Animated.timing(glowOpacity, {
                    toValue: 0.6,
                    duration: 1200,
                    useNativeDriver: true,
                }),
                Animated.timing(glowOpacity, {
                    toValue: 0.2,
                    duration: 1200,
                    useNativeDriver: true,
                }),
            ])
        );

        // Entrance sequence
        Animated.sequence([
            // 1. Logo scales + fades in
            Animated.parallel([
                Animated.spring(logoScale, {
                    toValue: 1,
                    tension: 60,
                    friction: 7,
                    useNativeDriver: true,
                }),
                Animated.timing(logoOpacity, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ]),
            // 2. Title slides up
            Animated.parallel([
                Animated.timing(titleOpacity, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.timing(titleTranslateY, {
                    toValue: 0,
                    duration: 400,
                    useNativeDriver: true,
                }),
            ]),
            // 3. Tagline slides up
            Animated.parallel([
                Animated.timing(taglineOpacity, {
                    toValue: 1,
                    duration: 350,
                    useNativeDriver: true,
                }),
                Animated.timing(taglineTranslateY, {
                    toValue: 0,
                    duration: 350,
                    useNativeDriver: true,
                }),
            ]),
        ]).start(() => {
            // Start glow after entrance
            glowPulse.start();

            // Hold for a moment, then fade out
            setTimeout(() => {
                glowPulse.stop();
                Animated.timing(containerOpacity, {
                    toValue: 0,
                    duration: 400,
                    useNativeDriver: true,
                }).start(() => {
                    if (onFinish) onFinish();
                });
            }, 1800);
        });

        return () => {
            glowPulse.stop();
        };
    }, []);

    return (
        <Animated.View style={[styles.container, { opacity: containerOpacity }]}>
            <StatusBar barStyle="light-content" backgroundColor="#0d1117" />
            <LinearGradient
                colors={['#0d1117', '#161625', '#1a0e2e']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
            />

            {/* Decorative background orbs */}
            <View style={styles.orbContainer} pointerEvents="none">
                <View style={[styles.orb, styles.orbTeal]} />
                <View style={[styles.orb, styles.orbPurple]} />
                <View style={[styles.orb, styles.orbPink]} />
            </View>

            {/* Main content */}
            <View style={styles.content}>
                {/* Glow halo behind logo */}
                <Animated.View style={[styles.glow, { opacity: glowOpacity }]} />

                {/* Logo mark */}
                <Animated.View
                    style={[
                        styles.logoContainer,
                        {
                            opacity: logoOpacity,
                            transform: [{ scale: logoScale }],
                        },
                    ]}
                >
                    <LinearGradient
                        colors={['#ff79c6', '#9580ff', '#80ffea']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.logoGradientBorder}
                    >
                        <View style={styles.logoInner}>
                            <Text style={styles.logoLetter}>K</Text>
                        </View>
                    </LinearGradient>
                </Animated.View>

                {/* Brand name */}
                <Animated.Text
                    style={[
                        styles.brandName,
                        {
                            opacity: titleOpacity,
                            transform: [{ translateY: titleTranslateY }],
                        },
                    ]}
                >
                    KINGSPLUG
                </Animated.Text>

                {/* Tagline */}
                <Animated.Text
                    style={[
                        styles.tagline,
                        {
                            opacity: taglineOpacity,
                            transform: [{ translateY: taglineTranslateY }],
                        },
                    ]}
                >
                    Your Digital Marketplace
                </Animated.Text>

                {/* Decorative gradient line */}
                <Animated.View style={[styles.dividerWrapper, { opacity: taglineOpacity }]}>
                    <LinearGradient
                        colors={['transparent', '#9580ff', '#80ffea', 'transparent']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.dividerLine}
                    />
                </Animated.View>
            </View>

            {/* Bottom badge */}
            <Animated.View style={[styles.footer, { opacity: taglineOpacity }]}>
                <Text style={styles.footerText}>Powered by Kingsplug</Text>
            </Animated.View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0d1117',
    },
    orbContainer: {
        ...StyleSheet.absoluteFillObject,
        overflow: 'hidden',
    },
    orb: {
        position: 'absolute',
        borderRadius: 9999,
        opacity: 0.15,
    },
    orbTeal: {
        width: 280,
        height: 280,
        backgroundColor: '#80ffea',
        top: -80,
        right: -80,
    },
    orbPurple: {
        width: 320,
        height: 320,
        backgroundColor: '#9580ff',
        bottom: height * 0.15,
        left: -100,
    },
    orbPink: {
        width: 200,
        height: 200,
        backgroundColor: '#ff79c6',
        bottom: -40,
        right: 20,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    glow: {
        position: 'absolute',
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: '#9580ff',
        shadowColor: '#9580ff',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 60,
        elevation: 0,
        opacity: 0.3,
    },
    logoContainer: {
        marginBottom: 32,
        shadowColor: '#80ffea',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 30,
        elevation: 20,
    },
    logoGradientBorder: {
        width: 110,
        height: 110,
        borderRadius: 28,
        padding: 3,
    },
    logoInner: {
        flex: 1,
        backgroundColor: '#161625',
        borderRadius: 26,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoLetter: {
        fontSize: 58,
        fontWeight: '900',
        color: '#ffffff',
        letterSpacing: -2,
        lineHeight: 66,
    },
    brandName: {
        fontSize: 34,
        fontWeight: '900',
        color: '#ffffff',
        letterSpacing: 8,
        marginBottom: 10,
        textAlign: 'center',
    },
    tagline: {
        fontSize: 15,
        color: COLORS.textMuted,
        letterSpacing: 2,
        textAlign: 'center',
        marginBottom: 28,
        fontWeight: '400',
    },
    dividerWrapper: {
        width: '70%',
    },
    dividerLine: {
        height: 1.5,
        borderRadius: 1,
    },
    footer: {
        paddingBottom: 48,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.25)',
        letterSpacing: 1.5,
        fontWeight: '500',
    },
});

export default SplashScreen;
