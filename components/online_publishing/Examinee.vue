<template>
  <v-card flat>
    <v-card-title>Online publishings on elibrary.ru</v-card-title>
    <v-card-subtitle>Add links for all your publishings</v-card-subtitle>
    <v-card-title class="py-0">
      Links to online publications
      <v-spacer />
      <v-btn icon @click="addToList(answer.links)">
        <v-icon>mdi-plus-circle-outline</v-icon>
      </v-btn>
    </v-card-title>
    <v-list>
      <v-list-item v-for="(item, index) in answer.links" :key="index">
        <v-text-field v-model="item.text" :label="`${index+1} link`" dense></v-text-field>
        <v-btn icon @click="removeFromList(answer.links, index)" dense>
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </v-list-item>
    </v-list>
    <v-card-actions></v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: {
    value: Object,
    settings: Object
  },
  data: () => ({}),
  computed: {
    answer: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      }
    }
  },
  methods: {
    addToList: function(list) {
      list.push({ text: "" });
    },
    removeFromList: function(list, index) {
      this.$delete(list, index);
    }
  }
};
</script>

<style></style>
