import React, { useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types/navigation';
import { GetAnonymousIdentity } from '@/services/serviceControllers';
import { saveSessionInfo } from '@/utilities/sessionsHandler';
import GhostAuraRing from '@/components/GhostAuraRing';

type WelcomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Welcome'>;

export default function WelcomeScreen() {
    const navigation = useNavigation<WelcomeScreenNavigationProp>();

    // Local State Management
    const [loading, setLoading] = useState(false)

    // API Calls
    const GetAnonymousIdentityApiCall = async () => {
        try {
            const response = await GetAnonymousIdentity();
            if (response) {
                await saveSessionInfo(response.alias, response.sessionToken);
            }
            return response;
        } catch (error) {
            console.error("Failed to get anonymous user identity:", error);
        }
    }

    // Submit Functions
    const handleGetStartedSubmit = async () => {
        setLoading(true);
        const response = await GetAnonymousIdentityApiCall();
        setLoading(false);
        if (response) {
            navigation.navigate('Home');
        } else {
            navigation.navigate('Error', { message: 'Failed to get anonymous user identity. Please try again!' });
        }
    };

    return (
        <ParallaxScrollView
            headerImage={
                <Image
                    source={require('@/assets/images/silent-pool-1.jpg')}
                    style={styles.headerImage}
                />
            }
            headerBackgroundColor={{ dark: '#000', light: '#f7f7f7' }}
        >
            <Text style={styles.title}>Welcome to SilentPool</Text>
            <Text style={styles.primarySubtitle}>
                Experience discreet, encrypted, and ephemeral conversations.
            </Text>
            <View style={styles.buttonContainer}>
                <GhostAuraRing>
                    <Button
                        mode='contained'
                        onPress={handleGetStartedSubmit}
                        loading={loading}
                        contentStyle={{ flexDirection: 'row-reverse' }}
                    >
                        Get Started
                    </Button>
                </GhostAuraRing>
            </View>
            <Text style={styles.secondarySubtitle}>
                Click on "Get Started" to get your anonymous identity and start using SilentPool.
            </Text>
        </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
    headerImage: {
        height: 250,
        width: '100%',
        resizeMode: 'cover',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#fff',
        marginVertical: 20,
    },
    primarySubtitle: {
        fontSize: 18,
        textAlign: 'center',
        color: '#888',
        marginBottom: 10,
    },
    buttonContainer: {
        marginVertical: 10,
        alignItems: 'center',
    },
    secondarySubtitle: {
        fontSize: 14,
        textAlign: 'center',
        color: '#888',
        marginBottom: 100,
    },
});