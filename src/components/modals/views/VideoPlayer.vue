<template>
  <v-card class="modal-content fm-modal-video-player">
    <v-card-title
      class="d-flex flex-row justify-content-between align-center py-3"
    >
      <h5 class="h5 truncate w-4/5 mb-0">{{ videoFile.basename }}</h5>
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
      <video ref="fmVideo" controls></video>
    </v-card-text>
  </v-card>
</template>

<script>
import Plyr from "plyr";
import modal from "./../mixins/modal";
import translate from "./../../../mixins/translate";

export default {
  name: "Player",
  mixins: [modal, translate],
  data() {
    return {
      player: {}
    };
  },
  mounted() {
    // initiate video player
    this.player = new Plyr(this.$refs.fmVideo);
    // load source
    this.player.source = {
      type: "video",
      title: this.videoFile.filename,
      sources: [
        {
          src: `${this.$store.getters["fm/settings/baseUrl"]}stream-file?disk=${
            this.selectedDisk
          }&path=${encodeURIComponent(this.videoFile.path)}`,
          type: `audio/${this.videoFile.extension}`
        }
      ]
    };
  },
  beforeDestroy() {
    this.player.destroy();
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
     * Video file
     * @returns {*}
     */
    videoFile() {
      return this.$store.getters["fm/selectedItems"][0];
    }
  },
  methods: {}
};
</script>

<style lang="scss">
.fm-modal-video-player {
}
</style>
