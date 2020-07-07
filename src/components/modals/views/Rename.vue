<template>
  <v-card class="modal-content fm-modal-rename">
    <v-card-title
      class="d-flex flex-row justify-content-between align-center py-3"
    >
      <h5 class="h5 mb-0">{{ lang.modal.rename.title }}</h5>
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
        id="fm-input-rename"
        dense
        outlined
        :label="lang.modal.rename.fieldName"
        v-focus
        v-bind:class="{ 'is-invalid': checkName }"
        v-model="name"
        v-on:keyup="validateName"
        :rules="[
          () => !!name || 'Érvénytelen név!',
          !checkName || 'Érvénytelen név - Ez a fájl már létezik!'
        ]"
      >
      </v-text-field>
    </v-card-text>
    <v-divider class="m-0"></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        depressed
        v-bind:disabled="submitDisable"
        v-on:click="rename"
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
  name: "Rename",
  mixins: [modal, translate],
  data() {
    return {
      name: "",
      directoryExist: false,
      fileExist: false
    };
  },
  computed: {
    /**
     * Selected item
     * @returns {*}
     */
    selectedItem() {
      return this.$store.getters[`fm/${this.activeManager}/selectedList`][0];
    },

    /**
     * Check new name
     * @returns {boolean}
     */
    checkName() {
      return this.directoryExist || this.fileExist || !this.name;
    },

    /**
     * Submit button disable
     * @returns {*|boolean}
     */
    submitDisable() {
      return this.checkName || this.name === this.selectedItem.basename;
    }
  },
  mounted() {
    // initiate item name
    this.name = this.selectedItem.basename;
  },
  methods: {
    /**
     * Validate item name
     */
    validateName() {
      if (this.name !== this.selectedItem.basename) {
        // if item - folder
        if (this.selectedItem.type === "dir") {
          // check folder name matches
          this.directoryExist = this.$store.getters[
            `fm/${this.activeManager}/directoryExist`
          ](this.name);
        } else {
          // check file name matches
          this.fileExist = this.$store.getters[
            `fm/${this.activeManager}/fileExist`
          ](this.name);
        }
      }
    },

    /**
     * Rename item
     */
    rename() {
      // create new name with path
      const newName = this.selectedItem.dirname
        ? `${this.selectedItem.dirname}/${this.name}`
        : this.name;

      this.$store
        .dispatch("fm/rename", {
          type: this.selectedItem.type,
          newName,
          oldName: this.selectedItem.path
        })
        .then(() => {
          // close modal window
          this.hideModal();
        });
    }
  }
};
</script>
