<template>
  <div class="subLibFileCont">
    <div class="subLibFileManage">
      <subFile></subFile>
    </div>
  </div>
</template>

<script>
  /*eslint-disable*/
  import subFile from './subFile'
  export default {
    name: 'subLibFiles',
    data() {
      return {}
    },
    components: {
      subFile
    },
    created() {
      console.log(this.$route.query.name)
    }
  }
</script>

<style lang="scss" scoped>
  .subLibFileCont {
    padding: 20px;
  }
</style>
