<template>
  <div class="subLibFileCont">
    <div class="subLibFileManage">
      <configFile v-if="libType === '参数库'" :selectCompId="subLibId" ref="configFiles"></configFile>
      <subFile v-else :selectCompId="subLibId" ref="subFiles"></subFile>
    </div>
  </div>
</template>

<script>
  /*eslint-disable*/
  import subFile from './subFile'
  import configFile from './configFile'
  export default {
    name: 'subLibFiles',
    data() {
      return {
        subLibId: '',
        libType: '',
        myTimer: null
      }
    },
    components: {
      subFile,
      configFile
    },
    created() {
      this.subLibId  = this.$route.params.id
      this.libType = this.$route.query.libType
      if(this.myTimer) {
        clearInterval(this.myTimer)
      }
      this.myTimer = setInterval(() => {
        if(this.libType === '参数库') {
          this.$refs.configFiles.refreshFileList()
        } else {
          this.$refs.subFiles.refreshFileList()
        }
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
    height: calc(100% - 60px) !important;
    overflow-y: auto;
    padding: 20px;
  }
</style>
