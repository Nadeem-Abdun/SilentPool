import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing, StyleSheet } from 'react-native';

interface AuraRingProps {
    children: React.ReactNode;
    auraColor?: string;
    size?: { width: number; height: number };
}

const AuraRing: React.FC<AuraRingProps> = ({ children, auraColor = '#007AFF', size = { width: 120, height: 50 } }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const opacityAnim = useRef(new Animated.Value(0.5)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(scaleAnim, {
                    toValue: 1.3, // Expands outward
                    duration: 1500,
                    easing: Easing.out(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 0, // Fades out
                    duration: 1500,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    return (
        <View style={styles.wrapper}>
            {/* Aura Effect */}
            <Animated.View
                style={[
                    styles.aura,
                    {
                        width: size.width,
                        height: size.height,
                        borderRadius: size.height / 2, // Oval shape
                        borderColor: auraColor,
                        transform: [{ scale: scaleAnim }],
                        opacity: opacityAnim,
                    },
                ]}
            />
            {/* Wrapped Child (Button, etc.) */}
            <View style={styles.content}>{children}</View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    aura: {
        position: 'absolute',
        borderWidth: 3,
    },
    content: {
        zIndex: 1, // Ensures button is on top
    },
});

export default AuraRing;
