/* eslint-disable */
import Vue from 'vue'
import axios from 'axios'
import store from '@/store'
import { getToken, getRefreshToken, setToken, setRefreshToken, getIp, getPort, getExpire, getExpire2, setExpire, setExpire2, removeExpire, removeExpire2 } from '@/utils/auth'
// create an axios instance
let ipConfig = getIp()
let portConfig = getPort()
// let serviceConfig = 'http://' + ipConfig + ':' + portConfig + '/apis'
// let serviceConfig = 'http://127.0.0.1:8080' + '/apis'
let serviceConfig = 'http://192.168.1.147:8080'
// let serviceConfig = 'http://127.0.0.1:8080'
// let serviceConfig = 'http://192.168.31.13:8080' + '/apis'

let timeStamp = getExpire()
let refreshTimeStamp = getExpire2()
let qs = require('qs')
const service = axios.create({
  baseURL: serviceConfig // api的base_url
  /* baseURL: "http://192.168.0.107:9090",*/// api的base_url

})
let isRefreshing = false
let refreshSubscribers = []

function subscribeTokenRefresh(cb) {
  refreshSubscribers.push(cb)
}

function onRefreshed(token) {
  refreshSubscribers.map(cb => cb(token))
}

// request interceptor
service.interceptors.request.use(config => {
  if (store.getters.token) {
    config.headers['Authorization'] = 'Bearer' + getToken() // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone interceptor
service.interceptors.response.use(
  // response => response,
  response => {
    return response
  },
  error => {
    if (error.response) {
      if (error.response.status === 401) {
        console.log('ACCESS TOKEN EXPIRED!');
        if(!isRefreshing) {
          isRefreshing = true
          let refreshTo = getRefreshToken()
          let datapost = qs.stringify({
            'grant_type': 'refresh_token',
            'client_id': 'OAUTH_CLIENT_ID',
            'client_secret': 'OAUTH_CLIENT_SECRET',
            'refresh_token': refreshTo
          })
          axios({
            method: 'post',
            url: service.defaults.baseURL + '/oauth/token',
            auth: {
              username: 'OAUTH_CLIENT_ID',
              password: 'OAUTH_CLIENT_SECRET'
            },
            data: datapost
          }).then(function(res) {
            isRefreshing = false
            setToken(res.data.access_token)
            setRefreshToken(res.data.refresh_token)
            store.commit('SET_TOKEN', res.data.access_token)
            onRefreshed(res.data.access_token)
            // 必须置于数组，否则之前每次token过期后被挂起的所有请求会全部重发一遍（包括已经请求成功的）
            refreshSubscribers = []
          }).catch(function (err) {
            console.log('Refresh login error: ', error);
            // console.log(err.response.status)
            Vue.prototype.$confirm('当前登录状态已过期，请重新登录', '系统提示', {
              confirmButtonText: '重新登录',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              removeExpire('timestamp')
              removeExpire2('timestamp')
              store.dispatch('FedLogOut').then(() => {
                location.reload();// 为了重新实例化vue-router对象 避免bug
              });
            })
            throw error;
          })
        }
        const retryOrigReq = new Promise((resolve, reject) => {
          subscribeTokenRefresh(token => {
            error.response.config.headers['Authorization'] = 'Bearer ' + token
            resolve(axios(error.response.config))
          })
        })
        return retryOrigReq
      }
    }
    return Promise.reject(error)
  })

export default service
