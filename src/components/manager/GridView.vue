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
      </v-row>

      <draggable
        class="row pb-4"
        v-if="directories.length >= 1"
        forceFallback="true"
        :sort="false"
        @start="drag = true"
        @end="drag = false"
      >
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
              class="fm-grid-item unselectable rounded-lg overflow-hidden"
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
      </draggable>

      <v-row class="pb-4" v-if="files.length >= 1">
        <v-col cols="12">
          <h2 class="subtitle-2 mb-0">Fájlok</h2>
        </v-col>
      </v-row>

      <draggable
        class="row pb-4"
        v-if="files.length >= 1"
        :sort="false"
        @start="drag = true"
        @end="drag = false"
      >
        <div class="image-grid-container px-3 w-full">
          <div v-for="(file, index) in files" v-bind:key="`f-${index}`">
            <v-lazy :options="{ threshold: 0.5 }" transition="fade-transition">
              <v-card
                class="fm-grid-item unselectable h-full rounded-lg overflow-hidden"
                v-bind:title="file.basename"
                v-bind:class="{ active: checkSelect('files', file.path) }"
                v-on:click="selectItem('files', file.path, $event)"
                v-on:dblclick="selectAction(file.path, file.extension)"
                v-on:contextmenu.prevent="contextMenu(file, $event)"
                outlined
              >
                <div
                  class="text-center h-full relative"
                  style="padding-bottom: 100%;"
                >
                  <v-icon
                    class="fm-item-icon d-flex self-center h-full inset-0"
                    v-if="acl && file.acl === 0"
                    >mdi-lock-open-outline</v-icon
                  >
                  <thumbnail
                    v-else-if="thisImage(file.extension)"
                    v-bind:disk="disk"
                    v-bind:file="file"
                  >
                  </thumbnail>
                  <v-icon
                    class="fm-item-icon d-flex self-center h-full inset-0"
                    v-else
                    >{{ extensionToIcon(file.extension) }}</v-icon
                  >
                </div>
                <!-- <v-list-item>
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
                </v-list-item> -->
              </v-card>
            </v-lazy>
          </div>
        </div>

        <!-- <v-col
          class="d-flex child-flex"
          cols="2"
          sm="2"
          md="2"
          xl="1"
          v-for="(file, index) in files"
          v-bind:key="`f-${index}`"
        >
          <v-lazy :options="{ threshold: 0.5 }" transition="fade-transition">
            <v-card
              class="fm-grid-item unselectable rounded-lg overflow-hidden"
              v-bind:title="file.basename"
              v-bind:class="{ active: checkSelect('files', file.path) }"
              v-on:click="selectItem('files', file.path, $event)"
              v-on:dblclick="selectAction(file.path, file.extension)"
              v-on:contextmenu.prevent="contextMenu(file, $event)"
            >
              <div class="m-auto">
                <v-icon class="fm-item-icon" v-if="acl && file.acl === 0"
                  >mdi-lock-open-outline</v-icon
                >
                <thumbnail
                  v-else-if="thisImage(file.extension)"
                  v-bind:disk="disk"
                  v-bind:file="file"
                >
                </thumbnail>
                <v-icon class="fm-item-icon m-auto" v-else>{{
                  extensionToIcon(file.extension)
                }}</v-icon>
              </div>
            </v-card>
          </v-lazy>
        </v-col> -->
      </draggable>
    </v-container>
  </div>
</template>

<script>
import translate from "./../../mixins/translate";
import helper from "./../../mixins/helper";
import managerHelper from "./mixins/manager";
import Thumbnail from "./Thumbnail.vue";
import draggable from "vuedraggable";

export default {
  name: "grid-view",
  components: { Thumbnail, draggable },
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
    font-size: 4rem;
  }

  .fm-grid-item {
    &.active {
      background-color: #f4f6fa;
    }

    &:not(.active):hover {
      background-color: #f4f6fa;
    }
  }
  .sortable-drag {
    opacity: 1 !important;
  }
}
.image-grid-container {
  display: grid;
  grid-gap: 1.5rem;
  //grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
}
</style>
