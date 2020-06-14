<template>
  <v-card flat>
    <v-card-title>{{settings.title}}</v-card-title>
    <v-card-subtitle>{{settings.subtitle}}</v-card-subtitle>

    <v-list>
      <v-list-item v-for="(item, index) in answer.links" :key="index" class="my-2">
        <v-card width="100%">
          <v-card-text>
            <v-row>
              <v-text-field
                v-model="item.text"
                :label="`${index+1} files description`"
                dense
                class="ml-3 mr-2"
              ></v-text-field>
              <v-btn icon @click="removeFromList(answer.links, index)" dense>
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-row>
            <v-text-field
              v-model="item.url"
              label="Url"
              dense
              :rules="[v => !!v.match(settings.regex) || 'Wrong url']"
            ></v-text-field>
          </v-card-text>
        </v-card>
      </v-list-item>
    </v-list>
    <v-card-actions>
      <v-spacer />
      <v-btn icon @click="addToList(answer.links)">
        <v-icon>mdi-plus-circle-outline</v-icon>
      </v-btn>
      <v-spacer />
    </v-card-actions>
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
  },
  methods: {
    addToList: function(list) {
      list.push({ text: "", url: "" });
    },
    removeFromList: function(list, index) {
      this.answer.attach[index].files.forEach(o =>
        this.deleteFile(o._id, index)
      );
      this.$delete(list, index);
    }
  }
};
</script>

<style>
</style>