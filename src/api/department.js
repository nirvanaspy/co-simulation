import request from '../utils/request'

// getDepartment
export function getDepartment() {
  return request({
    url: '/departments',
    method: 'get'
  })
}

// add
export function addDepartment(data) {
  return request({
    url: '/departments',
    method: 'post',
    headers: {
      'content-type': 'application/json;charset=utf-8'
    },
    data
  })
}

// delete
export function deleteDepartment(id) {
  return request({
    url: '/departments/' + id,
    method: 'delete'
  })
}

export function modifyDepartment(id, data) {
  return request({
    url: '/departments/' + id,
    method: 'post',
    headers: {
      'content-type': 'application/json;charset=utf-8'
    },
    data
  })
}
