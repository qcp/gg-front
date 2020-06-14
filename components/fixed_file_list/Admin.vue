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
      Attaches
      <v-spacer />
      <v-btn icon @click="addVariant()">
        <v-icon>mdi-plus-circle-outline</v-icon>
      </v-btn>
    </v-card-title>
    <v-list>
      <draggable v-model="settings.attaches" handle=".handle">
        <v-list-item v-for="(item, index) in settings.attaches" :key="index" class="my-2">
          <v-card width="100%">
            <v-card-text>
              <v-row>
                <v-text-field
                  v-model="item.text"
                  :label="`${index+1} attaches text`"
                  dense
                  class="ml-3 mr-2"
                ></v-text-field>
                <v-btn icon @click="removeVariant(index)" dense>
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
                <v-btn icon class="handle" dense>
                  <v-icon>mdi-drag</v-icon>
                </v-btn>
              </v-row>
              <v-switch v-model="item.allowMultiple" label="Allow multiple files upload"></v-switch>
              <v-combobox
                label="Allow formats"
                v-model="item.allowFormats"
                :items="formatsList"
                hide-selected
                multiple
                small-chips
                deletable-chips
              ></v-combobox>
            </v-card-text>
          </v-card>
        </v-list-item>
      </draggable>
    </v-list>
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
  },
  methods: {
    removeVariant: function(index) {
      this.$delete(this.settings.attaches, index);
    },
    addVariant: function() {
      this.settings.attaches.push({
        text: "",
        allowMultiple: false,
        allowFormats: []
      });
    }
  }
};
</script>

<style>
</style>
