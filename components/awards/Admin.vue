<template>
  <v-card flat>
    <v-card-title>Awards</v-card-title>
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

<style></style>
