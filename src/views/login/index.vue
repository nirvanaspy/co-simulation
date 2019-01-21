<template>
  <div class="login-container">
    <el-form class="login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
      <div class="title-container">
        <h3 class="title">{{$t('login.title')}}</h3>
        <lang-select class="set-language"></lang-select>
      </div>
      <!--<div class="ipContainer">
        <el-form-item prop="ipConfig" class="ipform">
          <span class="svg-container svg-container_ip">
            <svg-icon icon-class="IP" />
          </span>
          <el-input name="ipConfig" type="text" v-model="loginForm.ipConfig" autoComplete="on" placeholder="IP地址" />
        </el-form-item>
        &lt;!&ndash;<span class="colon">:</span>&ndash;&gt;
        <el-form-item prop="port" class="portform">
          <span class="svg-container">
            <svg-icon icon-class="port" />
          </span>
          <el-input name="port" type="text" v-model="loginForm.port" autoComplete="on" placeholder="端口号" />
        </el-form-item>
      </div>-->
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
          <svg-icon icon-class="eye" />
        </span>
      </el-form-item>

      <el-button type="primary" style="width:100%;margin-bottom:30px;" :loading="loading" @click.native.prevent="handleLogin">{{$t('login.logIn')}}</el-button>
      <div class="register-container">
        <span class="register-tips">没有账号？</span>
        <span class="register-btn" @click="jumpToRegister">注册</span>
      </div>
    </el-form>
  </div>
</template>

<script>
import { isvalidUsername } from '@/utils/validate'
import LangSelect from '@/components/LangSelect'
import { mapMutations } from 'vuex'
import service from '@/utils/request'
// import { getUserId } from '@/api/getUsers'
/* eslint-disable */
export default {
  components: { LangSelect},
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
        /*let ip = this.loginForm.ipConfig;
        let port = this.loginForm.port;*/
        let expireDays = 30;
        if (valid) {
          this.loading = true
          this.setCookie('username', username, expireDays)
          // this.setCookie('password', password, expireDays)
          /*this.setCookie('ip', ip, expireDays)
          this.setCookie('port', port, expireDays)
          service.defaults.baseURL = 'http://' + ip + ':' + port + '/apis' // 动态设置api接口*/

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
            /*getUserId().then((res) => {
              this.setCookie('userId', res.data.data.id)
            })*/
            this.$router.push({ path: '/projectManage' })
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
    /*if(this.getCookie('ip')) {
      this.loginForm.ipConfig = this.getCookie('ip')
    }
    if(this.getCookie('port')) {
      this.loginForm.port = this.getCookie('port')
    }*/
    if(this.getCookie('username')) {
      this.loginForm.username = this.getCookie('username')
    }
    /*this.setIP(this.loginForm.ipConfig)
    this.setPort(this.loginForm.port)*/
    // window.addEventListener('hashchange', this.afterQRScan)
  },
  destroyed() {
    // window.removeEventListener('hashchange', this.afterQRScan)
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
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    // color: #454545;
    color: $light_gray;
  }
  /*.ipContainer {
    .el-form-item.ipform{
      width:55%;
      display: inline-block;
    }
    .ipform .el-input{
      width:60%;
    }
    .colon {
      display: inline-block;
      text-align: center;
      width: 5%;
      color:#fff;
    }
    .el-form-item.portform{
      width:40%;
      display: inline-block;
      float: right;
    }
    .portform .el-input{
      width:40%
    }
  }*/
}
.register-container{
  text-align: center;
  font-size: 14px;
  color:$light_gray;
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
  background-color: $bg;
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 520px;
    padding: 35px 35px 15px 35px;
    margin: 0 auto;
    top: 40%;
    margin-top: -200px;
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
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    &_login,&_ip {
      font-size: 20px;
    }
  }
  .title-container {
    position: relative;
    .title {
      font-size: 26px;
      font-weight: 400;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
    .set-language {
      color: #fff;
      position: absolute;
      top: 5px;
      right: 0px;
    }
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .thirdparty-button {
    position: absolute;
    right: 35px;
    bottom: 28px;
  }
}
</style>
