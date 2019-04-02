import request from '@/utils/request'

// 查询库
export function libraryList() {
  return request({
    url: '/libraries',
    method: 'get'
  })
}
// 查询子库
export function subLibraryList(id) {
  return request({
    url: '/sublibraries/byLibraryId/' + id,
    method: 'get'
  })
}
// 新增子库
export function addSubLibrary(data) {
  return request({
    url: '/sublibraries',
    method: 'post',
    data
  })
}
// 修改子库
export function updateSubLibrary(id, data) {
  return request({
    url: '/sublibraries/' + id,
    method: 'patch',
    data
  })
}
// 删除子库
export function deleteSubLibrary(id) {
  return request({
    url: '/sublibraries/' + id,
    method: 'delete'
  })
}
