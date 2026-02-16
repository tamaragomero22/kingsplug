import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator, View, Text, StatusBar } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../constants/theme';

// Screens
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import VerifyEmailScreen from '../screens/VerifyEmailScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import DashboardScreen from '../screens/DashboardScreen';
import KYCScreen from '../screens/KYCScreen';
import AboutScreen from '../screens/AboutScreen';
import TermsScreen from '../screens/TermsScreen';

const AuthStack = createStackNavigator();
const AppStack = createStackNavigator();

const MyTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: COLORS.background,
        card: COLORS.header,
        text: COLORS.text,
        border: COLORS.border,
    },
};

const commonScreenOptions = {
    headerStyle: {
        backgroundColor: COLORS.header,
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    headerTintColor: COLORS.text,
    headerTitleStyle: {
        fontWeight: 'bold',
    },
    headerBackTitleVisible: false,
};

const AuthNavigator = () => (
    <AuthStack.Navigator screenOptions={{ ...commonScreenOptions, headerShown: false }}>
        <AuthStack.Screen name="Login" component={LoginScreen} />
        <AuthStack.Screen name="Signup" component={SignupScreen} />
        <AuthStack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
        <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <AuthStack.Screen name="About" component={AboutScreen} options={{ headerShown: true, title: 'About Kingsplug' }} />
        <AuthStack.Screen name="Terms" component={TermsScreen} options={{ headerShown: true, title: 'Terms of Service' }} />
    </AuthStack.Navigator>
);

const AppNavigator = () => (
    <AppStack.Navigator screenOptions={commonScreenOptions}>
        <AppStack.Screen
            name="Dashboard"
            component={DashboardScreen}
            options={{ headerShown: false }}
        />
        <AppStack.Screen
            name="KYC"
            component={KYCScreen}
            options={{ title: 'Identity Verification' }}
        />
    </AppStack.Navigator>
);

const RootNavigator = () => {
    const { userToken, isLoading } = useAuth();

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <NavigationContainer theme={MyTheme}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.header} />
            {userToken == null ? <AuthNavigator /> : <AppNavigator />}
        </NavigationContainer>
    );
};

export default RootNavigator;
