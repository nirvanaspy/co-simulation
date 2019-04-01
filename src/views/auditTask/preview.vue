<template>
  <div id="perviewBox">
    <img src="" alt="">
  </div>
</template>

<script>
  /*eslint-disable*/
  import Viewer from 'viewerjs'
  import 'viewerjs/dist/viewer.min.css'
  export default {
    name: 'preview',
    created() {
      this.$nextTick(() => {
        const viewbox = document.getElementById('previewBox')
        const viewer = new Viewer(viewbox, {
          url: 'data-original'
        });
      })


    }
  }
</script>

<style scoped>

</style>
