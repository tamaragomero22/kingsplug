import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

// For local testing: Use machine's IP (e.g. http://192.168.1.5:4000) 
// Emulator often maps 10.0.2.2 to host, but physical devices need actual IP.
// expoConfig.hostUri automatically gives us the machine's IP in development.
const getBaseUrl = () => {
    if (__DEV__) {
        const debuggerHost = Constants.expoConfig?.hostUri;
        const address = debuggerHost ? debuggerHost.split(':')[0] : 'localhost';
        return `http://${address}:4000`;
    }
    return 'https://api.kingsplug.com';
};

const API_BASE_URL = getBaseUrl();

console.log('API Base URL:', API_BASE_URL);

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the auth token in headers
apiClient.interceptors.request.use(
    async (config) => {
        const token = await SecureStore.getItemAsync('userToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;
