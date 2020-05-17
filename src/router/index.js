import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store";

import Login from "../views/Login.vue";
import LoginQuestions from "../views/LoginQuestions.vue";
import Main from "../views/Main.vue";

Vue.use(VueRouter);

async function checkUserRole(to, from, next) {
  new Promise(resolve => {
    resolve();
  }).then(() => {
    if (store.getters.token && !store.getters.user)
      return store.dispatch("login", store.getters.token);
  }).then(() => {
    if (store.getters.user.role == to.matched[0].meta.role)
      next();
    else
      throw "Wrong route";
  }).catch(err => {
    console.error(err);
    store.dispatch("logout");
    next("/login");
  });
}

const routes = [
  {
    path: "/login",
    alias: "/",
    name: "Login",
    component: Login,
    beforeEnter: (to, from, next) => {
      if (!store.getters.user) next();
      else next(store.getters.role[0]);
    }
  },
  {
    path: "/questions",
    name: "LoginQuestions",
    component: LoginQuestions
  },
  {
    path: "/a",
    name: "Developer",
    component: Main,
    meta: { role: "admin" },
    redirect: "/a/dashboard",
    children: [
      {
        path: "dashboard",
        name: "DeveloperDashboard",
        component: () => import("../views/admin/Dashboard.vue")
      },
      {
        path: "builder",
        name: "DeveloperBuilder",
        component: () => import("../views/admin/Builder.vue")
      }
    ],
    beforeEnter: checkUserRole
  },
  {
    path: "/e",
    name: "Examinee",
    component: Main,
    meta: { role: "examinee" },
    redirect: "/e/viewer",
    children: [
      {
        path: "viewer",
        name: "ExamineeViewer",
        component: () => import("../views/examinee/Viewer.vue")
      }
    ],
    beforeEnter: checkUserRole
  },
  {
    path: "/r",
    name: "Reviewer",
    component: Main,
    meta: { role: "reviewer" },
    redirect: "/r/viewer",
    children: [
      {
        path: "viewer",
        name: "ReviewerViewer",
        component: () => import("../views/reviewer/Viewer.vue")
      }
    ],
    beforeEnter: checkUserRole
  },
  {
    path: "/about",
    name: "About",
    component: function () {
      return import("../views/About.vue");
    }
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
