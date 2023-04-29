import mitt from "mitt";
const emitter = mitt();

export const emitterEvents = {
  SHOW_ALERT: "SHOW_ALERT",
  EXECUTE_REQUIRE_LOGIN_ACTION: "EXECUTE_REQUIRE_LOGIN_ACTION",
  EXPIRED_TOKEN: "EXPIRED_TOKEN",
};
export default emitter;
