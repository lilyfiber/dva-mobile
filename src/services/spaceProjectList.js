import request  from '../utils/request';

// 项目列表
export async function queryProjectList (params) {
  return request({
    url: `/api/mobile/park/${params.id}/project`,
    method: 'get',
  })
}