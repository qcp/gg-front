<template>
  <v-card class="custom">
    <div style="position: sticky; top: 10px">
      <v-tooltip top>
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" fab small absolute style="right:-50px" @click="$router.push('builder')">
            <v-icon color="success">mdi-plus-circle-outline</v-icon>
          </v-btn>
        </template>
        Create new inquirer
      </v-tooltip>
    </div>

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
      { text: "Inquirer", value: "general.title" },
      { text: "Description", value: "general.description" }
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

<style scoped>
.custom {
  margin-top: -60px;
  z-index: 6;
}
</style>