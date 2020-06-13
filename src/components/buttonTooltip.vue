<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <v-btn
        v-on="on"
        v-bind="$attrs"
        :class="handle ? 'handle' : ''"
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
    handle: Boolean,
    tooltip: String,
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