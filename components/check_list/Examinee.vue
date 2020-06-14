<template>
  <v-card flat>
    <v-card-title>{{settings.title}}</v-card-title>
    <v-card-subtitle>{{settings.subtitle}}</v-card-subtitle>
    <v-card-text>
      <v-checkbox
        v-for="(variant, index) in settings.variants"
        v-model="answer.choice[index]"
        :key="index"
        :label="variant.text"
        hide-details
      ></v-checkbox>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    value: Object,
    settings: Object
  },
  data: () => ({}),
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