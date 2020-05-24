<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <v-btn
        v-on="on"
        :dense="dense"
        :icon="icon"
        :loading="loading"
        :large="large"
        :disabled="disabled"
        :class="handle?'handle':''"
        :href="href"
        @click="click"
      >
        <slot></slot>
      </v-btn>
    </template>
    {{tooltip}}
  </v-tooltip>
</template>

<script>
export default {
  props: {
    dense: Boolean,
    icon: Boolean,
    loading: Boolean,
    handle: Boolean,
    tooltip: String,
    large: Boolean,
    disabled: Boolean,
    href: String
  },
  methods: {
    click: function() {
      this.$emit("click", this.value);
    }
  }
};
</script>

<style>
</style>