import Vue from "vue";
import router from "@/router";

function parseJwt(token) {
  const base64 = token
    .split(".")[1]
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );
  return JSON.parse(jsonPayload);
}

const state = {
  user: null,
  token: sessionStorage.getItem("user-token")
};
const mutations = {
  loginAttempt: (state, { token }) => {
    state.token = token;
    state.user = null;
  },
  loginSuccess: (state, { user }) => {
    state.user = user;
  },
  loginFailure: state => {
    state.user = null;
    state.token = "";
  },
  logout: state => {
    state.user = null;
    state.token = "";
  }
};
const actions = {
  login: ({ commit }, token) => {
    return new Promise((resolve, reject) => {
      commit("loginAttempt", { token: token });
      sessionStorage.setItem("user-token", token);
      Vue.backCall("/signin", "POST")
        .then(res => {
          commit("loginSuccess", { user: res.user });
          resolve(res.user);
        })
        .catch(err => {
          commit("loginFailure");
          reject(err);
        });
    });
  },
  logout: ({ commit }) => {
    sessionStorage.removeItem("user-token");
    commit("logout");
    router.push("/login");
  }
};
const getters = {
  user: state => state.user,
  token: state => state.token,
  tokenData: state => parseJwt(state.token)
};

export default {
  state,
  getters,
  actions,
  mutations
};
