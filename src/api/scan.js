import request from '../utils/request'

export function scanDevice(planId, deviceId) {
  return request({
    url: '/deploymentdesigns/' + planId + '/device/' + deviceId + '/scan',
    method: 'get'
  })
}

export function scanComp(planId, deviceId, compId) {
  return request({
    url: '/deploymentdesigns/' + planId + '/device/' + deviceId + '/component/' + compId + '/scan',
    method: 'get'
  })
}

export function scanQucikByDev(planId, deviceId, extensions) {
  return request({
    url: '/deploymentdesigns/' + planId + '/device/' + deviceId + '/scan',
    method: 'get',
    params: {
      extensions: extensions
    }
  })
}

export function scanQucikByComp(planId, deviceId, compId, extensions) {
  return request({
    url: '/deploymentdesigns/' + planId + '/device/' + deviceId + '/component/' + compId + '/scan',
    method: 'get',
    params: {
      extensions: extensions
    }
  })
}
// 扫描节点/设备
export function scanNode(nodeId) {
  return request({
    url: '/deploymentdesignnodes/' + nodeId + '/scan',
    method: 'get'
  })
}
// 快速扫描节点/设备
export function scanQuickNode(nodeId, extensions) {
  return request({
    url: '/deploymentdesignnodes/' + nodeId + '/scan',
    method: 'get',
    params: {
      extensions: extensions
    }
  })
}

// 扫描节点/设备上的组件
export function scanNodeDetail(comId) {
  return request({
    url: '/deploymentdesigndetails/' + comId + '/scan',
    method: 'get'
  })
}
// 快速扫描组件
export function scanQuickNodeDetail(comId, extensions) {
  return request({
    url: '/deploymentdesigndetails/' + comId + '/scan',
    method: 'get',
    params: {
      extensions: extensions
    }
  })
}

// 按orderId 获取扫描结果
export function getResultByOrder(id) {
  return request({
    url: '/deploymentdesignscanresults',
    method: 'get',
    params: {
      orderId: id
    }
  })
}
