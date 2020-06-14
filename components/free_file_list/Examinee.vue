<template>
  <v-card flat>
    <v-card-title>{{settings.title}}</v-card-title>
    <v-card-subtitle>{{settings.subtitle}}</v-card-subtitle>

    <v-list>
      <v-list-item v-for="(item, index) in answer.attach" :key="index" class="my-2">
        <v-card width="100%">
          <v-card-text>
            <v-row>
              <v-text-field
                v-model="item.text"
                :label="`${index+1} files description`"
                dense
                class="ml-3 mr-2"
              ></v-text-field>
              <v-btn icon @click="removeFromList(answer.attach, index)" dense>
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-row>
            <v-file-input
              :multiple="settings.allowMultiple"
              :accept="settings.allowFormats.join(', ')"
              label="Files"
              @change="(a) => uploadFiles(a, index)"
              :loading="loading"
            ></v-file-input>
            <v-list dense>
              <v-list-item v-for="(file) in item.files" :key="file._id">
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
                <v-btn icon dense @click="deleteFile(file._id, index)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-list-item>
    </v-list>
    <v-card-actions>
      <v-spacer />
      <v-btn icon @click="addToList(answer.attach)">
        <v-icon>mdi-plus-circle-outline</v-icon>
      </v-btn>
      <v-spacer />
    </v-card-actions>
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
  computed: {
    answer: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      }
    }
  },
  methods: {
    addToList: function(list) {
      list.push({ text: "", files: [] });
    },
    removeFromList: function(list, index) {
      this.answer.attach[index].files.forEach(o => this.deleteFile(o._id, index));
      this.$delete(list, index);
    },
    uploadFiles: function(files, index) {
      this.loading = true;
      this.$backUploadFiles(files).then(res => {
        this.answer.attach[index].files.push(...res.files);
        this.loading = false;
      });
    },
    deleteFile: function(id, index) {
      this.$backCall(`/utils/delete-file?_id=${id}`, "DELETE").then(() => {
        this.$delete(
          this.answer.attach[index].files,
          this.answer.attach[index].files.findIndex(o => o._id === id)
        );
      });
    }
  }
};
</script>

<style>
</style>