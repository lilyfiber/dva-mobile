import request  from '../utils/request';

// 找空间列表查询
export async function query (params) {
  return request({
    url: '/api/mobile/space',
    method: 'get',
    data: params,
  })
}

export async function update (params) {
  return request({
    url: '/api/mobile/space',
    method: 'put',
    data: params,
  })
}
