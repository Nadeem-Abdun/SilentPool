import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { RootStackParamList } from '@/types/navigation';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type ErrorScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Error'>;
type ErrorScreenRoutePropType = RouteProp<RootStackParamList, 'Error'>;

export default function ErrorScreen() {
    const navigation = useNavigation<ErrorScreenNavigationProp>();
    const route = useRoute<ErrorScreenRoutePropType>();
    const { message } = route.params;

    const handleRetry = () => {
        if (message === 'Invalid Pool ID. Please try again!') {
            navigation.navigate('Home');
        }
        if (message === 'Network issue detected. Check your connection.') {
            // navigation.navigate('Chat');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.errorText}>Something went wrong!</Text>
            <Text style={styles.messageText}>
                {message}
            </Text>
            <Button title='Retry' onPress={handleRetry} color='#FF3B30' />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f7f7f7',
        paddingHorizontal: 20,
    },
    errorText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FF3B30',
        marginBottom: 10,
    },
    messageText: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
        marginBottom: 20,
    },
});