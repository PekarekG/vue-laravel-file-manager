<template>
    <v-card class="modal-content fm-modal-unzip">
        <v-card-title class="d-flex flex-row justify-content-between align-center py-3">
          <h5 class="h5 mb-0">{{ lang.modal.unzip.title }}</h5>
          <v-spacer></v-spacer>
          <v-tooltip left attach=".modal-content">
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon small aria-label="Close" v-on:click="hideModal">
                  <v-icon 
                  aria-hidden="true" 
                  v-bind="attrs"
                  v-on="on">mdi-close</v-icon>
              </v-btn>
            </template>
          <span>Bezárás</span>
        </v-tooltip>
        </v-card-title>
        <v-divider class="m-0"></v-divider>
        <v-card-text class="py-0 ">
          </v-list>
            <v-list-item class="d-flex items-center justify-between px-0">
              <span class="body-2"><strong>{{ lang.modal.unzip.fieldRadioName }}</strong></span>
              <v-radio-group class="ml-auto" v-model.number="createFolder" row>
                <v-radio 
                  id="unzipRadio1" 
                  name="uploadOptions"
                  :label="lang.modal.unzip.fieldRadio1" 
                  :value="0"
                >
                </v-radio>
                <v-radio 
                  class="mr-0"
                  id="unzipRadio2" 
                  name="uploadOptions"
                  :label="lang.modal.unzip.fieldRadio2" 
                  :value="1"
                >
                </v-radio>
              </v-radio-group>
            </v-list-item>
          </v-list>
          <v-divider></v-divider>
          <div v-if="createFolder">
            <v-text-field
              id="fm-folder-name"
              dense 
              outlined
              :label="lang.modal.unzip.fieldName" 
              v-focus
              v-bind:class="{'is-invalid': directoryExist}"
              v-model="directoryName"
              v-on:keyup="validateDirName"
              :rules="[
                !directoryExist || 'Érvénytelen név - Ez a mappa már létezik!'
              ]"
              >
            </v-text-field>
          </div>
          <div v-else>
            <v-alert 
            outlined 
            color="orange"
            >
              {{ lang.modal.unzip.warning }}
            </v-alert>
          </div>
        </v-card-text>
        <v-divider class="m-0"></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            depressed
            v-bind:disabled="!submitActive"
            v-on:click="unpackArchive"
            dark
            color="secondary"
            >
            {{ lang.btn.submit }}
          </v-btn>
          <v-btn
            text
            v-on:click="hideModal"
          >
            {{ lang.btn.cancel }}
          </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import modal from './../mixins/modal';
import translate from './../../../mixins/translate';

export default {
  name: 'Unzip',
  mixins: [modal, translate],
  data() {
    return {
      createFolder: 0,

      // name for new directory
      directoryName: '',

      // directory exist
      directoryExist: false,

    };
  },
  computed: {
    /**
     * Submit button - active or no
     * @returns {string|boolean}
     */
    submitActive() {
      if (this.createFolder) {
        return this.directoryName && !this.directoryExist;
      }

      return true;
    },
  },
  methods: {
    /**
     * Check the folder name if it exists or not.
     */
    validateDirName() {
      if (this.directoryName) {
        this.directoryExist = this.$store.getters[`fm/${this.activeManager}/directoryExist`](this.directoryName);
      } else {
        this.directoryExist = false;
      }
    },

    /**
     * Unpack selected archive
     */
    unpackArchive() {
      this.$store.dispatch('fm/unzip', this.createFolder ? this.directoryName : null).then(() => {
        // close modal window
        this.hideModal();
      });
    },
  },
};
</script>
