import request  from '../utils/request';

// 找空间列表查询
export async function query (params) {
  return request({
    url: `/api/mobile/park/${params.id}/node`,
    method: 'get'
  })
}