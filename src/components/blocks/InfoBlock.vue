<template>
  <v-container fluid class="fm-info-block px-4 py-0 mb-2">
    <!-- Progress Bar -->
    <!-- <v-progress-linear
      absolute
      top
      color="secondary"
      v-show="progressBar"
      v-bind:value="progressBar"
    ></v-progress-linear> -->
    <v-row>
      <v-col cols="auto" class="d-flex items-center h-14">
        <span class="text-xl leading-none" v-show="selectedCount">
          {{ `${selectedCount} ${lang.info.selected}` }},
          {{ `${selectedFilesSize} ${lang.info.selectedSize}` }},
        </span>
        <span class="text-xl leading-none" v-show="!selectedCount">
          {{ `${directoriesCount} ${lang.info.directories}` }},
          {{ `${filesCount} ${lang.info.files}` }},
          {{ `${filesSize} ${lang.info.size}` }}
        </span>
      </v-col>
      <v-col cols="auto" class="ml-auto d-flex align-center h-14">
        <!-- <span class="pr-2" v-show="loadingSpinner">
          <span class="d-flex align-center">
            <v-progress-circular
              :size="18"
              :width="2"
              indeterminate
              color="secondary"
            ></v-progress-circular>
          </span>
        </span> -->
        <v-btn
          fab
          text
          small
          depressed
          v-show="clipboardType"
          v-on:click="showModal('Clipboard')"
          v-bind:title="[
            lang.clipboard.title + ' - ' + lang.clipboard[clipboardType]
          ]"
          class="mr-2"
        >
          <v-icon class="opacity-75">mdi-clipboard-outline</v-icon>
        </v-btn>
        <v-btn
          fab
          text
          small
          depressed
          v-on:click="showModal('Status')"
          v-bind:class="[hasErrors ? 'text-danger' : 'text-success']"
          v-bind:title="lang.modal.status.title"
        >
          <v-icon class="opacity-75">mdi-information-outline</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import translate from "./../../mixins/translate";
import helper from "./../../mixins/helper";

export default {
  name: "InfoBlock",
  mixins: [translate, helper],
  computed: {
    /**
     * Active manager
     * @returns {default.computed.activeManager|(function())|string|activeManager}
     */
    activeManager() {
      return this.$store.state.fm.activeManager;
    },

    /**
     * Progress bar value - %
     * @returns {number}
     */
    progressBar() {
      return this.$store.state.fm.messages.actionProgress;
    },

    /**
     * App has errors
     * @returns {boolean}
     */
    hasErrors() {
      return !!this.$store.state.fm.messages.errors.length;
    },

    /**
     * Files count in selected directory
     * @returns {*}
     */
    filesCount() {
      return this.$store.getters[`fm/${this.activeManager}/filesCount`];
    },

    /**
     * Directories count in selected directory
     * @returns {*}
     */
    directoriesCount() {
      return this.$store.getters[`fm/${this.activeManager}/directoriesCount`];
    },

    /**
     * Files size in selected directory
     * @returns {*|string}
     */
    filesSize() {
      return this.bytesToHuman(
        this.$store.getters[`fm/${this.activeManager}/filesSize`]
      );
    },

    /**
     * Count files and folders
     * @returns {*}
     */
    selectedCount() {
      return this.$store.getters[`fm/${this.activeManager}/selectedCount`];
    },

    /**
     * Calculate selected files size
     * @returns {*|string}
     */
    selectedFilesSize() {
      return this.bytesToHuman(
        this.$store.getters[`fm/${this.activeManager}/selectedFilesSize`]
      );
    },

    /**
     * Clipboard - action type
     * @returns {null}
     */
    clipboardType() {
      return this.$store.state.fm.clipboard.type;
    },

    /**
     * Spinner
     * @returns {number}
     */
    loadingSpinner() {
      return this.$store.state.fm.messages.loading;
    }
  },
  methods: {
    /**
     * Show modal window
     * @param modalName
     */
    showModal(modalName) {
      this.$store.commit("fm/modal/setModalState", {
        modalName,
        show: true
      });
    }
  }
};
</script>

<style lang="scss">
.fm-info-block {
  height: 3.5rem;
}
</style>
