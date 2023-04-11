import { createRouter, createWebHistory } from "vue-router";
import ArtistsPage from "../pages/ArtistsPage.vue";
import CollectionsPage from "../pages/CollectionsPage.vue";
import HomePage from "../pages/HomePage.vue";
import LoginPage from "../pages/LoginPage.vue";
import SignupPage from "../pages/SignupPage.vue";
import AlbumsPage from "../pages/AlbumsPage.vue";
import AlbumDetailPage from "../pages/AlbumDetailPage.vue";
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
        name: routeNames.HOME
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
      path: "/albums",
      name: routeNames.ALBUM,
      component: AlbumsPage,
      meta: {
        layout: screenLayout.DEFAULT_LAYOUT
      }
      // beforeEnter: requireLoginGuard
    },
    {
      path: "/albums/:album",
      name: routeNames.ALBUM_DETAILS, 
      component: AlbumDetailPage,
      meta: {
        layout: screenLayout.DEFAULT_LAYOUT
      }
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
