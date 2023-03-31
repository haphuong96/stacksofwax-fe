import { createRouter, createWebHistory } from "vue-router";
import LoginPage from "../pages/LoginPage.vue";
import SignupPage from "../pages/SignupPage.vue";
import HomePage from "../pages/HomePage.vue";
import { routeNames } from "./route-names";
import { screenLayout } from "./screen-layouts";
import { checkAuthGuard, requireLoginGuard } from "./guards/check-auth.guard";
//note: need to add meta:layout and guard (optional)
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: routeNames.DEFAULT,
      redirect: {
        name: routeNames.LOGIN
      }
    },
    {
      path: "/login",
      name: routeNames.LOGIN,
      component: LoginPage,
      meta: {
        layout: screenLayout.AUTH_LAYOUT
      },
      beforeEnter: checkAuthGuard
    },
    {
      path: "/signup",
      name: routeNames.SIGNUP,
      component: SignupPage,
      meta: {
        layout: screenLayout.AUTH_LAYOUT
      },
      beforeEnter: checkAuthGuard
    },
    {
      path: "/home",
      name: routeNames.HOME,
      component: HomePage,
      meta: {
        layout: screenLayout.DEFAULT_LAYOUT
      },
      beforeEnter: requireLoginGuard
    }
  ]
});

export default router;
