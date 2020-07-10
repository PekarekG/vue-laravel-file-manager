<template>
  <div class="fm-table">
    <v-simple-table fixed-header>
      <template>
        <thead>
          <tr>
            <th
              class="text-left w-50 cursor-pointer"
              v-on:click="sortBy('name')"
            >
              <div class="d-flex items-center">
                <span class="text-sm">{{ lang.manager.table.name }}</span>
                <template v-if="sortSettings.field === 'name'">
                  <v-icon small v-show="sortSettings.direction === 'down'"
                    >mdi-arrow-down</v-icon
                  >
                  <v-icon small v-show="sortSettings.direction === 'up'"
                    >mdi-arrow-up</v-icon
                  >
                </template>
              </div>
            </th>
            <th
              class="text-left w-15 cursor-pointer"
              v-on:click="sortBy('type')"
            >
              <div class="d-flex items-center">
                <span class="text-sm">{{ lang.manager.table.type }}</span>
                <template v-if="sortSettings.field === 'type'">
                  <v-icon small v-show="sortSettings.direction === 'down'"
                    >mdi-arrow-down</v-icon
                  >
                  <v-icon small v-show="sortSettings.direction === 'up'"
                    >mdi-arrow-up</v-icon
                  >
                </template>
              </div>
            </th>
            <th
              class="text-left w-20 cursor-pointer"
              v-on:click="sortBy('date')"
            >
              <div class="d-flex items-center">
                <span class="text-sm">{{ lang.manager.table.date }}</span>
                <template v-if="sortSettings.field === 'date'">
                  <v-icon small v-show="sortSettings.direction === 'down'"
                    >mdi-arrow-down</v-icon
                  >
                  <v-icon small v-show="sortSettings.direction === 'up'"
                    >mdi-arrow-up</v-icon
                  >
                </template>
              </div>
            </th>
            <th
              class="text-left w-15 cursor-pointer"
              v-on:click="sortBy('size')"
            >
              <div class="d-flex items-center">
                <span class="text-sm">{{ lang.manager.table.size }}</span>
                <template v-if="sortSettings.field === 'size'">
                  <v-icon small v-show="sortSettings.direction === 'down'"
                    >mdi-arrow-down</v-icon
                  >
                  <v-icon small v-show="sortSettings.direction === 'up'"
                    >mdi-arrow-up</v-icon
                  >
                </template>
              </div>
            </th>
          </tr>
        </thead>
        <draggable
          tag="tbody"
          :sort="false"
          forceFallback="true"
          @start="drag = true"
          @end="drag = false"
        >
          <tr v-if="!isRootPath" class="cursor-pointer">
            <td v-on:click="levelUp">
              <div class="d-flex items-center">
                <v-icon class="mr-4">mdi-subdirectory-arrow-left</v-icon>
                <span>[...]</span>
              </div>
            </td>
            <td v-on:click="levelUp"></td>
            <td v-on:click="levelUp"></td>
            <td v-on:click="levelUp"></td>
          </tr>
          <tr
            v-for="(directory, index) in directories"
            v-bind:key="`d-${index}`"
            v-bind:class="{
              'table-info': checkSelect('directories', directory.path)
            }"
            v-on:click="selectItem('directories', directory.path, $event)"
            v-on:contextmenu.prevent="contextMenu(directory, $event)"
            class="cursor-pointer"
          >
            <v-lazy tag="td">
              <table>
                <tr>
                  <td
                    class="fm-content-item unselectable"
                    v-bind:class="
                      acl && directory.acl === 0 ? 'text-hidden' : ''
                    "
                    v-on:dblclick="selectDirectory(directory.path)"
                  >
                    <div class="d-flex items-center">
                      <v-icon class="mr-4 cursor-pointer"
                        >mdi-folder-outline</v-icon
                      >
                      <span class="cursor-pointer hover:underline">
                        {{ directory.basename }}
                      </span>
                    </div>
                  </td>
                </tr>
              </table>
            </v-lazy>
            <v-lazy tag="td">
              <table>
                <tr>
                  <td>{{ lang.manager.table.folder }}</td>
                </tr>
              </table>
            </v-lazy>
            <v-lazy tag="td">
              <table>
                <tr>
                  <td>{{ timestampToDate(directory.timestamp) }}</td>
                </tr>
              </table>
            </v-lazy>
            <v-lazy tag="td">
              <table>
                <tr>
                  <td>&ndash;</td>
                </tr>
              </table>
            </v-lazy>
          </tr>
          <tr
            v-for="(file, index) in files"
            v-bind:key="`f-${index}`"
            v-bind:class="{ 'table-info': checkSelect('files', file.path) }"
            v-on:click="selectItem('files', file.path, $event)"
            v-on:dblclick="selectAction(file.path, file.extension)"
            v-on:contextmenu.prevent="contextMenu(file, $event)"
            class="cursor-pointer"
          >
            <v-lazy tag="td">
              <table>
                <tr>
                  <td
                    class="fm-content-item unselectable"
                    v-bind:class="acl && file.acl === 0 ? 'text-hidden' : ''"
                  >
                    <div class="d-flex items-center">
                      <v-icon class="mr-4">
                        {{ extensionToIcon(file.extension) }}
                      </v-icon>
                      <span class="hover:underline">
                        {{ file.filename ? file.filename : file.basename }}
                      </span>
                    </div>
                  </td>
                </tr>
              </table>
            </v-lazy>
            <v-lazy tag="td">
              <table>
                <tr>
                  <td>{{ file.extension }}</td>
                </tr>
              </table>
            </v-lazy>
            <v-lazy tag="td">
              <table>
                <tr>
                  <td>{{ timestampToDate(file.timestamp) }}</td>
                </tr>
              </table>
            </v-lazy>
            <v-lazy tag="td">
              <table>
                <tr>
                  <td>{{ bytesToHuman(file.size) }}</td>
                </tr>
              </table>
            </v-lazy>
          </tr>
        </draggable>
      </template>
    </v-simple-table>
  </div>
</template>

<script>
import translate from "./../../mixins/translate";
import helper from "./../../mixins/helper";
import managerHelper from "./mixins/manager";
import draggable from "vuedraggable";

export default {
  name: "table-view",
  components: {
    draggable
  },
  mixins: [translate, helper, managerHelper],
  props: {
    manager: { type: String, required: true }
  },
  computed: {
    /**
     * Sort settings
     * @returns {*}
     */
    sortSettings() {
      return this.$store.state.fm[this.manager].sort;
    }
  },
  methods: {
    /**
     * Sort by field
     * @param field
     */
    sortBy(field) {
      this.$store.dispatch(`fm/${this.manager}/sortBy`, {
        field,
        direction: null
      });
    }
  }
};
</script>

<style lang="scss">
.fm-table {
  tbody tr {
    height: 3.5rem;
  }

  tbody tr:hover {
    background-color: #f4f6fa !important;
  }

  tbody tr.table-info {
    background-color: #f4f6fa;
  }

  .w-15 {
    width: 15%;
  }

  .w-20 {
    width: 20%;
  }

  .w-50 {
    width: 50%;
  }

  .text-hidden {
    color: #cdcdcd;
  }

  .sortable-ghost {
    background-color: red;
    opacity: 1;
  }
  .sortable-chosen {
    background-color: #f4f6fa;
    opacity: 1;
  }
  .sortable-drag {
    background-color: #fff;
    opacity: 1 !important;
    width: auto !important;
    border-radius: 0.5rem;
    box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2),
      0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12);
    transform: scale(1.02);
    transform-origin: 15% 40%;
    width: auto;
  }
}
</style>
