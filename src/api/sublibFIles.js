import request from '@/utils/request'

// 查询子库文件
export function getSubLibFiles(id) {
  return request({
    url: '/sublibraryFiles/bySublibraryId/' + id + '/files',
    method: 'get'
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
export function getFileAudits(fileId) {
  return request({
    url: '/sublibraryFilesAudits/' + fileId,
    method: 'get'
  })
}

// 申请二次修改
export function applyForModify(fileId) {
  return request({
    url: '/sublibraryFiles/' + fileId + '/applyForModify',
    method: 'post'
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
    method: 'post',
    data
  })
}
