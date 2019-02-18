import React, { Component } from "react";
import ClassNames from "classnames";
import PropTypes from "prop-types";

import Animator from "jw-animator";
import * as Audio from "jw-audio";

import Sound from "../resources/sound.png";
import Mute from "../resources/mute.png";
import Soundtrack from "../resources/soundtrack.mp3";

import "./style.css";

class AudioPlayer extends Component {
  constructor(props) {
    super(props);

    this.state = { loaded: false, soundOn: true };

    this.toggleSound = this.toggleSound.bind(this);
  }

  toggleSound() {
    const { soundOn } = this.state;

    this.gain.gain.value = soundOn ? 0 : 0.2;

    this.setState({ soundOn: !soundOn });
  }

  async componentDidMount() {
    let destination = Audio.destination;
    const { animator } = this.props;

    try {
      this.source = await Audio.createMediaSource(Soundtrack);
      this.gain = Audio.createGain();
      this.source.connect(this.gain).connect(destination);
      this.source.element.loop = true;
      this.gain.gain.value = 0.2;

      animator.onPause(() => {
        if (this.state.loaded) {
          this.source.pause();
        }
      });
      animator.onResume(() => {
        if (this.state.loaded) {
          this.source.resume();
        }
      });

      let eventHandler = () => {
        this.source.resume();
        this.setState({ loaded: true });
        document.removeEventListener("click", eventHandler);
      };

      document.addEventListener("click", eventHandler);
    } catch (error) {}
  }

  render() {
    const { loaded, soundOn } = this.state;

    return (
      <div id="audio-player">
        {loaded && (
          <div id="audio-info" className={ClassNames({ show: soundOn })}>
            <span id="audio-title">Fireflies (Said The Sky Remix)</span>
            <span id="audio-author">Owl City</span>
          </div>
        )}
        {loaded && (
          <img
            id="sound-toggle"
            src={soundOn ? Sound : Mute}
            alt="Sound"
            onClick={this.toggleSound}
          />
        )}
      </div>
    );
  }
}

AudioPlayer.propTypes = {
  animator: PropTypes.instanceOf(Animator)
};

export default AudioPlayer;
