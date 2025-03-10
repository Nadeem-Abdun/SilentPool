import React from 'react';
import { View, Text, StyleSheet, Image, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types/navigation';
import { GetAnonymousIdentity } from '@/services/serviceControllers';
import { saveSessionInfo } from '@/utilities/sessionsHandler';

type WelcomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Welcome'>;

export default function WelcomeScreen() {
    const navigation = useNavigation<WelcomeScreenNavigationProp>();

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
        const response = await GetAnonymousIdentityApiCall();
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
                    source={require('@/assets/images/silent-pool.png')}
                    style={styles.headerImage}
                />
            }
            headerBackgroundColor={{ dark: '#000', light: '#f7f7f7' }}
        >
            <Text style={styles.title}>Welcome to SilentPool</Text>
            <Text style={styles.subtitle}>
                Experience discreet, encrypted, and ephemeral conversations.
            </Text>
            {/* <Image
                source={require('@/assets/images/silent-pool.png')}
                style={styles.image}
            /> */}
            <View style={styles.buttonContainer}>
                <Button
                    title="Get Started"
                    onPress={() => handleGetStartedSubmit()}
                    color="#007AFF"
                />
            </View>
        </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
    headerImage: {
        height: 250,// Match the HEADER_HEIGHT from ParallaxScrollView
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
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        color: '#555',
        marginBottom: 40,
    },
    image: {
        height: 150,
        width: '100%',
        resizeMode: 'cover',
        marginBottom: 40,
    },
    buttonContainer: {
        marginTop: 20,
        width: '100%',
        alignItems: 'center',
    },
});