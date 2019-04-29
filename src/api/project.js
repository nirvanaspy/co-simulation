import request from '../utils/request'

export function projectList(listQuery) {
  return request({
    url: '/projects',
    method: 'get',
    params: {
      deleted: false,
      size: listQuery.size,
      page: listQuery.page
    }
  })
}

export function projectList_user(id, listQuery) {
  return request({
    url: 'projects/byUserId/' + id,
    method: 'get',
    params: {
      deleted: false,
      size: listQuery.size,
      page: listQuery.page
    }
  })
}

export function createProject(data) {
  return request({
    url: '/projects',
    method: 'post',
    data
  })
}

export function updateProject(data, id) {
  return request({
    url: '/projects/' + id,
    method: 'patch',
    data
  })
}

export function updateProPic(id, data) {
  return request({
    url: '/projects/' + id + '/updatePic',
    method: 'patch',
    data
  })
}

export function deleteProject(id, data) {
  return request({
    url: '/projects/' + id + '/delete',
    method: 'patch',
    data
  })
}

export function projectListHis(listQuery) {
  return request({
    url: '/projects',
    method: 'get',
    params: {
      deleted: true,
      size: listQuery.size,
      page: listQuery.page
    }
  })
}

export function projectList_userHis(id, listQuery) {
  return request({
    url: 'projects/byUserId/' + id,
    method: 'get',
    params: {
      deleted: true,
      size: listQuery.size,
      page: listQuery.page
    }
  })
}

// 恢复已删除工程
export function restorePro(id, data) {
  return request({
    url: '/projects/' + id + '/restore',
    method: 'patch',
    data
  })
}

// 清除已删除工程
export function cleanPro(id) {
  return request({
    url: '/projects/' + id + '/clean',
    method: 'delete'
  })
}

export function starPro(id, hasStar) {
  return request({
    url: '/projects/' + id + '/star',
    method: 'patch',
    params: {
      hasStar: hasStar
    }
  })
}

// 设置节点，令号
export function arrangePro(id, data) {
  return request({
    url: '/projects/' + id + '/arrange',
    method: 'patch',
    data
  })
}

// 启动项目
export function startPro(id) {
  return request({
    url: '/projects/' + id + '/startProject',
    method: 'patch'
  })
}

// 判断是否具备查看项目的权限
export function getProjectAuth(ProId, uId) {
  return request({
    url: 'projects/' + ProId + '/projectDetails',
    method: 'get',
    params: {
      userId: uId
    }
  })
}

// 查询项目详情
export function getProjectById(ProId) {
  return request({
    url: 'projects/' + ProId,
    method: 'get'
  })
}

// 搜索项目
export function searchProject(data) {
  return request({
    url: '/projects/multiInquire',
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'post',
    data
  })
}

// 根据用户密级查询项目
export function getProjectBySecretClass(id, ifDeleted) {
  return request({
    url: '/projects/byUserSecretClass/' + id,
    method: 'get',
    params: {
      deleted: ifDeleted
    }
  })
}
