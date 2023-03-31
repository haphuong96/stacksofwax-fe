import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import { screenLayout } from "./router/screen-layouts";
import AuthLayout from "./layouts/AuthLayout.vue";
import DefaultLayout from "./layouts/DefaultLayout.vue";

const app = createApp(App);

app.component(screenLayout.AUTH_LAYOUT, AuthLayout);
app.component(screenLayout.DEFAULT_LAYOUT, DefaultLayout);

app.use(router);

app.mount("#app");
