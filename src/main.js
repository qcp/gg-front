import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import utils from "./plugins/utils";

Vue.config.productionTip = false;

Vue.component('c-date-picker-text', () => import("@/components/datePickerText"));
Vue.component('c-btn-tip', () => import("@/components/buttonTooltip"));
Vue.component('c-btn-upload', () => import("@/components/buttonUpload"));

Vue.use(utils);

new Vue({
  router,
  store,  
  vuetify,
  render: function (h) {
    return h(App);
  }
}).$mount("#app");
