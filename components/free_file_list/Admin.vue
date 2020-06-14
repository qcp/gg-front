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
      <v-switch v-model="settings.allowMultiple" label="Allow multiple files upload"></v-switch>
      <v-combobox
        label="Allow formats"
        v-model="settings.allowFormats"
        :items="formatsList"
        hide-selected
        multiple
        small-chips
        deletable-chips
      ></v-combobox>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    value: Object
  },
  data: () => ({
    formatsList: ["image/png", "image/jpeg", "image/bmp"]
  }),
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
