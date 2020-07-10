<template>
  <v-card class="modal-content fm-modal-properties">
    <v-card-title
      class="d-flex flex-row justify-content-between align-center py-3"
    >
      <h5 class="h5 mb-0">{{ lang.modal.properties.title }}</h5>
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
        <v-list-item-avatar>
          <v-icon>mdi-server-network</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title
            >{{ lang.modal.properties.disk }}:</v-list-item-title
          >
          <v-list-item-subtitle>{{ selectedDisk }}</v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <v-btn
            icon
            small
            v-on:click="copyToClipboard(selectedDisk)"
            v-bind:title="lang.clipboard.copy"
          >
            <v-icon small color="grey lighten-1">mdi-content-copy</v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
      <v-list-item class="px-0">
        <v-list-item-avatar>
          <v-icon>mdi-form-textbox</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title
            >{{ lang.modal.properties.name }}:</v-list-item-title
          >
          <v-list-item-subtitle>{{
            selectedItem.basename
          }}</v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <v-btn
            icon
            small
            v-on:click="copyToClipboard(selectedItem.basename)"
            v-bind:title="lang.clipboard.copy"
          >
            <v-icon small color="grey lighten-1">mdi-content-copy</v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
      <v-list-item class="px-0">
        <v-list-item-avatar>
          <v-icon>mdi-file-tree</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title
            >{{ lang.modal.properties.path }}:</v-list-item-title
          >
          <v-list-item-subtitle>{{ selectedItem.path }}</v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <v-btn
            icon
            small
            v-on:click="copyToClipboard(selectedItem.path)"
            v-bind:title="lang.clipboard.copy"
          >
            <v-icon small color="grey lighten-1">mdi-content-copy</v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
      <template v-if="selectedItem.type === 'file'">
        <v-list-item class="px-0">
          <v-list-item-avatar>
            <v-icon>mdi-harddisk</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title
              >{{ lang.modal.properties.size }}:</v-list-item-title
            >
            <v-list-item-subtitle>{{
              bytesToHuman(selectedItem.size)
            }}</v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn
              icon
              small
              v-on:click="copyToClipboard(bytesToHuman(selectedItem.size))"
              v-bind:title="lang.clipboard.copy"
            >
              <v-icon small color="grey lighten-1">mdi-content-copy</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
        <v-list-item class="px-0">
          <v-list-item-avatar>
            <v-icon>mdi-link-variant</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title
              >{{ lang.modal.properties.url }}:</v-list-item-title
            >
            <v-list-item-subtitle v-if="url">{{ url }}</v-list-item-subtitle>
            <v-list-item-subtitle v-else>
              <div
                class="d-flex items-center cursor-pointer"
                v-on:click="getUrl"
              >
                <v-icon class="mr-1" x-small>mdi-link-variant</v-icon>
                <span>URL lekérése</span>
              </div>
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn
              icon
              small
              v-on:click="copyToClipboard(url)"
              v-bind:title="lang.clipboard.copy"
            >
              <v-icon small color="grey lighten-1">mdi-content-copy</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </template>
      <template v-if="selectedItem.hasOwnProperty('timestamp')">
        <v-list-item class="px-0">
          <v-list-item-avatar>
            <v-icon>mdi-calendar-edit</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title
              >{{ lang.modal.properties.modified }}:</v-list-item-title
            >
            <v-list-item-subtitle>{{
              timestampToDate(selectedItem.timestamp)
            }}</v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn
              icon
              small
              v-on:click="
                copyToClipboard(timestampToDate(selectedItem.timestamp))
              "
              v-bind:title="lang.clipboard.copy"
            >
              <v-icon small color="grey lighten-1">mdi-content-copy</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </template>
      <template v-if="selectedItem.hasOwnProperty('acl')">
        <v-list-item class="px-0">
          <v-list-item-avatar>
            <v-icon>mdi-account-outline</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title
              >{{ lang.modal.properties.access }}:</v-list-item-title
            >
            <v-list-item-subtitle>{{
              lang.modal.properties["access_" + selectedItem.acl]
            }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-card-text>
  </v-card>
</template>

<script>
import modal from "./../mixins/modal";
import translate from "./../../../mixins/translate";
import helper from "./../../../mixins/helper";
import EventBus from "./../../../eventBus";

export default {
  name: "Properties",
  mixins: [modal, translate, helper],
  data() {
    return {
      url: null
    };
  },
  computed: {
    /**
     * Selected disk
     * @returns {*}
     */
    selectedDisk() {
      return this.$store.getters["fm/selectedDisk"];
    },

    /**
     * Selected file
     * @returns {*}
     */
    selectedItem() {
      return this.$store.getters["fm/selectedItems"][0];
    }
  },
  methods: {
    /**
     * Get URL
     */
    getUrl() {
      this.$store
        .dispatch("fm/url", {
          disk: this.selectedDisk,
          path: this.selectedItem.path
        })
        .then(response => {
          if (response.data.result.status === "success") {
            this.url = response.data.url;
          }
        });
    },

    /**
     * Copy text to clipboard
     * @param text
     */
    copyToClipboard(text) {
      // create input
      const copyInputHelper = document.createElement("input");
      copyInputHelper.className = "copyInputHelper";
      document.body.appendChild(copyInputHelper);
      // add text
      copyInputHelper.value = text;
      copyInputHelper.select();
      // copy text to clipboard
      document.execCommand("copy");
      // clear
      document.body.removeChild(copyInputHelper);

      // Notification
      EventBus.$emit("addNotification", {
        status: "success",
        message: this.lang.notifications.copyToClipboard
      });
    }
  }
};
</script>

<style lang="scss">
.fm-modal-properties .modal-body {
  .row {
    margin-bottom: 0.3rem;
    padding-top: 0.3rem;
    padding-bottom: 0.3rem;

    .fa-copy {
      padding-top: 0.2rem;
      display: none;
      cursor: pointer;
    }

    &:hover {
      background-color: #f8f9fa;

      & .fa-copy {
        display: block;
      }
    }
  }

  .col-2 {
    font-weight: bold;
  }

  .col-9 {
    word-wrap: break-word;
  }
}
</style>
