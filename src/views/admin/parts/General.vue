<template>
  <v-card flat>
    <v-card-text>
      <v-text-field v-model="general.title" label="Name"></v-text-field>
      <v-textarea v-model="general.description" label="Description" rows="3"></v-textarea>
      <v-radio-group v-model="general.viewMode" row label="View mode: " disabled>
        <v-radio label="list" value="list"></v-radio>
        <v-radio label="stepper" value="stepper"></v-radio>
      </v-radio-group>
      <v-row>
        <v-col>
          <c-date-picker-text
            v-model="general.startDateExaminees"
            label="Start date for examinees"
            :min="new Date().toISOString()"
          ></c-date-picker-text>
        </v-col>
        <v-col>
          <c-date-picker-text
            v-model="general.finishDateExaminees"
            label="Finish date for examinees"
            :min="general.startDateExaminees"
          ></c-date-picker-text>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <c-date-picker-text
            v-model="general.startDateReviewers"
            label="Start date for reviewers"
            :min="new Date().toISOString()"
          ></c-date-picker-text>
        </v-col>
        <v-col>
          <c-date-picker-text
            v-model="general.finishDateReviewers"
            label="Finish date for reviewers"
            :min="general.startDateReviewers"
          ></c-date-picker-text>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    value: Object
  },
  data: () => ({}),
  computed: {
    general: {
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