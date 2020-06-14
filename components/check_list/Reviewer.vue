<template>
  <v-card flat>
    <v-card-title>{{settings.title}}</v-card-title>
    <v-card-subtitle class="pb-0">{{settings.subtitle}}</v-card-subtitle>
    <v-card-text>
      <v-checkbox
        v-for="(variant, index) in settings.variants"
        v-model="answer.choice[index]"
        :key="index"
        :label="variant.text"
        hide-details
        readonly
      ></v-checkbox>
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