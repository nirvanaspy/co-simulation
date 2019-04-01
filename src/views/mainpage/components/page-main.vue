<template>
  <section class="app-main" style="min-height: 100%">
    <!--<transition name="fade-transform" mode="out-in">-->
    <transition name="slipe-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="$route.path"></router-view>
      </keep-alive>
    </transition>
  </section>
</template>

<script>
  export default {
    name: 'page-main',
    computed: {
      cachedViews() {
        return this.$store.state.tagsView.cachedViews
      }
    }
  }
</script>

<style scoped>

</style>
