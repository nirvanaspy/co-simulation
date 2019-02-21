import request from '@/utils/request'
/* eslint-disable */
export function loginByUsername(data) {
  return request({
    url: '/oauth/token',
    method: 'post',
    auth: {
      username: 'OAUTH_CLIENT_ID',
      password: 'OAUTH_CLIENT_SECRET'
    },
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data
  })
}

export function logout() {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}

export function getUserInfo(token) {
  return request({
    url: '/users/login',
    method: 'get',
    auth:{
      username:'admin',
      password:'admin'
    }
    /*params: { token }*/
  })
}

export function refreshToken(data) {
  return request({
    url: '/oauth/token',
    method: 'post',
    auth: {
      username: 'OAUTH_CLIENT_ID',
      password: 'OAUTH_CLIENT_SECRET'
    },
    data
  })
}

