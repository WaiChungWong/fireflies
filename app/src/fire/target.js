export default class Target {
  constructor(mouse) {
    this.mouse = mouse;
    this.clicked = false;
    this.clickTime = 120;

    mouse.onMouseMove(() => {});
    mouse.onMouseDown(() => {
      this.clicked = true;
      setTimeout(() => (this.clicked = false), this.clickTime);
    });
    mouse.onMouseUp(() => {});
  }

  isClicked() {
    return this.clicked;
  }

  getPosition() {
    return this.mouse.isMouseDown ? this.mouse.position : null;
  }
}
