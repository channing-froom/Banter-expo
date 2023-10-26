import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { DeviceMotion } from 'expo-sensors';

// components
import MagicBall from "./MagicBall";

/**
 * The ball container that will manage the increases in x & y for the ball based on cords created from device motion 
 * @param {
 *  multiplier: the values from device motion will use this to increase or decrease the movement value of the ball,
 *  refresh: how often the animations and updates from motion will happen in milliseconds
 * }  
 * @returns 
 */
export default function BallCage({
    multiplier = 200,
    refresh = 100
}) {
    // create a default state for data colleced from deviceMotion
    const [motion, setMotion] = useState({
        acceleration: null,
        accelerationIncludingGravity: {
            x: 0,
            y: 0,
            z: 0,
        },
        interval: 0,
        orientation: null,
        rotation: {
            alpha: 0, // defines x movement
            beta: 0, // defines y movement
            gamma: 0
        },
        rotationRate: null
    });

    // Register listeners and set intervals
    // TODO should probably add a way to delete listeners when components change 
    DeviceMotion.setUpdateInterval(refresh);
    DeviceMotion.addListener(motionData => {
        setMotion(motionData);
    })

    return (
        <View style={styles.BallCageContainer}>
            <MagicBall
                coords={{
                    x: motion.rotation?.gamma?.toFixed(2) * multiplier,
                    y: motion.rotation?.beta?.toFixed(2) * multiplier
                }}
                refresh={refresh}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    BallCageContainer: {
        width: '100%',
        height: '100%',
    }
});