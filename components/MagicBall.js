import { Entypo } from '@expo/vector-icons';
import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
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
 *  coords: {x: sharedValueObject for x, y: sharedValueObject for y}
 *  startPosition: {top: absolute top position, left: absolute left position}
 * } 
 * @returns 
 */
const MagicBall = ({
    refresh = 200,
    size = 50,
    color = 'white',
    coords = { x: null, y: null },
    startPosition = {
        top: 0,
        left: 0
    }
}) => {
    // Ball movement animation settings
    const containerStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: withTiming(coords.x.value ?? 0, { duration: refresh })
                },
                {
                    translateY: withTiming(coords.y.value ?? 0, { duration: refresh })
                },
            ],
        };
    });

    return (
        <View>
            <AnimatedMagicBallView style={[containerStyle, {
                top: startPosition.top,
                left: startPosition.left,
                position: 'absolute',
                display: 'block'
            }]}>
                <Entypo name="github-with-circle" size={size} color={color} />
            </AnimatedMagicBallView>
        </View>
    )
}

const styles = StyleSheet.create({
    MagicBallContainer: {
        position: 'absolute',
    },
    PanContainer: {}
});

export default memo(MagicBall);