<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    :nudge-right="40"
    transition="scale-transition"
    offset-y
    min-width="290px"
    :disabled="disabled"
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        v-model="date"
        :rules="rules"
        :label="label"
        prepend-icon="mdi-calendar"
        :disabled="disabled"
        readonly
        v-on="on"
      ></v-text-field>
    </template>
    <v-date-picker
      v-model="date"      
      :min="min"
      @input="menu = false"
    ></v-date-picker>
  </v-menu>
</template>

<script>
export default {
  props: {
    value: String,
    label: String,
    rules: Array,
    disabled: Boolean,
    min: String
  },
  data: () => ({
    menu: false
  }),
  computed: {
    date: {
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