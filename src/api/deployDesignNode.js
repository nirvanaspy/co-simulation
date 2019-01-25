import request from '../utils/request'

export function deployNodeList(id, listQuery) {
  return request({
    url: 'deploymentdesigns/' + id + '/deploymentdesignnodes',
    method: 'get',
    params: {
      size: listQuery.size,
      page: listQuery.page
    }
  })
}

// 查询部署设计下所有已绑定设备
export function getAllBindDevices(id) {
  return request({
    url: 'deploymentdesigns/' + id + '/devices',
    method: 'get'
  })
}

// 新建节点
export function createDeployplanNode(id) {
  return request({
    url: 'deploymentdesigns/' + id + '/deploymentdesignnode',
    method: 'post'
  })
}

// 删除节点
export function deleteDeployplanNode(id) {
  return request({
    url: 'deploymentdesignnodes/' + id,
    method: 'delete'
  })
}

// 绑定设备到节点
export function bindDeviceToNode(nodeId, deviceId) {
  return request({
    url: 'deploymentdesignnodes/' + nodeId + '/device/' + deviceId + '/bind',
    method: 'post'
  })
}

// 解绑设备
export function unbindDeviceByNode(nodeId) {
  return request({
    url: 'deploymentdesignnodes/' + nodeId + '/unbind',
    method: 'delete'
  })
}

// 查询部署节点绑定详情
export function getNodeDetail(id) {
  return request({
    url: 'deploymentdesignnodes/' + id + '/deploymentdesigndetails',
    method: 'get'
  })
}

// 绑定组件到部署设计节点(单个绑定）
export function bindCompToNode(nodeId, data) {
  // /deploymentdesignnodes/{deploymentDesignNodeId}/deploymentdesigndetailbycomponent
  return request({
    url: 'deploymentdesignnodes/' + nodeId + '/deploymentdesigndetailbycomponent',
    method: 'post',
    data
  })
}

// 绑定组件到部署设计节点(多个绑定）
export function bindCompsToNode(nodeId, data) {
  return request({
    url: 'deploymentdesignnodes/' + nodeId + '/deploymentdesigndetailbycomponents',
    method: 'post',
    data
  })
}

// 绑定组件历史版本到部署设计节点(多个绑定）
export function bindCompHisToNode(nodeId, data) {
  return request({
    url: 'deploymentdesignnodes/' + nodeId + '/deploymentdesigndetailbycomponenthistorys',
    method: 'post',
    data
  })
}

// 删除部署节点详情（解绑组件）
export function deleteBindDetail(id) {
  return request({
    url: 'deploymentdesigndetails/' + id,
    method: 'delete'
  })
}

export function deleteDeployplan(id) {
  return request({
    url: 'deploymentdesigns/' + id,
    method: 'delete'
  })
}

export function deployplanDetailsList(deploymentDesignId) {
  return request({
    url: '/deploymentdesigns/' + deploymentDesignId + '/deploymentdesigndetails',
    method: 'get'
  })
}

export function deployplanDevice(deploymentDesignId) {
  return request({
    url: '/deploymentdesigns/' + deploymentDesignId + '/devices',
    method: 'get'
  })
}

export function getDeployDetailByDevice(deploymentDesignId, deviceid) {
  return request({
    url: '/deploymentdesigns/' + deploymentDesignId + '/deploymentdesigndetail',
    method: 'get',
    params: {
      deviceId: deviceid
    }
  })
}

// 获取可绑定组件
export function getAvailableComps(nodeId) {
  return request({
    url: '/deploymentdesignnodes/' + nodeId + '/components',
    method: 'get'
  })
}

// 绑定组件历史到节点
export function bindSingleCompHisToNode(nodeId, compHisId) {
  return request({
    url: 'deploymentdesignnodes/' + nodeId + '/componenthistory/' + compHisId + '/bind',
    method: 'post'
  })
}

// 更新已绑定组件历史版本
export function updateCompHisToNode(detailId, compHisId) {
  return request({
    url: 'deploymentdesigndetails/' + detailId + '/componenthistory/' + compHisId + '/bind',
    method: 'patch'
  })
}
