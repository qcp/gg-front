<template>
  <v-card flat>
    <v-card-title>{{settings.title}}</v-card-title>
    <v-card-subtitle class="pb-0">{{settings.subtitle}}</v-card-subtitle>
    <v-list>
      <v-list-item v-for="(item, index) in answer.links" :key="index" class="my-2">
        <v-text-field v-model="item.text" :label="`${index+1} files description`" dense readonly></v-text-field>
        <v-text-field v-model="item.url" label="Url" dense readonly class="ml-2"></v-text-field>
        <v-btn icon dense target="_blank" :href="item.url">
          <v-icon>mdi-open-in-new</v-icon>
        </v-btn>
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