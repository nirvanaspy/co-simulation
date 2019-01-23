import request from '@/utils/request'

export function getCompCounts(id) {
  return request({
    url: '/projects/' + id + '/componentcounts',
    method: 'get',
    params: {
      deleted: false
    }
  })
}

export function getDeviceCounts(id) {
  return request({
    url: '/projects/' + id + '/devicecounts',
    method: 'get',
    params: {
      deleted: false
    }
  })
}

export function getDeployDesignCounts(id) {
  return request({
    url: '/projects/' + id + '/deploymentdesigncounts',
    method: 'get',
    params: {
      deleted: false,
      baseline: false
    }
  })
}
