<template>
  <v-card flat>
    <v-card-title>Awards</v-card-title>
    <v-card-subtitle>Attach all your awards</v-card-subtitle>
    <v-card-text>
      <v-file-input
        :multiple="settings.allowMultiple"
        :accept="settings.allowFormats.join(', ')"
        label="File input"
        @change="uploadFiles"
        :loading="loading"
      ></v-file-input>
      <v-list dense>
        <v-list-item v-for="(file) in answer.files" :key="file._id">
          <v-list-item-icon>
            <v-icon color="green">mdi-file-check</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{file.filename}}</v-list-item-title>
          <v-btn icon dense target="_blank" :href="$downloadFileUrl(file._id)">
            <v-icon>mdi-open-in-new</v-icon>
          </v-btn>
          <v-btn icon dense @click="$backDownloadFile(file._id, file.filename)">
            <v-icon>mdi-download</v-icon>
          </v-btn>
          <v-btn icon dense @click="deleteFile(file._id)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    value: Object,
    settings: Object
  },
  data: () => ({
    loading: false
  }),
  methods: {
    uploadFiles: function(files) {
      this.loading = true;
      this.$backUploadFiles(files).then(res => {
        this.answer.files.push(...res.files);
        this.loading = false;
      });
    },
    deleteFile: function(id) {
      this.$backCall(`/utils/delete-file?_id=${id}`, "DELETE").then(() => {
        this.$delete(
          this.answer.files,
          this.answer.files.findIndex(o => o._id === id)
        );
      });
    }
  },
  computed: {
    answer: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      }
    }
  }
};
</script>

<style>
</style>