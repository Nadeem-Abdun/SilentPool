import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing, StyleSheet } from 'react-native';

const NUM_RAYS = 10; // Number of electric rays at a time

const RadiatingRays = ({ children }: { children: React.ReactNode }) => {
    const rays = useRef(
        Array.from({ length: NUM_RAYS }).map(() => ({
            opacity: new Animated.Value(1),
            translateX: new Animated.Value(0),
            translateY: new Animated.Value(0),
            scale: new Animated.Value(0.5),
            rotation: Math.random() * 360, // Random direction
        }))
    ).current;

    useEffect(() => {
        const startAnimations = () => {
            rays.forEach(({ opacity, translateX, translateY, scale }, index) => {
                Animated.loop(
                    Animated.parallel([
                        Animated.timing(opacity, {
                            toValue: 0, // Fade out
                            duration: 800 + index * 100,
                            useNativeDriver: true,
                        }),
                        Animated.timing(scale, {
                            toValue: 1.5, // Expand outward
                            duration: 800 + index * 100,
                            easing: Easing.out(Easing.ease),
                            useNativeDriver: true,
                        }),
                        Animated.timing(translateX, {
                            toValue: (Math.random() - 0.5) * 40, // Random X direction
                            duration: 800 + index * 100,
                            useNativeDriver: true,
                        }),
                        Animated.timing(translateY, {
                            toValue: (Math.random() - 0.5) * 40, // Random Y direction
                            duration: 800 + index * 100,
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
            {rays.map(({ opacity, translateX, translateY, scale, rotation }, index) => (
                <Animated.View
                    key={index}
                    style={[
                        styles.ray,
                        {
                            opacity,
                            transform: [
                                { translateX },
                                { translateY },
                                { scale },
                                { rotate: `${rotation}deg` },
                            ],
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
    ray: {
        position: 'absolute',
        width: 1,
        height: 70,
        backgroundColor: '#00DDEC',
        borderRadius: 2,
    },
});

export default RadiatingRays;
