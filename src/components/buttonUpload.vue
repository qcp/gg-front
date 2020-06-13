<template>
  <div>
    <input
      style="display: none"
      ref="uploadFile"
      type="file"
      :accept="accept"
      :multiple="multiple"
      @change="onFileChanged"
    />
    <c-btn-tip v-bind="$attrs" @click="$refs.uploadFile.click()">
      <slot></slot>
    </c-btn-tip>
  </div>
</template>
<script>
export default {
  props: {
    accept: String,
    multiple: Boolean
  },
  methods: {
    onFileChanged: function(e) {
      this.$emit("select", e);
    }
  }
};
</script>

<style scoped></style>
