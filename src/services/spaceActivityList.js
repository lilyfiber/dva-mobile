import request  from '../utils/request';

// 查询找空间下的活动列表
export async function queryActivityList (params) {
  return request({
    url: `/api/mobile/park/${params.id}/event`,
    method: 'get',
  })
}