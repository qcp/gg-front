<template>
  <v-card flat>
    <v-card-title class="sticky">
      Examinees
      <v-spacer />
      <c-bth-tip icon tooltip="Export excel" disabled>
        <v-icon>mdi-file-export</v-icon>
      </c-bth-tip>
      <c-bth-tip icon tooltip="Import excel" disabled>
        <v-icon>mdi-file-import</v-icon>
      </c-bth-tip>
      <c-bth-tip icon tooltip="Send email to all" disabled>
        <v-icon>mdi-gmail</v-icon>
      </c-bth-tip>
      <c-bth-tip icon tooltip="Add new examinee" @click="addToList(examinees)">
        <v-icon>mdi-plus-circle-outline</v-icon>
      </c-bth-tip>
    </v-card-title>

    <v-list class="mt-n4">
      <v-list-item class="my-4 align-start" v-for="(examinee) in examinees" :key="examinee._id">
        <v-card width="100%" class="d-flex align-center">
          <v-text-field v-model="examinee.name" class="mx-2" label="Name"></v-text-field>
          <v-text-field v-model="examinee.email" class="mx-2" label="Email"></v-text-field>
          <v-menu
            offset-y
            bottom
            auto
            origin="center center"
            transition="scale-transition"
            :close-on-content-click="false"
          >
            <template v-slot:activator="{ on: menu }">
              <v-tooltip bottom>
                <template v-slot:activator="{ on: tooltip }">
                  <v-btn class="ml-2" icon v-on="{ ...tooltip, ...menu}">
                    <v-icon>mdi-information-outline</v-icon>
                  </v-btn>
                </template>
                <span>Info</span>
              </v-tooltip>
            </template>
            <v-card>
              <v-card-text class="py-2">
                <strong>Email:</strong><span>{{`${examinee.metadata.emailSended?'sended':'not sended'}`}}</span>
                <c-bth-tip icon tooltip="Resend email" @click="sendMail(examinee)">
                  <v-icon>mdi-gmail</v-icon>
                </c-bth-tip>
              </v-card-text>
              <v-card-text class="py-2">
                <strong>Last login:</strong> unknow
              </v-card-text>
            </v-card>
          </v-menu>

          <c-bth-tip
            class="mr-2"
            icon
            tooltip="Remove examinee"
            @click="removeFromList(examinees, examinee._id)"
          >
            <v-icon>mdi-delete</v-icon>
          </c-bth-tip>
        </v-card>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
export default {
  props: {
    value: Array,
    inquirerId: String
  },
  data: () => ({}),
  computed: {
    examinees: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      }
    }
  },
  methods: {
    addToList: function(list) {
      list.unshift({ _id: this.$nextMongoId(), metadata: {} });
    },
    removeFromList: function(list, key) {
      this.$delete(
        list,
        list.findIndex(o => o._id == key)
      );
    },
    sendMail: function(recepient) {
      this.$backCall("/utils/send-email-secret", "POST", {
        inquirerId: this.inquirerId,
        recepientId: recepient._id
      })
        .then(res => {
          this.$set(recepient.metadata, "emailSended", true);
        })
        .catch(err => {
          this.$set(recepient.metadata, "emailSended", false);
        });
    }
  }
};
</script>

<style>
.sticky {
  position: sticky;
  top: 0;
  z-index: 1;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 1) 0%,
    rgba(255, 255, 255, 1) 80%,
    rgba(255, 255, 255, 0) 100%
  );
}
</style>