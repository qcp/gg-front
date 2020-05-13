<template>
  <div class="small-window">
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

    <v-card max-width="600">
      <v-tabs v-model="tab" grow>
        <v-tab key="noSecret">I don't have secret</v-tab>
        <v-tab key="newSecret">My secret doesn't work</v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item key="noSecret">
          <v-card flat>
            <v-card-text>
              If you are the person who should be tested or checked, you should
              receive a message with a secret in the mail that you indicated to
              the manager. If your mail box is empty, contact your manager to
              change the mail address or resend the message.
            </v-card-text>
            <v-card-text>
              If you do not have to check or complete the test, you have come to
              this page by accident.
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn @click="$router.push('/login')">Back to login page</v-btn>
              <v-spacer />
            </v-card-actions>
          </v-card>
        </v-tab-item>
        <v-tab-item key="newSecret">
          <v-card flat>
            <v-card-subtitle>
              If your email is in the list of current tests, we
              will send you a message with a new secret.
            </v-card-subtitle>
            <v-card-text>
              <v-text-field v-model="email" label="Email" required></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn @click="$router.push('/login')">Back to login page</v-btn>
              <v-btn
                color="primary"
                :disabled="!email.match(/\S+@\S+\.\S+/)"
                @click="resendEmailSecret"
              >Resend secret</v-btn>
              <v-spacer />
            </v-card-actions>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </div>
</template>

<script>
export default {
  data: () => ({
    alert: {
      show: false,
      type: "error",
      text: ""
    },
    overlay: false,
    tab: null,
    email: ""
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
    resendEmailSecret: function() {
      this.overlay = true;
      this.toggleAlert();
      this.$backCall("/resend-email-secret", "POST", {
        email: this.email
      })
        .catch(error => {
          this.toggleAlert(error);
        })
        .finally(() => {
          this.overlay = false;
        });
    }
  },
  watch: {
    tab: function() {
      this.toggleAlert();
    },
    email: function() {
      this.toggleAlert();
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