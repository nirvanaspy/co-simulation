<template>
  <div class="subLibFileCont">
    <div class="subLibFileManage">
      <subFile :selectCompId="subLibId"></subFile>
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
        subLibId: ''
      }
    },
    components: {
      subFile
    },
    created() {
      this.subLibId  = this.$route.params.id
    }
  }
</script>

<style lang="scss" scoped>
  .subLibFileCont {
    padding: 20px;
  }
</style>
