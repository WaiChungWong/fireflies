import Behaviours from "./behaviours";

export default {
  HOLD: {
    behaviour: Behaviours.ATTRACT,
    effectiveRange: 300
  },
  DASH: {
    behaviour: Behaviours.FOLLOW,
    effectiveRange: 200
  },
  CLICK: {
    behaviour: Behaviours.FLEE,
    effectiveRange: 300
  }
};
