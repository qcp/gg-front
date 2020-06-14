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
    <v-card-title class="py-0">
      Variants
      <v-spacer />
      <v-btn icon @click="addVariant()">
        <v-icon>mdi-plus-circle-outline</v-icon>
      </v-btn>
    </v-card-title>
    <v-list>
      <draggable v-model="settings.variants" handle=".handle">
        <v-list-item v-for="(item, index) in settings.variants" :key="index">
          <v-text-field v-model="item.text" :label="`${index+1} variant`" dense></v-text-field>
          <v-btn icon @click="removeVariant(index)" dense>
            <v-icon>mdi-delete</v-icon>
          </v-btn>
          <v-btn icon class="handle" dense>
            <v-icon>mdi-drag</v-icon>
          </v-btn>
        </v-list-item>
      </draggable>
    </v-list>
    <v-card-actions></v-card-actions>
  </v-card>
</template>

<script>
import draggable from "vuedraggable";

export default {
  components: {
    draggable
  },
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
  methods: {
    removeVariant: function(index) {
      this.$delete(this.settings.variants, index);
    },
    addVariant: function() {
      this.settings.variants.push({ text: "" });
    }
  }
};
</script>

<style>
</style>
