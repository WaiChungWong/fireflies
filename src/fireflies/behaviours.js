import { roundAngle, getDistance, getDirection } from "./geometry2d";

const { random, min } = Math;

export default {
  /** Move randomly. */
  WANDER: {
    /* Purple color with variance. */
    getColor: () => {
      return {
        r: (255 * random()) >> 0 /* >>: fast method to round numbers */,
        g: 0,
        b: 255
      };
    },

    /* Slow speed, in terms of pixels per second. */
    getSpeed: () => 30 + 30 * random(),

    /* React slowly in speed, in terms of pixels per second. */
    getAcceleration: () => 300,

    /* Steer Randomly. */
    getDirectionVar: () => -7.5 + 15 * random(),

    /* Dim brightness range. */
    getBrightnessMin: () => -2 + 0.5 * random(),
    getBrightnessMax: () => 0.5 + 0.5 * random(),

    /* No target to pursue, so 0. */
    blurFactor: 0
  },

  /** Move towards the target in a slow speed. */
  ATTRACT: {
    /* Yellow color with variance. */
    getColor: () => {
      return {
        r: 255,
        g: (255 * random()) >> 0 /* >>: fast method to round numbers */,
        b: 0
      };
    },

    /* Medium speed, in terms of pixels per second. */
    getSpeed: () => 50 + 50 * random(),

    /* React normally in speed, in terms of pixels per second. */
    getAcceleration: () => 700,

    /* Steer towards the direction with medium force. */
    getDirectionVar: (origin, target) => {
      let direction = getDirection(origin.position, target.position);
      let directionVar = direction - origin.direction;
      let steerFactor = 8;

      return roundAngle(directionVar) * steerFactor;
    },

    /* Medium brightness range. */
    getBrightnessMin: () => -0.4 + 0.4 * random(),
    getBrightnessMax: () => 1 + 0.2 * random(),

    /* Attracted but not accurately. */
    blurFactor: 350
  },

  /** Follow the same direction as the target and move in a medium fast speed. */
  FOLLOW: {
    /* Green color with variance. */
    getColor: () => {
      return {
        r: 0,
        g: (255 * random()) >> 0 /* >>: fast method to round numbers */,
        b: 255
      };
    },

    /* Speed will depend on the target speed and distance. */
    getSpeed: (origin, target) => {
      let distance = getDistance(origin.position, target.position);

      return target.speed * 40 / (distance + 20);
    },

    /* React extremely quickly in speed, in terms of pixels per second. */
    getAcceleration: () => 2500,

    /* Steer towards that direction with high force. */
    getDirectionVar: (origin, target) => {
      let distance = getDistance(origin.position, target.position);
      let directionVar = target.direction - origin.direction;
      let steerFactor = min(20, 8000 / distance);

      return roundAngle(directionVar) * steerFactor;
    },

    /* Medium brightness range. */
    getBrightnessMin: () => -0.2 + 0.4 * random(),
    getBrightnessMax: () => 1 + 0.2 * random(),

    /* Follow with slight noise. */
    blurFactor: 100
  },

  /** Move away from the target position in fast speed. */
  FLEE: {
    /* Blue color with variance. */
    getColor: () => {
      return {
        r: 0,
        g: (255 * random()) >> 0,
        b: 255
      };
    },

    /* Extreme speed, in terms of pixels per second. */
    getSpeed: () => 800 + 200 * random(),

    /* React extremely quickly in speed, in terms of pixels per second. */
    getAcceleration: () => 4000,

    /* Steer away from the direction with maximum force. */
    getDirectionVar: (origin, target) => {
      let direction = getDirection(target.position, origin.position);
      let directionVar = direction - origin.direction;
      let steerFactor = 25;

      return roundAngle(directionVar) * steerFactor;
    },

    /* Great brightness range. */
    getBrightnessMin: () => 0 + 0.4 * random(),
    getBrightnessMax: () => 1 + 0.2 * random(),

    /* Flee with preciseness. */
    blurFactor: 0
  },

  /** Move toward the target in fast speed, then eventually slow down as it approaches close. */
  ARRIVE: {
    /* Color with all variance. */
    getColor: () => {
      return {
        r: (255 * random()) >> 0 /* >>: fast method to round numbers */,
        g: (255 * random()) >> 0 /* >>: fast method to round numbers */,
        b: (255 * random()) >> 0 /* >>: fast method to round numbers */
      };
    },

    /* Speed with dependence on the target position. Therefore no standard speed applied. */
    getSpeed: (origin, target) => {
      return getDistance(origin.position, target.position) * 1.5;
    },

    /* React quickly in speed, in terms of pixels per second. */
    getAcceleration: () => 800,

    /* Pursue to the direction with high force. */
    getDirectionVar: (origin, target) => {
      let direction = getDirection(origin.position, target.position);
      let directionVar = direction - origin.direction;
      let steerFactor = 20;

      return roundAngle(directionVar) * steerFactor;
    },

    /* Great brightness range. */
    getBrightnessMin: () => 0 + 0.4 * random(),
    getBrightnessMax: () => 1 + 0.2 * random(),

    /* Arrive with preciseness. */
    blurFactor: 20
  }
};
