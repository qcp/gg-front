<template>
  <v-card flat>
    <v-card-title>{{examinee.name}} online publishings on elibrary.ru</v-card-title>
    <v-list>
      <v-list-item v-for="(item, index) in answer.links" :key="index">
        <v-text-field v-model="item.text" :label="`${index+1} link`" dense readonly></v-text-field>
      </v-list-item>
    </v-list>
    <v-card-actions></v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: {
    settings: Object,
    examinee: Object,
    answer: Object
  }
};
</script>

<style></style>
