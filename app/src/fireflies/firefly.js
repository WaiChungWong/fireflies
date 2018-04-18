import Behaviours from "./behaviours";
import {
  getDistance,
  roundAngle,
  getVariation,
  getHeartPosition,
  getBlurredPosition
} from "./geometry2d";

const { random, sin, cos, PI } = Math;

class Firefly {
  constructor() {
    /* Behaviour. Initially Wander. */
    this.behaviour = null;

    /* Color. */
    this.color = { r: 0, g: 0, b: 0 };
    this.colorVar = 300;

    /* Behaviour Color */
    this.behaviourColor = { r: 0, g: 0, b: 0 };

    /* Brightness (Opacity). */
    this.brightness = 0;
    this.brightnessVar = 3;
    this.brightnessMin = 0;
    this.brightnessMax = 1;
    this.brightnessGrd = 1;

    /* Speed Magnitude. */
    this.speed = 0;

    /* Behaviour Speed and Acceleration */
    this.behaviourSpeed = 0;
    this.acceleration = 0;

    /* Velocity. */
    this.velocity = { x: 0, y: 0 };

    /* Radius. */
    this.radius = 0;

    /* Position. */
    this.position = { x: 0, y: 0 };

    /* Direction. */
    this.direction = 0;
    this.directionVar = 0;
  }

  initialise(width, height) {
    this.behaviour = Behaviours.WANDER;
    this.radius = 10 + 20 * random();
    this.position.x = width * random();
    this.position.y = height;
    this.speed = 0;
    this.direction = 0;
  }

  isOutOfBound(width, height) {
    let { x, y } = this.position;
    let radius = this.radius;

    return (
      x < -radius || width + radius < x || y < -radius || height + radius < y
    );
  }

  changeBehaviour(behaviour) {
    if (this.behaviour !== behaviour) {
      const { getColor, getBrightnessMin, getBrightnessMax } = behaviour;

      this.behaviour = behaviour;
      this.behaviourColor = getColor();
      this.brightnessMin = getBrightnessMin();
      this.brightnessMax = getBrightnessMax();
    }
  }

  behaveOn(target) {
    const { position, speed, direction, behaviour } = this;
    const { blurFactor } = behaviour;
    const destiny = {
      position: target.getBlurredPosition(blurFactor),
      speed: target.getSpeed(),
      direction: target.getDirection()
    };

    this.behave({ position, speed, direction }, destiny);
  }

  getTo(position) {
    const origin = {
      position: this.position,
      speed: this.speed,
      direction: this.direction
    };
    const destiny = {
      position: position,
      speed: 0,
      direction: 0
    };

    this.behave(origin, destiny);
  }

  behave(origin, destiny) {
    const { getSpeed, getAcceleration, getDirectionVar } = this.behaviour;

    this.behaviourSpeed = getSpeed(origin, destiny);
    this.acceleration = getAcceleration(origin, destiny);
    this.directionVar = getDirectionVar(origin, destiny);
  }

  updateColor(timeDiff) {
    let { r, g, b } = this.color;
    let interval = this.colorVar * timeDiff;
    let { r: bR, g: bG, b: bB } = this.behaviourColor;

    this.color.r = (r + getVariation(r, bR, interval)) >> 0;
    this.color.g = (g + getVariation(g, bG, interval)) >> 0;
    this.color.b = (b + getVariation(b, bB, interval)) >> 0;
  }

  updateBrightness(timeDiff) {
    let b = this.brightness;
    let bMax = this.brightnessMax;
    let bMin = this.brightnessMin;
    let bVar = this.brightnessVar;

    this.brightnessGrd = b >= bMax ? -1 : b <= bMin ? 1 : this.brightnessGrd;
    this.brightness += this.brightnessGrd * bVar * timeDiff;
  }

  updateSpeed(timeDiff) {
    let speed = this.speed;
    let bSpeed = this.behaviourSpeed;
    let interval = this.acceleration * timeDiff;

    this.speed += getVariation(speed, bSpeed, interval);
  }

  updateDirection(timeDiff) {
    let d = this.direction;
    let dVar = this.directionVar;

    d += dVar * timeDiff;
    this.direction = roundAngle(d);
  }

  updateVelocityPosition(timeDiff) {
    let speed = this.speed;
    let direction = this.direction;
    let vX = speed * cos(direction);
    let vY = speed * sin(direction);

    this.velocity.x = vX;
    this.velocity.y = vY;
    this.position.x += vX * timeDiff;
    this.position.y += vY * timeDiff;
  }

  update(width, height, timeDiff, target) {
    const position = target.getPosition();
    const action = target.getAction();

    this.changeBehaviour(Behaviours.WANDER);

    if (position && action && action.behaviour) {
      const { behaviour, effectiveRange } = action;

      /* Calculate the distance between itself and the mouse position. */
      let distance = getDistance(this.position, position);

      /* If the firefly is within the effective range,
       * then apply the action behaviour. Otherwise it will stay in wander. */
      if (distance < effectiveRange) {
        this.changeBehaviour(behaviour);
      }
    }

    /* Re-initiate firefly when it flies off the boundary. */
    if (this.behaviour === null || this.isOutOfBound(width, height)) {
      this.initialise(width, height);
    } else {
      this.behaveOn(target);
      this.updateColor(timeDiff);
      this.updateBrightness(timeDiff);
      this.updateSpeed(timeDiff);
      this.updateDirection(timeDiff);
      this.updateVelocityPosition(timeDiff);
    }
  }

  performHeart(width, height, timeDiff, position, totalCount, performIndex) {
    this.changeBehaviour(Behaviours.ARRIVE);
    const { blurFactor } = this.behaviour;

    let blurredPosition = getBlurredPosition(position, blurFactor);

    /* Re-initiate firefly when it flies off the boundary. */
    if (this.behaviour === null || this.isOutOfBound(width, height)) {
      this.initialise(width, height);
    } else {
      this.getTo(getHeartPosition(totalCount, performIndex, blurredPosition));
      this.updateColor(timeDiff);
      this.updateBrightness(timeDiff);
      this.updateSpeed(timeDiff);
      this.updateDirection(timeDiff);
      this.updateVelocityPosition(timeDiff);
    }
  }

  paint(context) {
    context.beginPath();

    let { x, y } = this.position;
    let radius = this.radius;
    let { r, g, b } = this.color;
    let brightness = this.brightness.toFixed(2);
    let gradient = context.createRadialGradient(x, y, 0, x, y, radius);

    gradient.addColorStop(0, `rgba(255, 255, 255, ${brightness}`);
    gradient.addColorStop(0.1, `rgba(255, 255, 255, ${0.8 * brightness}`);
    gradient.addColorStop(0.4, `rgba(${r}, ${g}, ${b}, ${0.2 * brightness})`);
    gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

    context.fillStyle = gradient;
    context.arc(x, y, radius, 2 * PI, false);
    context.closePath();
    context.fill();
  }
}

export default Firefly;
