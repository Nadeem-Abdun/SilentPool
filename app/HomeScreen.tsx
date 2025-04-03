import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { Button, IconButton } from 'react-native-paper';
import { RootStackParamList } from '@/types/navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import Clipboard from '@react-native-clipboard/clipboard';
import { GetCreatePool, PostJoinPool } from '@/services/serviceControllers';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
    const [poolId, setPoolId] = useState('');
    const navigation = useNavigation<HomeScreenNavigationProp>();

    // Local State Management
    const [loading, setLoading] = useState({ createPool: false, joinPool: false });

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
        setLoading(prevState => ({ ...prevState, createPool: true }));
        const response = await createPoolApiCall();
        setLoading(prevState => ({ ...prevState, createPool: false }));
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
        setLoading(prevState => ({ ...prevState, joinPool: true }));
        const response = await joinPoolApiCall();
        setLoading(prevState => ({ ...prevState, joinPool: false }));
        if (response) {
            navigation.navigate('Chat', { poolId: response.pool.poolId, encryptionKey: response.pool.encryptionKey });
            setPoolId('');
        } else {
            navigation.navigate('Error', { message: 'Invalid Pool ID. Please try again!' });
        }
    };

    // Utility Functions
    const pasteFromClipboard = async () => {
        const clipboardContent = await Clipboard.getString();
        setPoolId(clipboardContent);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>The Epicenter of Secure Anonymity</Text>
            <Text style={styles.subtitle}>Create or join a secure pool for encrypted, private conversations.</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder='Enter Pool ID'
                    placeholderTextColor="#AAA"
                    value={poolId}
                    onChangeText={setPoolId}
                />
                <IconButton
                    icon="content-paste"
                    size={20}
                    onPress={pasteFromClipboard}
                    style={styles.pasteButton}
                    iconColor="#AAA"
                />
            </View>
            <View style={styles.buttonContainer}>
                <Button
                    onPress={handleCreatePool}
                    buttonColor='#007AFF'
                    mode='contained'
                    loading={loading.createPool}
                    contentStyle={{ flexDirection: 'row-reverse' }}
                >
                    Create Pool
                </Button>
                <Button
                    onPress={handleJoinPool}
                    buttonColor='#34C759'
                    mode='contained'
                    loading={loading.joinPool}
                    contentStyle={{ flexDirection: 'row-reverse' }}
                >
                    Join Pool
                </Button>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#151718',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#fff',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        color: '#888',
        marginBottom: 40,
    },
    inputContainer: {
        width: '90%',
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
    },
    input: {
        flex: 1,
        height: 50,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingRight: 40,
        color: '#fff',
        backgroundColor: '#555',
    },
    pasteButton: {
        position: 'absolute',
        right: 10,
    },
    buttonContainer: {
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
});
