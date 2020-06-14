<template>
  <v-card flat>
    <v-card-title>{{settings.title}}</v-card-title>
    <v-card-subtitle>{{settings.subtitle}}</v-card-subtitle>
    <v-list>
      <v-list-item v-for="(item, index) in settings.attaches" :key="index" class="my-2">
        <v-card width="100%">
          <v-card-text>{{item.text}}</v-card-text>
          <v-list dense>
            <v-list-item v-for="(file) in answer.attach[index].files" :key="file._id">
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
            </v-list-item>
          </v-list>
        </v-card>
      </v-list-item>
    </v-list>
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