const { random, PI } = Math;

/* Generate color of the fire: Bright yellow color. */
const getColor = () => ({
  r: 255,
  g: (100 + 155 * random()) >> 0,
  b: 80
});

/* Generate fire color reducing velocity in terms of value per second. */
const getColorVar = () => ({
  r: -480 + 120 * random(),
  g: -960 + 240 * random(),
  b: -480 + 120 * random()
});

/* Generate the starting radius. */
const getRadius = () => 20 + 10 * random();

/* Generate the radius variation. */
const getRadiusVar = () => 40 + 40 * random();

/* Generate fire velocity in terms of pixels per second. */
const getVelocity = () => ({
  x: -90 + 180 * random(),
  y: -500 + 300 * random()
});

/* Generate lifespan and remaining life time in terms of milliseconds. */
const getLifespan = () => 0.2 + 0.2 * random();

class FireParticle {
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
    this.radiusVar = getRadiusVar();
    this.opacity = 1;
    this.velocity = getVelocity();
    this.lifespan = getLifespan();
    this.remainingLife = this.lifespan;
  }

  update(timeDiff, target, startFire) {
    const position = target.getPosition();

    /* Update the fire particle. If the remainingLife is over,
       reset properties of the fire particle. */
    if (
      (this.remainingLife <= 0 || this.radius <= 0) &&
      position &&
      startFire
    ) {
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
      this.radius -= this.radiusVar * timeDiff;
      this.opacity = this.remainingLife / this.lifespan;
    }
  }

  paint(context) {
    let { opacity, remainingLife, radius, position, color } = this;

    if (remainingLife > 0 && radius > 0) {
      context.beginPath();

      let { x, y } = position;
      let { r, g, b } = color;
      let gradient = context.createRadialGradient(x, y, 0, x, y, radius);

      gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${opacity}`);
      gradient.addColorStop(0.6, `rgba(${r}, ${g}, ${b}, ${0.6 * opacity})`);
      gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

      context.fillStyle = gradient;
      context.arc(x, y, radius, 2 * PI, false);
      context.closePath();
      context.fill();
    }
  }
}

export default FireParticle;
