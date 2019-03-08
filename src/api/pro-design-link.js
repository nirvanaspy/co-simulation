import request from '../utils/request'

export function getLinks(proId) {
  return request({
    url: '/subtasks/byProject/' + proId,
    method: 'get',
    params: {
      deleted: false
    }
  })
}

// 新建子任务
export function setProLinks(proId, data) {
  return request({
    url: '/subtasks/byProject/' + proId + '/setDesignLink',
    method: 'patch',
    data
  })
}

// 更新子任务信息
export function updateProDesignLink(id, data) {
  return request({
    url: '/subtasks/' + id + '/updateDesignLink',
    method: 'patch',
    data
  })
}

// 删除子任务
export function deleteSubtask(id) {
  return request({
    url: '/subtasks/' + id,
    method: 'delete'
  })
}

// 获取子任务文件
export function getTaskFiles(id, parent) {
  return request({
    url: '/subtasks/' + id + '/files',
    method: 'get',
    headers: {
      'parentNodeId': parent
    }
  })
}

// 下载文件
export function downloadtaskFile(id, userId) {
  return request({
    url: '/subtasksFiles/' + id + '/export',
    method: 'get',
    params: {
      userId: userId
    }
  })
}

// 设置审核员
export function setAuditors(proId, data) {
  return request({
    url: '/subtasks/' + proId + '/arrangeAssessors',
    method: 'patch',
    data
  })
}

// 更新文件信息
export function editFileInfo(id, data) {
  return request({
    url: '/proDesignLinkFiles/' + id,
    method: 'patch',
    data
  })
}

// 删除文件
export function deleteTaskFile(id, data) {
  return request({
    url: '/proDesignLinkFiles/' + id,
    method: 'delete',
    data
  })
}

// 根据模版创建子任务
export function createProcessNodes(id, data) {
  return request({
    url: '/processNodes',
    headers: {
      projectId: id,
      'Content-Type': 'application/json'
    },
    method: 'post',
    data
    /* data: {
      processNodeEntities: JSON.stringify([{ a: 'a' }, { b: 'c' }, { d: 'd' }])
    }*/
  })
}
