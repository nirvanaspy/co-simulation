<template>
  <div class="subLibFileCont">
    <div class="subLibFileManage">
      <subFile :selectCompId="subLibId" ref="subFiles"></subFile>
    </div>
  </div>
</template>

<script>
  /*eslint-disable*/
  import subFile from './subFile'
  export default {
    name: 'subLibFiles',
    data() {
      return {
        subLibId: '',
        myTimer: null
      }
    },
    components: {
      subFile
    },
    created() {
      this.subLibId  = this.$route.params.id
      if(this.myTimer) {
        clearInterval(this.myTimer)
      }
      this.myTimer = setInterval(() => {
        this.$refs.subFiles.refreshFileList()
      }, 20000)
    },
    destroyed() {
      if(this.myTimer) {
        clearInterval(this.myTimer)
      }
    },
  }
</script>

<style lang="scss" scoped>
  .subLibFileCont {
    padding: 20px;
  }
</style>
