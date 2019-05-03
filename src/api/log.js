import request from '../utils/request'

export function logList(proId, listQuery) {
  return request({
    url: '/projects/' + proId + '/deploylogs',
    method: 'get',
    params: {
      size: listQuery.limit,
      page: listQuery.page
    }
  })
}

