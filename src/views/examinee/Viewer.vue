<template>
  <div class="custom">
    <v-card>
      <v-card-title>{{ inquirer.general.title }}</v-card-title>
      <v-divider />
      <v-progress-linear
        :active="loading"
        height="2"
        indeterminate
        color="primary"
      ></v-progress-linear>
      <v-card-subtitle>{{ inquirer.general.description }}</v-card-subtitle>
    </v-card>
    <v-list class="background-light pt-0" :disabled="inquirer.state == 'done'">
      <v-list-item
        class="my-4 px-0"
        v-for="criteria in inquirer.content"
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
    <v-row v-if="inquirer.state != 'done'">
      <v-spacer />
      <v-btn :disabled="loading" color="secondary" @click="confirm('draft')"
        >Save draft</v-btn
      >
      <v-spacer />
      <v-btn :disabled="loading" color="primary" @click="confirm('done')"
        >Send for evaluation</v-btn
      >
      <v-spacer />
    </v-row>
  </div>
</template>

<script>
import components from "@/../components";

export default {
  data: () => ({
    loading: true,
    inquirer: {
      general: {
        title: "Inquirer name",
        description: "Please wait"
      },
      state: "",
      content: []
    }
  }),
  methods: {
    reload: function() {
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
              this.$set(
                criteria,
                "answer",
                component.defaultAnswer(criteria.settings)
              ); //реактивное свойство
          });
        })
        .then(() => {
          this.loading = false;

          if (this.inquirer.state == "done") {
            this.$root.$modal({
              persistent: true,
              title: "Your answers are evaluated",
              message: "You couldn't change it now",
              confirmBtn: {
                text: "OK"
              }
            });
          }
        });
    },
    confirm: function(state) {
      this.loading = true;
      this.$backCall("/e/viewer", "POST", {
        inquirerId: this.inquirer._id,
        state: state,
        examineeId: this.$store.getters.user._id,
        content: this.inquirer.content.map(criteria => ({
          _id: criteria._id,
          answer: criteria.answer
        }))
      }).then(() => {
        this.loading = false;
        this.inquirer.state = state;
        this.$root
          .$modal({
            persistent: true,
            title: "Thx for your answers",
            confirmBtn: {
              text: "Leave",
              color: "warning"
            },
            cancelBtn: {
              text: "Back to editing",
              color: "success"
            }
          })
          .then(res => {
            if (res) this.$store.dispatch("logout");
          });
      });
    }
  },
  beforeMount: function() {
    this.reload();
  }
};
</script>

<style scoped>
.theme--light.v-list.background-light,
.theme--dark.v-list.background-light {
  background: transparent;
}
.custom {
  margin-top: -76px;
  z-index: 6;
  width: 100%;
}
</style>
