<template>
  <v-card class="modal-content fm-modal-delete">
    <v-card-title
      class="d-flex flex-row justify-content-between align-center py-3"
    >
      <h5 class="h5 mb-0">{{ lang.modal.delete.title }}</h5>
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
      <div v-if="selectedItems.length">
        <selected-file-list></selected-file-list>
      </div>
      <div v-else>
        <span class="text-danger">{{ lang.modal.delete.noSelected }}</span>
      </div>
    </v-card-text>
    <v-divider class="m-0"></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn depressed v-on:click="deleteItems" dark color="secondary">
        {{ lang.modal.delete.title }}
      </v-btn>
      <v-btn text v-on:click="hideModal">
        {{ lang.btn.cancel }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import SelectedFileList from "../additions/SelectedFileList.vue";
import modal from "./../mixins/modal";
import translate from "./../../../mixins/translate";

export default {
  name: "Delete",
  mixins: [modal, translate],
  components: { SelectedFileList },
  computed: {
    /**
     * Files and folders for deleting
     * @returns {*}
     */
    selectedItems() {
      return this.$store.getters["fm/selectedItems"];
    }
  },
  methods: {
    /**
     * Delete selected directories and files
     */
    deleteItems() {
      // create items list for delete
      const items = this.selectedItems.map(item => ({
        path: item.path,
        type: item.type
      }));

      this.$store.dispatch("fm/delete", items).then(() => {
        // close modal window
        this.hideModal();
      });
    }
  }
};
</script>
