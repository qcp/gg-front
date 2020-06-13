<template>
  <v-layout wrap align-center justify-center>
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
                Enter the secret key from the email address in the box below.
              </v-card-subtitle>
              <v-card-text>
                <v-textarea
                  v-model="emailSecret"
                  :rules="[
                    v => v.length > 0 || 'Copy and paste secret from email!'
                  ]"
                  label="Email secret"
                  required
                  auto-grow
                  rows="1"
                  append-icon="mdi-comment-question"
                  @click:append="$router.push('questions')"
                ></v-textarea>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn color="primary" @click="onLoginAtempt" large outlined
                  >Login</v-btn
                >
                <v-spacer />
              </v-card-actions>
            </v-card>
          </v-tab-item>
          <v-tab-item key="admin">
            <v-card flat>
              <v-card-subtitle>
                We use your google account to email all form recepients.
              </v-card-subtitle>
              <v-card-actions>
                <v-spacer />
                <v-btn color="primary" @click="onGooglePopup" large outlined
                  >Login with google</v-btn
                >
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
export default {
  data: () => ({
    valid: true,
    tab: null,
    emailSecret: ""
  }),
  methods: {
    onLoginAtempt: function() {
      if (this.$refs.form.validate()) {
        this.$root.$overlay.show();
        this.$store
          .dispatch("login", this.emailSecret)
          .then(res => this.$router.push(`${res.role[0]}`))
          .catch(error => {
            this.$root.$modal({
              width: 400,
              title: "Error",
              message: error,
              cancelBtn: {
                text: "OK"
              }
            });
          })
          .finally(() => this.$root.$overlay.hide());
      }
    },
    onGooglePopup: function() {
      this.$root.$overlay.show();
      this.$backCall("/google/url", "GET")
        .then(res => {
          window.location.href = res.url;
        })
        .catch(error => {
          this.$root.$modal({
            width: 400,
            title: "Error",
            message: error,
            cancelBtn: {
              text: "OK"
            }
          });
        })
        .finally(() => this.$root.$overlay.hide());
    }
  },
  mounted: function() {
    this.emailSecret = this.$route.query.secret || "";
    if (this.emailSecret) {
      setTimeout(() => this.onLoginAtempt(), 500);
    }
  }
};
</script>

<style scoped></style>
