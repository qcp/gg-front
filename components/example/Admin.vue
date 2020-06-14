<template>
  <v-card flat>
    <v-card-title></v-card-title>
    <v-card-text></v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    value: Object
  },
  data: () => ({}),
  computed: {
    settings: {
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
