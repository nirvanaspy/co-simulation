import request from '../utils/request'

// 根据用户查询消息
export function getMesByUser(id) {
  return request({
    url: '/messages/' + id,
    method: 'get'
  })
}

// 全部标记为已读
export function readAllMes(data) {
  return request({
    url: '/messages/readAll',
    method: 'patch',
    data
  })
}

// 将消息标记为已读
export function readMes(data) {
  return request({
    url: '/messages',
    method: 'patch',
    data
  })
}

// 清空所有已读消息
export function clearAllRead(data) {
  return request({
    url: '/messages/clearAllRead',
    method: 'post',
    data
  })
}

export function getMessages() {
  return request({
    url: '/messages/messages',
    method: 'get'
  })
}
