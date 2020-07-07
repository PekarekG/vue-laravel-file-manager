<template>
  <v-card class="modal-content fm-modal-folder">
    <v-card-title
      class="d-flex flex-row justify-content-between align-center py-3"
    >
      <h5 class="h5 mb-0">{{ lang.modal.newFolder.title }}</h5>
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
    <v-card-text class="pt-6 pb-0">
      <v-text-field
        id="fm-folder-name"
        dense
        outlined
        :label="lang.modal.newFolder.fieldName"
        v-focus
        v-bind:class="{ 'is-invalid': directoryExist }"
        v-model="directoryName"
        v-on:keyup="validateDirName"
        :rules="[!this.directoryExist || 'Ez a mappa már létezik!']"
      ></v-text-field>
    </v-card-text>
    <v-divider class="m-0"></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        depressed
        v-bind:disabled="!submitActive"
        v-on:click="addFolder"
        dark
        color="secondary"
      >
        {{ lang.btn.submit }}
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
  name: "NewFolder",
  mixins: [modal, translate],
  data() {
    return {
      // name for new directory
      directoryName: "",

      // directory exist
      directoryExist: false
    };
  },
  computed: {
    /**
     * Submit button - active or no
     * @returns {string|boolean}
     */
    submitActive() {
      return this.directoryName && !this.directoryExist;
    }
  },
  methods: {
    /**
     * Check the folder name if it exists or not.
     */
    validateDirName() {
      if (this.directoryName) {
        this.directoryExist = this.$store.getters[
          `fm/${this.activeManager}/directoryExist`
        ](this.directoryName);
      } else {
        this.directoryExist = false;
      }
    },

    /**
     * Create new directory
     */
    addFolder() {
      this.$store
        .dispatch("fm/createDirectory", this.directoryName)
        .then(response => {
          // if new directory created successfully
          if (response.data.result.status === "success") {
            // close modal window
            this.hideModal();
          }
        });
    }
  }
};
</script>

<style>
.modal-header {
  height: 3.5rem;
}
</style>
