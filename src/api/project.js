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
    url: '/users/' + id + '/projects',
    method: 'get',
    params: {
      deleted: false,
      size: listQuery.size,
      page: listQuery.page
    }
  })
}

export function createProject(data, id) {
  return request({
    url: '/users/' + id + '/project',
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

export function deleteProject(id) {
  return request({
    url: '/projects/' + id,
    method: 'delete'
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
    url: '/users/' + id + '/projects',
    method: 'get',
    params: {
      deleted: true,
      size: listQuery.size,
      page: listQuery.page
    }
  })
}

// 恢复已删除工程
export function restorePro(id) {
  return request({
    url: '/projects/' + id + '/restore',
    method: 'patch'
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
