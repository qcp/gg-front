<template>
  <v-card flat>
    <v-card-title>{{settings.title}}</v-card-title>
    <v-card-subtitle>{{settings.subtitle}}</v-card-subtitle>
    <v-list>
      <v-list-item v-for="(item, index) in settings.attaches" :key="index" class="my-2">
        <v-card width="100%">
          <v-card-text>{{item.text}}</v-card-text>
          <v-card-text class="py-0">
            <v-text-field
              v-model="answer.links[index].url"
              label="Url"
              dense
              :rules="[v => !!v.match(item.regex) || 'Wrong url']"
            ></v-text-field>
          </v-card-text>
        </v-card>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
export default {
  props: {
    value: Object,
    settings: Object
  },
  data: () => ({
    loading: false
  }),
  computed: {
    answer: {
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