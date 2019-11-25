import request from '../utils/request'

export function compList(proId, listQuery) {
  return request({
    url: '/projects/' + proId + '/components',
    method: 'get',
    params: {
      // isShowHistory: false,
      deleted: false,
      size: listQuery.limit,
      page: listQuery.page
    }
  })
}
// 全部组件无分页
export function compAll(proId) {
  return request({
    url: '/projects/' + proId + '/component',
    method: 'get',
    params: {
      deleted: false
    }
  })
}
// 已删除组件
export function compListHistory(proId, listQuery) {
  return request({
    url: '/projects/' + proId + '/components',
    method: 'get',
    params: {
      deleted: true,
      size: listQuery.limit,
      page: listQuery.page
    }
  })
}
// 组件历史版本 -- 分页
export function compHisVersion(id, listQuery) {
  return request({
    url: '/components/' + id + '/history',
    method: 'get',
    params: {
      size: listQuery.limit,
      page: listQuery.page
    }
  })
}
// 组件历史版本 -- 无分页
export function compHisVersions(id) {
  return request({
    url: '/components/' + id + '/historys',
    method: 'get'
  })
}

export function createComp(proId, data) {
  return request({
    url: '/projects/' + proId + '/component',
    method: 'post',
    headers: {
      // 'Content-Type': 'multipart/form-data'
      // 'content-type': 'application/json'
      'content-type': 'application/x-www-form-urlencoded'
    },
    data
  })
}

export function updateComp(data, id) {
  return request({
    url: '/components/' + id,
    method: 'PATCH',
    data
  })
}

export function copyComp(data, id) {
  return request({
    url: '/components/' + id + '/copy',
    method: 'post',
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data
  })
}

export function importComp(userData, data) {
  return request({
    url: '/components/import',
    method: 'post',
    auth: {
      username: userData.username,
      password: userData.password
    },
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data
  })
}

export function deleteComp(id) {
  return request({
    url: '/components/' + id,
    method: 'delete'
  })
}

export function compSingle(id) {
  return request({
    url: '/components/' + id,
    method: 'get',
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    }
  })
}

// 组件分类

// 获取组件分类
export function getCompTypes(id) {
  return request({
    url: '/projects/' + id + '/componenttypes',
    method: 'get'
  })
}

// 新建组件分类
export function saveCompTypes(id, data) {
  return request({
    url: '/projects/' + id + '/componenttypes',
    method: 'post',
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data
  })
}

// 删除组件分类
export function deleteCompType(id) {
  return request({
    url: '/componenttypes/' + id,
    method: 'delete'
  })
}

// 修改组件分类
export function updateCompTypes(data, id) {
  return request({
    url: '/componenttypes/' + id,
    method: 'PATCH',
    data
  })
}

// getComById
export function getCompById(id) {
  return request({
    url: '/components/' + id,
    method: 'get'
  })
}

// 组件管理
// savefiles
export function saveFiles(id, data) {
  return request({
    url: '/components/' + id + '/componentfiles/savefile',
    method: 'post',
    headers: {
      // 'content-type': 'application/x-www-form-urlencoded'
      'content-type': 'application/json'
    },
    data
  })
}
// saveFolder
export function saveFolder(id, parentNodeId, data) {
  return request({
    url: '/components/' + id + '/createfolder',
    method: 'post',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'parentNodeId': parentNodeId
    },
    data
  })
}

// getfiles
export function getCompFiles(id, parent) {
  return request({
    url: '/components/' + id + '/files',
    method: 'get',
    headers: {
      'parentNodeId': parent
    }
  })
}
// deletefiles
export function deleteCompFiles(id) {
  return request({
    url: '/componentfiles/' + id,
    method: 'delete'
  })
}
// exportfiles
export function exportCompFiles(id) {
  return request({
    url: '/componentfiles/' + id + '/export',
    method: 'get'
  })
}
// uploadFolder
export function uploadFolder(id, data) {
  return request({
    url: '/components/' + id + '/componentfiles/uploadfolder',
    method: 'post',
    data
  })
}
// moveFileTo
export function movefileTo(FileId, targetId, data) {
  return request({
    url: '/componentfiles/' + FileId + '/move',
    method: 'patch',
    data
  })
}
// copyFileTo
export function copyFileTo(FileId, targetId, data) {
  return request({
    url: '/componentfiles/' + FileId + '/copy',
    method: 'patch',
    data
  })
}
// renameFile
export function renameFile(FileId, data) {
  return request({
    url: '/componentfiles/' + FileId,
    method: 'patch',
    data
  })
}

// 回收站
// 恢复已删除组件
export function restoreCom(comId) {
  return request({
    url: '/components/' + comId + '/restore',
    method: 'patch'
  })
}

// 清除已删除组件
export function cleanCom(comId) {
  return request({
    url: '/components/' + comId + '/clean',
    method: 'delete'
  })
}

// 组件历史版本文件
// 获取历史组件文件
export function getHisCompFiles(id, parent) {
  return request({
    url: '/componenthistorys/' + id + '/files',
    method: 'get',
    headers: {
      'parentNodeId': parent
    }
  })
}

// 预览子任务文件
export function previewFiles(id) {
  return request({
    url: '/preview/previewFile',
    method: 'get',
    params: {
      subtaskFileId: id
    }
  })
}

// 预览子库文件
export function previewSublibFiles(id) {
  return request({
    url: '/preview/previewSublibraryFile',
    method: 'get',
    params: {
      sublibraryFileId: id
    }
  })
}
