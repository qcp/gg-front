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
      <v-container fill-height>
        <router-view />
      </v-container>
    </v-content>
    <c-modal ref="modal"></c-modal>
  </v-app>
</template>

<script>
import cModal from "@/components/modalDialog";

export default {
  name: "App",
  components: {
    cModal
  },
  data: () => ({}),
  mounted() {
    console.log(this.$refs.modal);
    this.$root.$modal = this.$refs.modal.open;
  }
};
</script>

<style>
.theme--light.v-application {
  background: #fafafa !important;
}
</style>

