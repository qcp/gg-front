<template>
  <v-layout wrap align-center justify-center>
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-alert
      v-model="alert.show"
      transition="scale-transition"
      dense
      outlined
      :type="alert.type"
    >{{alert.text}}</v-alert>

    <v-form v-model="valid" ref="form">
      <v-card>
        <v-tabs v-model="tab" grow>
          <v-tab key="user">I need to take a test</v-tab>
          <v-tab key="admin">I want to create a test</v-tab>
        </v-tabs>

        <v-tabs-items v-model="tab">
          <v-tab-item key="user">
            <v-card flat>
              <v-card-subtitle>
                Enter the secret key from the email address in the box
                below.
              </v-card-subtitle>
              <v-card-text>
                <v-textarea
                  v-model="emailSecret"
                  :rules="[v => v.length > 0 || 'Copy and paste secret from email!']"
                  label="Email secret"
                  required
                  auto-grow
                  rows="1"
                  append-icon="mdi-comment-question"
                  @click:append="$router.push('/questions')"
                ></v-textarea>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn color="primary" @click="onLoginAtempt" large outlined>Login</v-btn>
                <v-spacer />
              </v-card-actions>
            </v-card>
          </v-tab-item>
          <v-tab-item key="admin">
            <v-card flat>
              <v-card-subtitle>
                We use your google account to email all form
                recepients.
              </v-card-subtitle>
              <v-card-actions>
                <v-spacer />
                <v-btn color="primary" @click="onGooglePopup" large outlined>Login with google</v-btn>
                <v-spacer />
              </v-card-actions>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-card>
    </v-form>
  </v-layout>
</template>

<script>
import config from "@/config";

export default {
  data: () => ({
    alert: {
      show: false,
      type: "error",
      text: ""
    },
    overlay: false,
    valid: true,
    tab: null,
    emailSecret: ""
  }),
  methods: {
    toggleAlert: function(text, type) {
      if (text) {
        this.alert.text = text;
        this.alert.type = type || "error";
        this.alert.show = true;
      } else {
        this.alert.show = false;
      }
    },
    onLoginAtempt: function() {
      if (this.$refs.form.validate()) {
        this.overlay = true;
        this.toggleAlert();
        this.$store
          .dispatch(
            "login",
            this.emailSecret
          )
          .then(res => this.$router.push(`/${res.role[0]}`))
          .catch(error => this.toggleAlert(error))
          .finally(() => (this.overlay = false));
      }
    },
    onGooglePopup: function() {
      this.overlay = true;
      this.toggleAlert();
      this.$backCall("/google/url", "GET")
        .then(res => {
          window.location.href = res.url;
        })
        .catch(error => this.toggleAlert(error))
        .finally(() => (this.overlay = false));
    }
  },
  watch: {
    tab: function() {
      this.toggleAlert();
    }
  },
  mounted: function() {
    this.emailSecret = this.$route.query.secret || "";
    if (this.emailSecret) {
      this.onLoginAtempt();
    }
  }
};
</script>

<style scoped>
.small-window {
  max-width: 600px;
  margin: auto;
}
</style>
