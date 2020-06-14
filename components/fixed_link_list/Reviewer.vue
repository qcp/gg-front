<template>
  <v-card flat>
    <v-card-title>{{settings.title}}</v-card-title>
    <v-card-subtitle>{{settings.subtitle}}</v-card-subtitle>
    <v-list>
      <v-list-item v-for="(item, index) in settings.attaches" :key="index" class="my-2">
        <v-text-field v-model="item.text" :label="`${index+1} files description`" dense readonly></v-text-field>
        <v-text-field v-model="answer.links[index].url" label="Url" dense readonly class="ml-2"></v-text-field>
        <v-btn icon dense target="_blank" :href="answer.links[index].url">
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