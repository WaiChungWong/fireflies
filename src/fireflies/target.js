import Actions from "./actions";
import { getBlurredPosition } from "./geometry2d";

export default class Target {
  constructor(mouse) {
    this.mouse = mouse;
    this.clicked = false;
    this.dashSpeed = 1000;
    this.clickTime = 120;

    mouse.onMove(() => {});
    mouse.onDown(() => {
      this.clicked = true;
      setTimeout(() => (this.clicked = false), this.clickTime);
    });
    mouse.onUp(() => {});
  }

  getPosition() {
    return this.mouse.position;
  }

  getBlurredPosition(blurFactor) {
    return getBlurredPosition(this.mouse.position, blurFactor);
  }

  getDirection() {
    return this.mouse.direction;
  }

  getSpeed() {
    return this.mouse.movingSpeed;
  }

  getAction() {
    const { clicked, mouse, dashSpeed } = this;
    const { isMouseDown, movingSpeed } = mouse;

    if (clicked) {
      return Actions.CLICK;
    } else if (isMouseDown) {
      return Actions.HOLD;
    } else if (movingSpeed > dashSpeed) {
      return Actions.DASH;
    } else {
      return null;
    }
  }
}
