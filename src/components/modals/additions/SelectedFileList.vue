<template>
    <div class="fm-additions-file-list">
        <v-list-item class="d-flex justify-content-between px-0"
             v-for="(item, index) in selectedItems"
             v-bind:key="index">
            <v-list-item-avatar class="mr-0">
              <v-icon v-if="item.type === 'dir'">mdi-folder-outline</v-icon>
              <v-icon v-else>{{ extensionToIcon(item.extension) }}</v-icon>
            </v-list-item-avatar>
            <v-list-item-title>
                <span class="body-2 pl-1">{{ item.basename }}</span>
            </v-list-item-title>
            <v-list-item-subtitle class="d-flex items-center justify-end">
                <span class="pl-1">{{ bytesToHuman(item.size) }}</span>
            </v-list-item-subtitle>
        </v-list-item>
    </div>
</template>

<script>
import helper from './../../../mixins/helper';

export default {
  name: 'SelectedFileList',
  mixins: [helper],
  computed: {
    /**
     * Selected files and folders
     * @returns {*}
     */
    selectedItems() {
      return this.$store.getters['fm/selectedItems'];
    },
  },
};
</script>

<style lang="scss">
</style>
