<template>
  <v-card class="modal-content fm-modal-folder">
    <v-card-title
      class="d-flex flex-row justify-content-between align-center py-3"
    >
      <h5 class="h5 mb-0">{{ lang.modal.newFile.title }}</h5>
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
        id="fm-file-name"
        dense
        outlined
        :label="lang.modal.newFile.fieldName"
        v-focus
        v-bind:class="{ 'is-invalid': fileExist }"
        v-model="fileName"
        v-on:keyup="validateFileName"
        :rules="[!this.fileExist || 'Ez a fájl már létezik!']"
      ></v-text-field>
    </v-card-text>
    <v-divider class="m-0"></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        depressed
        v-bind:disabled="!submitActive"
        v-on:click="addFile"
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
  name: "NewFile",
  mixins: [modal, translate],
  data() {
    return {
      // name for new file
      fileName: "",

      // file exist
      fileExist: false
    };
  },
  computed: {
    /**
     * Submit button - active or no
     * @returns {string|boolean}
     */
    submitActive() {
      return this.fileName && !this.fileExist;
    }
  },
  methods: {
    /**
     * Check the file name if it exists or not.
     */
    validateFileName() {
      if (this.fileName) {
        this.fileExist = this.$store.getters[
          `fm/${this.activeManager}/fileExist`
        ](this.fileName);
      } else {
        this.fileExist = false;
      }
    },

    /**
     * Create new file
     */
    addFile() {
      this.$store.dispatch("fm/createFile", this.fileName).then(response => {
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
