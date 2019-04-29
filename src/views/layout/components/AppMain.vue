<template>
  <section class="app-main" style="min-height: 100%">
    <transition name="fade-scale">
      <searchPanel v-show="ifShowSearch"></searchPanel>
    </transition>
    <transition name="fade-scale">
      <div v-show="!ifShowSearch">
        <transition name="fade-transform" mode="out-in">
          <keep-alive :include="cachedViews">
            <router-view :key="$route.path"></router-view>
          </keep-alive>
        </transition>
      </div>
    </transition>
  </section>
</template>

<script>
import searchPanel from '../../mainpage/components/searchPanel'
export default {
  name: 'AppMain',
  components: {
    searchPanel
  },
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    ifShowSearch() {
      return this.$store.state.app.ifSearch
    }
    // key() {
    //   return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    // }
  }
}
</script>
