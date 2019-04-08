<template>
  <div class="tasks-container">
    <!--<el-header style="background: linear-gradient(120deg, #00e4d0, #5983e8);line-height: 63px;height: 63px;">
      <div class="searchContainer" style="display: inline-block;margin-bottom:16px;">
        <span class="icon-search"><svg-icon icon-class="search"></svg-icon></span>
        <el-input style="width: 160px;" class="filter-item" placeholder="任务名" v-model="searchQuery">
        </el-input>
        <div class="proTitle">
          <svg-icon icon-class="co-simulation"></svg-icon>
          CO-Simulation
        </div>
      </div>
      <div class="right-menu">
        <span calss="userName" style="position: relative;top: -12px;color: #fff;">{{userName}}</span>
        <el-dropdown class="avatar-container right-menu-item" trigger="click">
          <div class="avatar-wrapper">
            <pan-thumb class="proImg" width="40px" height="40px" image="./2/png">
            </pan-thumb>
            <i class="el-icon-caret-bottom"></i>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <span v-if="role === 'admin'" style="display:block;">
                <router-link to="/user_manage">用户管理</router-link>
              </span>
              <span v-else style="display:block;">修改密码</span>
            </el-dropdown-item>
            <el-dropdown-item divided>
              <span @click="logout" style="display:block;">{{$t('navbar.logOut')}}</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-header>-->
    <div style="padding: 10px 0 0 40px;">
      <span>
        <el-button type="success" @click="handleSelectTemplate" size="mini" v-if="roles.includes('ROLE_PROJECT_MANAGER') || editable === true">选择模版</el-button>
        <el-button type="success" @click="handleCheckTemplate" size="mini" v-else>查看流程</el-button>
      </span>
      <el-button type="primary" @click="handleBackToPro" size="mini">返回项目</el-button>
    </div>
    <div class="board">
      <Kanban :key="1" :list="list" :options="options" :taskType="undo" class="kanban todo" header-text="待处理" @onNewTask="refreshList"/>
      <Kanban :key="2" :list="listWorking" :options="options" class="kanban working" header-text="进行中"/>
      <Kanban :key="3" :list="listDone" :options="options" class="kanban done" header-text="已完成"/>
    </div>
    <el-dialog :visible.sync="templateDialog" width="80%" class="visio-dialog">
      <visio :proId="proId" @refreshList="getLinkList" :processNodes="processNodeList" :editable="editable"></visio>
    </el-dialog>
  </div>
</template>

<script>
  /*eslint-disable*/
  import PanThumb from '@/components/PanThumb'
  import Kanban from '@/components/kanban'
  import visio from '@/views/visio/index'
  import { getLinks, getProcessNodes } from '@/api/pro-design-link'
  import { getProjectById } from '@/api/project'

  export default {
    name: 'task_manage',
    components: {
      PanThumb,
      Kanban,
      visio
    },
    data() {
      return {
        undo: 'undo',
        userId: '',
        roles: '',
        proId: '',
        proName: '',
        userName: '',
        selectedId: '',
        tableKey: 0,
        list: [],
        listWorking: [],
        listDone: [],
        processNodeList: [],
        taskInfo: {
          name: '',
          info: ''
        },
        searchQuery: '',
        formLabelWidth: '100px',
        textMap: {
          update: '编辑',
          create: '新建'
        },
        token: '',
        role: '',
        options: {
          group: 'mission'
        },
        temp: {
          name: '',
          pic: '',
          finishTime: '',
          designLink: null
        },
        templateDialog: false,
        editable: false,
        completeFlag: false
      }
    },
    created() {
      this.completeFlag = false
      this.roles = this.$store.getters.roles
      this.proId = this.$route.query.id
      this.proName = this.$route.query.name
      this.getProDetail()
      this.getLinkList()
      this.getProcessList()
    },
    methods: {
      getProDetail() {
        getProjectById(this.proId).then((res) => {
          if(res.data.code === 0) {
            if(res.data.data.pic.id === this.getCookie('userId')) {
              this.editable = true
              this.completeFlag = true
            }
          }
        })
      },
      getLinkList() {
        getLinks(this.proId).then((res) => {
          if(res.data.code === 0) {
            this.list = res.data.data
            console.log(this.list)
          }
        })
      },
      getProcessList() {
        getProcessNodes(this.proId).then((res) => {
          if(res.data.code === 0) {
            this.processNodeList = res.data.data
          }
        })
      },
      logout() {
        this.$store.dispatch('FedLogOut').then(() => {
          location.reload()// In order to re-instantiate the vue-router object to avoid bugs
        })
      },
      refreshList() {
        this.getLinkList()
      },
      handleSelectTemplate() {
        this.templateDialog = true
        this.editable = true
      },
      handleCheckTemplate() {
        this.templateDialog = true
        this.editable = false
      },
      handleBackToPro() {
        this.$router.push({ path: '/projectManage' })
      }
    },
    computed: {
      /*list1: function() {
        let self = this;
        return self.list.filter(function (item) {
          return item.state === 0;
        })
      },
      list2: function() {
        let self = this;
        return self.list.filter(function (item) {
          return item.state === 1;
        })
      },
      list3: function() {
        let self = this;
        return self.list.filter(function (item) {
          return item.state === 2;
        })
      }*/
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  $bg: #f1f3f5;
  $dark_gray: #889aa4;
  $light_gray: #eee;
  .proTitle {
    position: absolute;
    width: 140px;
    top: 0;
    left: 50%;
    margin-left: -70px;
    background: linear-gradient(to right, #5786e8, #2961d2);
    -webkit-background-clip: text;
    color: transparent;
  }
  .icon-search {
    position: absolute;
    top: 1px;
    left: 30px;
    z-index: 99;
  }
  .right-menu {
    float: right;
    height: 100%;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }

    .avatar-container {
      height: 50px;
      margin-right: 30px;

      .avatar-wrapper {
        cursor: pointer;
        margin-top: 5px;
        position: relative;

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
  .board {
    width: 1000px;
    margin-left: 20px;
    display: flex;
    justify-content: space-around;
    flex-direction: row;
    align-items: flex-start;
    margin-top: 10px;
  }
</style>
