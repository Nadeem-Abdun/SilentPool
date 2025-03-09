import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
import { RootStackParamList } from '@/types/navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { GetCreatePool, PostJoinPool } from '@/services/serviceControllers';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
    const [poolId, setPoolId] = useState('');
    const navigation = useNavigation<HomeScreenNavigationProp>();

    // API Calls
    const createPoolApiCall = async () => {
        try {
            const response = await GetCreatePool();
            if (response) {
                console.log("Created Pool With ID: " + response.poolId);
            }
            return response;
        } catch (error) {
            console.error("Failed to create pool", error);
            return null;
        }
    };
    const joinPoolApiCall = async () => {
        try {
            const formdata = {
                poolId: poolId
            }
            const response = await PostJoinPool(formdata);
            if (response) {
                console.log("Joined Pool With ID: " + poolId);
            }
            return response;
        } catch (error) {
            console.error("Failed to join pool", error);
            return null;
        }
    };

    // Submit Functions
    const handleCreatePool = async () => {
        // Navigate to the Chat screen with a newly generated Pool ID
        const response = await createPoolApiCall();
        if (response) {
            console.log(response, "abc")
            navigation.navigate('Chat', { poolId: response.poolId, encryptionKey: response.encryptionKey });
            setPoolId('');
        } else {
            navigation.navigate('Error', { message: 'Failed to create pool. Please try again!' });
        }
    };
    const handleJoinPool = async () => {
        if (poolId.trim() === '') {
            alert('Please enter a valid Pool ID.');
            return;
        }
        const response = await joinPoolApiCall();
        if (response) {
            navigation.navigate('Chat', { poolId: response.pool.poolId, encryptionKey: response.pool.encryptionKey });
            setPoolId('');
        } else {
            navigation.navigate('Error', { message: 'Invalid Pool ID. Please try again!' });
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to the Home Screen</Text>
            <Text style={styles.subtitle}>Create or join a pool to start chatting.</Text>
            <TextInput
                style={styles.input}
                placeholder='Enter Pool ID'
                value={poolId}
                onChangeText={setPoolId}
            />
            <View style={styles.buttonContainer}>
                <Button title='Create Pool' onPress={handleCreatePool} color='#007AFF' />
                <Button title='Join Pool' onPress={handleJoinPool} color='#34C759' />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f7f7f7',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        color: '#555',
        marginBottom: 40,
    },
    input: {
        width: '80%',
        height: 50,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 20,
        backgroundColor: '#fff',
    },
    buttonContainer: {
        width: '80%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
});
