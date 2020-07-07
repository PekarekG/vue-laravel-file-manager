<template>
  <v-card class="modal-content fm-modal-preview">
    <v-card-title
      class="d-flex flex-row justify-content-between align-center py-3"
    >
      <h5 class="h5 mb-0">{{ selectedItem.basename }}</h5>
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
    <v-card-text class="pa-0 d-flex">
      <template v-if="showCropperModule">
        <cropper-module
          v-bind:imgSrc="imgSrc"
          v-bind:maxHeight="maxHeight"
          v-on:closeCropper="closeCropper"
        ></cropper-module>
      </template>
      <transition v-else name="fade" mode="out-in">
        <i
          v-if="!imgSrc"
          class="fas fa-spinner fa-spin fa-5x p-5 text-muted"
        ></i>
        <img
          v-else
          v-bind:src="imgSrc"
          v-bind:alt="selectedItem.basename"
          v-bind:style="{ 'max-height': maxHeight + 'px' }"
          class="m-auto"
        />
        />
      </transition>
    </v-card-text>
    <v-divider class="m-0"></v-divider>
    <v-card-actions v-if="showFooter">
      <v-tooltip right attach=".modal-content">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            v-bind:title="lang.modal.cropper.title"
            v-on:click="showCropperModule = true"
            dark
            v-bind="attrs"
            v-on="on"
            color="secondary"
          >
            <v-icon>mdi-crop</v-icon>
          </v-btn>
        </template>
        <span>Szerkesztés</span>
      </v-tooltip>
      <v-spacer></v-spacer>
      <v-btn text v-on:click="hideModal">
        {{ lang.btn.cancel }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import CropperModule from "./../additions/Cropper.vue";
import modal from "./../mixins/modal";
import translate from "./../../../mixins/translate";
import helper from "./../../../mixins/helper";
import GET from "./../../../http/get";

export default {
  name: "Preview",
  mixins: [modal, translate, helper],
  components: { CropperModule },
  data() {
    return {
      showCropperModule: false,
      imgSrc: ""
    };
  },
  created() {
    this.loadImage();
  },
  computed: {
    /**
     * Authorization required
     * @return {*}
     */
    auth() {
      return this.$store.getters["fm/settings/authHeader"];
    },

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
    },

    /**
     * Show modal footer
     * @return boolean
     */
    showFooter() {
      return (
        this.canCrop(this.selectedItem.extension) && !this.showCropperModule
      );
    },

    /**
     * Calculate the max height for image
     * @returns {number}
     */
    maxHeight() {
      if (this.$store.state.fm.modal.modalBlockHeight) {
        return this.$store.state.fm.modal.modalBlockHeight - 170;
      }

      return 300;
    }
  },
  methods: {
    /**
     * Can we crop this image?
     * @param extension
     * @returns {boolean}
     */
    canCrop(extension) {
      return this.$store.state.fm.settings.cropExtensions.includes(
        extension.toLowerCase()
      );
    },

    /**
     * Close cropper
     */
    closeCropper() {
      this.showCropperModule = false;
      this.loadImage();
    },

    /**
     * Load image
     */
    loadImage() {
      // if authorization required
      if (this.auth) {
        GET.preview(this.selectedDisk, this.selectedItem.path).then(
          response => {
            const mimeType = response.headers["content-type"].toLowerCase();
            const imgBase64 = Buffer.from(response.data, "binary").toString(
              "base64"
            );

            this.imgSrc = `data:${mimeType};base64,${imgBase64}`;
          }
        );
      } else {
        this.imgSrc = `${
          this.$store.getters["fm/settings/baseUrl"]
        }preview?disk=${this.selectedDisk}&path=${encodeURIComponent(
          this.selectedItem.path
        )}&v=${this.selectedItem.timestamp}`;
      }
    }
  }
};
</script>

<style lang="scss">
.fm-modal-preview {
  img {
    max-width: 100%;
    height: auto;
    max-height: 100% !important;
  }

  /* .v-card__text img {
    max-height: 100% !important;
  } */

  & > .d-flex {
    padding: 1rem;
    border-top: 1px solid #e9ecef;
  }
}
</style>
