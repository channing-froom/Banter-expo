
/**
* TODO, this method should be moved to a shard lib
* Get the new x & y position by passing in the increments of x & y, This method will guard against out of bounds
* @param number newX : the increment for x
* @param number newY : the increment for y
* @param number currentX : value to define current x
* @param number currentY : value to define current y
* @param number maxCords: defines the limits of where the ball can travel               
* @returns 
*/
export const getUpdatedCoords = (
    newX = 0,
    newY = 0,
    currentX = null,
    currentY = null,
    maxCords = {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    }
) => {
    let updatedY = currentY + newY,
        updatedX = currentX + newX;

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

    return {
        x: updatedX,
        y: updatedY
    }
}