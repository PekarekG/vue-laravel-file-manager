<template>
  <v-card class="modal-content fm-modal-errors">
    <v-card-title
      class="d-flex flex-row justify-content-between align-center py-3"
    >
      <h5 class="h5 mb-0">{{ lang.modal.status.title }}</h5>
      <v-spacer></v-spacer>
      <v-tooltip left attach=".modal-content">
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon small aria-label="Close" v-on:click="hideModal">
            <v-icon aria-hidden="true" v-bind="attrs" v-on="on"
              >mdi-close</v-icon
            >
          </v-btn>
        </template>
        <span>Bezárás</span>
      </v-tooltip>
    </v-card-title>
    <v-divider class="m-0"></v-divider>
    <v-card-text class="py-0">
      <v-list v-if="errors.length">
        <v-list-item
          class="px-0"
          v-for="(item, index) in errors"
          v-bind:key="index"
        >
          <v-list-item-content>
            <v-list-item-title
              >{{ item.status }} - {{ item.message }}</v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-list v-else>
        <v-list-item>
          <v-list-item-content>
            {{ lang.modal.status.noErrors }}
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card-text>
    <v-divider class="m-0"></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        depressed
        v-bind:disabled="!errors.length"
        v-on:click="clearErrors"
        dark
        color="secondary"
      >
        {{ lang.btn.clear }}
      </v-btn>
      <v-btn text v-on:click="hideModal">
        {{ lang.btn.cancel }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import modal from "./../mixins/modal";
import translate from "./../../../mixins/translate";

export default {
  name: "Status",
  mixins: [modal, translate],
  computed: {
    /**
     * Application errors
     * @returns {default.computed.errors|(function())|Array|boolean}
     */
    errors() {
      return this.$store.state.fm.messages.errors;
    }
  },
  methods: {
    /**
     * Clear all errors
     */
    clearErrors() {
      this.$store.commit("fm/messages/clearErrors");
    }
  }
};
</script>
