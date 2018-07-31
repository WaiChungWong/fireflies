import React, { Component } from "react";
import PropTypes from "prop-types";

import Animator from "jw-animator";
import CanvasAnimator from "jw-animate-canvas";

import FireParticle from "./fireparticle";
import SparkParticle from "./sparkparticle";
import Target from "./target";

import "./style.css";

class Fire extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fireParticles: [],
      sparkParticles: []
    };

    this.animate = this.animate.bind(this);
  }

  componentDidMount() {
    const { count, animator } = this.props;
    const { fireParticles, sparkParticles } = this.state;

    animator.add(timeDiff => this.update(timeDiff));
    animator.start();

    for (let i = 0; i < count; i++) {
      fireParticles.push(new FireParticle());
    }

    for (let i = 0; i < count / 4; i++) {
      sparkParticles.push(new SparkParticle());
    }
  }

  update(timeDiff) {
    const { target } = this.props;
    const { fireParticles, sparkParticles } = this.state;
    let startFire = true;

    /* Update the fire particles. */
    for (let i = 0; i < fireParticles.length; i++) {
      const p = fireParticles[i];

      p.update(timeDiff, target, startFire);

      if (p.remainingLife === p.lifespan) {
        startFire = false;
      }
    }

    /* Update the spark particles. */
    for (let i = 0; i < sparkParticles.length; i++) {
      sparkParticles[i].update(timeDiff, target, startFire);
    }
  }

  animate(context, width, height) {
    const { fireParticles, sparkParticles } = this.state;

    /* Clear the canvas screen. */
    context.clearRect(0, 0, width, height);

    /* Set the color overlapping to become brighter. */
    context.globalCompositeOperation = "lighter";

    /* Paint the fire particles. */
    for (let i = 0; i < fireParticles.length; i++) {
      fireParticles[i].paint(context);
    }

    /* Paint the spark particles. */
    for (let i = 0; i < sparkParticles.length; i++) {
      sparkParticles[i].paint(context);
    }
  }

  render() {
    const { animator } = this.props;

    return (
      <CanvasAnimator
        className="fire-layer"
        animator={animator}
        animate={this.animate}
      />
    );
  }
}

Fire.propTypes = {
  count: PropTypes.number,
  animator: PropTypes.instanceOf(Animator),
  target: PropTypes.instanceOf(Target)
};

Fire.defaultProps = {
  count: 50,
  animator: new Animator(),
  target: null
};

export default Fire;
