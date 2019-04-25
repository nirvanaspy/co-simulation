<template>
  <div id="previewBox" style="height: 100%;">
    <img :src="pathId">
  </div>
</template>

<script>
  /*eslint-disable*/
  import Viewer from 'viewerjs'
  import 'viewerjs/dist/viewer.min.css'
  import service from '@/utils/request'
  export default {
    name: 'preview',
    data() {
      return {
        picSrc: '',
        pathId: '',
      }
    },
    created() {
      this.type = this.$route.query.type
      // this.pathId = 'http://192.168.31.69:8080/preview/viewer/document/' + this.$route.query.id
      this.pathId = service.defaults.baseURL + '/preview/viewer/document/' + this.$route.query.id
      // this.pathId = this.$route.query.id
    },
    mounted() {
      this.$nextTick(() => {
        const viewbox = document.getElementById('previewBox')
        const viewer = new Viewer(viewbox, {
          url: 'data-original'
        });
        viewer.show();
      })
    }
  }
</script>

<style scoped>

</style>
