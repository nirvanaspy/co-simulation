<template>
  <div class="login-container">
    <div class="page-login--layer page-login--layer-area">
      <ul class="circles">
        <li v-for="n in 10" :key="n"></li>
      </ul>
    </div>
    <div
      class="page-login--layer page-login--layer-time"
      flex="main:center cross:center">
      {{time}}
    </div>
    <el-form class="login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
      <div class="title-container">
        <!--<div class="sys-title">co-simulation</div>-->
        <h3 class="title">{{$t('login.title')}}</h3>
      </div>
      <div class="form-container">
        <el-form-item prop="username">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
          <el-input name="username" type="text" v-model="loginForm.username" autoComplete="on" placeholder="username" />
        </el-form-item>

        <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
          <el-input name="password" :type="passwordType" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="on" placeholder="password" />
          <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
        </el-form-item>

        <el-button type="primary" style="width:100%;margin-bottom:20px;" :loading="loading" @click.native.prevent="handleLogin">{{$t('login.logIn')}}</el-button>
        <!--<div class="register-container">
          <span class="register-tips">没有账号？</span>
          <span class="register-btn" @click="jumpToRegister">注册</span>
        </div>-->
      </div>
    </el-form>
  </div>
</template>

<script>
import { isvalidUsername } from '@/utils/validate'
import { mapMutations } from 'vuex'
import dayjs from 'dayjs'
/* eslint-disable */
export default {
  name: 'login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error('请输入正确的用户名！'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 1) {
        callback(new Error('请输入正确的密码！'))
      } else {
        callback()
      }
    }
    return {
      timeInterval: null,
      time: dayjs().format('HH:mm:ss'),
      loginForm: {
        username: '',
        password: '',
        ipConfig: '192.168.31.13',
        port: 8080
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'password',
      loading: false,
      showDialog: false
    }
  },
  methods: {
    jumpToRegister() {
      this.$router.replace('/register')
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        let username = this.loginForm.username;
        let password = this.loginForm.password;
        let expireDays = 30;
        if (valid) {
          this.loading = true
          this.setCookie('username', username, expireDays)

          let qs = require('qs');
          let formData = qs.stringify({
            "username": username,
            'password': password,
            'grant_type': 'password',
            'scope': 'SCOPES',
            'client_id': 'OAUTH_CLIENT_ID',
            'enctype': 'OAUTH_CLIENT_ID'
          })

          this.$store.dispatch('LoginByUsername', formData).then(() => {
            this.loading = false

            // if(this.$store.getters.roles.includes('ROLE_ADMIN')) {
            if(this.loginForm.username === 'admin') {
              this.$router.push({ path: '/user_manage/index' })
            } else {
              this.$router.push({ path: '/projectManage' })
            }
            // this.$router.push({ path: '/' })
          }).catch(() => {
            this.loading = false
            this.$notify({
              title: '失败',
              message: '登录失败',
              type: 'error',
              duration: 1000
            })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    refreshTime () {
      this.time = dayjs().format('HH:mm:ss')
    },
    ...mapMutations({
      setToken: 'SET_TOKEN',
      setRoles: 'SET_ROLES',
      setName: 'SET_NAME',
      setIP: 'SET_IP',
      setPort: 'SET_PORT',
      setloginname: 'SET_LOGINNAME'
    })
  },
  created() {
    if(this.getCookie('username')) {
      this.loginForm.username = this.getCookie('username')
    }
  },
  mounted () {
    this.timeInterval = setInterval(() => {
      this.refreshTime()
    }, 1000)
  },
  beforeDestroy () {
    clearInterval(this.timeInterval)
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg:#2d3a4b;
$light_gray:#eee;

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 40px;
    width: 85%;
    input {
      background: #fff;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 6px 5px 6px 15px;
      color: #495057;
      height: 40px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px rgb(255,255,255) inset !important;
        -webkit-text-fill-color: #495057 !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgb(229, 229, 229);
    background: #fff;
    border-radius: 5px;
    // color: #454545;
    color: $light_gray;
  }
}
.register-container{
  text-align: center;
  font-size: 14px;
  color:#212529;
  .register-tips{
    margin-right: 4px;
  }
  .register-btn{
    color:#36a3f7;
    cursor: pointer;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;
.sys-title {
  background: linear-gradient(to right, #5983e8, #00e4d0);
  -webkit-background-clip: text;
  color: transparent;
}
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background: url("./login-back.jpg") center center no-repeat;
  background-size: cover;
  .login-form {
    position: absolute;
    top: 40%;
    left: 50%;
    width: 600px;
    height: 400px;
    padding: 35px 35px 15px 35px;
    margin-top: -200px;
    margin-left: -300px;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 2px 5px 2px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    &_login,&_ip {
      font-size: 20px;
    }
  }
  .svg-container.svg-container_login {
    padding-left: 13px;
  }
  .title-container {
    position: relative;
    .title {
      font-size: 30px;
      font-weight: 500;
      color: rgb(33, 37, 41);
      margin: 0px auto 40px auto;
      text-align: center;
    }
    .set-language {
      color: #fff;
      position: absolute;
      top: 5px;
      right: 0px;
    }
  }
  .form-container {
    background: #fff;
    padding: 40px 40px 20px;
    border-radius: 4px;
    box-shadow: 0 -25px 37.7px 11.3px rgba(8, 143, 220, 0.07);
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 3px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
// 背景
.circles {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    li {
      position: absolute;
      display: block;
      list-style: none;
      width: 20px;
      height: 20px;
      background: #FFF;
      animation: animate 25s linear infinite;
      bottom: -200px;
      @keyframes animate {
        0%{
          transform: translateY(0) rotate(0deg);
          opacity: 1;
          border-radius: 0;
        }
        100%{
          transform: translateY(-1000px) rotate(720deg);
          opacity: 0;
          border-radius: 50%;
        }
      }
      &:nth-child(1) {
        left: 15%;
        width: 80px;
        height: 80px;
        animation-delay: 0s;
      }
      &:nth-child(2) {
        left: 5%;
        width: 20px;
        height: 20px;
        animation-delay: 2s;
        animation-duration: 12s;
      }
      &:nth-child(3) {
        left: 70%;
        width: 20px;
        height: 20px;
        animation-delay: 4s;
      }
      &:nth-child(4) {
        left: 40%;
        width: 60px;
        height: 60px;
        animation-delay: 0s;
        animation-duration: 18s;
      }
      &:nth-child(5) {
        left: 65%;
        width: 20px;
        height: 20px;
        animation-delay: 0s;
      }
      &:nth-child(6) {
        left: 75%;
        width: 150px;
        height: 150px;
        animation-delay: 3s;
      }
      &:nth-child(7) {
        left: 35%;
        width: 200px;
        height: 200px;
        animation-delay: 7s;
      }
      &:nth-child(8) {
        left: 50%;
        width: 25px;
        height: 25px;
        animation-delay: 15s;
        animation-duration: 45s;
      }
      &:nth-child(9) {
        left: 20%;
        width: 15px;
        height: 15px;
        animation-delay: 2s;
        animation-duration: 35s;
      }
      &:nth-child(10) {
        left: 85%;
        width: 150px;
        height: 150px;
        animation-delay: 0s;
        animation-duration: 11s;
      }
    }
  }
// 层
.page-login--layer {
  // @extend %full;
  overflow: auto;
}
.page-login--layer-area {
  overflow: hidden;
}
// 时间
.page-login--layer-time {
  text-align: center;
  font-size: 3em;
  font-weight: bold;
  color: rgba(64, 64, 64, 0.05);
  overflow: hidden;
}
</style>
