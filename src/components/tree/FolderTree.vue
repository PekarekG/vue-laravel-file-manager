<template>
  <overlay-scrollbars
    class="fm-tree"
    :options="{ scrollbars: { autoHide: 'leave' } }"
  >
    <v-list-group>
      <template v-slot:activator>
        <v-list-item-content>
          <v-list-item-title>
            <div
              class="fm-tree-disk d-flex items-center sticky top-0 pl-2 py-2 z-10"
            >
              <v-icon class="pr-4 opacity-75">mdi-server-network</v-icon>
              <span> {{ selectedDisk }}</span>
            </div>
          </v-list-item-title>
        </v-list-item-content>
      </template>
      <branch class="pb-2" v-bind:parent-id="0"></branch>
    </v-list-group>
  </overlay-scrollbars>
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
}
</style>
