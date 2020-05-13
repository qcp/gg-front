<template>
  <v-card flat>
    <v-card-title>Awards {{examinee.name}}</v-card-title>
    <v-card-text>
      <v-list dense>
        <v-list-item v-for="(file) in answer.files" :key="file._id">
          <v-list-item-icon>
            <v-icon color="green">mdi-file-check</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{file.filename}}</v-list-item-title>
          <v-btn icon dense target="_blank" :href="$downloadFileUrl(file._id)">
            <v-icon>mdi-download</v-icon>
          </v-btn>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    settings: Object,
    examinee: Object,
    answer: Object
  }
};
</script>

<style>
</style>