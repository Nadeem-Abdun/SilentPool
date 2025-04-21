import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper'
import { RootStackParamList } from '@/types/navigation';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type ErrorScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Error'>;
type ErrorScreenRoutePropType = RouteProp<RootStackParamList, 'Error'>;

export default function ErrorScreen() {
    const navigation = useNavigation<ErrorScreenNavigationProp>();
    const route = useRoute<ErrorScreenRoutePropType>();
    const { message } = route.params;

    const handleGoHome = () => {
        navigation.navigate('Welcome');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.errorText}>Oops!</Text>
            <Text style={styles.messageText}>{message}</Text>
            <Button icon='home' onPress={handleGoHome} buttonColor='#FF3B30' mode='contained'>Go Home</Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#151718',
        paddingHorizontal: 20,
    },
    errorText: {
        fontSize: 50,
        fontWeight: 'bold',
        color: '#FF3B30',
        textAlign: 'center',
        marginBottom: 10,
    },
    messageText: {
        fontSize: 20,
        fontWeight: 'medium',
        color: '#888',
        textAlign: 'center',
        marginBottom: 20,
    },
});