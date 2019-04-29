<template>
  <div class="library-container" v-loading="listLoading">
    <div v-for="item in librariesList" class="library-item" @dblclick.prevent.stop="selectLibrary(item)">
      <span class="library-icon">
        <svg-icon :icon-class="item.type"></svg-icon>
      </span>
      <span class="library-name">{{item.type}}</span>
    </div>
  </div>
</template>

<script>
  /*eslint-disable*/
  import { libraryList } from "@/api/library"
  import { getFileTree } from "@/api/sublibFiles"
  export default {
    name: 'library',
    data() {
      return {
        librariesList: [],
        listLoading: false
      }
    },
    methods: {
      getLibraryList() {
        this.listLoading = true
        libraryList().then((res) => {
          if(res.data.code === 0) {
            this.librariesList = res.data.data
          }
          this.listLoading = false
        })
      },
      selectLibrary(item) {
        this.$router.push({
          path: '/sublibrary',
          name: 'subLibrary',
          params: {
            id: item.id,
            name: item.type
          }
        })
      }
    },
    created() {
      this.getLibraryList()
      getFileTree().then(() => {

      })
    }
  }
</script>

<style lang="scss" scoped>
  .library-container {
    padding: 20px;
    text-align: center;
    position: absolute;
    top: 35%;
    left: 50%;
    margin-top: -100px;
    margin-left: -380px;
    // 禁止选中文字
    -moz-user-select:none; /*火狐*/
    -webkit-user-select:none; /*webkit浏览器*/
    -ms-user-select:none; /*IE10*/
    user-select:none;
    .library-item {
      display: inline-block;
      width: 180px;
      padding: 20px;
      text-align: center;
      cursor: pointer;
      -webkit-transition: all 0.3s; -moz-transition: all 0.3s; -o-transition: all 0.3s;
      &:hover {
        -webkit-transform: scale(1.3); /*1.1放大值*/
        -moz-transform: scale(1.3);
        -o-transform: scale(1.3);
        -ms-transform: scale(1.3);
      }
      .library-icon {
        font-size: 100px;
      }
      .library-name {
        display: block;
        margin-top: 10px;
      }
    }
  }

</style>
