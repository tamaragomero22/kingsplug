import React, { createContext, useState, useEffect, useContext } from 'react';
import * as SecureStore from 'expo-secure-store';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userToken, setUserToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check for token on app load
    useEffect(() => {
        const bootstrapAsync = async () => {
            let token;
            try {
                token = await SecureStore.getItemAsync('userToken');
            } catch (e) {
                console.error('Failed to load token', e);
            }
            setUserToken(token);
            setIsLoading(false);
        };

        bootstrapAsync();
    }, []);

    const login = async (token) => {
        setUserToken(token);
        await SecureStore.setItemAsync('userToken', token);
    };

    const logout = async () => {
        setUserToken(null);
        await SecureStore.deleteItemAsync('userToken');
    };

    return (
        <AuthContext.Provider value={{ userToken, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
