<template>
  <div>
    <my-header></my-header>
    <page-main></page-main>
  </div>
</template>

<script>
  /*eslint-disable*/
  import myHeader from './components/myheader'
  import pageMain from  './components/page-main'
  export default {
    name: 'Mainpage',
    data() {
      return {}
    },
    components: {
      myHeader,
      pageMain
    }
  }
</script>

<style scoped>

</style>
