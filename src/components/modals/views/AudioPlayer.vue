<template>
  <v-card class="modal-content fm-modal-audio-player">
    <v-card-title
      class="d-flex flex-row justify-content-between align-center py-3"
    >
      <h5 class="h5 mb-0">{{ lang.modal.audioPlayer.title }}</h5>
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
      <audio ref="fmAudio" controls></audio>
      <v-divider class="mt-4 mb-0"></v-divider>
      <v-list-item
        v-bind:class="playingIndex === index ? 'bg-gray-200' : ''"
        v-for="(item, index) in audioFiles"
        v-bind:key="index"
      >
        <v-list-item-title>
          <span class="text-muted pr-2">{{ index }}.</span>
          {{ item.basename }}
        </v-list-item-title>
        <template v-if="playingIndex === index">
          <v-list-item-action>
            <div v-if="status === 'playing'">
              <v-icon v-on:click="togglePlay()">mdi-pause</v-icon>
            </div>
            <div v-else>
              <v-icon v-on:click="togglePlay()">mdi-play</v-icon>
            </div>
          </v-list-item-action>
        </template>
        <template v-else>
          <v-list-item-action>
            <div>
              <v-icon v-on:click="selectTrack(index)">mdi-play</v-icon>
            </div>
          </v-list-item-action>
        </template>
      </v-list-item>
      <!-- <div class="d-flex justify-content-between align-center py-2 px-2"
              v-bind:class="playingIndex === index ? 'bg-light' : ''"
              v-for="(item, index) in audioFiles"
              v-bind:key="index">
              <div class="w-75 text-truncate">
                  <span class="text-muted pr-2">{{ index }}.</span>
                  {{ item.basename }}
              </div>
              <template v-if="playingIndex === index">
                  <div v-if="status === 'playing'">
                      <v-icon v-on:click="togglePlay()">mdi-pause</v-icon>
                  </div>
                  <div v-else>
                      <v-icon v-on:click="togglePlay()">mdi-play</v-icon>
                  </div>
              </template>
              <template v-else>
                  <div>
                      <v-icon v-on:click="selectTrack(index)">mdi-play</v-icon>
                  </div>
              </template>
          </div> -->
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
      player: {},
      playingIndex: 0,
      status: "paused"
    };
  },
  mounted() {
    // initiate player
    this.player = new Plyr(this.$refs.fmAudio, {
      speed: {
        selected: 1,
        options: [0.5, 1, 1.5]
      }
    });

    // select first item in the list
    this.setSource(this.playingIndex);

    // add event listeners
    this.player.on("play", () => {
      this.status = "playing";
    });

    this.player.on("pause", () => {
      this.status = "paused";
    });

    this.player.on("ended", () => {
      if (this.audioFiles.length > this.playingIndex + 1) {
        // play next track
        this.selectTrack(this.playingIndex + 1);
      }
    });
  },
  beforeDestroy() {
    // destroy player
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
     * Audio files list
     * @returns {*}
     */
    audioFiles() {
      return this.$store.getters["fm/selectedItems"];
    }
  },
  methods: {
    /**
     * Select another audio track
     * @param index
     */
    selectTrack(index) {
      if (this.player.playing) {
        // stop playing
        this.player.stop();
      }
      // load new source
      this.setSource(index);
      // start play
      this.player.play();

      this.playingIndex = index;
    },

    /**
     * Set source to audio player
     * @param index
     */
    setSource(index) {
      this.player.source = {
        type: "audio",
        title: this.audioFiles[index].filename,
        sources: [
          {
            src: `${
              this.$store.getters["fm/settings/baseUrl"]
            }stream-file?disk=${this.selectedDisk}&path=${encodeURIComponent(
              this.audioFiles[index].path
            )}`,
            type: `audio/${this.audioFiles[index].extension}`
          }
        ]
      };
    },

    /**
     * Play/Pause
     */
    togglePlay() {
      this.player.togglePlay();
    }
  }
};
</script>

<style lang="scss">
.fm-modal-audio-player {
  .fas.fa-play {
    color: gray;
    opacity: 0.1;
    cursor: pointer;

    &:hover {
      opacity: 0.5;
    }

    &.active {
      opacity: 1;
      color: deepskyblue;
    }
  }

  .fas.fa-pause {
    color: gray;
    opacity: 0.5;
    cursor: pointer;
  }
}
</style>
