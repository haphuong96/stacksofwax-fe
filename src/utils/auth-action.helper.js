import { localStorageKeys } from "../common/local-storage-keys";
import emitter, { emitterEvents } from "./emitter.helper";
export const authAction = (action) => {
  if (!localStorage.getItem(localStorageKeys.ACCESS_TOKEN)) {
    emitter.emit(emitterEvents.EXECUTE_REQUIRE_LOGIN_ACTION);
    return;
  }
  action();
};
