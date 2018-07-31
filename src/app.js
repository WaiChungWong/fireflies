import React, { Component } from "react";
import PropTypes from "prop-types";

import Animator from "jw-animator";
import Mouse from "jw-mouse";

import Fireflies from "./fireflies";
import FirefliesTarget from "./fireflies/target";
import Fire from "./fire";
import FireTarget from "./fire/target";

import "./app.css";

class App extends Component {
  constructor(props) {
    super(props);

    this.mouse = new Mouse();
    this.blockContextMenu = event => event.preventDefault();

    this.state = {
      firefliesTarget: new FirefliesTarget(this.mouse),
      fireTarget: new FireTarget(this.mouse)
    };
  }

  componentDidMount() {
    const { mouse, blockContextMenu, scene, foreground, background } = this;
    const { animator } = this.props;

    scene.addEventListener("contextmenu", blockContextMenu);

    animator.add(() => {
      if (mouse.isMouseDown && this.isAllFirefliesAttracted()) {
        foreground.performHeart(mouse.position);
        background.performHeart(mouse.position);

        clearTimeout(this.performTimer);

        this.performTimer = setTimeout(() => {
          foreground.performHeart();
          background.performHeart();
        }, 5000);
      }
    });

    animator.start();

    mouse.attach(scene);
  }

  componentWillUnmount() {
    const { mouse, blockContextMenu, scene } = this;

    scene.removeEventListener("contextmenu", blockContextMenu);

    mouse.detach();
  }

  isAllFirefliesAttracted() {
    const { foreground, background } = this;

    return (
      foreground.isAllFirefliesAttracted() &&
      background.isAllFirefliesAttracted()
    );
  }

  render() {
    const { animator } = this.props;
    const { firefliesTarget, fireTarget } = this.state;

    return (
      <div id="fireflies-scene" ref={s => (this.scene = s)}>
        <Fireflies
          ref={r => (this.background = r)}
          animator={animator}
          target={firefliesTarget}
          count={50}
          index={0}
          totalCount={100}
        />
        <Fire animator={animator} target={fireTarget} />
        <Fireflies
          ref={r => (this.foreground = r)}
          animator={animator}
          target={firefliesTarget}
          count={50}
          index={1}
          totalCount={100}
        />
      </div>
    );
  }
}

App.propTypes = {
  animator: PropTypes.instanceOf(Animator)
};

App.defaultProps = {
  animator: new Animator()
};

export default App;
