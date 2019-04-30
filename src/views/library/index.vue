<template>
  <div class="lib-cont">
    <div class="library-container" v-loading="listLoading">
      <div v-for="item in librariesList" class="library-item" @dblclick.prevent.stop="selectLibrary(item)">
      <span class="library-icon">
        <svg-icon :icon-class="item.type"></svg-icon>
      </span>
        <span class="library-name">{{item.type}}</span>
      </div>
    </div>
    <div class="tree-container" v-show="ifShowTree">
      <libTree></libTree>
      <div class="tree-bar">
        <span class="icon" @click="hideTree">
          <svg-icon icon-class="collapse"></svg-icon>
        </span>
      </div>
    </div>
    <div class="hide-tree-bar" v-show="!ifShowTree">
      <span class="icon" @click="showTree">
          <svg-icon icon-class="expand"></svg-icon>
      </span>
    </div>
  </div>
</template>

<script>
  /*eslint-disable*/
  import { libraryList } from "@/api/library"
  import libTree from './libraryTree'
  export default {
    name: 'library',
    components: {
      libTree
    },
    data() {
      return {
        librariesList: [],
        listLoading: false,
        ifShowTree: false
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
      },
      showTree() {
        this.ifShowTree = true
      },
      hideTree() {
        this.ifShowTree = false
      }
    },
    created() {
      this.getLibraryList()
    }
  }
</script>

<style lang="scss" scoped>
  .lib-cont {
    position: absolute;
    top: 60px;
    bottom: 0;
    width: 100%;
  }
  .library-container {
    padding: 20px;
    text-align: center;
    position: relative;
    top: 35%;
    margin-top: -100px;
    /*position: absolute;
    top: 35%;
    left: 50%;
    margin-top: -100px;
    margin-left: -380px;*/
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
  .tree-container {
    width: 300px;
    height: 600px;
    overflow-y:scroll;
    position: absolute;
    left: 0;
    top: 200px;
    border-radius: 10px;
    padding: 10px;
    margin-left: -10px;
    border: 1px solid #effdfc;
    // background: #effdfc;
    background: #4be8dd;
    -ms-overflow-style:none;
    /*火狐下隐藏滚动条*/
    overflow:-moz-scrollbars-none;
  }
  .tree-container::-webkit-scrollbar{width:0px}
  .tree-bar {
    height: 40px;
    width: 18px;
    margin-top: -20px;
    // background: #efefef;
    position: absolute;
    top: 50%;
    right: 2px;
    .icon {
      cursor: pointer;
      font-size: 40px;
      position: relative;
      right: 10px;
    }
  }
  .hide-tree-bar {
    position: absolute;
    top: 470px;
    .icon {
      font-size: 40px;
      cursor: pointer;
      position: relative;
      left: -10px;
    }
  }
</style>
