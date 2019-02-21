import { loginByUsername, logout, getUserInfo } from '@/api/login'
import { getToken, getRefreshToken, setToken, setRefreshToken, removeToken, removeRefreshToken, setUserId, removeUserId, removeProId, setExpire, setExpire2, removeExpire, removeExpire2 } from '@/utils/auth'
const jwt = require('jsonwebtoken')

const user = {
  state: {
    user: '',
    status: '',
    code: '',
    token: getToken(),
    refreshToken: getRefreshToken(),
    name: '',
    avatar: '',
    introduction: '',
    roles: [],
    ipconfig: '',
    port: '',
    loginname: '',
    setting: {
      articlePlatform: []
    }
  },

  mutations: {
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_REFRESHTOKEN: (state, token) => {
      state.refreshToken = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_IP: (state, ipconfig) => {
      state.ipconfig = ipconfig
    },
    SET_PORT: (state, port) => {
      state.port = port
    },
    SET_LOGINNAME: (state, loginname) => {
      state.loginname = loginname
    }
  },
  /* eslint-disable */
  actions: {
    // 用户名登录
    LoginByUsername({ commit }, formData) {
      return new Promise((resolve, reject) => {
        removeExpire()
        removeExpire2()
        loginByUsername(formData).then(response => {
          const access_token = response.data.access_token
          const refresh_token = response.data.refresh_token
          commit('SET_TOKEN', access_token)
          commit('SET_REFRESHTOKEN', refresh_token)
          setToken(access_token)
          setRefreshToken(refresh_token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        if (!state.token) { // 由于mockjs 不支持自定义状态码只能这样hack
          reject('error')
          console.log('hasNoToken')
        }
        const data = state.token
        const refreshToken = state.refreshToken
        const decodeToken = jwt.decode(data)
        const decodeRefreshToken = jwt.decode(refreshToken)
        // const dateNow = (new Date())/1000
        setUserId(decodeToken.userId)
        setExpire(decodeToken.exp)
        setExpire2(decodeRefreshToken.exp)   //refreshToken
        // const rolesset = decodeToken.authorities.length > 1 ? 'admin' : 'editor'
        const rolesset = decodeToken.authorities[0] ==  'ROLE_ADMIN' ? 'admin' : 'editor'
        console.log(decodeToken.authorities[0])
        commit('SET_ROLES', rolesset)
        resolve()
      })
    },
    // 第三方验证登录
    // LoginByThirdparty({ commit, state }, code) {
    //   return new Promise((resolve, reject) => {
    //     commit('SET_CODE', code)
    //     loginByThirdparty(state.status, state.email, state.code).then(response => {
    //       commit('SET_TOKEN', response.data.token)
    //       setToken(response.data.token)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_REFRESHTOKEN', '')
          commit('SET_ROLES', [])
          removeExpire()
          removeExpire2()
          removeToken()
          removeRefreshToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        commit('SET_REFRESHTOKEN', '')
        commit('SET_ROLES', [])
        removeExpire()
        removeExpire2()
        removeToken()
        removeRefreshToken()
        removeUserId()
        removeProId()
        resolve()
      })
    },

    // 动态修改权限
    ChangeRoles({ commit }, role) {
      return new Promise(resolve => {
        commit('SET_TOKEN', role)
        setToken(role)
        getUserInfo(role).then(response => {
          const data = response.data
          commit('SET_ROLES', data.roles)
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          commit('SET_INTRODUCTION', data.introduction)
          resolve()
        })
      })
    }
  }
}

export default user
