<template>
  <div class="library-container">
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
  export default {
    name: 'library',
    data() {
      return {
        librariesList: []
      }
    },
    methods: {
      getLibraryList() {
        libraryList().then((res) => {
          if(res.data.code === 0) {
            this.librariesList = res.data.data
          }
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
    }
  }
</script>

<style lang="scss" scoped>
  .library-container {
    padding: 20px;
    text-align: center;
    // 禁止选中文字
    -moz-user-select:none; /*火狐*/
    -webkit-user-select:none; /*webkit浏览器*/
    -ms-user-select:none; /*IE10*/
    user-select:none;
    .library-item {
      display: inline-block;
      width: 140px;
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
        font-size: 70px;
      }
      .library-name {
        display: block;
        margin-top: 10px;
      }
    }
  }

</style>
