import request from '../utils/request'

export function getDevice(proId) {
  return request({
    url: '/projects/' + proId + '/device',
    method: 'get',
    params: {
      deleted: false
    }
  })
}

export function getDevices(proId, listQuery) {
  return request({
    url: '/projects/' + proId + '/devices',
    method: 'get',
    params: {
      size: listQuery.size,
      page: listQuery.page,
      deleted: false
    }
  })
}
// 获取所有设备 无分页
export function getAllDevices(proId) {
  return request({
    url: '/projects/' + proId + '/device',
    method: 'get',
    params: {
      deleted: false
    }
  })
}

export function saveDevices(proId, data) {
  return request({
    url: '/projects/' + proId + '/device',
    method: 'post',
    data
  })
}

export function deleteDevice(id) {
  return request({
    url: '/devices/' + id,
    method: 'delete'
  })
}

export function updateDevice(id, data) {
  return request({
    method: 'PATCH',
    url: '/devices/' + id,
    /* async: true,
    crossDomain: true*/
    /* headers: {
      'content-type': 'application/json'
    },*/
    data
  })
}

export function copyDevices(id) {
  return request({
    url: '/devices/' + id + '/copy',
    method: 'post',
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    }
  })
}

export function getDisks(id) {
  return request({
    url: '/devices/' + id + '/disks',
    method: 'get',
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    }
  })
}

export function getProcess(id) {
  return request({
    url: '/devices/' + id + '/process',
    method: 'get',
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    }
  })
}

export function reportDevices(proId, data) {
  return request({
    url: '/projects/' + proId + '/device',
    method: 'post',
    data
  })
}

// 回收站
// 获取历史设备
export function getHisDevices(proId, listQuery) {
  return request({
    url: '/projects/' + proId + '/devices',
    method: 'get',
    params: {
      size: listQuery.size,
      page: listQuery.page,
      deleted: true
    }
  })
}
// 清空已删除设备
export function cleanDevice(id) {
  return request({
    url: '/devices/' + id + '/clean',
    method: 'delete'
  })
}

// 恢复已删除设备
export function restoreDev(id) {
  return request({
    url: '/devices/' + id + '/restore',
    method: 'patch'
  })
}
