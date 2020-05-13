<template>
  <v-card flat>
    <v-card-title>{{settings.title}}</v-card-title>
    <v-card-subtitle class="pb-0">{{settings.subtitle}}</v-card-subtitle>
    <v-card-text>
      <v-radio-group v-model="answer.choice" column class="my-0">
        <v-radio
          v-for="(variant, index) in settings.variants"
          :key="index"
          :label="variant.text"
          :value="`(${index}) ${variant.text}`"
          readonly
        ></v-radio>
      </v-radio-group>
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