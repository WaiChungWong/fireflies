import React, { Component } from "react";
import ClassNames from "classnames";
import PropTypes from "prop-types";

import Animator from "jw-animator";

import Sound from "../resources/sound.png";
import Mute from "../resources/mute.png";
import Soundtrack from "../resources/soundtrack.mp3";

import "./style.css";

class AudioPlayer extends Component {
  constructor(props) {
    super(props);

    this.state = { musicLoaded: false, soundOn: true };

    this.toggleSound = this.toggleSound.bind(this);
  }

  toggleSound() {
    const { audio } = this;
    const { soundOn } = this.state;

    audio.muted = soundOn;

    this.setState({ soundOn: !soundOn });
  }

  componentDidMount() {
    const { audio } = this;
    const { animator } = this.props;

    audio.volume = 0.2;

    animator.onPause(() => audio.pause());
    animator.onResume(() => audio.play());
  }

  render() {
    const { musicLoaded, soundOn } = this.state;

    return (
      <div id="audio-player">
        <audio
          ref={a => (this.audio = a)}
          src={Soundtrack}
          preload="auto"
          autoPlay="true"
          loop="true"
          onCanPlayThrough={() => this.setState({ musicLoaded: true })}
        />
        {musicLoaded && (
          <div id="audio-info" className={ClassNames({ show: soundOn })}>
            <span id="audio-title">Fireflies (Said The Sky Remix)</span>
            <span id="audio-author">Owl City</span>
          </div>
        )}
        {musicLoaded && (
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
