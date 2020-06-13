<template>
  <v-dialog :value="active" :persistent="persistent" :width="width">
    <v-card>
      <v-card-title class="headline">{{ title }}</v-card-title>
      <v-card-subtitle v-if="subtitle">{{ subtitle }}</v-card-subtitle>
      <v-card-text>{{ message }}</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          v-if="cancelBtn"
          :color="cancelBtn.color"
          text
          @click.native="cancel"
          >{{ cancelBtn.text }}</v-btn
        >
        <v-btn
          v-if="confirmBtn"
          :color="confirmBtn.color"
          text
          @click.native="confirm"
          >{{ confirmBtn.text }}</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data: () => ({
    active: false,
    persistent: false,
    width: 500,
    title: "",
    subtitle: "",
    message: "",
    confirmBtn: undefined,
    cancelBtn: undefined,

    resolve: null,
    reject: null
  }),
  methods: {
    open(options) {
      if (options.cancelBtn) {
        this.cancelBtn = {};
        this.cancelBtn.color = options.cancelBtn.color || "warning";
        this.cancelBtn.text = options.cancelBtn.text || "Cancel";
      } else {
        this.cancelBtn = undefined;
      }
      if (options.confirmBtn) {
        this.confirmBtn = {};
        this.confirmBtn.color = options.confirmBtn.color || "success";
        this.confirmBtn.text = options.confirmBtn.text || "Confirm";
      } else {
        this.confirmBtn = undefined;
      }
      this.message = options.message || "";
      this.subtitle = options.subtitle || "";
      this.title = options.title || "";
      this.width = options.width || 500;
      this.persistent = options.persistent || false;
      this.active = true;
      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
    },
    confirm() {
      this.resolve(true);
      this.active = false;
    },
    cancel() {
      this.resolve(false);
      this.active = false;
    }
  }
};
</script>
