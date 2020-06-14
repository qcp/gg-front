<template>
  <v-card flat>
    <v-card-title>
      <v-text-field v-model="settings.title" label="Tap criteria title" dense></v-text-field>
    </v-card-title>
    <v-card-subtitle>
      <v-textarea
        v-model="settings.subtitle"
        label="Tap criteria subtitle"
        dense
        auto-grow
        rows="1"
      ></v-textarea>
    </v-card-subtitle>
    <v-card-text>
      <v-text-field v-model="settings.regex" label="Regex" dense></v-text-field>
    </v-card-text>
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
