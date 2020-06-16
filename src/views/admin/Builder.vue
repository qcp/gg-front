<template>
  <v-card class="custom">
    <div style="position: sticky; top: 10px">
      <v-tooltip top>
        <template v-slot:activator="{ on }">
          <v-btn
            v-on="on"
            fab
            small
            absolute
            style="left:-50px"
            @click="$router.push('dashboard')"
          >
            <v-icon>mdi-backburger</v-icon>
          </v-btn>
        </template>
        Back to dashboard
      </v-tooltip>

      <v-tooltip top>
        <template v-slot:activator="{ on }">
          <v-btn
            v-on="on"
            v-if="inquirer.state == 'PREPARE'"
            fab
            small
            absolute
            style="right:-50px"
            @click="save"
          >
            <v-badge :color="saveButton.color" dot>
              <v-icon color="primary">mdi-content-save</v-icon>
            </v-badge>
          </v-btn>
        </template>
        {{ saveButton.text }}
      </v-tooltip>
    </div>

    <v-card flat :disabled="loading">
      <v-tabs v-model="tab" grow center-active show-arrows="mobile">
        <v-tab key="general">General</v-tab>
        <v-tab key="examinees">Examinees</v-tab>
        <v-tab key="reviewers">Reviewers</v-tab>
        <v-tab key="content">Content</v-tab>
        <v-tab key="preview">Preview</v-tab>
        <v-tab key="results">Results</v-tab>
      </v-tabs>
      <v-progress-linear
        :active="loading"
        height="2"
        indeterminate
        color="primary"
      ></v-progress-linear>
      <v-tabs-items v-model="tab">
        <v-tab-item key="general">
          <General
            v-model="inquirer.general"
            :state="inquirer.state"
            @changeStateAndSave="changeStateAndSave"
          />
        </v-tab-item>
        <v-tab-item key="examinees">
          <Examinees
            v-model="examinees"
            :state="inquirer.state"
            :inquirerId="inquirer._id"
          />
        </v-tab-item>
        <v-tab-item key="reviewers">
          <Reviewers
            v-model="reviewers"
            :state="inquirer.state"
            :inquirerId="inquirer._id"
          />
        </v-tab-item>
        <v-tab-item key="content">
          <Content
            v-model="inquirer.content"
            :state="inquirer.state"
            :reviewers="reviewers"
          />
        </v-tab-item>
        <v-tab-item key="preview">
          <Preview
            :inquirer="inquirer"
            :state="inquirer.state"
            :isActive="tab == 4"
          />
        </v-tab-item>
        <v-tab-item key="results">
          <Results
            :inquirerId="inquirer._id"
            :state="inquirer.state"
            :isActive="tab == 5"
          />
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
    lastSave: new Date(),
    lastChange: new Date(),
    inquirer: {
      _id: "",
      state: "PREPARE",
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
  watch: {
    inquirer: {
      handler: function() {
        this.lastChange = new Date();
      },
      deep: true
    },
    examinees: {
      handler: function() {
        this.lastChange = new Date();
      },
      deep: true
    },
    reviewers: {
      handler: function() {
        this.lastChange = new Date();
      },
      deep: true
    }
  },
  computed: {
    saveButton: function() {
      let color = "secondary";
      let text = "Save changes";

      if (this.lastSave < this.lastChange) {
        color = "warning";
        text = `Unsaved changes sinse ${this.lastChange.toLocaleTimeString()}`;
      } else {
        color = "success";
        text = `Last save ${this.lastSave.toLocaleTimeString()}`;
      }

      return { color: color, text: text };
    }
  },
  methods: {
    save: function() {
      this.loading = true;
      Promise.all([
        this.$backCall("/a/builder/inquirer", "POST", {
          _id: this.inquirer._id,
          state: this.inquirer.state,
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
      ]).then(() => {
        this.loading = false;
        this.lastSave = new Date();
      });
    },
    load: function(id) {
      return Promise.all([
        this.$backCall(`/a/builder/inquirer?_id=${id}`, "GET").then(res => {
          this.inquirer = res.inquirer;
          if (this.inquirer.state != "PREPARE") this.tab = 5;
        }),
        this.$backCall(`/a/builder/examinees?_id=${id}`, "GET").then(res => {
          this.examinees = res.examinees;
        }),
        this.$backCall(`/a/builder/reviewers?_id=${id}`, "GET").then(res => {
          this.reviewers = res.reviewers;
        })
      ]);
    },
    changeStateAndSave: function(state) {
      this.inquirer.state = state;
      this.save();
    }
  },
  beforeMount: function() {
    this.$root.$overlay.show();
    if (this.$route.query._id) {
      this.load(this.$route.query._id).then(() => {
        this.loading = false;
        this.$root.$overlay.hide();
      });
    } else {
      this.$nextMongoId().then(id => {
        this.inquirer._id = id;
        this.inquirer.metadata.createUserId = this.$store.getters.user._id;
        this.loading = false;
        this.$root.$overlay.hide();
      });
    }
  }
};
</script>

<style scoped>
.custom {
  margin-top: -60px;
  z-index: 6;
  width: 100%;
}
</style>
