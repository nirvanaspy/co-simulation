import request from '@/utils/request'

// 查询子库文件
export function getSubLibFiles(id, flag) {
  return request({
    url: '/sublibraryFiles/bySublibraryId/' + id + '/files',
    method: 'get',
    params: {
      ifApprove: flag
    }
  })
}

// 上传子库文件
export function uploadSubLibFiles(subLibId, userId, data) {
  return request({
    url: '/sublibraries/' + subLibId + '/uploadfiles/byUser/' + userId,
    method: 'post',
    headers: {
      'content-type': 'application/json;charset=utf-8'
    },
    data
  })
}

// 更新文件信息
export function editSubLibFileInfo(id, data) {
  return request({
    url: '/sublibraryFiles/' + id,
    method: 'patch',
    data
  })
}

// 删除文件
export function deleteSubLibFile(id, data) {
  return request({
    url: '/sublibraryFiles/' + id,
    method: 'delete',
    data
  })
}

// 指定子库文件审核人
export function setLibFileAuditors(id, data) {
  return request({
    url: '/sublibraryFiles/arrangeAudit',
    method: 'patch',
    data
  })
}

// 根据用户查询待审核的文件
export function getAuditLibFilesByUser(id) {
  return request({
    url: '/sublibraryFiles/' + id + '/findToBeAuditedFiles',
    method: 'get'
  })
}

// 用户审核文件
export function auditLibFile(id, data) {
  return request({
    url: '/sublibraryFiles/' + id + '/sublibraryFileAudit',
    method: 'patch',
    data
  })
}

// 查看审核详情
export function getFileAudits(fileId, time) {
  return request({
    url: '/sublibraryFilesAudits/' + fileId,
    method: 'get',
    params: {
      sublibraryDate: time
    }
  })
}

// 申请二次修改
export function applyForModify(fileId, data) {
  return request({
    url: '/sublibraryFiles/' + fileId + '/applyForModify',
    method: 'post',
    data
  })
}

// 管理员查询用户的二次修改申请
export function getEditApply(fileId) {
  return request({
    url: '/sublibraryFiles/findModifyToBeAudit',
    method: 'get'
  })
}

// 管理员通过或者驳回二次修改申请
export function handleApply(fileId, data) {
  return request({
    url: '/sublibraryFiles/' + fileId + '/handleModifyApply',
    method: 'post',
    data
  })
}

// 二次修改文件
export function modifySubLibFile(fileId, data) {
  return request({
    url: '/sublibraryFiles/' + fileId + '/modifySublibraryFile',
    headers: {
      'content-type': 'application/json;charset=utf-8'
    },
    method: 'post',
    data
  })
}

// 撤销修改文件
export function revokeModify(fileId) {
  return request({
    url: '/sublibraryFiles/' + fileId + '/revokeModify',
    method: 'patch'
  })
}

// 修改文件版本
export function versionReplace(fileId, data) {
  return request({
    url: '/sublibraryFiles/' + fileId + '/versionReplace',
    method: 'patch',
    data
  })
}

// 查询文件历史版本
export function getFileHisVersion(fileId) {
  return request({
    url: '/sublibraryFiles/' + fileId + '/getSublibraryHistoriesFiles',
    method: 'get'
  })
}

// 搜索库文件
export function searchFiles(data) {
  return request({
    url: '/sublibraryFiles/multiInquire',
    headers: {
      'content-type': 'application/json;charset=utf-8'
    },
    method: 'post',
    data
  })
}

// 查询文件树
export function getFileTree(fileId) {
  return request({
    url: '/sublibraryFiles/getLibraryTrees',
    method: 'get'
  })
}

// 查询未通过的子库文件
export function getFailedFiles(subLibId, userId) {
  return request({
    url: '/sublibraryFiles/getFailedFiles',
    headers: {
      'userId': userId
    },
    method: 'get',
    params: {
      subDepotId: subLibId
    }
  })
}

// 查询子库文件历史版本
export function getSubHisFiles(fileId) {
  return request({
    url: '/sublibraryFiles/' + fileId + '/getSublibraryHistoriesFiles',
    method: 'get'
  })
}

// 根据二次修改申请者查询待二次修改的文件
export function getSubFilesByApplicant(subLibId, userId) {
  return request({
    url: '/sublibraryFiles/modifyFilesByApplicant/' + userId,
    method: 'get',
    params: {
      subdepotId: subLibId
    }
  })
}
