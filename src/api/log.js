import request from '../utils/request'

export function logList() {
  return request({
    url: '/downLogs',
    method: 'get'
  })
}

