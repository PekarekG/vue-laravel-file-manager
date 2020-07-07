<template>
  <div class="fm-grid">
    <v-container fluid class="d-flex flex-column px-4 py-0">
      <v-row class="d-none" v-if="!isRootPath" v-on:click="levelUp">
        <v-col class="pt-0">
          <v-btn text small>
            <v-icon left>mdi-subdirectory-arrow-left</v-icon>
            <span>[...]</span>
          </v-btn>
        </v-col>
      </v-row>

      <v-row class="pb-4" v-if="directories.length >= 1">
        <v-col cols="12">
          <h2 class="subtitle-2 mb-0">Mappák</h2>
        </v-col>

        <v-col
          cols="12"
          sm="6"
          md="4"
          xl="3"
          v-for="(directory, index) in directories"
          v-bind:key="`d-${index}`"
        >
          <v-lazy
            :options="{
              threshold: 0.5
            }"
            transition="fade-transition"
          >
            <v-card
              class="fm-grid-item unselectable"
              v-bind:title="directory.basename"
              v-bind:class="{
                active: checkSelect('directories', directory.path)
              }"
              v-on:click="selectItem('directories', directory.path, $event)"
              v-on:dblclick.stop="selectDirectory(directory.path)"
              v-on:contextmenu.prevent="contextMenu(directory, $event)"
              outlined
            >
              <v-list-item>
                <v-list-item-avatar>
                  <v-icon>{{
                    acl && directory.acl === 0
                      ? "mdi-lock-open-outline"
                      : "mdi-folder-outline"
                  }}</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title class="subtitle-1">{{
                    directory.basename
                  }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-card>
          </v-lazy>
        </v-col>
      </v-row>

      <v-row class="pb-4" v-if="files.length >= 1">
        <v-col cols="12">
          <h2 class="subtitle-2 mb-0">Fájlok</h2>
        </v-col>

        <v-col
          cols="12"
          sm="6"
          md="4"
          xl="3"
          v-for="(file, index) in files"
          v-bind:key="`f-${index}`"
        >
          <v-lazy :options="{ hreshold: 0.5 }" transition="fade-transition">
            <v-card
              class="fm-grid-item unselectable"
              v-bind:title="file.basename"
              v-bind:class="{ active: checkSelect('files', file.path) }"
              v-on:click="selectItem('files', file.path, $event)"
              v-on:dblclick="selectAction(file.path, file.extension)"
              v-on:contextmenu.prevent="contextMenu(file, $event)"
              outlined
            >
              <div class="text-center">
                <v-icon class="fm-item-icon" v-if="acl && file.acl === 0"
                  >mdi-lock-open-outline</v-icon
                >
                <thumbnail
                  v-else-if="thisImage(file.extension)"
                  v-bind:disk="disk"
                  v-bind:file="file"
                >
                </thumbnail>
                <v-icon class="fm-item-icon text-center" v-else>{{
                  extensionToIcon(file.extension)
                }}</v-icon>
              </div>
              <v-list-item>
                <v-list-item-avatar>
                  <v-icon v-if="acl && file.acl === 0"
                    >mdi-lock-open-outline</v-icon
                  >
                  <v-icon v-else>{{ extensionToIcon(file.extension) }}</v-icon>
                </v-list-item-avatar>
                <v-list-item-content class="fm-item-info">
                  <v-list-item-title class="subtitle-1">{{
                    `${file.filename}.${file.extension}`
                  }}</v-list-item-title>
                  <v-list-item-subtitle class="subtitle-2">{{
                    bytesToHuman(file.size)
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-card>
          </v-lazy>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import translate from "./../../mixins/translate";
import helper from "./../../mixins/helper";
import managerHelper from "./mixins/manager";
import Thumbnail from "./Thumbnail.vue";

export default {
  name: "grid-view",
  components: { Thumbnail },
  mixins: [translate, helper, managerHelper],
  data() {
    return {
      disk: ""
    };
  },
  props: {
    manager: { type: String, required: true }
  },
  mounted() {
    this.disk = this.selectedDisk;
  },
  beforeUpdate() {
    // if disk changed
    if (this.disk !== this.selectedDisk) {
      this.disk = this.selectedDisk;
    }
  },
  computed: {
    /**
     * Image extensions list
     * @returns {*}
     */
    imageExtensions() {
      return this.$store.state.fm.settings.imageExtensions;
    }
  },
  methods: {
    /**
     * Check file extension (image or no)
     * @param extension
     * @returns {boolean}
     */
    thisImage(extension) {
      // extension not found
      if (!extension) return false;

      return this.imageExtensions.includes(extension.toLowerCase());
    }
  }
};
</script>

<style lang="scss">
.fm-grid {
  /* padding-top: 1rem; */

  .fm-item-icon {
    font-size: 10rem;
  }

  .fm-grid-item {
    &.active {
      background-color: #f4f6fa;
    }

    &:not(.active):hover {
      background-color: #f4f6fa;
    }
  }

  /* .fm-grid-item {
            position: relative;
            width: 125px;
            padding: 0.4rem;
            margin-bottom: 1rem;
            margin-right: 1rem;
            border-radius: 5px;

            &.active {
                background-color: #c2e5eb;
                box-shadow: 3px 2px 5px gray;
            }

            &:not(.active):hover {
                background-color: #f8f9fa;
                box-shadow: 3px 2px 5px gray;
            }

            .fm-item-icon{
                cursor: pointer;
            }

            .fm-item-icon > i,
            .fm-item-icon > figure > i {
                color: #6d757d;
            }

            .fm-item-info {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        } */
}
</style>
