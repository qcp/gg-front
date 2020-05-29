<template>
  <v-app>
    <v-app-bar v-if="$store.getters.user" app dark color="primary" extended collapse-on-scroll>
      <v-toolbar-title>{{$route.name}}</v-toolbar-title>
      <v-spacer></v-spacer>
      <c-bth-tip icon tooltip="Help" href="https://github.com/qcp/gg-common">
        <v-icon>mdi-help-circle-outline</v-icon>
      </c-bth-tip>
      <c-bth-tip icon tooltip="Exit" @click="$store.dispatch('logout')">
        <v-icon>mdi-exit-run</v-icon>
      </c-bth-tip>
    </v-app-bar>
    <v-content>
      <v-container fill-height style="max-width:1000px">
        <router-view />
      </v-container>
    </v-content>
    <c-modal ref="modal"></c-modal>
    <v-overlay :value="overlay" z-index="8">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-app>
</template>

<script>
import cModal from "@/components/modalDialog";

export default {
  name: "App",
  components: {
    cModal
  },
  data: () => ({
    overlay: false
  }),
  mounted: function() {
    this.$root.$modal = this.$refs.modal.open;
    this.$root.$overlay = {
      show: () => this.overlay = true,
      hide: () => this.overlay = false
    };
  }
};
</script>

<style>
.theme--light.v-application {
  background: #fafafa !important;
}
</style>

