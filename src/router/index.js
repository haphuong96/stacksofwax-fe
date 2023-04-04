import { createRouter, createWebHistory } from "vue-router";
import ArtistsPage from "../pages/ArtistsPage.vue";
import CollectionsPage from "../pages/CollectionsPage.vue";
import HomePage from "../pages/HomePage.vue";
import LoginPage from "../pages/LoginPage.vue";
import SignupPage from "../pages/SignupPage.vue";
import VinylsPage from "../pages/VinylsPage.vue";
import { checkAuthGuard } from "./guards/check-auth.guard";
import { routeNames } from "./route-names";
import { screenLayout } from "./screen-layouts";
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
      }
      // beforeEnter: requireLoginGuard
    },
    {
      path: "/vinyls",
      name: routeNames.VINYL,
      component: VinylsPage,
      meta: {
        layout: screenLayout.DEFAULT_LAYOUT
      }
      // beforeEnter: requireLoginGuard
    },
    {
      path: "/artists",
      name: routeNames.ARTIST,
      component: ArtistsPage,
      meta: {
        layout: screenLayout.DEFAULT_LAYOUT
      }
      // beforeEnter: requireLoginGuard
    },
    {
      path: "/collections",
      name: routeNames.COLLECTION,
      component: CollectionsPage,
      meta: {
        layout: screenLayout.DEFAULT_LAYOUT
      }
      // beforeEnter: requireLoginGuard
    }
  ]
});

export default router;
