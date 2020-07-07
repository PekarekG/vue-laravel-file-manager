<template>
  <div class="fm-tree">
    <div class="fm-tree-disk d-flex items-center sticky top-0 px-6 py-2 z-10">
      <v-icon class="pr-4 opacity-75">mdi-server-network</v-icon>
      <span>{{ selectedDisk }}</span>
    </div>
    <branch class="pb-2" v-bind:parent-id="0"></branch>
  </div>
</template>

<script>
import Branch from "./Branch.vue";

export default {
  name: "FolderTree",
  components: {
    branch: Branch
  },
  computed: {
    /**
     * Selected Disk
     * @returns {*}
     */
    selectedDisk() {
      return this.$store.getters["fm/selectedDisk"];
    }
  }
};
</script>

<style lang="scss">
.fm-tree {
  overflow: auto;
  /* border-right: 1px solid #6d757d; */
  border-right: thin solid rgba(0, 0, 0, 0.12);

  & > .fm-folders-tree {
    padding-left: 0.2rem;
  }

  .fm-tree-disk {
    background-color: white;
  }
}
</style>
