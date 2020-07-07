<template>
  <div class="fm-content d-flex flex-column">
    <breadcrumb v-bind:manager="manager"></breadcrumb>
    <div class="fm-content-body">
      <table-view
        v-if="viewType === 'table'"
        v-bind:manager="manager"
      ></table-view>
      <grid-view v-else v-bind:manager="manager"></grid-view>
    </div>
  </div>
</template>

<script>
// Components
import Breadcrumb from "./Breadcrumb.vue";
import TableView from "./TableView.vue";
import GridView from "./GridView.vue";

export default {
  name: "Manager",
  components: {
    Breadcrumb,
    TableView,
    GridView
  },
  props: {
    manager: { type: String, required: true }
  },
  computed: {
    /**
     * view type - grid or table
     * @returns {default.computed.viewType|(function())|string}
     */
    viewType() {
      return this.$store.state.fm[this.manager].viewType;
    }
  }
};
</script>

<style lang="scss">
.fm-content {
  height: 100%;
  padding-left: 1rem;
  overflow: auto;
}
.fm-tree {
  height: 100%;
  overflow: auto;
}
</style>
