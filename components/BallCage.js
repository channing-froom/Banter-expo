import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { DeviceMotion } from 'expo-sensors';
import { useSharedValue } from 'react-native-reanimated';
import { getUpdatedCoords } from '../libs/coords'

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
const BallCage = ({
    multiplier = 200,
    refresh = 100
}) => {
    // set up basic params for managing the space of area the ball plays in
    let screen = Dimensions.get('screen');
    const ballSize = 40;
    const ballHalf = ballSize / 2;
    const screenX = screen.width / 2;
    const screenY = screen.height / 2;

    // TODO this should update based on orientation
    // Define the max x & y area's where the ball can go
    const maxCords = {
        left: -(screenX - ballSize),
        right: screenX - ballSize,
        top: -(screenY - ballSize),
        bottom: screenY - ballSize,
    }

    // Dynamic settings for css positioning to center ball on start
    let ballCenterPosition = {
        top: screenY - ballHalf,
        left: screenX - ballHalf
    }

    // shared values to control the position of the ball
    // This could be upgraded to a list of objects with cords
    const _x = useSharedValue(0);
    const _y = useSharedValue(0);

    // Register listeners and set intervals
    // TODO should probably add a way to delete listeners when components change 
    DeviceMotion.setUpdateInterval(refresh);

    // register the motion effect, 
    // include the return to un register the motion event
    useEffect(() => {
        // register the object that will listen to the deviceMotion lib
        const motionSubscription = DeviceMotion.addListener(motionData => {
            // calculate how much the object needs to move by
            const moveX = motionData.rotation?.gamma?.toFixed(2) * multiplier;
            const moveY = motionData.rotation?.beta?.toFixed(2) * multiplier;

            const { x, y } = getUpdatedCoords(
                moveX,
                moveY,
                _x.value,
                _y.value,
                maxCords
            );

            _x.value = x;
            _y.value = y;
        })

        return () => { motionSubscription.remove() }
    }, []);

    return (
        <View style={styles.BallCageContainer}>
            <MagicBall
                size={ballSize}
                coords={{
                    x: _x,
                    y: _y
                }}
                startPosition={ballCenterPosition}
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

export default BallCage;