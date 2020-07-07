<template>
  <v-lazy
    :options="{
      threshold: 0.5
    }"
    height="160"
    transition="fade-transition"
  >
    <v-icon class="fm-item-icon d-flex self-center h-full" v-if="!src"
      >mdi-file-image-outline</v-icon
    >
    <v-img
      v-else
      v-bind:src="src"
      v-bind:alt="file.filename"
      height="160"
      width="100%"
    >
      <template v-slot:placeholder>
        <v-row class="fill-height ma-0" align="center" justify="center">
          <v-progress-circular indeterminate color="grey"></v-progress-circular>
        </v-row>
      </template>
    </v-img>
    <!-- <img
      v-else
      v-bind:src="src"
      v-bind:alt="file.filename"
      class="img-thumbnail"
    /> -->
  </v-lazy>
</template>

<script>
import GET from "./../../http/get";

export default {
  name: "Thumbnail",
  data() {
    return {
      src: ""
    };
  },
  props: {
    disk: {
      type: String,
      required: true
    },
    file: {
      type: Object,
      required: true
    }
  },
  watch: {
    "file.timestamp": "loadImage"
  },
  mounted() {
    if (window.IntersectionObserver) {
      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              this.loadImage();
              obs.unobserve(this.$el);
            }
          });
        },
        {
          root: null,
          threshold: "0.5"
        }
      );

      // add observer for template
      observer.observe(this.$el);
    } else {
      this.loadImage();
    }
  },
  computed: {
    /**
     * Authorization required
     * @return {*}
     */
    auth() {
      return this.$store.getters["fm/settings/authHeader"];
    }
  },
  methods: {
    /**
     * Load image
     */
    loadImage() {
      // if authorization required
      if (this.auth) {
        GET.thumbnail(this.disk, this.file.path).then(response => {
          const mimeType = response.headers["content-type"].toLowerCase();
          const imgBase64 = Buffer.from(response.data, "binary").toString(
            "base64"
          );

          this.src = `data:${mimeType};base64,${imgBase64}`;
        });
      } else {
        this.src = `${
          this.$store.getters["fm/settings/baseUrl"]
        }thumbnails?disk=${this.disk}&path=${encodeURIComponent(
          this.file.path
        )}&v=${this.file.timestamp}`;
      }
    }
  }
};
</script>

<style lang="scss"></style>
