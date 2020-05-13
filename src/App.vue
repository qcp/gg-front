<template>
  <v-app>
    <v-content>
      <v-container fill-height>
        <v-layout wrap align-center>
          <v-flex>
            <router-view />
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: "App",
  components: {},
  data: () => ({})
};
</script>

<style>
.theme--light.v-application {
  background: #FAFAFA !important;
}
</style>

