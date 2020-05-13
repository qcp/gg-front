import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import utils from "./plugins/utils";

Vue.config.productionTip = false;

Vue.component('c-date-picker-text', () => import("@/components/datePickerText"));
Vue.component('c-bth-tip', () => import("@/components/buttonTooltip"));

Vue.use(utils);

new Vue({
  router,
  store,  
  vuetify,
  render: function (h) {
    return h(App);
  }
}).$mount("#app");
