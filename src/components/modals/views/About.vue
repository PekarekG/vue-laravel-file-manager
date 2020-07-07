<template>
  <v-card class="modal-content fm-modal-about">
    <v-card-title
      class="d-flex flex-row justify-content-between align-center py-3"
    >
      <h5 class="h5 mb-0">{{ lang.modal.about.title }}</h5>
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
      <v-list-item class="px-0">
        <v-list-item-content>
          <v-list-item-title
            ><strong>{{ lang.modal.about.name }}</strong></v-list-item-title
          >
        </v-list-item-content>
      </v-list-item>
      <v-list-item class="px-0">
        <v-list-item-title>{{ lang.modal.about.version }}:</v-list-item-title>
        <v-list-item-subtitle>{{ version }}</v-list-item-subtitle>
      </v-list-item>
      <v-list-item class="px-0">
        <v-list-item-title>{{ lang.modal.about.developer }}:</v-list-item-title>
        <v-list-item-subtitle
          >Aleksandr Manekin (alexusmai@gmail.com)</v-list-item-subtitle
        >
      </v-list-item>
      <v-list-item class="px-0">
        <v-list-item-title>GitHub:</v-list-item-title>
        <v-list-item-subtitle
          ><a
            href="https://github.com/alexusmai/laravel-file-manager"
            target="_blank"
          >
            alexusmai/laravel-file-manager
          </a></v-list-item-subtitle
        >
      </v-list-item>
    </v-card-text>
  </v-card>
</template>

<script>
import modal from "./../mixins/modal";
import translate from "./../../../mixins/translate";

export default {
  name: "About",
  mixins: [modal, translate],
  computed: {
    /**
     * App version
     * @returns {*}
     */
    version() {
      return this.$store.state.fm.settings.version;
    }
  }
};
</script>
