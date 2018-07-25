import request  from '../utils/request';

// 查询空间详情下的项目详情
export async function query (params) {
  return request({
    url: `/api/mobile/policy/${params.id}`,
    method: 'get',
  })
}
