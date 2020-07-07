<template>
  <v-container fluid class="fm-navbar px-4 py-0">
    <v-row>
      <v-col class="h-14 d-flex items-center py-0" cols="auto">
        <v-menu offset-y attach=".fm-navbar">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              fab
              dark
              small
              depressed
              color="secondary"
              v-on="on"
              class="mr-4"
            >
              <v-icon dark>mdi-plus</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item-group>
              <v-list-item disabled v-if="uploading">
                <v-list-item-icon class="mr-3">
                  <v-icon class="opacity-75">mdi-upload-outline</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ lang.btn.upload }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item v-else v-on:click="showModal('Upload')">
                <v-list-item-icon class="mr-3">
                  <v-icon class="opacity-75">mdi-upload-outline</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ lang.btn.upload }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <!-- <v-list-item v-on:click="showModal('NewFile')" v-bind:title="lang.btn.file">
                <v-list-item-icon class="mr-3">
                  <v-icon class="opacity-75">mdi-file-outline</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ lang.btn.file }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item> -->
              <v-list-item v-on:click="showModal('NewFolder')" v-bind:title="lang.btn.folder">
                <v-list-item-icon class="mr-3">
                  <v-icon class="opacity-75">mdi-folder-outline</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ lang.btn.folder }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-menu>
        <v-tooltip bottom attach=".fm-navbar">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              fab
              text
              small
              depressed
              color="primary"
              v-bind:disabled="!isAnyItemSelected"
              v-on:click="showModal('Delete')"
              v-bind="attrs"
              v-on="on"
              class="mr-2"
            >
              <v-icon dark class="opacity-75">mdi-delete-outline</v-icon>
            </v-btn>
          </template>
          <span>{{ lang.btn.delete }}</span>
        </v-tooltip>
        <v-tooltip bottom attach=".fm-navbar">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              fab
              text
              small
              depressed
              color="primary"
              v-bind:disabled="backDisabled"
              v-on:click="historyBack()"
              v-bind="attrs"
              v-on="on"
              class="mr-2"
            >
              <v-icon dark class="opacity-75">mdi-step-backward</v-icon>
            </v-btn>
          </template>
          <span>{{ lang.btn.back }}</span>
        </v-tooltip>
        <v-tooltip bottom attach=".fm-navbar">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              fab
              text
              small
              depressed
              color="primary"
              v-bind:disabled="forwardDisabled"
              v-on:click="historyForward()"
              v-bind="attrs"
              v-on="on"
              class="mr-2"
            >
              <v-icon dark class="opacity-75">mdi-step-forward</v-icon>
            </v-btn>
          </template>
          <span>{{ lang.btn.forward }}</span>
        </v-tooltip>
        <v-tooltip bottom attach=".fm-navbar">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              fab
              text
              small
              depressed
              color="primary"
              v-on:click="refreshAll()"
              v-bind="attrs"
              v-on="on"
              class="mr-2"
            >
              <v-icon dark class="opacity-75">mdi-refresh</v-icon>
            </v-btn>
          </template>
          <span>{{ lang.btn.refresh }}</span>
        </v-tooltip>
        <v-tooltip bottom attach=".fm-navbar">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              fab
              text
              small
              depressed
              color="primary"
              v-bind:disabled="!isAnyItemSelected"
              v-on:click="toClipboard('copy')"
              v-bind="attrs"
              v-on="on"
              class="mr-2"
            >
              <v-icon dark class="opacity-75">mdi-content-copy</v-icon>
            </v-btn>
          </template>
          <span>{{ lang.btn.copy }}</span>
        </v-tooltip>
        <v-tooltip bottom attach=".fm-navbar">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              fab
              text
              small
              depressed
              color="primary"
              v-bind:disabled="!isAnyItemSelected"
              v-on:click="toClipboard('cut')"
              v-bind="attrs"
              v-on="on"
              class="mr-2"
            >
              <v-icon dark class="opacity-75">mdi-content-cut</v-icon>
            </v-btn>
          </template>
          <span>{{ lang.btn.cut }}</span>
        </v-tooltip>
        <v-tooltip bottom attach=".fm-navbar">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              fab
              text
              small
              depressed
              color="primary"
              v-bind:disabled="!clipboardType"
              v-on:click="paste"
              v-bind="attrs"
              v-on="on"
              class="mr-2"
            >
              <v-icon dark class="opacity-75">mdi-content-paste</v-icon>
            </v-btn>
          </template>
          <span>{{ lang.btn.paste }}</span>
        </v-tooltip>
        <v-tooltip bottom attach=".fm-navbar">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              fab
              text
              small
              depressed
              color="primary"
              v-on:click="toggleHidden"
              v-bind="attrs"
              v-on="on"
              class="mr-2"
            >
              <v-icon dark class="opacity-75" v-if="hiddenFiles">mdi-eye-off-outline</v-icon>
              <v-icon dark class="opacity-75" v-else>mdi-eye-outline</v-icon>
            </v-btn>
          </template>
          <span>{{ lang.btn.hidden }}</span>
        </v-tooltip>
      </v-col class="h-14 py-0">
      <v-spacer></v-spacer>
      <v-col class="h-14 d-flex items-center justify-end py-0">
        <v-tooltip bottom attach=".fm-navbar">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              fab
              text
              small
              depressed
              color="primary"
              v-bind:class="[viewType === 'table' ? 'active' : '']"
              v-on:click="selectView('table')"
              v-bind="attrs"
              v-on="on"
              class="mr-2"
            >
              <v-icon class="opacity-75" dark>mdi-view-list-outline</v-icon>
            </v-btn>
          </template>
          <span>{{ lang.btn.table }}</span>
        </v-tooltip>
        <v-tooltip bottom attach=".fm-navbar">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              fab
              text
              small
              depressed
              color="primary"
              v-bind:class="[viewType === 'grid' ? 'active' : '']"
              v-on:click="selectView('grid')"
              v-bind="attrs"
              v-on="on"
              class="mr-2"
            >
              <v-icon class="opacity-75" dark>mdi-view-grid-outline</v-icon>
            </v-btn>
          </template>
          <span>{{ lang.btn.grid }}</span>
        </v-tooltip>
        <v-tooltip left attach=".fm-navbar">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              fab
              text
              small
              depressed
              color="primary"
              v-bind:class="{ active: fullScreen }"
              v-on:click="screenToggle"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon dark class="opacity-75" v-if="fullScreen">mdi-fullscreen-exit</v-icon>
              <v-icon dark class="opacity-75" v-else>mdi-fullscreen</v-icon>
            </v-btn>
          </template>
          <span>{{ lang.btn.fullScreen }}</span>
        </v-tooltip>
        <v-tooltip bottom left attach=".fm-navbar">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              fab
              text
              small
              depressed
              color="primary"
              v-on:click="showModal('About')"
              v-bind="attrs"
              v-on="on"
              class="d-none"
            >
              <v-icon class="opacity-75" dark>mdi-help</v-icon>
            </v-btn>
          </template>
          <span>{{ lang.btn.about }}</span>
        </v-tooltip>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import translate from "./../../mixins/translate";
import EventBus from "./../../eventBus";
// Components
import Modal from './../../components/modals/Modal.vue';

export default {
  mixins: [translate],
  components: {
    Modal,
  },
  computed: {
    /**
     * Active manager name
     * @returns {default.computed.activeManager|(function())|string|activeManager}
     */
    activeManager() {
      return this.$store.state.fm.activeManager;
    },

    /**
     * Back button state
     * @returns {boolean}
     */
    backDisabled() {
      return !this.$store.state.fm[this.activeManager].historyPointer;
    },

    /**
     * Forward button state
     * @returns {boolean}
     */
    forwardDisabled() {
      return (
        this.$store.state.fm[this.activeManager].historyPointer ===
        this.$store.state.fm[this.activeManager].history.length - 1
      );
    },

    /**
     * Is any files or directories selected?
     * @returns {boolean}
     */
    isAnyItemSelected() {
      return (
        this.$store.state.fm[this.activeManager].selected.files.length > 0 ||
        this.$store.state.fm[this.activeManager].selected.directories.length > 0
      );
    },

    /**
     * Manager view type - grid or table
     * @returns {default.computed.viewType|(function())|string}
     */
    viewType() {
      return this.$store.state.fm[this.activeManager].viewType;
    },

    /**
     * Upload files
     * @returns {boolean}
     */
    uploading() {
      return this.$store.state.fm.messages.actionProgress > 0;
    },

    /**
     * Clipboard - action type
     * @returns {null}
     */
    clipboardType() {
      return this.$store.state.fm.clipboard.type;
    },

    /**
     * Full screen status
     * @returns {default.computed.fullScreen|(function())|boolean|fullScreen|*|string}
     */
    fullScreen() {
      return this.$store.state.fm.fullScreen;
    },

    /**
     * Show or Hide hidden files
     * @returns {boolean}
     */
    hiddenFiles() {
      return this.$store.state.fm.settings.hiddenFiles;
    },
  },
  methods: {
    /**
     * Refresh file manager
     */
    refreshAll() {
      this.$store.dispatch("fm/refreshAll");
    },

    /**
     * History back
     */
    historyBack() {
      this.$store.dispatch(`fm/${this.activeManager}/historyBack`);
    },

    /**
     * History forward
     */
    historyForward() {
      this.$store.dispatch(`fm/${this.activeManager}/historyForward`);
    },

    /**
     * Copy
     * @param type
     */
    toClipboard(type) {
      this.$store.dispatch("fm/toClipboard", type);

      // show notification
      if (type === "cut") {
        EventBus.$emit("addNotification", {
          status: "success",
          message: this.lang.notifications.cutToClipboard
        });
      } else if (type === "copy") {
        EventBus.$emit("addNotification", {
          status: "success",
          message: this.lang.notifications.copyToClipboard
        });
      }
    },

    /**
     * Paste
     */
    paste() {
      this.$store.dispatch("fm/paste");
    },

    /**
     * Set Hide or Show hidden files
     */
    toggleHidden() {
      this.$store.commit("fm/settings/toggleHiddenFiles");
    },

    /**
     * Show modal window
     * @param modalName
     */
    showModal(modalName) {
      // show selected modal
      this.$store.commit("fm/modal/setModalState", {
        modalName,
        show: true
      });
    },

    /**
     * Select view type
     * @param type
     */
    selectView(type) {
      if (this.viewType !== type)
        this.$store.commit(`fm/${this.activeManager}/setView`, type);
    },

    /**
     * Full screen toggle
     */
    screenToggle() {
      const fm = document.getElementsByClassName("fm")[0];

      if (!this.fullScreen) {
        if (fm.requestFullscreen) {
          fm.requestFullscreen();
        } else if (fm.mozRequestFullScreen) {
          fm.mozRequestFullScreen();
        } else if (fm.webkitRequestFullscreen) {
          fm.webkitRequestFullscreen();
        } else if (fm.msRequestFullscreen) {
          fm.msRequestFullscreen();
        }
      } else if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }

      this.$store.commit("fm/screenToggle");
    }
  }
};
</script>

<style lang="scss">
  .fm-navbar {
    position: relative;
    height: 3.5rem;
    z-index: 1021;

  }
  /* .v-menu__content {
    left: 36px !important;
  } */
</style>
