<template>
  <div
    ref="contextMenu"
    v-if="menuVisible"
    v-bind:style="menuStyle"
    v-on:blur="closeMenu"
    v-click-outside="onClickOutside"
    class="fm-context-menu rounded-lg elevation-4"
  >
    <v-list dense class="rounded-lg">
      <v-list-item-group
        v-for="(group, index) in menu"
        v-bind:key="`g-${index}`"
      >
        <v-list-item
          v-for="(item, index) in group"
          v-bind:key="`i-${index}`"
          v-if="showMenuItem(item.name)"
          v-on:click="menuAction(item.name)"
        >
          <v-list-item-icon class="mr-2">
            <v-icon small>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{
              lang.contextMenu[item.name]
            }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </div>
</template>

<script>
/* eslint-disable no-param-reassign */
import EventBus from "./../../eventBus";
import translate from "../../mixins/translate";
import contextMenu from "./mixins/contextMenu";
import contextMenuRules from "./mixins/contextMenuRules";
import contextMenuActions from "./mixins/contextMenuActions";

export default {
  name: "ContextMenu",
  mixins: [translate, contextMenu, contextMenuRules, contextMenuActions],
  data() {
    return {
      menuVisible: false,
      menuStyle: {
        top: 0,
        left: 0
      }
    };
  },
  mounted() {
    /**
     * Listen events
     * 'contextMenu'
     */
    EventBus.$on("contextMenu", event => this.showMenu(event));
  },
  computed: {
    /**
     * Context menu items
     * @returns {*}
     */
    menu() {
      return this.$store.state.fm.settings.contextMenu;
    }
  },
  methods: {
    /**
     * Show context menu
     * @param event
     */
    showMenu(event) {
      if (this.selectedItems) {
        this.menuVisible = true;

        // focus on menu
        this.$nextTick(() => {
          this.$refs.contextMenu.focus();
          // set menu params
          this.setMenu(event.pageY, event.pageX);
        });
      }
    },

    /**
     * Set context menu coordinates
     * @param top
     * @param left
     */
    setMenu(top, left) {
      // get parent el (.fm-body)
      const el = this.$refs.contextMenu.parentNode;

      // get parent el size
      const elSize = el.getBoundingClientRect();

      // actual coordinates of the block
      const elY = window.pageYOffset + elSize.top;
      const elX = window.pageXOffset + elSize.left;

      // calculate the preliminary coordinates
      let menuY = top - elY;
      let menuX = left - elX;

      // calculate max X and Y coordinates
      const maxY =
        elY + (el.offsetHeight - this.$refs.contextMenu.offsetHeight - 25);
      const maxX =
        elX + (el.offsetWidth - this.$refs.contextMenu.offsetWidth - 25);

      if (top > maxY) menuY = maxY - elY;
      if (left > maxX) menuX = maxX - elX;

      // set coordinates
      this.menuStyle.top = `${menuY}px`;
      this.menuStyle.left = `${menuX}px`;
    },

    /**
     * Close context menu
     */
    closeMenu() {
      this.menuVisible = false;
    },

    /**
     * Show context menu item
     * @param name
     * @returns {*}
     */
    showMenuItem(name) {
      if (Object.prototype.hasOwnProperty.call(this, `${name}Rule`)) {
        return this[`${name}Rule`]();
      }

      return false;
    },

    /**
     * Call actions when clicking the context menu
     * @param name
     */
    menuAction(name) {
      if (Object.prototype.hasOwnProperty.call(this, `${name}Action`)) {
        this[`${name}Action`]();
      }
      // close context menu
      this.closeMenu();
    },

    /**
     * Close context menu click outside
     * @param name
     */
    onClickOutside() {
      this.menuVisible = false;
    }
  }
};
</script>

<style lang="scss">
.fm-context-menu {
  position: absolute;
  z-index: 9997;
}
</style>
