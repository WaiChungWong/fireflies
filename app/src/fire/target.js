export default class Target {
  constructor(mouse) {
    this.mouse = mouse;
    this.isMousePressed = false;
    this.clicked = false;
    this.clickTime = 120;

    mouse.onMouseMove(() => {});
    mouse.onMouseDown(() => {
      this.clicked = true;
      setTimeout(() => (this.clicked = false), this.clickTime);
    });
  }

  getPosition() {
    return this.mouse.isMouseDown ? this.mouse.position : null;
  }
}
