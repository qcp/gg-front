<template>
  <v-card class="custom">
    <div style="position: sticky; top: 10px">
      <v-tooltip top>
        <template v-slot:activator="{ on }">
          <v-btn
            v-on="on"
            fab
            small
            absolute
            style="right:-50px"
            @click="$router.push('builder')"
          >
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
    >
      <template v-slot:item.state="{ item }">
        <v-chip
          small
          :color="
            item.state == 'IN_PROGRESS'
              ? 'warning'
              : item.state == 'DONE'
              ? 'success'
              : ''
          "
          >{{ item.state }}</v-chip
        >
      </template>
      <template v-slot:item.statistics="{ item }">
        <v-chip v-if="item.statistics.none" small class="ma-1"
          ><v-icon left>mdi-account-clock</v-icon
          >{{ item.statistics.none }}</v-chip
        >
        <v-chip v-if="item.statistics.draft" small class="ma-1"
          ><v-icon left>mdi-account-edit</v-icon
          >{{ item.statistics.draft }}</v-chip
        >
        <v-chip v-if="item.statistics.done" small class="ma-1"
          ><v-icon left>mdi-account-check</v-icon
          >{{ item.statistics.done }}</v-chip
        >
        <v-chip v-if="item.statistics.all" small class="ma-1"
          ><v-icon left>mdi-account-group</v-icon
          >{{ item.statistics.all }}</v-chip
        >
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    loading: true,
    headers: [
      { text: "Inquirer", value: "general.title" },
      { text: "Description", value: "general.description" },
      { text: "State", value: "state" },
      { text: "Statistics", value: "statistics" }
    ],
    items: []
  }),
  methods: {
    edit: function(item) {
      this.$router.push({ path: "builder", query: { _id: item._id } });
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
  width: 100%;
}
</style>
