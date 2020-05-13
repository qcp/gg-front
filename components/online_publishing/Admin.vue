<template>
  <v-card flat>
    <v-card-title>Online publishings on elibrary.ru</v-card-title>
    <v-card-text>This criteria doesnot supported any additional settings.</v-card-text>
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
  },
};
</script>

<style></style>
