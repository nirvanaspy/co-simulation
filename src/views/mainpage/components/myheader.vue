<template>
  <div class="my-header-container">
    <!--<div class="mask" v-if="ifShowSearch"></div>-->
    <el-header class="my-header">
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
                <span class="icon-text">库</span>
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
        <span class="myBage" @click="handleCheckNotice">
          <el-badge :value="unReadMesCount" class="item">
            <span style="color: #fff">
              <svg-icon icon-class="bell"></svg-icon>
            </span>
          </el-badge>
        </span>
        <span @click="toogleSearch" class="searchBox">
          <svg-icon icon-class="search"/>
        </span>
        <span calss="userName" style="position: relative;top: -12px;color: #fff;font-size: 14px;">{{userName}}</span>
        <el-dropdown class="avatar-container right-menu-item" trigger="click">
          <div class="avatar-wrapper">
            <pan-thumb class="proImg" width="40px" height="40px" image="./2/png">
            </pan-thumb>
            <i class="el-icon-caret-bottom"></i>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <span v-if="role.includes('ROLE_ADMIN') || role.includes('ROLE_SECURITY_GUARD')" style="display:block;">
                <router-link to="/user_manage/index">用户管理</router-link>
              </span>
              <span v-else @click="handleModifyPassword" style="display:block;">修改密码</span>
            </el-dropdown-item>
            <el-dropdown-item divided>
              <span @click="routerToPro" style="display:block;">项目管理</span>
            </el-dropdown-item>
            <el-dropdown-item divided>
              <span @click="routerToMyPro" style="display:block;">我的项目</span>
            </el-dropdown-item>
            <el-dropdown-item divided>
              <span @click="jumpToAudit" style="display:block;">我的审核</span>
            </el-dropdown-item>
            <el-dropdown-item divided>
              <span @click="jumpToLog" style="display:block;">下载日志</span>
            </el-dropdown-item>
            <el-dropdown-item divided>
              <span @click="jumpToAuditApply" style="display:block;">二次修改申请</span>
            </el-dropdown-item>
            <el-dropdown-item divided>
              <span @click="logout" style="display:block;">{{$t('navbar.logOut')}}</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-header>
    <!--普通用户修改密码-->
    <el-dialog title="修改密码" :visible.sync="modifyPasswordVisible" append-to-body width="40%" class="limit-width-dialog">
      <el-form :model="form" ref="modifyPassForm" :rules="modifyRules" style="width: 80%; margin:0 auto;">
        <el-form-item label="新密码" :label-width="formLabelWidth" prop="passwordNew">
          <el-input :type="passwordType" v-model="form.passwordNew" auto-complete="off"></el-input>
          <span class="show-pwd" @click="showPwd">
            <svg-icon icon-class="eye"/>
          </span>
        </el-form-item>
        <el-form-item label="再次输入" :label-width="formLabelWidth" prop="passwordAgain">
          <el-input :type="passwordTypeAgain" v-model="form.passwordAgain" auto-complete="off"></el-input>
          <span class="show-pwd" @click="showPwdAgain">
            <svg-icon icon-class="eye"/>
          </span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="modifyPasswordVisible = false">取 消</el-button>
        <el-button :disabled="this.btnConfirm" type="primary" @click="modifyPassword" :loading="modPasLoading">确 定
        </el-button>
      </div>
    </el-dialog>
    <!--消息弹框-->
    <el-dialog title="" :visible.sync="noticeDialogVisible" append-to-body width="100%" class="message-dialog">
      <el-row :gutter="20" style="height: 100%;position: relative;">
        <div class="drop-box">
          <el-radio-group v-model="checkType" @change="checkTypeChange" style="margin-right: 10px">
            <el-radio label="unRead">未读</el-radio>
            <el-radio label="hasRead">已读</el-radio>
            <el-radio label="all">全部</el-radio>
          </el-radio-group>
          <el-dropdown>
            <span class="el-dropdown-link">
              更多操作<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <span @click="markAllRead">全部标记为已读</span>
              </el-dropdown-item>
              <el-dropdown-item>
                <span @click="clearAllReadMes">清除所有已读</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <el-col style="height: 100%;" :span="6">
          <div class="notice-list-box">
            <div v-for="item in listA" class="notice-item" @dblclick="checkMes(item)" :class="{'selectedMes': selectedMesObj !== null && selectedMesObj.id === item.id}">
              <span class="mes-des-box">{{operateBodyMap[item.mainBody]}}</span>
              <span class="mes-des-box">{{operateTypeMap[item.messageOperate]}}</span>
              <span class="mes-des-box operator">
                操作人：
                <span v-if="item.mainOperatorName">{{item.mainOperatorName}}</span>
                <span v-else>--</span>
              </span>
              <span class="mes-des-box time">{{item.createTime}}</span>
              <span class="unRead-icon" v-if="item.ifRead === false">
                <svg-icon icon-class="unRead"></svg-icon>
              </span>
            </div>
          </div>
        </el-col>
        <el-col style="height: 100%;" :span="18">
          <div class="notice-detail">
            <div v-if="selectedMesObj !== null">
              <div class="detail-header">
                <div class="detail-header-box">
                  <span class="header-item-box">
                    <span class="icon-box"><svg-icon icon-class="mark"></svg-icon></span>
                    <span class="text">{{operateBodyMap[selectedMesObj.mainBody]}}</span>
                  </span>
                </div>
              </div>
              <div class="detail-body">
                {{selectedMesObj.description}}
                <el-button type="primary" size="mini" @click="handleCheckMes(selectedMesObj)" v-if="selectedMesObj.messageOperate == 4" style="position: relative;top: -3px;">点击查看</el-button>
              </div>
              <div class="detail-footer">
                <div style="height: 40px;line-height: 40px;" v-if="selectedMesObj">
                  <span><svg-icon icon-class="user-1" class="icons"></svg-icon>被操作人：</span>
                  <span v-if="selectedMesObj.arrangedPersonName">{{selectedMesObj.arrangedPersonName}}</span>
                </div>
                <div style="height: 40px;line-height: 40px;" v-if="selectedMesObj">
                  <span><svg-icon icon-class="user-1" class="icons"></svg-icon>操作人：</span>
                  <span v-if="selectedMesObj.mainOperatorName">{{selectedMesObj.mainOperatorName}}</span>
                </div>
                <div style="height: 40px;line-height: 40px;">
                  <span><svg-icon icon-class="components3" class="icons"></svg-icon>操作类型：</span>
                  <span>{{operateTypeMap[selectedMesObj.mainBody]}}</span>
                </div>
                <div style="height: 40px;line-height: 40px;">
                  <span><svg-icon icon-class="time" class="icons" style="color: #333;"></svg-icon>操作时间：</span>
                  <span>{{selectedMesObj.createTime}}</span>
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
  /*eslint-disable*/
  import PanThumb from '@/components/PanThumb'
  import { isvalidPwd } from '@/utils/validate'
  import { updatePassword } from '@/api/getUsers'
  import { getMesByUser, readAllMes, readMes, clearAllRead, getMessages, findMesByIfRead } from '@/api/message'
  import service from '@/utils/request'
  import Stomp from 'stompjs'
  import SockJS from 'sockjs-client'
  // import debounce from 'lodash/debounce'
  export default {
    name: 'myheader',
    components: {
      PanThumb
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
          if (this.passwordValidate && this.pasAgainValidate) {
            this.btnConfirm = false
          }
        }

      }
      const validatePasswordAgain = (rule, value, callback) => {
        if (!isvalidPwd(value)) {
          callback(new Error('密码必须是6-16位数字和字母的组合！'))
          this.btnConfirm = true
          this.pasAgainValidate = false
        } else if (this.form.passwordAgain !== this.form.passwordNew) {
          this.btnConfirm = true
          this.pasAgainValidate = false
          callback(new Error('两次密码输入不一致，请再次输入新密码！'))
        } else {
          callback()
          this.pasAgainValidate = true
          if (this.passwordValidate && this.pasAgainValidate) {
            this.btnConfirm = false
          }
        }
      }
      return {
        userName: '你好 ',
        userId: '',
        role: '',
        modifyPasswordVisible: false,
        modPasLoading: false,
        btnConfirm: false,
        passwordType: 'password',
        passwordTypeAgain: 'password',
        formLabelWidth: '100px',
        form: {
          passwordNew: '',
          passwordAgain: ''
        },
        modifyRules: {
          passwordNew: [{required: true, trigger: 'blur', validator: validatePassword}],
          passwordAgain: [{required: true, trigger: 'blur', validator: validatePasswordAgain}]
        },
        noticeDialogVisible: false,
        mesList: [],
        unReadMesCount: 0,
        currentCount: 0,
        operateTypeMap: {
          0: '无操作',
          1: '赋予新角色',
          2: '指定为项目负责人',
          3: '指定为子任务负责人',
          4: '指定为审核员',
          5: '删除',
          6: '恢复',
          7: '修改'
        },
        operateBodyMap: {
          0: '无操作主体',
          1: '用户',
          2: '项目',
          3: '子任务',
          4: '子库文件'
        },
        selectedMesObj: null,
        readingMes: false,
        hasChecked: false,
        checkType: 'all'
      }
    },
    created() {
      // this.role = this.$store.getters.roles[0]
      this.role = this.$store.getters.roles
      this.userName += this.getCookie('username')
      this.userId = this.getCookie('userId')
      // this.subscribeNotice()
      this.getAllMes()
      this.getUnreadMes()
    },
    methods: {
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
      jumpToLog() {
        this.$router.push({
          path: '/downloadLogs/index'
        })
      },
      jumpToAuditApply() {
        this.$router.push({
          path: '/audit_apply/index'
        })
      },
      logout() {
        this.$store.dispatch('FedLogOut').then(() => {
          location.reload()// In order to re-instantiate the vue-router object to avoid bugs
        })
      },
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
      handleModifyPassword() {
        this.resetModify()
        this.modifyPasswordVisible = true
        this.modPasLoading = false
        this.$nextTick(() => {
          this.$refs['modifyPassForm'].clearValidate()
        })
      },
      resetModify() {
        this.form = {
          passwordAgain: '',
          passwordNew: ''
        }
      },
      modifyPassword() {
        this.$refs['modifyPassForm'].validate((valid) => {
          if (valid) {
            this.modPasLoading = true
            let data = {
              'password': this.form.passwordNew
            }
            var qs = require('qs');
            let datapost = qs.stringify(data)
            updatePassword(this.userId, datapost).then((res) => {
              if(res.data.code === 0) {
                this.modifyPasswordVisible = false
                this.$notify({
                  title: '成功',
                  message: '密码修改成功',
                  type: 'success',
                  duration: 2000
                })
                this.$store.dispatch('FedLogOut').then(() => {
                  location.reload()// In order to re-instantiate the vue-router object to avoid bugs
                })
              } else {
                this.$notify({
                  title: '失败',
                  message: res.data.msg,
                  type: 'error',
                  duration: 2000
                })
              }
              this.modPasLoading = false
            })
          }
        })
      },
      routerToPro() {
        this.$router.push({ path: '/projectManage' })
      },
      routerToMyPro() {
        this.$router.push({ path: '/myProject' })
      },
      toogleSearch() {
        this.$store.dispatch('setIfSearch')
      },
      // 订阅通知
      subscribeNotice() {
        let url = service.defaults.baseURL + '/COSIMULATION';
        let socket = new SockJS(url);
        let stompClient = Stomp.over(socket);
        stompClient.debug=null
        let that = this;
        let username = this.getCookie('username')
        stompClient.connect({}, function (frame) {
          stompClient.subscribe('/personalInfo/' + username, function (response) {
            let resBody = response.body;
            let resBody2 = resBody.replace(/[\\]/g, '');
            that.webResBody = JSON.parse(resBody2);
            if(that.currentCount == that.webResBody.data) {
              return
            }
            // that.currentCount = that.webResBody.data
            // if(that.unReadMesCount <  that.webResBody.data) {
            if(that.currentCount <  that.webResBody.data) {
              that.unReadMesCount = that.webResBody.data
              that.currentCount = that.webResBody.data
            }
          })
        })
      },
      // 显示消息弹框
      handleCheckNotice() {
        this.noticeDialogVisible = true
        /*getMesByUser(this.userId).then((res) => {
          if(res.data.code === 0) {
            this.mesList = res.data.data
          }
        })*/
      },
      // 根据日期排序
      sortDate(a,b){
        return b.timeStartApp-a.timeStartApp
      },
      // 查询所有消息
      getAllMes() {
        getMesByUser(this.userId).then((res) => {
          if(res.data.code === 0) {
            // this.mesList = res.data.data
            let unReadList = []
            let newArr = [];
            for(let i = 0; i < res.data.data.length; i++){
              if(res.data.data[i].ifRead == false) {
                unReadList.push(res.data.data[i])
              }
              let newCreateTime = (res.data.data[i].createTime).replace(new RegExp("-", "gm"), "/");
              let newCreateSecond = (new Date(newCreateTime)).getTime(); //得到毫秒数
              newArr.push(res.data.data[i])
              newArr[i].timeStartApp = newCreateSecond;
            }
            this.unReadMesCount = unReadList.length
            this.mesList = newArr.sort(this.sortDate);
          }
        })
      },
      getUnreadMes() {
        let qs = require('qs')
        let data = {
          ifRead: false,
          userId: this.userId
        }
        let dataPost = qs.stringify(data)
        findMesByIfRead(dataPost).then((res) => {
          if(res.data.code === 0) {
            let unReadList = res.data.data
            this.unReadMesCount = unReadList.length
            this.currentCount = unReadList.length
            this.subscribeNotice()
          }
        })
      },
      // 将所有消息标记为已读
      markAllRead() {
        let qs = require('qs')
        let data = {
          userId: this.userId
        }
        let dataPost = qs.stringify(data)
        readAllMes(dataPost).then((res) => {
          if(res.data.code === 0 ) {
            this.getAllMes()
          }
        })
      },
      // 清除所有已读消息
      clearAllReadMes() {
        let qs = require('qs')
        let data = {
          userId: this.userId
        }
        let dataPost = qs.stringify(data)
        clearAllRead(dataPost).then((res) => {
          if(res.data.code === 0 ) {
            this.selectedMesObj = null
            this.getAllMes()
          }
        })
      },
      // 查看消息并且标记为已读
      checkMes(item) {
        if(this.readingMes) {
          return
        }
        if(item.ifRead === false) {
          let qs = require('qs')
          let data = {
            messageId: item.id
          }
          let dataPost = qs.stringify(data)
          this.readingMes = true
          readMes(dataPost).then((res) => {
            if(res.data.code === 0) {
              this.selectedMesObj = item
              // console.log(this.selectedMesObj)
              item.ifRead = true
              this.unReadMesCount -= 1
            }
            this.readingMes = false
          }).catch(() => {
            this.readingMes = false
          })
        } else {
          this.selectedMesObj = item
          // console.log(this.selectedMesObj)
        }
      },
      handleCheckMes(data) {
        if(data.messageOperate == 4) {
          // 子任务审核
          if(data.mainBody == 3) {
            this.$router.push({ path: '/audit_tasks/index' })
            this.noticeDialogVisible = false
          }
          // 子库文件审核
          if(data.mainBody == 4) {
            this.$router.push({ path: '/audit_subLibFile/index' })
          }
        }

      },
      checkTypeChange(val) {
      }
    },
    computed: {
      ifShowSearch() {
        return this.$store.state.app.ifSearch
      },
      listA() {
        let self = this
        if(this.checkType === 'unRead') {
          return self.mesList.filter((item) => {
            return item.ifRead == false
          })
        } else if(this.checkType === 'hasRead') {
          return self.mesList.filter((item) => {
            return item.ifRead == true
          })
        } else {
          return self.mesList
        }
      }
    },
    watch: {
      currentCount(newValue, oldValue) {
        if(newValue === oldValue || oldValue === 0) {
          return
        }
        getMesByUser(this.userId).then((res) => {
          if(res.data.code === 0) {
            // this.mesList = res.data.data
            let unReadList = []
            let newArr = [];
            for(let i = 0; i < res.data.data.length; i++){
              if(res.data.data[i].ifRead == false) {
                unReadList.push(res.data.data[i])
              }
              let newCreateTime = (res.data.data[i].createTime).replace(new RegExp("-", "gm"), "/");
              let newCreateSecond = (new Date(newCreateTime)).getTime(); //得到毫秒数
              newArr.push(res.data.data[i])
              newArr[i].timeStartApp = newCreateSecond;
            }
            this.mesList = newArr.sort(this.sortDate);
            let latestMes = this.mesList[0]
            // that.setCookie('mesCount', that.mesList.length)
            this.$notify.info({
              title: '你有一条新消息',
              message: latestMes.description,
              position: 'bottom-right',
              duration: 2000
            })
          }
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .my-header-container {
    // position: relative;
    // z-index: 999;
  }
  .my-header {
    background: linear-gradient(120deg, #00e4d0, #5983e8);
    line-height: 63px;
    height: 63px;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 2px;
    font-size: 16px;
    cursor: pointer;
    user-select: none;
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
  .myBage {
    position: relative;
    top: -12px;
    right: 40px;
    cursor: pointer;
  }
  .searchBox {
    position: relative;
    top: -10px;
    right: 20px;
    color: #fff;
    font-size: 18px;
    cursor: pointer;
  }

  .notice-list-box, .notice-detail {
    height: 100%;
    background: #efefef;
    opacity: 1;
  }
  .notice-list-box {
    overflow-y: scroll;
    position: relative;
   }
  .drop-box {
    position: absolute;
    right: 75%;
    margin-right: 10px;
    top: -40px;
  }
  .notice-item {
    width: 100%;
    // height: 100px;
    color: #999;
    border-bottom: 1px solid #ccc;
    padding:10px 20px;
    cursor: pointer;
    position: relative;
    background: #fff;
    .operator {
      display: block;
    }
    .time {
      display: block;
    }
    .unRead-icon {
      position: absolute;
      right: 10px;
      top: 0;
      font-size: 20px;
    }
  }
  .notice-item:hover {
    background: rgb(240, 240, 240);
  }
  .notice-item.selectedMes {
    background: rgb(240, 240, 240);
  }
  .detail-header-box {
    height: 70px;
    line-height: 50px;
    padding: 10px;
    border-bottom: 1px solid #ccc;
    .header-item-box {
      display: inline-block;
      padding: 2px 10px;
      background:rgb(241,249,254);
      height: 30px;
      line-height: 25px;
      border-radius: 4px;
      .icon-box {
        font-size: 20px;color: rgb(119,194,248);
      }
      .text {
        color: rgb(122,196,245);
        font-weight: 500;
        font-size: 16px;
      }
    }
  }
  .detail-body {
    min-height: 200px;
    background: #fff;
    padding: 20px;
    font-size: 18px;
    color: #555;
  }
  .detail-footer {
    min-height: 100px;
    padding: 10px 20px;
    .icons {
      font-size: 20px;
      margin-right: 4px;
      position: relative;
      top: 1px;
    }
  }
  /*// 蒙层
  .mask {
    background: #ebf1f6;
    position: absolute;
    z-index: 100;
    height: 60px;
    width: 100%;
  }*/
</style>
