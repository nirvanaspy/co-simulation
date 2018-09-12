import request from '@/utils/request'
// getLogByUser
export function getLogList(id, listQuery) {
  return request({
    // url: '/users/' + id + '/systemlog',
    url: '/users/' + id + '/useractionlogs',
    method: 'get',
    params: {
      size: listQuery.size,
      page: listQuery.page
    }
  })
}
// getLogByAdmin
export function getLogAll(listQuery) {
  return request({
    // url: '/systemlogs',
    url: '/useractionlogs',
    method: 'get',
    params: {
      size: listQuery.size,
      page: listQuery.page
    }
  })
}
