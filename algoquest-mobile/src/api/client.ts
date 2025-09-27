import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const api = axios.create({
    baseURL: "http://10.0.2.2:8080/api/v1",
    //baseURL: "http://localhost:8080",
});

api.interceptors.request.use(async (config: any) => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
        config.headers = {
            ...config.headers,
            Authorization: `Bearer ${token}`,
        };
    }
    return config;
});
