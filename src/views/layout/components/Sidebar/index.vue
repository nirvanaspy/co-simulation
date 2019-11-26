<template>
  <scroll-bar>
    <div class="proTitle" v-if="!isCollapse">
      <svg-icon icon-class="co-simulation"></svg-icon>
      CO-Simulation
    </div>
    <div class="user-container" v-if="!isCollapse">
      <div class="avatar-container">
        <span class="user-avatar"><svg-icon icon-class="useravata"></svg-icon></span>
      </div>
      <div class="userInfo-container">
        <span class="user-name">
          {{userInfo.username}}
        </span>
        <span class="user-name">
          {{userInfo.realName}}
        </span>

      </div>
    </div>
    <el-menu
      mode="vertical"
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      text-color="#4A4A4A"
      active-text-color="#409EFF"
    >
      <sidebar-item :routes="permission_routers"></sidebar-item>
    </el-menu>
  </scroll-bar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import ScrollBar from '@/components/ScrollBar'

export default {
  components: { SidebarItem, ScrollBar },
  data() {
    return {
      userName: ''
    }
  },
  created() {
    this.userName = this.getCookie('username')
  },
  computed: {
    ...mapGetters([
      'permission_routers',
      'sidebar',
      'userInfo'
    ]),
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .proTitle {
    margin: 20px 0;
    padding-left: 22px;
    font-size: 18px;
    width: 100%;
    height: 40px;
    line-height: 40px;
    font-weight: 700;
    /*background: linear-gradient(to right, #5983e8, #00e4d0);*/
    /*-webkit-background-clip: text;*/
    /*color: transparent;*/
    .svg-icon {
      margin-right: 0!important;
    }
  }
  .user-container {
    width: 100%;
    height: 60px;
    padding: 10px 18px;
    .avatar-container{
      float: left;
      .user-avatar {
        display: inline-block;
        width: 40px;
        height: 40px;
        // background: #03e0d0;
        border-radius: 50%;
        font-size: 40px;
        line-height: 50px;
      }
    }
    .userInfo-container {
      margin: 4px 0 0 6px;
      float: left;
      font-size: 12px;
      .user-name, .role-info {
        display: block;
        height: 20px;
        line-height: 20px;
        width: 100px;
        font-weight: 400;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .user-name {
        font-size: 13px;
        color: rgb(74,74,74);
      }
      .role-info {
        color: rgb(194,194,194);
        font-size: 13px;
      }
    }
  }

</style>
