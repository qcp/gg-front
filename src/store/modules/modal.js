const state = {
    active: false,
    persistent: false,
    width: 500,
    title: "",
    subtitle: "",
    text: "",
    confirmBtn: undefined,
    cancelBtn: undefined
};
const mutations = {
    show: (state, { modal }) => {
        if (modal.cancelBtn) {
            state.cancelBtn = {};
            state.cancelBtn.callback = modal.cancelBtn.callback || (() => state.active = false);
            state.cancelBtn.color = modal.cancelBtn.color || "warning";
            state.cancelBtn.text = modal.cancelBtn.text || "Cancel";
        }
        else{
            state.cancelBtn = undefined;
        }
        if (modal.confirmBtn) {
            state.confirmBtn = {};
            state.confirmBtn.callback = modal.confirmBtn.callback || (() => state.active = false);
            state.confirmBtn.color = modal.confirmBtn.color || "success";
            state.confirmBtn.text = modal.confirmBtn.text || "Confirm";
        }
        else{
            state.confirmBtn = undefined;
        }
        state.text = modal.text || "";
        state.subtitle = modal.subtitle || "";
        state.title = modal.title || "";
        state.width = modal.width || 500;
        state.persistent = modal.persistent || false;
        state.active = true;
    },
    hide: (state) => {
        state.active = false;
    }
};
const actions = {
    showModal: ({ commit }, modal) => commit("show", { modal }),
    hideModal: ({ commit }) => commit("hide")
};
const getters = {
    modal: state => state
};

export default {
    state,
    getters,
    actions,
    mutations
};