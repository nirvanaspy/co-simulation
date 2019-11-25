import request from '../utils/request'

export function hasMd5(md5) {
  return request({
    url: '/files/hasmd5/',
    method: 'get',
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    params: {
      MD5: md5
    }
  })
}

export function mergeFile(data) {
  return request({
    url: '/files/chunks/merge',
    method: 'post',
    timeout: 1000 * 60 * 30,
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data
  })
}

export function uploadFiles(compId, proId, data) {
  return request({
    url: '/subtasks/' + compId + '/uploadfiles',
    method: 'post',
    headers: {
      'content-type': 'application/json;charset=utf-8',
      'projectId': proId
    },
    data
  })
}

export function modifyFiles(compId, proId, data) {
  return request({
    url: '/subtaskFiles/' + compId + '/modifySubtaskFiles',
    method: 'post',
    headers: {
      'content-type': 'application/json;charset=utf-8',
      'projectId': proId
    },
    data
  })
}
