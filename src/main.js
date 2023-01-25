import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import VeeValidate from "./includes/validation";
import { checkOnAuthStateChanged } from "./includes/firebase";

import "./assets/base.css";
import "./assets/main.css";

let app;

checkOnAuthStateChanged(() => {
  if (!app) {
    app = createApp(App);

    app.use(createPinia());
    app.use(router);
    app.use(VeeValidate);

    app.mount("#app");
  }
});
