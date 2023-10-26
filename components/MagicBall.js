import { Entypo } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    useAnimatedGestureHandler,
    withSpring,
    withTiming
} from 'react-native-reanimated';

// Create the HOC that view attach the animation functionailty
const AnimatedMagicBallView = Animated.createAnimatedComponent(View);

/**
 * MagicBall component that is a self managed ball that will move around the screen,
 * You can pass through a coords object to change the x and y of the ball
 * @param {
 *  refresh: the rate at which the animation for the movement of the ball will run
 *  size: the size of the icon
 *  color: icon color
 *  coords: {x: the amount x should increase by, y: the amount y should increase by}
 * } 
 * @returns 
 */
export default function MagicBall({
    refresh = 200,
    size = 50,
    color = 'white',
    coords = { x: 0, y: 0 }
}) {
    let screen = Dimensions.get('screen')
    const ballHalf = size / 2;
    const screenX = screen.width / 2;
    const screenY = screen.height / 2;

    // TODO this should update based on orientation
    // Define the max x & y area's where the ball can go
    const maxCords = {
        left: -(screenX - size),
        right: screenX - size,
        top: -(screenY - size),
        bottom: screenY - size,
    }

    // Dynamic settings for css positioning to center ball on start
    let ballCenterPosition = {
        y: screenY - ballHalf,
        x: screenX - ballHalf
    }

    // Shared Values to manage the position of the ball
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const dragState = useSharedValue(false);

    // Listener for changes to coords object so that we can adjust the balls position
    useEffect(() => {
        // dont update anything from the passed coords because
        // user is manually dragging ball around
        if (dragState.value == true) return;

        // hold new position in memory so we can manage the limits
        let updatedY = translateY.value + parseInt(coords.y);
        let updatedX = translateX.value + parseInt(coords.x);

        // Ensure that ball does not go out of bounds
        if (updatedY >= maxCords.bottom) {
            updatedY = maxCords.bottom;
        } else if (updatedY <= maxCords.top) {
            updatedY = maxCords.top;
        }

        if (updatedX >= maxCords.right) {
            updatedX = maxCords.right;
        } else if (updatedX <= maxCords.left) {
            updatedX = maxCords.left;
        }

        // Update shared values to move ball around
        translateY.value = updatedY;
        translateX.value = updatedX;
    }, [coords]);

    /**
     * On drag listeners for when the user whats to re position the ball manually.
     */
    const onDrag = useAnimatedGestureHandler({
        onStart: (event, context) => {
            context.translateX = translateX.value;
            context.translateY = translateY.value;

            // lock drag state so that the passed coords dont effect the position while dragging
            dragState.value = true;
        },
        onActive: (event, context) => {
            // hold new position in memory so we can manage the limits
            let updatedX = event.translationX + context.translateX;
            let updatedY = event.translationY + context.translateY;

            // Ensure that ball does not go out of bounds
            if (updatedY < maxCords.bottom || updatedY < maxCords.top) {
                if (updatedY >= maxCords.bottom) {
                    updatedY = maxCords.bottom;
                } else if (updatedY <= maxCords.top) {
                    updatedY = maxCords.top;
                }

                translateY.value = updatedY;
            }

            if (updatedX < maxCords.right || updatedX < maxCords.left) {
                if (updatedX >= maxCords.right) {
                    updatedX = maxCords.right;
                } else if (updatedX <= maxCords.left) {
                    updatedX = maxCords.left;
                }

                translateX.value = updatedX;
            }
        }, onEnd: () => {
            // release drag state so that component can accept coords again
            dragState.value = false;
        }
    });

    // Ball movement animation settings
    const containerStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: withTiming(translateX.value, { duration: refresh })
                },
                {
                    translateY: withTiming(translateY.value, { duration: refresh })
                },
            ],
        };
    });

    return (
        <View>
            <PanGestureHandler onGestureEvent={onDrag} style={styles.PanContainer}>
                <AnimatedMagicBallView style={[containerStyle, {
                    top: ballCenterPosition.y,
                    left: ballCenterPosition.x,
                    position: 'absolute',
                    display: 'block'
                }]}>
                    <Entypo name="github-with-circle" size={size} color={color} />
                </AnimatedMagicBallView>
            </PanGestureHandler>
        </View>
    )
}

const styles = StyleSheet.create({
    MagicBallContainer: {
        position: 'absolute',
    },
    PanContainer: {}
});