<template>
  <v-card class="mx-auto" max-width="700">
    <v-toolbar flat>
      <v-toolbar-title class="grey--text">Dashboard</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon @click="$router.push('builder')">
        <v-icon>mdi-plus-circle-outline</v-icon>
      </v-btn>

      <v-btn icon @click="$store.dispatch('logout')">
        <v-icon>mdi-exit-run</v-icon>
      </v-btn>
    </v-toolbar>

    <v-data-table
      :headers="headers"
      :items="items"
      :loading="loading"
      @click:row="edit"
      loading-text="Loading... Please wait"
      no-data-text="No one inquirer found"
    ></v-data-table>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    loading: true,
    headers: [
      { text: "title", value: "general.title" },
      { text: "description", value: "general.description" }
    ],
    items: []
  }),
  methods: {
    edit: function(item) {
      this.$router.push({ name: "DeveloperBuilder", query: { _id: item._id } });
    }
  },
  beforeMount: function() {
    this.loading = true;
    this.$backCall("/a/dashboard", "GET").then(res => {
      this.items = res.dashboard;
      this.loading = false;
    });
  }
};
</script>

<style>
</style>