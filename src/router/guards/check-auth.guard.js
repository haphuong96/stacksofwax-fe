import { localStorageKeys } from "../../common/local-storage-keys";
import { routeNames } from "../route-names";

export function checkAuthGuard(_to, _from, next) {
  const accessToken = localStorage.getItem(localStorageKeys.ACCESS_TOKEN);
  if (!accessToken) {
    next();
  } else {
    next({ name: routeNames.HOME });
  }
}

export function requireLoginGuard(_to, _from, next) {
  const accessToken = localStorage.getItem(localStorageKeys.ACCESS_TOKEN);
  console.log(accessToken)
  if (!accessToken) {
    next({ name: routeNames.LOGIN });
  } else {
    next();
  }
}
