<template>
  <div>
    <router-view />
    <v-dialog :value="modal.active" :persistent="modal.persistent" :width="modal.width">
      <v-card>
        <v-card-title class="headline">{{modal.title}}</v-card-title>
        <v-card-subtitle v-if="modal.subtitle">{{modal.subtitle}}</v-card-subtitle>
        <v-card-text>{{modal.text}}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            v-if="modal.cancelBtn"
            :color="modal.cancelBtn.color"
            text
            @click="modal.cancelBtn.callback"
          >{{modal.cancelBtn.text}}</v-btn>
          <v-btn
            v-if="modal.confirmBtn"
            :color="modal.confirmBtn.color"
            text
            @click="modal.confirmBtn.callback"
          >{{modal.confirmBtn.text}}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  computed: {
    modal: function() {
      return this.$store.getters.modal;
    }
  }
};
</script>

<style>
</style>