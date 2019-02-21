<template>
  <div class="login-container"
       v-loading.fullscreen.lock="jumpLoading"
       element-loading-text="正在跳转中"
       element-loading-spinner="el-icon-loading"
  >
    <el-form class="login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
      <div class="title-container">
        <h3 class="title">{{$t('login.register')}}</h3>
      </div>
      <div class="form-container">
        <el-form-item prop="username">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
          <el-input name="username" type="text" id="hasUser" v-model="loginForm.username" autoComplete="on" placeholder="请输入用户名" />
        </el-form-item>

        <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
          <el-input name="password" :type="passwordType" @keyup.enter.native="registerUser" v-model="loginForm.password" autoComplete="on" placeholder="请输入密码" />
          <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
        </el-form-item>
        <el-form-item prop="againPassword">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input name="password" :type="passwordTypeAgin" @keyup.enter.native="registerUser" v-model="loginForm.againPassword" autoComplete="on" placeholder="再次输入密码" />
          <span class="show-pwd" @click="showPwdAgin">
            <svg-icon :icon-class="passwordTypeAgin === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>

        <el-button type="primary" style="width:100%;margin-bottom:30px;" :loading="loading" @click.native.prevent="registerUser">注册</el-button>
        <div class="register-container">
          <span class="register-tips">已有账号？</span>
          <span class="register-btn" @click="jumpToLogin">登录</span>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
  import { isvalidUsername, isvalidPwd } from '@/utils/validate'
  import { addUser, UserIfExist } from '../../api/getUsers'
  // import service from '@/utils/request'

  /*eslint-disable*/
  export default {
    name: 'register',
    data() {
      const validateUsername = (rule, value, callback) => {
        if (!isvalidUsername(value)) {
          callback(new Error('账号必须是5-15位的英文字母或数字！'))
        } else {
          // service.defaults.baseURL = 'http://' + this.loginForm.ipConfig + ':' + this.loginForm.port + '/apis'
          /*UserIfExist(this.loginForm.username).then((res) => {
            if(res.data.data) {
              callback(new Error('用户已存在'))
            }else {
              callback()
            }
          }).catch(() => {
            callback()
          })*/
          callback()
        }
      }
      const validatePassword = (rule, value, callback) => {
        if (value.length === 0) {
          callback(new Error('密码不能为空！'))
        } else if (!isvalidPwd(value)) {
          callback(new Error('密码必须是6-16位数字和字母的组合！'))
        } else {
          callback()
        }
      }
      const validatePasswordAgain = (rule, value, callback) => {
        if (value.length === 0) {
          callback(new Error('请再次输入密码！'))
        } else if (this.loginForm.againPassword !== this.loginForm.password) {
          callback(new Error('两次输入的密码不一致！'))
        } else {
          callback()
        }
      }
      return {
        ifExist: false,
        jumpLoading: false,
        loginForm: {
          ipConfig: '192.168.0.117',
          port: '8080',
          username: '',
          password: '',
          againPassword: ''
        },
        loginRules: {
          username: [{required: true, trigger: 'blur', validator: validateUsername}],
          password: [{required: true, trigger: 'blur', validator: validatePassword}],
          againPassword: [{required: true, trigger: 'blur', validator: validatePasswordAgain}]
        },
        passwordType: 'password',
        passwordTypeAgin: 'password',
        loading: false,
        showDialog: false,
        errorMessage: '操作失败！'
      }
    },
    methods: {
      jumpToLogin() {
        this.$router.replace('/login')
      },
      showPwd() {
        if (this.passwordType === 'password') {
          this.passwordType = ''
        } else {
          this.passwordType = 'password'
        }
      },
      showPwdAgin() {
        if (this.passwordTypeAgin === 'password') {
          this.passwordTypeAgin = ''
        } else {
          this.passwordTypeAgin = 'password'
        }
      },
      handleLogin() {
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            this.loading = true
            this.$store.dispatch('LoginByUsername', this.loginForm).then(() => {
              this.loading = false
              this.$router.push({path: '/'})
            }).catch(() => {
              this.loading = false
            })
          } else {
            return false
          }
        })
      },
      hasUser() {
        let username = this.loginForm.username
        UserIfExist(username).then(response => {
          this.ifExist = response.data.data
        })
      },
      registerUser: function () {
        /*service.defaults.baseURL = 'http://' + this.loginForm.ipConfig + ':' + this.loginForm.port + '/apis'
        this.setCookie('ip', this.loginForm.ipConfig)
        this.setCookie('port', this.loginForm.port)*/
        this.$refs['loginForm'].validate((valid) => {
          if(valid) {
            this.loading = true
            let qs = require('qs');
            let data = {
              'username': this.loginForm.username,
              'password': this.loginForm.password
            }
            let datapost = qs.stringify(data)
            addUser(datapost).then(() => {
              this.setCookie('username',this.loginForm.username)
              this.$notify({
                title: '成功',
                message: '注册成功',
                type: 'success',
                duration: 2000
              })
              this.loading = false
              // this.$router.replace('/login')
              let formData = qs.stringify({
                "username": this.loginForm.username,
                'password': this.loginForm.password,
                'grant_type': 'password',
                'scope': 'SCOPES',
                'client_id': 'OAUTH_CLIENT_ID',
                'enctype': 'OAUTH_CLIENT_ID'
              })
              this.jumpLoading = true
              this.$store.dispatch('LoginByUsername', formData).then(() => {
                this.jumpLoading = false
                this.loading = false
                this.$router.push({ path: '/projectManage' })
              }).catch(() => {
                this.loading = false
                this.jumpLoading = false
                this.$notify({
                  title: '失败',
                  message: '登录失败',
                  type: 'error',
                  duration: 1000
                })
              })
            }).catch((error) => {
              this.loading = false
              this.errorMessage = '注册失败，请检查信息填写是否正确！'
              if(error.response.data.message){
                this.errorMessage = error.response.data.message
              }
              this.$notify({
                title: '失败',
                message: this.errorMessage,
                type: 'error',
                duration: 2000
              })
            })
          }
        })
      }
    },
    created() {
      this.jumpLoading = false
    },
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

  .login-container {
    position: fixed;
    height: 100%;
    width: 100%;
    background: url("../login/login-back.jpg") center center no-repeat;
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
</style>
