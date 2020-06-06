<template>
  <v-card flat>
    <v-toolbar flat class="sticky">
      <v-icon color="cyan" class="mr-2">mdi-account</v-icon>
      <v-toolbar-title>Reviewers</v-toolbar-title>
      <v-spacer />
      <c-bth-tip icon tooltip="Export excel" @click="exportExcelReviewers">
        <v-icon color="green darken-2">mdi-file-export</v-icon>
      </c-bth-tip>
      <c-bth-tip icon tooltip="Import excel" disabled>
        <v-icon color="green darken-2">mdi-file-import</v-icon>
      </c-bth-tip>
      <c-bth-tip icon tooltip="Send email to all" disabled>
        <v-icon>mdi-gmail</v-icon>
      </c-bth-tip>
      <c-bth-tip icon tooltip="Add new reviewer" @click="addToList(reviewers.users)">
        <v-icon>mdi-plus-circle-outline</v-icon>
      </c-bth-tip>
    </v-toolbar>

    <v-list class="mt-n4">
      <v-list-item class="my-4 align-start" v-for="(user) in reviewers.users" :key="user._id">
        <v-card width="100%" class="d-flex align-center">
          <v-text-field
            v-model="user.name"
            :rules="[v => !!v || 'Name is required']"
            class="mx-2"
            label="Name"
          ></v-text-field>
          <v-text-field
            v-model="user.email"
            :rules="[v => !!v || 'Email is required']"
            class="mx-2"
            label="Email"
          ></v-text-field>
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
                <strong>Email:</strong>
                <span>{{`${user.metadata.emailSended?'sended':'not sended'}`}}</span>
                <c-bth-tip icon tooltip="Resend email" @click="sendMail(user)">
                  <v-icon>mdi-gmail</v-icon>
                </c-bth-tip>
              </v-card-text>
              <v-card-text class="py-2">
                <strong>Last login:</strong>
                <span
                  v-if="user.metadata.lastLogin"
                >{{new Date(user.metadata.lastLogin).toLocaleString()}}</span>
                <span v-else>unknown</span>
              </v-card-text>
            </v-card>
          </v-menu>

          <c-bth-tip
            class="mr-2"
            icon
            tooltip="Remove reviewer"
            @click="removeFromList(reviewers.users, user._id)"
          >
            <v-icon>mdi-delete</v-icon>
          </c-bth-tip>
        </v-card>
      </v-list-item>
    </v-list>

    <v-divider />

    <v-toolbar flat class="sticky">
      <v-icon color="teal" class="mr-2">mdi-account-multiple</v-icon>
      <v-toolbar-title>Groups</v-toolbar-title>
      <v-spacer />
      <c-bth-tip icon tooltip="Add new group" @click="addToList(reviewers.groups)">
        <v-icon>mdi-plus-circle-outline</v-icon>
      </c-bth-tip>
    </v-toolbar>

    <v-list class="mt-n4">
      <v-list-item class="my-4 align-start" v-for="(group) in reviewers.groups" :key="group._id">
        <v-card width="100%">
          <div class="d-flex align-center">
            <v-text-field
              v-model="group.name"
              :rules="[v => !!v || 'Name is required']"
              class="mx-2"
              label="Name"
            ></v-text-field>

            <c-bth-tip
              class="mr-2"
              icon
              tooltip="Remove group"
              @click="removeFromList(reviewers.groups, group._id)"
            >
              <v-icon>mdi-delete</v-icon>
            </c-bth-tip>
          </div>
          <v-select
            v-model="group.reviewers"
            :rules="[v => !!v.length || 'At least one rewiewer required']"
            :items="reviewers.users"
            item-text="name"
            item-value="_id"
            label="Reviewers"
            multiple
            hide-selected
            chips
            deletable-chips
            :menu-props="{ bottom: true, offsetY: true }"
            class="mx-2"
          >
            <template v-slot:item="{item, on}">
              <v-list-item v-on="on">
                <span>{{ item.name }}</span>&nbsp;
                <span class="grey--text caption">({{ item.email }})</span>
              </v-list-item>
            </template>
          </v-select>
        </v-card>
      </v-list-item>
    </v-list>

    <v-divider />

    <v-toolbar flat class="sticky">
      <v-icon color="lime" class="mr-2">mdi-robot</v-icon>
      <v-toolbar-title>Auto tests</v-toolbar-title>
      <v-spacer />
      <c-bth-tip icon tooltip="Export excel" @click="exportExcelApis">
        <v-icon color="green darken-2">mdi-file-export</v-icon>
      </c-bth-tip>
      <c-bth-tip icon tooltip="Import excel" disabled>
        <v-icon color="green darken-2">mdi-file-import</v-icon>
      </c-bth-tip>
      <v-dialog transition="slide-x-transition" max-width="800">
        <template v-slot:activator="{ on: menu }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on: tooltip }">
              <v-btn icon v-on="{ ...tooltip, ...menu}" :disabled="!library.length">
                <v-icon>mdi-plus-box-multiple-outline</v-icon>
              </v-btn>
            </template>
            <span>Auto test library</span>
          </v-tooltip>
        </template>
        <v-card class="py-3">
          <v-simple-table fixed-header>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">Name</th>
                  <th class="text-left">Description</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in library" :key="item.module">
                  <td>{{ item.name }}</td>
                  <td>{{ item.description }}</td>
                  <td>
                    <v-btn icon @click="addToListExtApi(item)" :disabled="!item.available">
                      <v-icon v-if="item.available" color="success">mdi-plus-circle-outline</v-icon>
                      <v-icon v-else color="warning">mdi-minus-circle-off-outline</v-icon>
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card>
      </v-dialog>
      <c-bth-tip icon tooltip="Add new auto test" @click="addToList(reviewers.apis)">
        <v-icon>mdi-plus-circle-outline</v-icon>
      </c-bth-tip>
    </v-toolbar>

    <v-list class="mt-n4">
      <v-list-item class="my-4 align-start" v-for="(api) in reviewers.apis" :key="api._id">
        <v-card width="100%" class="d-flex align-center">
          <v-text-field
            v-model="api.name"
            :rules="[v => !!v || 'Name is required']"
            class="mx-2"
            label="Name"
          ></v-text-field>
          <v-text-field
            v-model="api.url"
            :rules="[v => !!v || 'Url is required']"
            class="mx-2"
            label="Url"
            @change="checkApi(api)"
          ></v-text-field>
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
                    <v-icon v-if="api.metadata.available" color="success">mdi-code-tags-check</v-icon>
                    <v-icon v-else color="warning">mdi-code-tags</v-icon>
                  </v-btn>
                </template>
                <span>Info</span>
              </v-tooltip>
            </template>
            <v-card>
              <v-card-text class="py-2">
                <strong>Sysname:</strong>
                <span v-if="api.metadata.name">{{api.metadata.name}}</span>
                <span v-else>unknown</span>
              </v-card-text>
              <v-card-text class="py-2">
                <strong>Description:</strong>
                <span v-if="api.metadata.description">{{api.metadata.description}}</span>
                <span v-else>unknown</span>
              </v-card-text>
            </v-card>
          </v-menu>
          <c-bth-tip
            class="mr-2"
            icon
            tooltip="Remove auto tesr"
            @click="removeFromList(reviewers.apis, api._id)"
          >
            <v-icon>mdi-delete</v-icon>
          </c-bth-tip>
        </v-card>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
import config from "@/config";
import excel from "@/plugins/excel";

export default {
  props: {
    value: Object,
    inquirerId: String
  },
  data: () => ({
    library: []
  }),
  computed: {
    reviewers: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      }
    }
  },
  methods: {
    addToListExtApi: function(data) {
      let api = {
        _id: this.$nextMongoId(),
        name: data.name,
        url: data.url,
        metadata: {}
      };
      this.checkApi(api);
      this.reviewers.apis.unshift(api);      
    },
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
    },
    checkApi: function(api) {
      fetch(api.url)
        .then(res => {
          if (!res.ok) throw res.statusText;
          return res.json();
        })
        .then(res => {
          if (res.status != "OK") throw res.error;
          this.$set(api, "metadata", res.metadata);
          api.name = !!api.name ? api.name : api.metadata.name;
        })
        .catch(err => {
          this.$set(api, "metadata", { available: false });
        });
    },
    exportExcelReviewers: function() {
      excel.export(
        "Reviewers",
        [
          {
            key: "name",
            header: "Name",
            width: 50
          },
          {
            key: "email",
            header: "Email",
            width: 50
          }
        ],
        this.reviewers.users
      );
    },
    exportExcelApis: function() {
      excel.export(
        "Apis",
        [
          {
            key: "name",
            header: "Name",
            width: 50
          },
          {
            key: "url",
            header: "Url",
            width: 50
          }
        ],
        this.reviewers.apis
      );
    }
  },
  mounted: function() {
    fetch(`${config.apiEndpoint}/library`)
      .then(res => {
        if (!res.ok) throw res.statusText;
        return res.json();
      })
      .then(res => {
        if (res.status != "OK") throw res.error;
        this.library = res.library.map(o => ({
          name: o.name,
          url: `${config.apiEndpoint}/${o.module}`,
          description: o.description,
          available: o.available
        }));
      });
  }
};
</script>

<style>
</style>