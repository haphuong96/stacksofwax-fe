import mitt from "mitt";
const emitter = mitt();

export const emitterEvents = {
  SHOW_ALERT: "SHOW_ALERT"
};
export default emitter;
