import React, { Component } from "react";
import PropTypes from "prop-types";

import Animator from "jw-animator";
import AnimateCanvas from "jw-animate-canvas";

import Firefly from "./firefly";
import Behaviours from "./behaviours";
import Target from "./target";

import "./style.css";

class Fireflies extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fireflies: [],
      performPosition: null
    };

    this.animate = this.animate.bind(this);
  }

  componentDidMount() {
    const { animator } = this.props;

    animator.add(timeDiff => this.update(timeDiff));

    this.generateFirefly();
  }

  generateFirefly() {
    const { count } = this.props;
    const { fireflies } = this.state;

    fireflies.push(new Firefly());

    this.setState({ fireflies });

    if (fireflies.length < count) {
      setTimeout(() => this.generateFirefly(), 250);
    }
  }

  isAllFirefliesAttracted() {
    const { count } = this.props;
    const { fireflies } = this.state;

    for (let i = 0; i < fireflies.length; i++) {
      const { behaviour } = fireflies[i];

      if (behaviour !== Behaviours.ATTRACT && behaviour !== Behaviours.ARRIVE) {
        return false;
      }
    }

    /* In case not all fireflies have been generated yet. */
    return fireflies.length === count;
  }

  performHeart(position) {
    this.setState({ performPosition: position });
  }

  update(timeDiff) {
    const { layer, props, state } = this;
    const { width, height } = layer.getCanvasElement();
    const { target, count, index, totalCount } = props;
    const { fireflies, performPosition: position } = state;

    if (position) {
      /* Update the fireflies. */
      for (let i = 0; i < fireflies.length; i++) {
        const firefly = fireflies[i];
        const ii = index * count + i;

        firefly.performHeart(width, height, timeDiff, position, totalCount, ii);
      }
    } else {
      /* Update the fireflies. */
      for (let i = 0; i < fireflies.length; i++) {
        const firefly = fireflies[i];

        firefly.update(width, height, timeDiff, target);
      }
    }
  }

  animate(context, width, height) {
    const { fireflies } = this.state;

    /* Clear the canvas screen. */
    context.clearRect(0, 0, width, height);

    /* Set the color overlapping to become brighter. */
    context.globalCompositeOperation = "lighter";

    /* Paint the fireflies. */
    for (let i = 0; i < fireflies.length; i++) {
      fireflies[i].paint(context, width, height);
    }
  }

  render() {
    const { animator } = this.props;

    return (
      <AnimateCanvas
        ref={layer => (this.layer = layer)}
        className="fireflies-layer"
        animator={animator}
        animate={this.animate}
      />
    );
  }
}

Fireflies.propTypes = {
  count: PropTypes.number,
  index: PropTypes.number,
  totalCount: PropTypes.number,
  animator: PropTypes.instanceOf(Animator),
  target: PropTypes.instanceOf(Target)
};

Fireflies.defaultProps = {
  count: 50,
  index: 0,
  totalCount: 50,
  animator: new Animator(),
  target: null
};

export default Fireflies;
