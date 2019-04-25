<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>

    <breadcrumb class="breadcrumb-container"></breadcrumb>
    <div class="proTitle">
      <span><svg-icon icon-class="co-simulation"></svg-icon></span>
      <span>CO-Simulation</span>
      <el-dropdown style="position:absolute;top:-1px;right: 6px;" placement="bottom-start">
        <span class="el-dropdown-link my-menu-icon">
          <svg-icon icon-class="menu"></svg-icon>
        </span>
        <el-dropdown-menu slot="dropdown" class="my-menu-dropdown">
          <div class="flex-menu-box">
            <div class="flex-menu-item" @click="jumpToPro()">
              <span class="icon-box">
                <svg-icon icon-class="project"></svg-icon>
              </span>
              <span class="icon-text">项目管理</span>
            </div>
            <div class="flex-menu-item" @click="jumpToKonwledge()">
              <span class="icon-box">
                <svg-icon icon-class="knowledge"></svg-icon>
              </span>
              <span class="icon-text">我的库</span>
            </div>
            <div class="flex-menu-item" @click="jumpToAudit()">
              <span class="icon-box" style="color: #3f9fe1;">
                <svg-icon icon-class="audit"></svg-icon>
              </span>
              <span class="icon-text">任务审查</span>
            </div>
            <div class="flex-menu-item" @click="jumpToAuditSubLibFile()">
              <span class="icon-box" style="color: #3f9fe1;">
                <svg-icon icon-class="audit1"></svg-icon>
              </span>
              <span class="icon-text">文件审查</span>
            </div>
          </div>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="right-menu">

      <el-tooltip effect="dark" :content="$t('navbar.screenfull')" placement="bottom">
        <screenfull class="screenfull right-menu-item"></screenfull>
      </el-tooltip>

      <span style="font-weight: 400 !important;color: #fff;line-height: 50px;position: relative;top: -13px;">
          {{selectedProName}}
      </span>

      <el-dropdown class="avatar-container right-menu-item" trigger="click">
        <div class="avatar-wrapper">
          <span class="user-avatar"><svg-icon icon-class="useravata"></svg-icon></span>
          <!--<img class="user-avatar" src="./2.jpg">-->
          <i class="el-icon-caret-bottom"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/dashboard/dashboard">
            <el-dropdown-item>
              <span>首页</span>
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <span @click="jumpToProManage">项目管理</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span @click="routerToMyPro" style="display:block;">我的项目</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span v-if="role === 'ROLE_ADMIN'" style="display:block;">
              <router-link to="/user_manage/index">用户管理</router-link>
            </span>
            <span v-else @click="handleModifyPassword" style="display:block;">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span @click="logout" style="display:block;">{{$t('navbar.logOut')}}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <!--普通用户修改密码-->
      <el-dialog title="修改密码" :visible.sync="modifyPasswordVisible" width="40%">
        <el-form :model="form" ref="modifyPassForm" :rules="modifyRules" style="width: 80%; margin:0 auto;">
          <el-form-item label="新密码" :label-width="formLabelWidth" prop="passwordNew">
            <el-input :type="passwordType" v-model="form.passwordNew" auto-complete="off"></el-input>
            <span class="show-pwd" @click="showPwd">
              <svg-icon icon-class="eye" />
            </span>
          </el-form-item>
          <el-form-item label="再次输入" :label-width="formLabelWidth" prop="passwordAgain">
            <el-input :type="passwordTypeAgain" v-model="form.passwordAgain" auto-complete="off"></el-input>
            <span class="show-pwd" @click="showPwdAgain">
              <svg-icon icon-class="eye" />
            </span>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="modifyPasswordVisible = false">取 消</el-button>
          <el-button :disabled="this.btnConfirm" type="primary" @click="modifyPassword">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </el-menu>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex'
  import { isvalidPwd } from '@/utils/validate'
  import PanThumb from '@/components/PanThumb'
  import Breadcrumb from '@/components/Breadcrumb'
  import Hamburger from '@/components/Hamburger'
  import ErrorLog from '@/components/ErrorLog'
  import Screenfull from '@/components/Screenfull'
  import LangSelect from '@/components/LangSelect'
  import ThemePicker from '@/components/ThemePicker'
  import { projectList, createProject } from '@/api/project'
  import { updateUser } from '@/api/getUsers'
  /* eslint-disable */
  export default {
    components: {
      PanThumb,
      Breadcrumb,
      Hamburger,
      ErrorLog,
      Screenfull,
      LangSelect,
      ThemePicker
    },
    data() {
      const validatePassword = (rule, value, callback) => {
        if (!isvalidPwd(value)) {
          callback(new Error('密码必须是6-16位数字和字母的组合！'))
          this.btnConfirm = true
          this.passwordValidate = false
        } else {
          callback()
          this.passwordValidate = true
          if(this.passwordValidate && this.pasAgainValidate) {
            this.btnConfirm = false
          }
        }

      }
      const validatePasswordAgain = (rule, value, callback) => {
        if (!isvalidPwd(value)) {
          callback(new Error('密码必须是6-16位数字和字母的组合！'))
          this.btnConfirm = true
          this.pasAgainValidate = false
        } else if(this.form.passwordAgain !== this.form.passwordNew) {
          this.btnConfirm = true
          this.pasAgainValidate = false
          callback(new Error('两次密码输入不一致，请再次输入新密码！'))
        } else {
          callback()
          this.pasAgainValidate = true
          if(this.passwordValidate && this.pasAgainValidate) {
            this.btnConfirm = false
          }
        }
      }
      return {
        list: null,
        role: '',
        userId: '',
        total: null,
        listLoading: true,
        proName: '',
        selectedProName: '',
        taskSelectedName: '',
        selected: '',
        dialogFormVisible: false,
        modifyPasswordVisible: false,
        passwordType: 'password',
        passwordTypeAgain: 'password',
        btnConfirm: false,
        passwordValidate: false,
        pasAgainValidate: false,
        form: {
          passwordNew: '',
          passwordAgain: ''
        },
        formLabelWidth: '100px',
        temp: {
          id: '',
          name: '',
          description: ''
        },
        modifyRules: {
          passwordNew: [{ required: true, trigger: 'blur', validator: validatePassword }],
          passwordAgain: [{ required: true, trigger: 'blur', validator: validatePasswordAgain }]
        },
        projectLength: 0,
        projectExist: true,
        userData:{
          username: '',
          password: ''
        }
      }
    },
    created() {
      this.role = this.$store.getters.roles[0]
      this.userData.username = this.getCookie('username')
      this.userData.password = this.getCookie('password')
      this.userId = this.getCookie('userId')
      this.taskSelectedName = decodeURI(this.getCookie('taskSelectedName'))
    },
    computed: {
      ...mapGetters([
        'sidebar',
        'name',
        'avatar',
        'roles'
      ])
    },
    methods: {
      showPwd() {
        if (this.passwordType === 'password') {
          this.passwordType = ''
        } else {
          this.passwordType = 'password'
        }
      },
      showPwdAgain() {
        if (this.passwordTypeAgain === 'password') {
          this.passwordTypeAgain = ''
        } else {
          this.passwordTypeAgain = 'password'
        }
      },
      getList() {
        this.listLoading = true
        projectList(this.userData).then(response => {
          this.list = response.data.data
          this.list.value = '';
          this.total = response.data.total
          this.listLoading = false
          this.projectLength = this.list.length
        })
      },
      toggleSideBar() {
        this.$store.dispatch('toggleSideBar')
      },
      logout() {
        this.$store.dispatch('FedLogOut').then(() => {
          location.reload()// In order to re-instantiate the vue-router object to avoid bugs
        })
      },
      jumpToProManage() {
        this.$router.replace('/projectManage')
        this.$store.dispatch('delAllViews')
      },
      routerToMyPro() {
        this.$router.push({ path: '/myProject' })
      },
      handleModifyPassword() {
        this.resetModify()
        this.modifyPasswordVisible = true
        this.$nextTick(() => {
          this.$refs['modifyPassForm'].clearValidate()
        })
      },
      resetModify () {
        this.form = {
          passwordAgain: '',
          passwordNew: ''
        }
      },
      modifyPassword() {
        this.$refs['modifyPassForm'].validate((valid) => {
          if(valid) {
            let data = {
              'password': this.form.passwordNew
            }
            var qs = require('qs');
            let datapost = qs.stringify(data)
            updateUser(datapost,this.userId).then(() => {
              this.modifyPasswordVisible = false
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
              this.$store.dispatch('FedLogOut').then(() => {
                location.reload()// In order to re-instantiate the vue-router object to avoid bugs
              })
            }).catch(() => {
              this.$notify({
                title: '失败',
                message: '修改失败',
                type: 'error',
                duration: 2000
              })
            })
          }
        })
      },
      jumpToAudit() {
        this.$router.push({
          path: '/audit_task'
        })
      },
      jumpToAuditSubLibFile() {
        this.$router.push({
          path: '/auditSubLibFiles'
        })
      },
      jumpToKonwledge() {
        this.$router.push({
          path: '/library'
        })
      },
      jumpToPro() {
        this.$router.push({
          path: '/projectManage'
        })
      },
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 2px;
    font-size: 16px;
    cursor: pointer;
    user-select: none;
  }
  .proIcon {
    position: absolute;
    right: -20px;
    top: 25px;
    font-size: 12px;
  }
  .proImg{
    cursor: pointer;
  }
  .navbar {
    height: 63px;
    line-height: 63px;
    border-radius: 0px !important;
    background: linear-gradient(120deg, #00e4d0, #5983e8);
    padding-left: 40px;
    .hamburger-container {
      line-height: 70px;
      height: 63px;
      float: left;
      padding: 0 10px;
    }
    .breadcrumb-container {
      height: 63px;
      line-height: 63px;
      float: left;
    }
    .errLog-container {
      display: inline-block;
      vertical-align: top;
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
      .screenfull {
        height: 20px;
      }
      .international {
        vertical-align: top;
      }
      .theme-switch {
        vertical-align: 15px;
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
            font-size: 40px;
            position: relative;
            top: -4px;
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
  }
  .proTitle {
    position: absolute;
    width: 160px;
    top: 0;
    left: 50%;
    margin-left: -70px;
    background: linear-gradient(to right, #5786e8, #2961d2);
    -webkit-background-clip: text;
    color: transparent;
  }
  .my-menu-icon {
    color: #fff;
    font-size: 26px;
    /*position: absolute;
    top: -1px;
    right: 4px;*/
    cursor: pointer;
  }
  .flex-menu-box {
    display: flex;
    width: 320px;
    flex-direction: row;
    flex-wrap: wrap;
    // justify-content: flex-start;
    justify-content: space-around;
    padding: 24px;
    .flex-menu-item {
      align-items: center;
      display: block;
      width: 60px;
      // height: 60px;
      font-size: 42px;
      text-align: center;
      line-height: 60px;
      cursor: pointer;
      color: #383838;
      .icon-box {
        display: block;
        width: 100%;
      }
      .icon-text {
        display: block;
        height: 20px;
        line-height: 20px;
        font-size: 14px;
      }
    }
  }
</style>
