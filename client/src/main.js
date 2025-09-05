import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { createPinia } from "pinia";

import "@mdi/font/css/materialdesignicons.css";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import Vue3Toastify from "vue3-toastify";
import PrimeVue from 'primevue/config';

// vue-router
import router from "./router";
//vuex
const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: "mdi", // Définit MDI comme le set d'icônes par défaut
    aliases, // Utilise les alias MDI standards
    sets: {
      mdi, // Inclut le set d'icônes MDI
    },
  },
});

const pinia = createPinia();

const app = createApp(App);
app.use(router);
app.use(vuetify);
app.use(pinia);
app.use(Vue3Toastify, {
  autoClose: 3000,
});
app.use(PrimeVue)
app.mount("#app");
