const { random, min, sqrt, pow, PI, atan2, sin, cos } = Math;

/** Calculate the angle using trigonometry. */
export const getAngle = (x, y) => {
  return typeof x === "number" && typeof y === "number" ? atan2(y, x) : 0;
};

/** Returns angle ranged from -180 to 180 degrees in radian. */
export const roundAngle = angle => {
  return angle > PI ? angle - 2 * PI : angle < -PI ? angle + 2 * PI : angle;
};

/** Calculate the distance from the origin position to the destination position. */
export const getDistanceVector = (position1, position2) => {
  if (position1 && position2) {
    let { x: x1, y: y1 } = position1;
    let { x: x2, y: y2 } = position2;

    return { x: x2 - x1, y: y2 - y1 };
  } else {
    return { x: 0, y: 0 };
  }
};

/** Calculate the distance from the origin position to the destination position. */
export const getDistance = (position1, position2) => {
  let { x, y } = getDistanceVector(position1, position2);
  return sqrt(x * x + y * y);
};

/** Calculate the directional angle to the destination position
 *  in terms of the angle oriented from the East. */
export const getDirection = (position1, position2) => {
  let { x, y } = getDistanceVector(position1, position2);
  return getAngle(x, y);
};

/** Calculate the variation needed to go from origin to target. */
export const getVariation = (origin, target, interval) => {
  if (origin > target) {
    return -min(interval, origin - target);
  } else if (origin < target) {
    return min(interval, target - origin);
  } else {
    return 0;
  }
};

/* Create a blurred target position from the mouse position and the blurring range. */
export const getBlurredPosition = (position, blurFactor) => {
  if (position) {
    let { x, y } = position;
    let randDegree = 2 * PI * random();

    return {
      x: x + cos(randDegree) * blurFactor,
      y: y + sin(randDegree) * blurFactor
    };
  } else {
    return position;
  }
};

/** Calculate the position for an index point to align in a heart shape. */
export const getHeartPosition = (count, index, position) => {
  let e = (index - count / 2) / count * 2 * PI;
  let { x, y } = position;

  return {
    x: x + 7 * 16 * pow(sin(e), 3),
    y: y - 7 * (13 * cos(e) - 5 * cos(2 * e) - 2 * cos(3 * e) - cos(4 * e))
  };
};
