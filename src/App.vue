<template>
  <v-app>
    <v-app-bar v-if="$store.getters.user" app dark color="primary" extended collapse-on-scroll>
      <v-toolbar-title>{{$route.name}}</v-toolbar-title>
      <v-spacer></v-spacer>
      <div class="hide_on_collapse">
        <v-menu
          offset-y
          origin="center center"
          transition="scale-transition"
          :close-on-content-click="false"
        >
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" icon>
              <v-icon>mdi-cog</v-icon>
            </v-btn>
          </template>
          <v-list dense>
            <v-list-item>
              <v-switch
                v-model="$vuetify.theme.dark"
                label="Dark theme"
                prepend-icon="mdi-theme-light-dark"
              ></v-switch>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item>
              <v-select
                value="English"
                label="Language"
                single-line
                hide-selected
                no-data-text="No other language available"
                :items="['English']"
                prepend-icon="mdi-translate"
              ></v-select>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
      <c-btn-tip icon tooltip="Help" href="https://github.com/qcp/gg-common">
        <v-icon>mdi-help-circle-outline</v-icon>
      </c-btn-tip>
      <v-divider vertical></v-divider>
      <c-btn-tip icon tooltip="Exit" @click="$store.dispatch('logout')">
        <v-icon>mdi-exit-run</v-icon>
      </c-btn-tip>
    </v-app-bar>
    <v-main>
      <v-container fill-height style="max-width:1000px">
        <router-view />
      </v-container>
    </v-main>
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
      show: () => (this.overlay = true),
      hide: () => (this.overlay = false)
    };
  }
};
</script>

<style>
.theme--light.v-application {
  background: #fafafa !important;
}
.v-toolbar.v-toolbar--collapsed .hide_on_collapse {
  display: none;
}
</style>

