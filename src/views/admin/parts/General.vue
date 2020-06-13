<template>
  <v-card flat>
    <v-card-text>
      <v-text-field
        v-model="general.title"
        :rules="[v => !!v || 'Title is required']"
        label="Title"
        :readonly="state != 'PREPARE'"
      ></v-text-field>
      <v-textarea
        v-model="general.description"
        :rules="[v => !!v || 'Description is required']"
        label="Description"
        :readonly="state != 'PREPARE'"
        rows="3"
      ></v-textarea>
      <v-radio-group
        v-model="general.viewMode"
        row
        label="View mode: "
        disabled
      >
        <v-radio label="list" value="list"></v-radio>
        <v-radio label="stepper" value="stepper"></v-radio>
      </v-radio-group>
      <v-row>
        <v-col>
          <c-date-picker-text
            v-model="general.startDateExaminees"
            :rules="[v => !!v || 'This field is required']"
            label="Start date for examinees"
            :min="new Date().toISOString()"
            :readonly="state != 'PREPARE'"
          ></c-date-picker-text>
        </v-col>
        <v-col>
          <c-date-picker-text
            v-model="general.finishDateExaminees"
            :disabled="!general.startDateExaminees"
            :rules="[v => !!v || 'This field is required']"
            label="Finish date for examinees"
            :min="general.startDateExaminees"
            :readonly="state != 'PREPARE'"
          ></c-date-picker-text>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <c-date-picker-text
            v-model="general.startDateReviewers"
            :rules="[v => !!v || 'This field is required']"
            label="Start date for reviewers"
            :min="new Date().toISOString()"
            :readonly="state != 'PREPARE'"
          ></c-date-picker-text>
        </v-col>
        <v-col>
          <c-date-picker-text
            v-model="general.finishDateReviewers"
            :disabled="!general.startDateReviewers"
            :rules="[v => !!v || 'This field is required']"
            label="Finish date for reviewers"
            :min="general.startDateReviewers"
            :readonly="state != 'PREPARE'"
          ></c-date-picker-text>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn v-if="state == 'PREPARE'" color="success" @click="readyToStart"
        >Ready to start!</v-btn
      >
      <v-spacer />
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: {
    value: Object,
    state: String
  },
  data: () => ({
    valid: true
  }),
  computed: {
    general: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      }
    }
  },
  methods: {
    readyToStart: function() {
      this.$root
        .$modal({
          width: 400,
          title: "Ready to start survey?",
          message: `Changes to the criteria, interviewed and verified will not be available. Email notifications will be sent ${this.general.startDateExaminees} to examinees and ${this.general.startDateReviewers} to reviewers`,
          cancelBtn: true,
          confirmBtn: true
        })
        .then(res => {
          if (res) {
            this.$emit("changeStateAndSave", "IN_PROGRESS");
          }
        });
    }
  }
};
</script>

<style></style>
