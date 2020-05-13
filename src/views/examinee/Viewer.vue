<template>
  <div>
    <v-card class="mx-auto" max-width="700">
      <v-toolbar flat>
        <v-toolbar-title class="grey--text">{{inquirer.general.title}}</v-toolbar-title>

        <v-spacer></v-spacer>

        <c-bth-tip icon tooltip="Exit" @click="$store.dispatch('logout')">
          <v-icon>mdi-exit-run</v-icon>
        </c-bth-tip>
      </v-toolbar>
      <v-progress-linear :active="loading" height="2" indeterminate color="primary"></v-progress-linear>
      <v-card-subtitle>{{inquirer.general.description}}</v-card-subtitle>
    </v-card>
    <v-list class="background-light mx-auto pt-0" max-width="700">
      <v-list-item class="my-4 px-0" v-for="(criteria) in inquirer.content" :key="criteria._id">
        <v-card width="100%">
          <component
            :is="criteria.template"
            v-model="criteria.answer"
            :settings="criteria.settings"
          ></component>
        </v-card>
      </v-list-item>
    </v-list>
    <v-row>
      <v-spacer />
      <v-btn color="primary" @click="confirm">Send form</v-btn>
      <v-spacer />
    </v-row>

    <v-overlay :value="overlay">
      <v-card>
        <v-card-text>Your answers saved! Thx.</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="secondary" @click="$store.dispatch('logout')">Leave</v-btn>
          <v-btn color="success" @click="overlay = false">Continue</v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-overlay>
  </div>
</template>

<script>
import components from "@/../components";

export default {
  data: () => ({
    loading: true,
    overlay: false,
    inquirer: {
      general: {},
      content: []
    }
  }),
  methods: {
    confirm: function() {
      this.loading = true;
      this.$backCall("/e/viewer", "POST", {
        inquirerId: this.inquirer._id,
        examineeId: this.$store.getters.user._id,
        content: this.inquirer.content.map(criteria => ({
          _id: criteria._id,
          answer: criteria.answer
        }))
      }).then(() => {
        this.loading = false;
        this.overlay = true;
      });
    }
  },
  beforeMount: function() {
    this.loading = true;

    this.$backCall(
      `/e/viewer?_id=${this.$store.getters.tokenData.inquirerId}`,
      "GET"
    )
      .then(res => {
        this.inquirer = res.inquirer;
        this.inquirer.content.forEach(criteria => {
          const component = components.find(
            o => o.sysname === criteria.component
          );
          criteria.template = component.examinee; //не реактивное свойство
          if (!criteria.answer)
            this.$set(criteria, "answer", component.defaultAnswer()); //реактивное свойство
        });
      })
      .then(() => {
        this.loading = false;
      });
  }
};
</script>

<style>
.theme--light.v-list.background-light {
  background: #fafafa;
}
</style>