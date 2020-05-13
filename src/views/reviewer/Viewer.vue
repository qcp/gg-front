<template>
  <div>
    <v-card class="mx-auto" max-width="700">
      <v-toolbar flat>
        <v-toolbar-title>
          <span>Hi, {{$store.getters.user.name}}! </span>
          <span class="grey--text">(reviewed: {{viewed}} of {{all}})</span>
        </v-toolbar-title>

        <v-spacer></v-spacer>

        <c-bth-tip icon tooltip="Exit" @click="$store.dispatch('logout')">
          <v-icon>mdi-exit-run</v-icon>
        </c-bth-tip>
      </v-toolbar>
      <v-progress-linear :active="loading" height="2" indeterminate color="primary"></v-progress-linear>
    </v-card>

    <v-card
      v-if="exist"
      class="my-4 pa-4 mx-auto"
      max-width="700"
      :loading="loading"
      :disabled="loading"
    >
      <v-card-subtitle v-if="current.content.decisionChain" class="pb-1">Previosly reviewers</v-card-subtitle>
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
            <v-card-subtitle dense class="pa-2">{{decision.reviewer.name}}</v-card-subtitle>
            <v-divider />
            <v-card-text dense class="pa-2">{{decision.comment}}</v-card-text>
          </v-card>
        </v-timeline-item>
      </v-timeline>

      <v-card-subtitle class="pb-1">Answer</v-card-subtitle>
      <v-card>
        <component
          :is="current.template"
          :settings="current.content.settings"
          :examinee="current.examinee"
          :answer="current.content.answer"
        ></component>
      </v-card>

      <v-card-subtitle class="pb-1">You decision</v-card-subtitle>
      <v-card>
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
            <c-bth-tip dense icon :tooltip="parameter.hint">
              <v-icon>mdi-information-outline</v-icon>
            </c-bth-tip>
          </v-list-item>
        </v-list>
        <v-card-text class="py-0">
          <v-textarea v-model="current.decision.comment" rows="3" label="Commment"></v-textarea>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn @click="next">Skip</v-btn>
          <v-btn @click="confirm" color="primary">Сonfirm</v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-card>
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

    exist: false,
    current: {
      inquirerId: "",
      examinee: {},
      content: {},
      template: {},
      decision: {}
    },
    answersGen: {}
  }),
  methods: {
    next: function() {
      const next = this.answersGen.next();
      this.current = next.value;
      this.exist = !next.done;
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
    this.loading = true;

    this.$backCall(
      `/r/viewer?_id=${this.$store.getters.tokenData.inquirerId}`,
      "GET"
    )
      .then(res => {
        this.all = res.answers.length;
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
              parameters.push({
                name: p.name,
                value: last
                  ? last.parameters.find(o => o.name === p.name).value
                  : ""
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
        this.next();
      });
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