<template>
  <v-card flat>
    <v-data-table :loading="loading" :headers="headers" :items="results">
      <template v-slot:top>
        <v-toolbar flat>
          There are all examinees who already answered
          <v-spacer />
          <c-bth-tip icon tooltip="Export excel" @click="exportExcel">
            <v-icon color="green darken-2">mdi-file-export</v-icon>
          </c-bth-tip>
          <c-bth-tip icon tooltip="Refresh" @click="reload">
            <v-icon>mdi-refresh</v-icon>
          </c-bth-tip>
        </v-toolbar>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import excel from "@/plugins/excel";

export default {
  props: {
    inquirerId: String,
    isActive: Boolean
  },
  data: () => ({
    loading: true,
    headers: [],
    results: []
  }),
  watch: {
    isActive: function() {
      if (this.isActive) this.reload();
    }
  },
  methods: {
    reload: function() {
      this.loading = true;

      this.$backCall(`/a/builder/results?_id=${this.inquirerId}`, "GET").then(
        res => {
          if (res.table) {
            this.headers = [];
            this.headers.push({
              text: "Examinee",
              value: "_examinee"
            });
            this.headers.push(
              ...res.table.headers.map(o => ({
                text: o.description || o.name,
                value: o.name
              }))
            );
            this.results = [];
            for (let result of res.table.results) {
              let obj = {};
              obj["_examinee"] = result.examinee.name;
              for (let parameter of result.parameters)
                obj[parameter.name] = parameter.value;

              this.results.push(obj);
            }
          }
          this.loading = false;
        }
      );
    },
    exportExcel: function() {
      excel.export(
        "Results",
        this.headers.map(o => ({
          key: o.value,
          header: o.text,
          width: 20
        })),
        this.results
      );
    }
  },
  beforeMount: function() {
    this.reload();
  }
};
</script>

<style>
</style>