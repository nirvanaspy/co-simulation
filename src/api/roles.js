import request from '@/utils/request'

export function roleList(listQuery) {
  return request({
    url: '/role',
    method: 'get',
    params: {
      size: listQuery.size,
      page: listQuery.page
    }
  })
}

export function updateRole(data, id) {
  return request({
    url: '/role/' + id,
    method: 'patch',
    data
  })
}

export function deleteRole(id) {
  return request({
    url: '/role/' + id,
    method: 'delete'
  })
}

export function addRole(data) {
  return request({
    url: '/role',
    method: 'post',
    data
  })
}
