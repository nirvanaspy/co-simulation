import request from '../utils/request'

export function getLinks(proId) {
  return request({
    url: '/designLinks',
    method: 'get',
    params: {
      deleted: false
    }
  })
}

export function saveLinks(data) {
  return request({
    url: '/designLinks',
    method: 'post',
    data
  })
}

export function updateLinkById(id, data) {
  return request({
    url: '/designLinks/' + id,
    method: 'patch',
    data
  })
}

export function deleteLinkById(id) {
  return request({
    url: '/designLinks/' + id,
    method: 'delete'
  })
}
