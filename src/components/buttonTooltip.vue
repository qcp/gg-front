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
    disabled: Boolean
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