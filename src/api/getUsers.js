import request from '@/utils/request'

export function UserList(listQuery) {
  return request({
    url: '/users',
    method: 'get',
    params: {
      size: listQuery.size,
      page: listQuery.page
    }
  })
}

export function allUser() {
  return request({
    url: '/users',
    method: 'get'
  })
}

export function getUserId() {
  return request({
    url: '/users/info',
    method: 'get'
  })
}
export function updateUser(id, data) {
  return request({
    url: '/users/' + id,
    method: 'patch',
    data
  })
}
export function deleteUser(id) {
  return request({
    url: '/users/' + id,
    method: 'delete'
  })
}
export function addUser(data, roleName) {
  return request({
    url: '/users',
    method: 'post',
    headers: {
      // 'Content-Type': 'application/json',
      'roleName': roleName
    },
    data
  })
}
export function UserIfExist(name) {
  return request({
    url: 'users/hasusername',
    method: 'get',
    params: {
      username: name
    }
  })
}
export function disableUser(id, data) {
  return request({
    url: '/users/' + id + '/authority',
    method: 'patch',
    data
  })
}

export function distributeUserRole(id, data) {
  return request({
    url: '/users/' + id + '/distribute',
    method: 'patch',
    data
  })
}

export function updatePassword(id, data) {
  return request({
    url: '/users/' + id + '/password',
    method: 'patch',
    data
  })
}

export function updateSecretClass(id, data) {
  return request({
    url: '/users/' + id + '/secretClass',
    method: 'patch',
    data
  })
}

export function getUserById(id) {
  return request({
    url: '/users/' + id,
    method: 'get'
  })
}

export function updateUserDepartment(id, data) {
  return request({
    url: '/users/' + id + '/department',
    method: 'patch',
    data
  })
}

export function ifIncharge(data) {
  return request({
    url: '/subtasks/ifIncharge',
    method: 'post',
    data
  })
}
