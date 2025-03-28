import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing, StyleSheet } from 'react-native';

const NUM_SMOKE_PARTICLES = 5; // Number of smoke particles

const GhostAuraRing = ({ children }: { children: React.ReactNode }) => {
    const particles = useRef(
        Array.from({ length: NUM_SMOKE_PARTICLES }).map(() => ({
            opacity: new Animated.Value(0.8),
            translateX: new Animated.Value(0),
            translateY: new Animated.Value(0),
            scale: new Animated.Value(0.5),
            blurRadius: Math.random() * 3 + 1, // Varying blur effect
        }))
    ).current;

    useEffect(() => {
        const startAnimations = () => {
            particles.forEach(({ opacity, translateX, translateY, scale }, index) => {
                Animated.loop(
                    Animated.parallel([
                        Animated.timing(opacity, {
                            toValue: 0, // Fade out gradually
                            duration: 1500 + index * 600, // Slower animation
                            useNativeDriver: true,
                        }),
                        Animated.timing(scale, {
                            toValue: 2, // Expand like smoke dispersing
                            duration: 1500 + index * 600, // Slower animation
                            easing: Easing.out(Easing.ease),
                            useNativeDriver: true,
                        }),
                        Animated.timing(translateX, {
                            toValue: (Math.random() - 0.5) * 60, // Random drift X
                            duration: 1500 + index * 600, // Slower animation
                            useNativeDriver: true,
                        }),
                        Animated.timing(translateY, {
                            toValue: (Math.random() - 0.5) * 60, // Random drift Y
                            duration: 1500 + index * 600, // Slower animation
                            useNativeDriver: true,
                        }),
                    ])
                ).start();
            });
        };

        startAnimations();
    }, []);

    return (
        <View style={styles.container}>
            {particles.map(({ opacity, translateX, translateY, scale, blurRadius }, index) => (
                <Animated.View
                    key={index}
                    style={[
                        styles.smoke,
                        {
                            opacity,
                            transform: [
                                { translateX },
                                { translateY },
                                { scale },
                            ],
                            shadowRadius: blurRadius, // Simulate a blur effect
                        },
                    ]}
                />
            ))}
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    smoke: {
        position: 'absolute',
        width: 35,
        height: 35,
        backgroundColor: 'rgba(0, 221, 236, 0.5)',
        borderRadius: 15,
        shadowColor: '#C0C0C0',
        shadowOffset: { width: 0, height: 0 },
    },
});

export default GhostAuraRing;
