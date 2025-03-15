import { NavigatorScreenParams } from "@react-navigation/native";

export type RootStackParamList = {
    Welcome: undefined; // No params for Welcome screen
    Home: undefined; // No params for Home screen
    Chat: { poolId: string, encryptionKey: string }; // Example route with params
    Error: { message: string }; // Example route with params
};