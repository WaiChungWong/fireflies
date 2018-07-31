export default class Target {
  constructor(mouse) {
    this.mouse = mouse;
    this.clicked = false;
    this.clickTime = 120;

    mouse.onMove(() => {});
    mouse.onDown(() => {
      this.clicked = true;
      setTimeout(() => (this.clicked = false), this.clickTime);
    });
    mouse.onUp(() => {});
  }

  isClicked() {
    return this.clicked;
  }

  getPosition() {
    return this.mouse.isMouseDown ? this.mouse.position : null;
  }
}
