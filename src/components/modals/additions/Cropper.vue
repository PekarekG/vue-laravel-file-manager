<template>
    <v-container fluid class="fm-additions-cropper pa-0">
        <v-row v-bind:style="{'max-height': maxHeight+'px'}">
            <v-col cols="12" sm="9" class="cropper-block pa-0">
                <img v-bind:src="imgSrc"
                     ref="fmCropper"
                     v-bind:alt="selectedItem.basename">
            </v-col>
            <v-col cols="12" sm="3" class="pl-0 pt-0">
                <div class="cropper-preview mx-auto"></div>
                <div class="cropper-data">

                    <v-text-field
                      outlined
                      dense
                      label="X koordináta"
                      suffix="px"
                      v-model.number="x"
                      id="dataX"
                    ></v-text-field>

                    <v-text-field
                      outlined
                      dense
                      label="Y koordináta"
                      suffix="px"
                      v-model.number="y"
                      id="dataY"
                    ></v-text-field>

                    <v-text-field
                      outlined
                      dense
                      label="Szélesség"
                      suffix="px"
                      v-model.number="width"
                      id="dataWidth"
                    ></v-text-field>

                    <v-text-field
                      outlined
                      dense
                      label="Magasság"
                      suffix="px"
                      v-model.number="height"
                      id="dataHeight"
                    ></v-text-field>

                    <v-text-field
                      outlined
                      dense
                      label="Forgatás"
                      suffix="fok"
                      v-model.number="rotate"
                      id="dataRotate"
                    ></v-text-field>

                    <v-text-field
                      outlined
                      dense
                      label="X tengely"
                      suffix="×"
                      v-model.number="scaleX"
                      id="dataScaleX"
                    ></v-text-field>
                    
                    <v-text-field
                      outlined
                      dense
                      label="Y tengely"
                      suffix="×"
                      v-model.number="scaleY"
                      id="dataScaleY"
                    ></v-text-field>

                    <v-btn depressed dark block color="secondary" v-on:click="setData()">
                      {{ lang.modal.cropper.apply }}
                    </v-btn>  
                </div>
            </v-col>
        </v-row>
        <v-divider class="m-0"></v-divider>
        <v-card-actions class="d-flex justify-content-between">
          <v-btn-toggle dense class="mr-2" aria-label="Scale">
            <v-btn v-on:click="cropMove(-10, 0)">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            <v-btn v-on:click="cropMove(10, 0)">
              <v-icon>mdi-arrow-right</v-icon>
            </v-btn>
            <v-btn v-on:click="cropMove(0, -10)">
              <v-icon>mdi-arrow-up</v-icon>
            </v-btn>
            <v-btn v-on:click="cropMove(0, 10)">
              <v-icon>mdi-arrow-down</v-icon>
            </v-btn>
          </v-btn-toggle>

          <v-btn-toggle dense class="mr-2" aria-label="Scale">
            <v-btn v-on:click="cropScaleX()">
              <v-icon>mdi-arrow-left-right</v-icon>
            </v-btn>
            <v-btn v-on:click="cropScaleY()">
              <v-icon>mdi-arrow-up-down</v-icon>
            </v-btn>
          </v-btn-toggle>

          <v-btn-toggle dense class="mr-2" aria-label="Rotate">
            <v-btn v-on:click="cropRotate(-45)">
              <v-icon>mdi-undo</v-icon>
            </v-btn>
            <v-btn v-on:click="cropRotate(45)">
              <v-icon>mdi-redo</v-icon>
            </v-btn>
          </v-btn-toggle>

          <v-btn-toggle dense class="mr-2" aria-label="Rotate">
            <v-btn v-on:click="cropZoom(0.1)">
              <v-icon>mdi-magnify-plus-outline</v-icon>
            </v-btn>
            <v-btn v-on:click="cropZoom(-0.1)">
              <v-icon>mdi-magnify-minus-outline</v-icon>
            </v-btn>
          </v-btn-toggle>

            <v-tooltip top attach=".v-card__actions">
              <template v-slot:activator="{ on, attrs }">
                <v-btn-toggle dense class="mr-2">
                      <v-btn 
                      v-on:click="cropReset()"
                      v-bind="attrs"
                      v-on="on"
                      >
                        <v-icon>mdi-refresh</v-icon>
                      </v-btn>
                </v-btn-toggle>
              </template>
              <span>{{ lang.modal.cropper.reset }}</span>
            </v-tooltip>
          <v-spacer></v-spacer>
          <v-btn depressed dark color="secondary" v-on:click="cropSave()">
            {{ lang.modal.cropper.save }}
          </v-btn>
            <v-btn text v-on:click="$emit('closeCropper')">
              {{ lang.btn.back }}
            </v-btn>
        </v-card-actions>
    </v-container>
</template>

<script>
import Cropper from 'cropperjs';
import translate from './../../../mixins/translate';

export default {
  name: 'Cropper',
  mixins: [translate],
  props: {
    imgSrc: { required: true },
    maxHeight: { type: Number, required: true },
  },
  data() {
    return {
      cropper: {},
      height: 0,
      width: 0,
      x: 0,
      y: 0,
      rotate: 0,
      scaleX: 1,
      scaleY: 1,
    };
  },
  mounted() {
    // set cropper instance
    this.cropper = new Cropper(this.$refs.fmCropper, {
      preview: '.cropper-preview',
      crop: (e) => {
        this.x = Math.round(e.detail.x);
        this.y = Math.round(e.detail.y);
        this.height = Math.round(e.detail.height);
        this.width = Math.round(e.detail.width);
        this.rotate = typeof e.detail.rotate !== 'undefined' ? e.detail.rotate : '';
        this.scaleX = typeof e.detail.scaleX !== 'undefined' ? e.detail.scaleX : '';
        this.scaleY = typeof e.detail.scaleY !== 'undefined' ? e.detail.scaleY : '';
      },
    });
  },
  beforeDestroy() {
    this.cropper.destroy();
  },
  computed: {
    /**
       * Selected file
       * @returns {*}
       */
    selectedItem() {
      return this.$store.getters['fm/selectedItems'][0];
    },
  },
  methods: {
    /**
     * Move
     * @param x
     * @param y
     */
    cropMove(x, y) {
      this.cropper.move(x, y);
    },

    /**
     * Scale - mirroring Y
     */
    cropScaleY() {
      this.cropper.scale(1, this.cropper.getData().scaleY === 1 ? -1 : 1);
    },

    /**
     * Scale - mirroring X
     */
    cropScaleX() {
      this.cropper.scale(this.cropper.getData().scaleX === 1 ? -1 : 1, 1);
    },

    /**
     * Rotate
     * @param grade
     */
    cropRotate(grade) {
      this.cropper.rotate(grade);
    },

    /**
     * Zoom
     * @param ratio
     */
    cropZoom(ratio) {
      this.cropper.zoom(ratio);
    },

    /**
     * Reset
     */
    cropReset() {
      this.cropper.reset();
    },

    /**
     * Set data from form
     */
    setData() {
      this.cropper.setData({
        x: this.x,
        y: this.y,
        width: this.width,
        height: this.height,
        rotate: this.rotate,
        scaleX: this.scaleX,
        scaleY: this.scaleY,
      });
    },

    /**
     * Save cropped image
     */
    cropSave() {
      this.cropper.getCroppedCanvas().toBlob(
        (blob) => {
          const formData = new FormData();
          // add disk name
          formData.append('disk', this.$store.getters['fm/selectedDisk']);
          // add path
          formData.append('path', this.selectedItem.dirname);
          // new image
          formData.append('file', blob, this.selectedItem.basename);

          this.$store.dispatch('fm/updateFile', formData).then((response) => {
          // if file updated successfully
            if (response.data.result.status === 'success') {
            // close cropper
              this.$emit('closeCropper');
            }
          });
        },
        this.selectedItem.extension !== 'jpg'
          ? `image/${this.selectedItem.extension}`
          : 'image/jpeg',
      );
    },
  },
};
</script>

<style lang="scss">
    @import "~cropperjs/dist/cropper.css";

    .fm-additions-cropper {
        overflow: hidden;

        & > .row {
            flex-wrap: nowrap;
        }

        .cropper-block {
            overflow: hidden;

            img {
                max-width: 100%;
            }
        }

        .col-sm-3 {
            overflow: auto;

            &::-webkit-scrollbar {
                display: none;
            }
        }

        .cropper-preview {
            margin-bottom: 1rem;
            overflow: hidden;
            height: 200px;

            img {
                max-width: 100%;
            }
        }

        .cropper-data {
            padding-left: 1rem;
            padding-right: 1rem;

            & > .input-group {
                margin-bottom: .5rem;
            }

            .input-group-prepend .input-group-text {
                min-width: 4rem;
            }

            .input-group-append .input-group-text {
                min-width: 3rem;
            }
        }

        & > .d-flex {
            padding: 1rem;
            border-top: 1px solid #e9ecef;
        }
    }
</style>
