<template>
  <v-card flat>
    <v-card class="ma-4">
      <v-card-title>{{ inquirer.general.title }}</v-card-title>
      <v-card-subtitle>{{ inquirer.general.description }}</v-card-subtitle>
    </v-card>
    <v-list class="pt-0">
      <v-list-item
        class="my-4"
        v-for="criteria in criterias"
        :key="criteria._id"
      >
        <v-card width="100%">
          <component
            :is="criteria.template"
            v-model="criteria.answer"
            :settings="criteria.settings"
          ></component>
        </v-card>
      </v-list-item>
    </v-list>
    <v-card-actions class="pb-4">
      <v-spacer />
      <v-btn color="primary" disabled>Send form</v-btn>
      <v-spacer />
    </v-card-actions>
  </v-card>
</template>

<script>
import components from "@/../components";

export default {
  props: {
    inquirer: Object,
    isActive: Boolean
  },
  data: () => ({
    criterias: []
  }),
  watch: {
    isActive: function() {
      if (this.isActive) this.reload();
    }
  },
  methods: {
    reload: function() {
      this.criterias = this.inquirer.content.map(item => ({
        _id: item._id,
        component: item.component,
        answer: components
          .find(o => o.sysname === item.component)
          .defaultAnswer(),
        settings: item.settings,
        template: components.find(o => o.sysname === item.component).examinee
      }));
    }
  },
  beforeMount: function() {
    this.reload();
  }
};
</script>

<style></style>
