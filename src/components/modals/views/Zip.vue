<template>
  <v-card class="modal-content fm-modal-zip">
    <v-card-title
      class="d-flex flex-row justify-content-between align-center py-3"
    >
      <h5 class="h5 mb-0">{{ lang.modal.zip.title }}</h5>
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
        id="fm-zip-name"
        dense
        outlined
        :label="lang.modal.zip.fieldName"
        suffix=".zip"
        v-model="archiveName"
        v-on:keyup="validateArchiveName"
        :rules="[!this.archiveExist || 'Ez az archívum már létezik!']"
      ></v-text-field>
      <v-divider class="m-0"></v-divider>
      <selected-file-list></selected-file-list>
    </v-card-text>
    <v-divider class="m-0"></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        depressed
        v-bind:disabled="!submitActive"
        v-on:click="createArchive"
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
import SelectedFileList from "../additions/SelectedFileList.vue";
import modal from "./../mixins/modal";
import translate from "./../../../mixins/translate";

export default {
  name: "Zip",
  mixins: [modal, translate],
  components: { SelectedFileList },
  data() {
    return {
      // name for new archive
      archiveName: "",

      // archive exist
      archiveExist: false
    };
  },
  computed: {
    /**
     * Submit button - active or no
     * @returns {string|boolean}
     */
    submitActive() {
      return this.archiveName && !this.archiveExist;
    }
  },
  methods: {
    /**
     * Check the archive name if it exists or not.
     */
    validateArchiveName() {
      if (this.archiveName) {
        this.archiveExist = this.$store.getters[
          `fm/${this.activeManager}/fileExist`
        ](`${this.archiveName}.zip`);
      } else {
        this.archiveExist = false;
      }
    },

    /**
     * Create new archive
     */
    createArchive() {
      this.$store.dispatch("fm/zip", `${this.archiveName}.zip`).then(() => {
        // close modal window
        this.hideModal();
      });
    }
  }
};
</script>
