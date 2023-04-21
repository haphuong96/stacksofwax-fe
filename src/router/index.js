import { createRouter, createWebHistory } from "vue-router";
import AlbumDetailPage from "../pages/AlbumDetailPage.vue";
import CollectionsPage from "../pages/CollectionsPage.vue";
import ExplorePage from "../pages/ExplorePage.vue";
import HomePage from "../pages/HomePage.vue";
import LoginPage from "../pages/LoginPage.vue";
import SignupPage from "../pages/SignupPage.vue";
import MyCollectionPage from "../pages/MyCollectionPage.vue";
import DraftCollectionPage from "../pages/DraftCollectionPage.vue";
import CollectionDetailPage from "../pages/CollectionDetailPage.vue";
import ArtistDetailPage from "../pages/ArtistDetailPage.vue";
import UserDetailPage from "../pages/UserDetailPage.vue";

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
      path: "/explore",
      name: routeNames.EXPLORE,
      component: ExplorePage,
      meta: {
        layout: screenLayout.DEFAULT_LAYOUT
      }
      // beforeEnter: requireLoginGuard
    },
    // {
    //   path: "/albums",
    //   name: routeNames.ALBUM,
    //   component: AlbumsPage,
    //   meta: {
    //     layout: screenLayout.DEFAULT_LAYOUT
    //   }
    //   // beforeEnter: requireLoginGuard
    // },
    {
      path: "/albums/:id",
      name: routeNames.ALBUM_DETAILS,
      component: AlbumDetailPage,
      meta: {
        layout: screenLayout.DEFAULT_LAYOUT
      }
    },
    {
      path: "/artists/:id",
      name: routeNames.ARTIST_DETAILS,
      component: ArtistDetailPage,
      meta: {
        layout: screenLayout.DEFAULT_LAYOUT
      }
    },
    // {
    //   path: "/artists",
    //   name: routeNames.ARTIST,
    //   component: ArtistsPage,
    //   meta: {
    //     layout: screenLayout.DEFAULT_LAYOUT
    //   }
    //   // beforeEnter: requireLoginGuard
    // },
    {
      path: "/collections",
      name: routeNames.COLLECTION,
      component: CollectionsPage,
      meta: {
        layout: screenLayout.DEFAULT_LAYOUT
      }
      // beforeEnter: requireLoginGuard
    },
    {
      path: "/collections/:id",
      name: routeNames.COLLECTION_DETAILS,
      component: CollectionDetailPage,
      meta: {
        layout: screenLayout.DEFAULT_LAYOUT
      }
      // beforeEnter: requireLoginGuard
    },
    {
      path: "/my-collections",
      name: routeNames.MY_COLLECTION,
      component: MyCollectionPage,
      meta: {
        layout: screenLayout.DEFAULT_LAYOUT
      }
      // beforeEnter: requireLoginGuard
    },
    {
      path: "/my-collections/:id",
      name: routeNames.DRAFT_COLLECTION_DETAIL,
      component: DraftCollectionPage,
      meta: {
        layout: screenLayout.DEFAULT_LAYOUT
      }
      // beforeEnter: requireLoginGuard
    },
    {
      path: "/user/:id",
      name: routeNames.USER_DETAIL,
      component: UserDetailPage,
      meta: {
        layout: screenLayout.DEFAULT_LAYOUT
      }
    }
  ]
});

export default router;
