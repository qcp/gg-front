<template>
  <v-card flat>
    <v-list>
      <draggable v-model="criterias" handle=".handle">
        <v-list-item
          class="my-4 align-start"
          v-for="(criteria, criteriaIndex) in criterias"
          :key="criteriaIndex"
        >
          <v-card width="100%">
            <component :is="criteria.template" v-model="criteria.settings"></component>
          </v-card>
          <v-card class="d-flex flex-column ml-4">
            <c-btn-tip icon handle tooltip="Drag to change criteria order">
              <v-icon>mdi-drag</v-icon>
            </c-btn-tip>
            <v-dialog transition="slide-x-transition" max-width="800">
              <template v-slot:activator="{ on: menu }">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on: tooltip }">
                    <v-btn icon v-on="{ ...tooltip, ...menu}">
                      <v-badge color="warning" dot :value="!criteria.parameters.length">
                        <v-icon>mdi-file-presentation-box</v-icon>
                      </v-badge>
                    </v-btn>
                  </template>
                  <span>Parameters</span>
                </v-tooltip>
              </template>
              <v-card class="py-3">
                <v-list>
                  <v-list-item
                    v-for="(parameter, parameterIndex) in criteria.parameters"
                    :key="parameterIndex"
                    class="my-4"
                  >
                    <v-card width="100%">
                      <v-card-text>
                        <v-row>
                          <v-text-field
                            v-model="parameter.name"
                            :rules="[v => !!v || 'Parameter name is required']"
                            class="ml-3 mr-2"
                            label="Parameter short name"
                            dense
                          ></v-text-field>
                          <v-text-field
                            v-model="parameter.description"
                            :rules="[v => !!v || 'Parameter description is required']"
                            class="mr-2"
                            label="Parameter description"
                            dense
                          ></v-text-field>
                          <c-btn-tip
                            dense
                            icon
                            tooltip="Remove parameter"
                            @click="removeParameter(criteria.parameters, parameterIndex)"
                          >
                            <v-icon>mdi-delete</v-icon>
                          </c-btn-tip>
                        </v-row>
                        <v-textarea v-model="parameter.hint" label="Parameter hint" rows="3" dense></v-textarea>
                      </v-card-text>
                    </v-card>
                  </v-list-item>
                </v-list>
                <v-card-actions>
                  <v-spacer />
                  <c-btn-tip
                    icon
                    large
                    tooltip="Add new parameter"
                    @click="addParameter(criteria.parameters)"
                  >
                    <v-icon>mdi-plus-circle-outline</v-icon>
                  </c-btn-tip>
                  <v-spacer />
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog transition="slide-x-transition" max-width="800">
              <template v-slot:activator="{ on: menu }">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on: tooltip }">
                    <v-btn icon v-on="{ ...tooltip, ...menu}">
                      <v-badge color="warning" dot :value="!criteria.reviewerChain.length">
                        <v-icon>mdi-account-multiple</v-icon>
                      </v-badge>
                    </v-btn>
                  </template>
                  <span>Reviewers</span>
                </v-tooltip>
              </template>
              <v-card class="py-3">
                <v-list>
                  <draggable v-model="criteria.reviewerChain" handle=".handle">
                    <v-list-item
                      v-for="(chainLink, chainLinkIndex) in criteria.reviewerChain"
                      :key="chainLinkIndex"
                    >
                      <v-chip
                        :color="`pink lighten-${Math.abs(chainLinkIndex%8-4)+1}`"
                      >{{chainLinkIndex+1}}</v-chip>
                      <v-select
                        v-model="chainLink.reviewers"
                        :rules="[v => !!v.length || 'At least one rewiewer required']"
                        :items="reviewersList"
                        item-value="_id"
                        :label="`Reviewers for ${chainLinkIndex+1} step`"
                        multiple
                        hide-selected
                        :menu-props="{ top: true, offsetY: true }"
                        class="mx-2"
                      >
                        <template v-slot:selection="{ attrs, item, parent, selected }">
                          <v-chip
                            v-bind="attrs"
                            :input-value="selected"
                            close
                            @click:close="parent.selectItem(item)"
                          >
                            <v-icon
                              left
                              :color="item.type == 'api' ? 'lime' : item.type == 'group' ? 'teal' : 'cyan'"
                            >{{item.type == 'api' ? 'mdi-robot' : item.type == 'group' ? 'mdi-account-multiple' : 'mdi-account' }}</v-icon>
                            {{ item.name }}
                          </v-chip>
                        </template>
                        <template v-slot:item="{item, on}">
                          <v-list-item v-on="on">
                            <v-icon
                              left
                              :color="item.type == 'api' ? 'lime' : item.type == 'group' ? 'teal' : 'cyan'"
                            >{{item.type == 'api' ? 'mdi-robot' : item.type == 'group' ? 'mdi-account-multiple' : 'mdi-account' }}</v-icon>
                            <span>{{ item.name }}</span>
                          </v-list-item>
                        </template>
                      </v-select>

                      <c-btn-tip
                        dense
                        icon
                        tooltip="Remove chain link"
                        @click="removeChainLink(criteria.reviewerChain, chainLinkIndex)"
                      >
                        <v-icon>mdi-delete</v-icon>
                      </c-btn-tip>
                      <c-btn-tip dense icon handle tooltip="Drag to change chain link order">
                        <v-icon>mdi-drag</v-icon>
                      </c-btn-tip>
                    </v-list-item>
                  </draggable>
                </v-list>
                <v-card-actions>
                  <v-spacer />
                  <c-btn-tip
                    icon
                    large
                    tooltip="Add new reviewer chain link"
                    @click="addChainLink(criteria.reviewerChain)"
                  >
                    <v-icon>mdi-plus-circle-outline</v-icon>
                  </c-btn-tip>
                  <v-spacer />
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-divider />
            <c-btn-tip icon tooltip="Remove" @click="removeCriteria(criteriaIndex)">
              <v-icon>mdi-delete</v-icon>
            </c-btn-tip>
          </v-card>
        </v-list-item>
      </draggable>
      <v-overflow-btn
        ref="addCriteriaSelect"
        :items="components"
        item-text="name"
        item-value="sysname"
        @change="addCriteria"
        class="mx-4"
        autocomplete="off"
        label="Add new component"
        append-icon="mdi-plus-circle-outline"
        solo
        editable
      ></v-overflow-btn>
    </v-list>
  </v-card>
</template>

<script>
import draggable from "vuedraggable";
import components from "@/../components";

export default {
  components: {
    draggable
  },
  props: {
    value: Array,
    reviewers: Object
  },
  data: () => ({
    components: components
  }),
  computed: {
    criterias: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      }
    },
    reviewersList: {
      get() {
        let list = [];
        list = list.concat(
          this.reviewers.users.map(item => ({
            type: "user",
            _id: item._id,
            name: item.name
          }))
        );
        list = list.concat(
          this.reviewers.groups.map(item => ({
            type: "group",
            _id: item._id,
            name: item.name
          }))
        );
        list = list.concat(
          this.reviewers.apis.map(item => ({
            type: "api",
            _id: item._id,
            name: item.name
          }))
        );
        return list;
      }
    }
  },
  methods: {
    addCriteria: function(sysname) {
      this.$nextMongoId().then(id => {
        this.criterias.push({
          _id: id,
          component: sysname,
          settings: this.components
            .find(o => o.sysname === sysname)
            .defaultSettings(),
          parameters: [],
          reviewerChain: [],
          template: this.components.find(o => o.sysname === sysname).admin
        });
        this.$refs.addCriteriaSelect.lazyValue = "";
      });
    },
    removeCriteria: function(index) {
      this.$delete(this.criterias, index);
    },
    addChainLink: function(chain) {
      chain.push({ reviewers: [] });
    },
    removeChainLink: function(chain, index) {
      this.$delete(chain, index);
    },
    addParameter: function(list) {
      list.push({});
    },
    removeParameter: function(list, index) {
      this.$delete(list, index);
    }
  },
  beforeMount: function() {
    this.criterias.forEach(criteria => {
      criteria.template = this.components.find(
        o => o.sysname === criteria.component
      ).admin;
    });
  }
};
</script>

<style>
.v-overflow-btn .v-input__slot {
  border: 0;
}
</style>