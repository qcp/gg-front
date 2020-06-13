<template>
  <div style="width: 100%">
    <v-expansion-panels v-if="exist" popout multiple :value="panels">
      <v-expansion-panel v-if="current.content.decisionChain">
        <v-expansion-panel-header>Previosly reviewers</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-timeline v-if="current.content.decisionChain" dense>
            <v-timeline-item
              v-for="(decision, decisionIndex) in current.content.decisionChain"
              :key="decisionIndex"
              color="grey lighten-5"
            >
              <template v-slot:icon>
                <v-badge color="pink darken-1" :content="decision.step+1">
                  <v-icon
                    class="ma-0"
                    :color="decision.reviewer.type == 'api' ? 'lime' : decision.reviewer.type == 'group' ? 'teal' : 'cyan'"
                  >{{decision.reviewer.type == 'api' ? 'mdi-robot' : decision.reviewer.type == 'group' ? 'mdi-account-multiple' : 'mdi-account' }}</v-icon>
                </v-badge>
              </template>
              <v-card>
                <v-card-title dense class="pa-2">{{decision.pretty}}</v-card-title>
                <v-card-subtitle dense class="pa-2">
                  {{new Date(decision.date).toLocaleString()}}:
                  <b>{{decision.reviewer.name}}</b>
                </v-card-subtitle>
                <v-divider />
                <v-card-text dense class="pa-2">{{decision.comment}}</v-card-text>
              </v-card>
            </v-timeline-item>
          </v-timeline>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header>Answer</v-expansion-panel-header>
        <v-expansion-panel-content>
          <component
            :is="current.template"
            :settings="current.content.settings"
            :examinee="current.examinee"
            :answer="current.content.answer"
          ></component>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header>You decision</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-list>
            <v-list-item
              v-for="(parameter, parameterIndex) in current.content.parameters"
              :key="parameterIndex"
              class="d-flex align-center"
            >
              <span class="subtitle-1 parameter-name mr-2">{{parameter.description}}:</span>
              <v-text-field
                v-model="current.decision.parameters[parameterIndex].value"
                :prefix="parameter.name + ' = '"
              ></v-text-field>
              <c-btn-tip dense icon :tooltip="parameter.hint">
                <v-icon>mdi-information-outline</v-icon>
              </c-btn-tip>
            </v-list-item>
          </v-list>
          <v-card-text class="py-0">
            <v-textarea v-model="current.decision.comment" rows="3" label="Commment"></v-textarea>
          </v-card-text>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-row class="mt-4">
        <v-spacer />
        <v-btn @click="next">Skip</v-btn>
        <v-spacer />
        <v-btn @click="confirm" color="primary">Сonfirm</v-btn>
        <v-spacer />
      </v-row>
    </v-expansion-panels>
    <v-overlay v-else-if="loading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-card v-else class="my-4 mx-auto" max-width="700">
      <v-card-title>There no criterias for review.</v-card-title>
    </v-card>
  </div>
</template>

<script>
import components from "@/../components";

export default {
  data: () => ({
    loading: true,

    viewed: 0,
    all: 0,
    answersGen: {},
    panels: [],

    exist: false,
    current: {
      inquirerId: "",
      examinee: {},
      content: {},
      template: {},
      decision: {}
    }
  }),
  methods: {
    reload: function() {
      this.loading = true;
      this.answersGen = {};

      this.$backCall(
        `/r/viewer?_id=${this.$store.getters.tokenData.inquirerId}`,
        "GET"
      )
        .then(res => {
          this.all += res.answers.length;
          const reviewerId = this.$store.getters.user._id;
          this.answersGen = (function*() {
            for (let answer of res.answers) {
              const template = components.find(
                o => o.sysname === answer.content.component
              ).reviewer;
              const last = answer.content.decisionChain
                ? answer.content.decisionChain.slice(-1)[0]
                : null;
              let parameters = [];
              for (let p of answer.content.parameters) {
                let param = last
                  ? last.parameters.find(o => o.name === p.name)
                  : null;
                parameters.push({
                  name: p.name,
                  value: param ? param.value : ""
                });
              }
              if (answer.content.decisionChain) {
                for (let d of answer.content.decisionChain) {
                  let api = answer.apis.find(o => o._id === d.reviewerId);
                  let user = answer.reviewers.find(o => o._id === d.reviewerId);
                  d.reviewer = {
                    name: api ? api.name : user.name,
                    type: api ? "api" : "user"
                  };
                  d.pretty = d.parameters.reduce(
                    (acc, p) => `${acc}${p.name}=${p.value ? p.value : " "}; `,
                    ""
                  );
                }
              }

              yield {
                inquirerId: answer._id,
                examinee: answer.examinee,
                content: answer.content,
                template: template,
                decision: {
                  reviewerId: reviewerId,
                  step: answer.content.reviewerNext.step,
                  date: new Date(),
                  comment: "",
                  parameters: parameters
                }
              };
            }
          })();
        })
        .then(() => {
          this.loading = false;
          this.next(true);
        });
    },
    next: function(isFirstLoad) {
      const next = this.answersGen.next();
      if (next.value) {
        this.current = next.value;
        this.panels = [0, 1, 2];
      }

      if (next.done && !isFirstLoad) {
        this.reload();
      } else if (!next.done && isFirstLoad) {
        this.exist = true;
      } else if (next.done && isFirstLoad) {
        this.exist = false;
        this.$root
          .$modal({
            persistent: true,
            title: `You reviewed ${this.viewed} answers!`,
            text:
              "There is no available answers for review, please come back later.",
            confirmBtn: {
              text: "Leave",
              color: "warning"
            },
            cancelBtn: {
              color: "success"
            }
          })
          .then(res => {
            if (res) this.$store.dispatch("logout");
          });
      }
    },
    confirm: function() {
      this.loading = true;
      this.$backCall("/r/viewer", "POST", {
        inquirerId: this.current.inquirerId,
        examineeId: this.current.examinee._id,
        criteriaId: this.current.content._id,
        decision: this.current.decision
      }).then(res => {
        this.loading = false;
        this.viewed++;
        this.next();
      });
    }
  },
  beforeMount: function() {
    this.reload();
  }
};
</script>

<style>
.parameter-name {
  max-width: 80%;
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>