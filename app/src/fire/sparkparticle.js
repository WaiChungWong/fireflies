const { random, PI } = Math;

const gravity = 30;

/* Generate color of the spark: Bright yellow color. */
const getColor = () => ({
  r: 255,
  g: (200 + 50 * random()) >> 0,
  b: 150
});

/* Generate spark color reducing velocity in terms of value per second. */
const getColorVar = () => ({
  r: -800 + 400 * random(),
  g: -800 + 400 * random(),
  b: -1200 + 600 * random()
});

/* Generate the starting radius. */
const getRadius = () => 5 + 5 * random();

/* Generate the radius variation. */
const getRadiusVar = () => 9 + 2 * random();

/* Generate spark velocity in terms of pixels per second. */
const getVelocity = () => ({
  x: -500 + 1000 * random(),
  y: -750 + 1000 * random()
});

/* Generate lifespan and remaining life time in terms of seconds. */
const getLifespan = () => 1 + 2 * random();

class SparkParticle {
  constructor() {
    /* Color and the reducing speed in terms of pixels per second. */
    this.color = { r: 0, g: 0, b: 0 };
    this.colorVar = 0;

    /* Radius. */
    this.radius = 0;

    /* Position, initially using a fault position. */
    this.position = null;

    /* Velocity in terms of pixels per second. */
    this.velocity = { x: 0, y: 0 };

    /* Lifespan and remaining life time in terms of seconds. */
    this.lifespan = 0;
    this.remainingLife = 0;

    /* Opacity. */
    this.opacity = 1;
  }

  initialise() {
    this.color = getColor();
    this.colorVar = getColorVar();
    this.radius = getRadius();
    this.radiusVariaton = getRadiusVar();
    this.opacity = 1;
    this.velocity = getVelocity();
    this.lifespan = getLifespan();
    this.remainingLife = this.lifespan;
  }

  update(timeDiff, target) {
    const { clicked } = target;
    const position = target.getPosition();

    /* Update the fire particle. If the remainingLife is over, reset properties of the fire particle. */
    if ((this.remainingLife <= 0 || this.radius <= 0) && position && clicked) {
      this.initialise();
      this.position = { x: position.x, y: position.y };
    } else if (this.remainingLife > 0 && this.radius > 0) {
      const { r, g, b } = this.color;
      const { r: rVar, g: gVar, b: bVar } = this.colorVar;
      const { x, y } = this.velocity;

      this.color.r = (r + rVar * timeDiff) >> 0;
      this.color.g = (g + gVar * timeDiff) >> 0;
      this.color.b = (b + bVar * timeDiff) >> 0;
      this.position.x += x * timeDiff;
      this.position.y += y * timeDiff;
      this.remainingLife -= timeDiff;
      this.radius -= this.radiusVariaton * timeDiff;
      this.opacity = this.remainingLife / this.lifespan;

      /* Update vertical velocity for gravity. */
      this.velocity.y += gravity;
    }
  }

  paint(context) {
    let { opacity, remainingLife, radius, position, color } = this;

    if (remainingLife > 0 && radius > 0) {
      context.beginPath();

      let { x, y } = position;
      let { r, g, b } = color;
      let gradient = context.createRadialGradient(x, y, 0, x, y, radius);

      gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity}`);
      gradient.addColorStop(0.6, `rgba(${r}, ${g}, ${b}, ${0.6 * opacity})`);
      gradient.addColorStop(1, `rgba(0, 0, 0, 0)`);

      context.fillStyle = gradient;
      context.arc(x, y, radius, 2 * PI, false);
      context.closePath();
      context.fill();
    }
  }
}

export default SparkParticle;
