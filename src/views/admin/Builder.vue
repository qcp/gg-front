<template>
  <v-card class="mx-auto" max-width="1300">
    <v-toolbar flat>
      <c-bth-tip icon tooltip="Go to dashboard" @click="$router.push('dashboard')">
        <v-icon>mdi-backburger</v-icon>
      </c-bth-tip>
      <v-toolbar-title class="grey--text">Builder</v-toolbar-title>

      <v-spacer></v-spacer>
      <c-bth-tip icon :loading="loading" tooltip="Save inquirer" @click="save">
        <v-icon color="primary">mdi-content-save</v-icon>
      </c-bth-tip>
      <c-bth-tip icon tooltip="Exit" @click="$store.dispatch('logout')">
        <v-icon>mdi-exit-run</v-icon>
      </c-bth-tip>
    </v-toolbar>

    <v-progress-linear :active="loading" height="2" indeterminate color="primary"></v-progress-linear>

    <v-card flat :disabled="loading">
      <v-tabs v-model="tab" grow center-active show-arrows>
        <v-tab key="general">General</v-tab>
        <v-tab key="content">Content</v-tab>
        <v-tab key="examinees">Examinees</v-tab>
        <v-tab key="reviewers">Reviewers</v-tab>
        <v-tab key="preview">Preview</v-tab>
        <v-tab key="results">Results</v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item key="general">
          <General v-model="inquirer.general" />
        </v-tab-item>
        <v-tab-item key="content">
          <Content v-model="inquirer.content" :reviewers="reviewers" />
        </v-tab-item>
        <v-tab-item key="examinees">
          <Examinees v-model="examinees" :inquirerId="inquirer._id" />
        </v-tab-item>
        <v-tab-item key="reviewers">
          <Reviewers v-model="reviewers" :inquirerId="inquirer._id" />
        </v-tab-item>
        <v-tab-item key="preview">
          <Preview :inquirer="inquirer" :isActive="tab==4" />
        </v-tab-item>
        <v-tab-item key="results">
          <Results :inquirerId="inquirer._id" :isActive="tab==5"/>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </v-card>
</template>

<script>
import General from "./parts/General";
import Content from "./parts/Content";
import Examinees from "./parts/Examinees";
import Reviewers from "./parts/Reviewers";
import Preview from "./parts/Preview";
import Results from "./parts/Results";

export default {
  components: {
    General,
    Content,
    Examinees,
    Reviewers,
    Preview,
    Results
  },
  data: () => ({
    tab: 0,
    loading: true,
    inquirer: {
      _id: "",
      general: {
        viewMode: "list"
      },
      metadata: {},
      content: []
    },
    examinees: [],
    reviewers: {
      users: [],
      groups: [],
      apis: []
    }
  }),
  methods: {
    save: function() {
      this.loading = true;
      Promise.all([
        this.$backCall("/a/builder/inquirer", "POST", {
          _id: this.inquirer._id,
          general: this.inquirer.general,
          examinees: this.examinees.map(examinee => ({ _id: examinee._id })),
          metadata: this.inquirer.metadata,
          content: this.inquirer.content.map(criteria => ({
            _id: criteria._id,
            component: criteria.component,
            settings: criteria.settings,
            parameters: criteria.parameters,
            reviewerChain: criteria.reviewerChain
          }))
        }),
        this.$backCall(
          "/a/builder/examinees",
          "POST",
          this.examinees.map(examinee => {
            examinee.role = "examinee";
            return examinee;
          })
        ),
        this.$backCall("/a/builder/reviewers", "POST", {
          users: this.reviewers.users.map(user => {
            user.role = "reviewer";
            return user;
          }),
          groups: this.reviewers.groups,
          apis: this.reviewers.apis
        })
      ]).then(() => (this.loading = false));
    },
    load: function(id) {
      return Promise.all([
        this.$backCall(`/a/builder/inquirer?_id=${id}`, "GET").then(res => {
          this.inquirer = res.inquirer;
        }),
        this.$backCall(`/a/builder/examinees?_id=${id}`, "GET").then(res => {
          this.examinees = res.examinees;
        }),
        this.$backCall(`/a/builder/reviewers?_id=${id}`, "GET").then(res => {
          this.reviewers = res.reviewers;
        })
      ]);
    }
  },
  beforeMount: function() {
    this.$loadMongoIdList().then(() => {
      if (this.$route.query._id) {
        this.load(this.$route.query._id).then(() => (this.loading = false));
      } else {
        this.inquirer._id = this.$nextMongoId();
        this.inquirer.metadata.createUserId = this.$store.getters.user._id;
        this.loading = false;
      }
    });
  }
};
</script>

<style>
</style>