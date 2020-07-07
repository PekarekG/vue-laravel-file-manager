<template>
  <v-card class="modal-content fm-modal-clipboard">
    <v-card-title
      class="d-flex flex-row justify-content-between align-center py-3"
    >
      <h5 class="h5 mb-0">{{ lang.clipboard.title }}</h5>
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
    <v-card-text>
      <template v-if="clipboard.type">
        <v-list-item class="d-flex justify-content-between px-0">
          <v-list-item-avatar class="mr-0">
            <v-icon small>mdi-server-network</v-icon>
          </v-list-item-avatar>
          <v-list-item-title class="w-75 text-truncate">
            <span class="pl-1">{{ clipboard.disk }}</span>
          </v-list-item-title>
          <v-list-item-icon class="justify-end pr-1 text-muted">
            <span
              v-bind:title="
                `${lang.clipboard.actionType} - ${
                  lang.clipboard[clipboard.type]
                }`
              "
            >
              <v-icon small v-if="clipboard.type === 'copy'"
                >mdi-content-copy</v-icon
              >
              <v-icon small v-else>mdi-content-cut</v-icon>
            </span>
          </v-list-item-icon>
        </v-list-item>
        <v-divider class="m-0"></v-divider>
        <v-list-item
          class="d-flex justify-content-between px-0"
          v-for="(dir, index) in directories"
          v-bind:key="`d-${index}`"
        >
          <v-list-item-avatar class="mr-0">
            <v-icon>mdi-folder-outline</v-icon>
          </v-list-item-avatar>
          <v-list-item-title class="w-75 text-truncate">
            <span class="body-2 pl-1">{{ dir.name }}</span>
          </v-list-item-title>
          <v-row>
            <v-btn
              icon
              class="mx-2"
              v-bind:title="lang.btn.delete"
              v-on:click="deleteItem('directories', dir.path)"
            >
              <v-icon small aria-hidden="true">mdi-close</v-icon>
            </v-btn>
          </v-row>
        </v-list-item>
        <v-list-item
          class="d-flex justify-content-between px-0"
          v-for="(file, index) in files"
          v-bind:key="`f-${index}`"
        >
          <v-list-item-avatar class="mr-0">
            <v-icon>mdi-file-outline</v-icon>
          </v-list-item-avatar>
          <v-list-item-title class="w-75 text-truncate">
            <span class="body-2 pl-1">{{ file.name }}</span>
          </v-list-item-title>
          <v-row>
            <v-btn
              icon
              class="mx-2"
              v-bind:title="lang.btn.delete"
              v-on:click="deleteItem('files', file.path)"
            >
              <v-icon small aria-hidden="true">mdi-close</v-icon>
            </v-btn>
          </v-row>
        </v-list-item>
      </template>
      <template v-else>
        <span>{{ lang.clipboard.none }}</span>
      </template>
    </v-card-text>
    <v-divider class="m-0"></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        depressed
        v-bind:disabled="!clipboard.type"
        v-on:click="resetClipboard"
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
import helper from "./../../../mixins/helper";

export default {
  name: "Clipboard",
  mixins: [modal, translate, helper],
  computed: {
    /**
     * Clipboard state
     * @returns {*}
     */
    clipboard() {
      return this.$store.state.fm.clipboard;
    },

    /**
     * Paths and names for directories
     * @returns {{path: *, name: *}[]}
     */
    directories() {
      return this.$store.state.fm.clipboard.directories.map(item => ({
        path: item,
        name: item.split("/").slice(-1)[0]
      }));
    },

    /**
     * File names, paths and icons
     * @returns {{path: *, name: *, icon: *}[]}
     */
    files() {
      return this.$store.state.fm.clipboard.files.map(item => {
        const name = item.split("/").slice(-1)[0];
        return {
          path: item,
          name,
          icon: this.extensionToIcon(name.split(".").slice(-1)[0])
        };
      });
    }
  },
  methods: {
    /**
     * Delete item from clipboard
     * @param type
     * @param path
     */
    deleteItem(type, path) {
      this.$store.commit("fm/truncateClipboard", { type, path });
    },

    /**
     * Reset clipboard
     */
    resetClipboard() {
      this.$store.commit("fm/resetClipboard");
    }
  }
};
</script>

<style lang="scss">
.fm-modal-clipboard {
  .modal-body .far {
    padding-right: 0.5rem;
  }
}
</style>
