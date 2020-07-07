<template>
  <v-card class="modal-content fm-modal-upload">
    <v-card-title
      class="d-flex flex-row justify-content-between align-center py-3"
    >
      <h5 class="h5 mb-0">{{ lang.modal.upload.title }}</h5>
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
    <v-card-text class="pb-0">
      <div class="fm-btn-wrapper mb-4" v-show="!progressBar">
        <v-btn depressed block dark color="secondary">{{
          lang.btn.uploadSelect
        }}</v-btn>
        <input
          type="file"
          multiple
          name="myfile"
          v-on:change="selectFiles($event)"
        />
      </div>
      <div class="fm-upload-list" v-if="countFiles">
        <v-list class="py-0">
          <v-list-item
            class="px-0"
            v-for="(item, index) in newFiles"
            v-bind:key="index"
          >
            <v-list-item-avatar class="mr-0">
              <v-icon>{{ mimeToIcon(item.type) }}</v-icon>
            </v-list-item-avatar>
            <v-list-item-title>
              <span class="body-2">{{ item.name }}</span>
            </v-list-item-title>
            <v-list-item-subtitle class="text-right">
              <span>{{ bytesToHuman(item.size) }}</span>
            </v-list-item-subtitle>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item class="px-0">
            <v-list-item-title>
              <span class="body-2"
                ><strong>{{ lang.modal.upload.selected }}</strong></span
              >
              <span>{{ newFiles.length }}</span>
            </v-list-item-title>
            <v-list-item-subtitle class="text-right">
              <strong>{{ lang.modal.upload.size }}</strong>
              <span>{{ allFilesSize }}</span>
            </v-list-item-subtitle>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item class="d-flex items-center justify-between px-0">
            <span class="body-2"
              ><strong>{{ lang.modal.upload.ifExist }}</strong></span
            >
            <v-radio-group class="ml-auto" v-model="overwrite" row>
              <v-radio
                id="uploadRadio1"
                name="uploadOptions"
                :label="lang.modal.upload.skip"
                :value="0"
              >
              </v-radio>
              <v-radio
                class="mr-0"
                id="uploadRadio2"
                name="uploadOptions"
                :label="lang.modal.upload.overwrite"
                :value="1"
              >
              </v-radio>
            </v-radio-group>
          </v-list-item>
        </v-list>
      </div>
      <div v-else>
        <v-alert outlined color="primary" class="text-center">
          {{ lang.modal.upload.noSelected }}
        </v-alert>
      </div>
      <div class="fm-upload-info">
        <!-- Progress Bar -->
        <div class="progress" v-show="countFiles">
          <v-progress-linear
            color="secondary"
            v-bind:value="progressBar"
            class="rounded-full"
          ></v-progress-linear>
          <!-- <div class="progress-bar progress-bar-striped bg-info" role="progressbar"
                         v-bind:aria-valuenow="progressBar"
                         aria-valuemin="0"
                         aria-valuemax="100"
                         v-bind:style="{width: progressBar + '%' }">
                        {{ progressBar }}%
                    </div> -->
        </div>
      </div>
    </v-card-text>
    <v-divider class="m-0"></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        depressed
        v-bind:class="[countFiles ? 'btn-info' : 'btn-light']"
        v-bind:disabled="!countFiles"
        v-on:click="uploadFiles"
        dark
        color="secondary"
      >
        {{ lang.btn.submit }}
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
  name: "Upload",
  mixins: [modal, translate, helper],
  data() {
    return {
      // selected files
      newFiles: [],

      // overwrite if exists
      overwrite: 0
    };
  },
  computed: {
    /**
     * Progress bar value - %
     * @returns {number}
     */
    progressBar() {
      return this.$store.state.fm.messages.actionProgress;
    },

    /**
     * Count of files selected for upload
     * @returns {number}
     */
    countFiles() {
      return this.newFiles.length;
    },

    /**
     * Calculate the size of all files
     * @returns {*|string}
     */
    allFilesSize() {
      let size = 0;

      for (let i = 0; i < this.newFiles.length; i += 1) {
        size += this.newFiles[i].size;
      }

      return this.bytesToHuman(size);
    }
  },
  methods: {
    /**
     * Select file or files
     * @param event
     */
    selectFiles(event) {
      // files selected?
      if (event.target.files.length === 0) {
        // no file selected
        this.newFiles = [];
      } else {
        // we have file or files
        this.newFiles = event.target.files;
      }
    },

    /**
     * Upload new files
     */
    uploadFiles() {
      // if files exists
      if (this.countFiles) {
        // upload files
        this.$store
          .dispatch("fm/upload", {
            files: this.newFiles,
            overwrite: this.overwrite
          })
          .then(response => {
            // if upload is successful
            if (response.data.result.status === "success") {
              // close modal window
              this.hideModal();
            }
          });
      }
    }
  }
};
</script>

<style lang="scss">
.fm-modal-upload {
  .fm-btn-wrapper {
    position: relative;
    overflow: hidden;
  }

  .fm-btn-wrapper input[type="file"] {
    font-size: 100px;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }

  .fm-upload-list .far {
    padding-right: 0.5rem;
  }

  .fm-upload-list .form-check-inline {
    margin-right: 0;
  }

  .fm-upload-info > .progress {
    margin-bottom: 1rem;
  }
}
</style>
