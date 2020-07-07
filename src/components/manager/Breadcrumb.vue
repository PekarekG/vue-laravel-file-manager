<template>
  <v-breadcrumbs class="fm-breadcrumb px-4 pt-0 pb-4">
    <v-breadcrumbs-item class="cursor-pointer" v-on:click="selectMainDirectory">
      <v-icon class="opacity-75 pr-1">mdi-server-network</v-icon>
      <span
        class="hover:underline"
        v-for="(disk, index) in disks"
        v-bind:key="index"
        >{{ disk }}</span
      >
    </v-breadcrumbs-item>
    <v-breadcrumbs-item
      class="cursor-pointer"
      v-for="(item, index) in breadcrumb"
      v-bind:key="index"
      v-bind:class="[breadcrumb.length === index + 1 ? 'active' : '']"
      v-on:click="selectDirectory(index)"
    >
      <v-icon class="pr-3">mdi-chevron-right</v-icon>
      <span class="hover:underline">{{ item }}</span>
    </v-breadcrumbs-item>
  </v-breadcrumbs>
</template>

<script>
export default {
  name: "Breadcrumb",
  props: {
    manager: { type: String, required: true }
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
     * Selected Disk for this manager
     * @returns {default.computed.selectedDisk|(function())|default.selectedDisk|null}
     */
    selectedDisk() {
      return this.$store.state.fm[this.manager].selectedDisk;
    },

    /**
     * Selected directory for this manager
     * @returns {default.computed.selectedDirectory|(function())|default.selectedDirectory|null}
     */
    selectedDirectory() {
      return this.$store.state.fm[this.manager].selectedDirectory;
    },

    /**
     * Breadcrumb
     * @returns {*}
     */
    breadcrumb() {
      return this.$store.getters[`fm/${this.manager}/breadcrumb`];
    },

    /**
     * Disk list
     * @returns {Array}
     */
    disks() {
      return this.$store.getters["fm/diskList"];
    },

    /**
     * Selected Disk for this manager
     * @returns {default.computed.selectedDisk|(function())|default.selectedDisk|null}
     */
    selectedDisk() {
      return this.$store.state.fm[this.manager].selectedDisk;
    }
  },
  methods: {
    /**
     * Load selected directory
     * @param index
     */
    selectDirectory(index) {
      const path = this.breadcrumb.slice(0, index + 1).join("/");

      // only if this path not selected
      if (path !== this.selectedDirectory) {
        // load directory
        this.$store.dispatch(`fm/${this.manager}/selectDirectory`, {
          path,
          history: true
        });
      }
    },

    /**
     * Select main directory
     */
    selectMainDirectory() {
      if (this.selectedDirectory) {
        this.$store.dispatch(`fm/${this.manager}/selectDirectory`, {
          path: null,
          history: true
        });
      }
    },

    /**
     * Select disk
     * @param disk
     */
    selectDisk(disk) {
      if (this.selectedDisk !== disk) {
        this.$store.dispatch("fm/selectDisk", {
          disk,
          manager: this.manager
        });
      }
    }
  }
};
</script>

<style lang="scss"></style>
