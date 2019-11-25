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
export function updateProDesignLink(uid, pid, data) {
  return request({
    url: '/subtasks/' + uid + '/byProject/' + pid,
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

// 查询子任务详情
export function getSubtaskDetail(id) {
  return request({
    url: '/subtasks/' + id,
    method: 'get'
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
    url: '/subtaskFiles/' + id,
    method: 'patch',
    data
  })
}

// 删除文件
export function deleteTaskFile(id, data) {
  return request({
    url: '/subtaskFiles/' + id,
    method: 'delete',
    data
  })
}

// 根据模版创建子任务
export function createProcessNodes(id, data) {
  return request({
    url: '/processNode1',
    headers: {
      projectId: id,
      'Content-Type': 'application/json'
    },
    method: 'post',
    data
  })
}

// 根据模版创建子任务流程关系
export function createProcessLinks(id, data) {
  return request({
    url: '/links',
    headers: {
      projectId: id,
      'Content-Type': 'application/json'
    },
    method: 'post',
    data
  })
}

// 根据项目查询流程
export function getProcessNodes(id) {
  return request({
    url: '/processNode1/byProjectId/' + id,
    method: 'get'
  })
}

// 根据用户id查询审核的子任务
export function getAuditTasks(id) {
  return request({
    url: '/subtasks/byAssessorId/' + id,
    method: 'get'
  })
}

// 审核
export function assessSubtask(id, data) {
  return request({
    url: '/subtasks/' + id + '/subtaskAudit',
    method: 'patch',
    data
  })
}

// 查询审批意见
export function getOpinion(id, state) {
  return request({
    url: '/subtasks/' + id + '/illustration',
    method: 'get',
    params: {
      state: state
    }
  })
}

// 查询所有流程审批意见
export function getAllOpinion(id, state) {
  return request({
    url: '/subtasks/' + id + '/Allillustration',
    method: 'get',
    params: {
      state: state
    }
  })
}

// 申请二次修改子任务
export function applyForTaskAudit(id, data) {
  return request({
    url: '/subtasks/' + id + '/applyForModify',
    method: 'post',
    data
  })
}

// 查询用户的二次修改申请
export function getTaskEditApply(id) {
  return request({
    url: '/subtasks/findModifyToBeAudit',
    method: 'get',
    params: {
      userId: id
    }
  })
}

// 通过或者驳回二次修改申请
export function handleTaskEditApply(id, data) {
  return request({
    url: '/subtasks/' + id + '/handleModifyApply',
    method: 'post',
    data
  })
}

// 修改子任务文件
export function modifyTaskFile(fileId, data) {
  return request({
    url: '/subtaskFiles/' + fileId + '/modifySubtaskFiles',
    headers: {
      'content-type': 'application/json;charset=utf-8'
    },
    method: 'post',
    data
  })
}

// 根据用户查询项目
export function getProjectsByUser(id) {
  return request({
    url: '/subtasks/findProjectsByUserId/' + id,
    method: 'get'
  })
}

// 查询子任务树
export function getProjectsTree(secretClass) {
  return request({
    url: '/subtasks/getProjectTrees',
    headers: {
      userSecretClass: secretClass
    },
    method: 'get'
  })
}

// 撤销子任务文件修改
export function revokeTaskFileModify(fileId) {
  return request({
    url: '/subtaskFiles/' + fileId + '/revokeModify',
    method: 'patch'
  })
}

// 修改文件版本
export function taskFileVersionReplace(fileId, data) {
  return request({
    url: '/subtaskFiles/' + fileId + '/versionReplace',
    method: 'patch',
    data
  })
}

// 查询文件版本
export function getTaskFileVersion(fileId) {
  return request({
    url: '/subtaskFiles/' + fileId + '/getSublibraryHistoriesFiles',
    method: 'get'
  })
}

// 查询项目是否有流程
export function ifProHasProcessNode(data) {
  return request({
    url: '/processNode1/ifHasProcessNode',
    method: 'post',
    data
  })
}

// 查询已存在的同名文件
export function findExistTaskFiles(id, data) {
  return request({
    url: '/subtasks/' + id + '/findExistSubtaskFiles',
    method: 'post',
    headers: {
      'content-type': 'application/json;charset=utf-8'
    },
    data
  })
}

// 批量删除文件
export function deleteFileInBranch(data) {
  return request({
    url: '/subtaskFiles/deleteFilesInBatch',
    method: 'patch',
    data
  })
}
