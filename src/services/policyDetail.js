import request  from '../utils/request';

// 查询空间详情下的政策详情
export async function queryPolicy (params) {
	console.log(params)
  return request({
    url: `/api/mobile/${params.id}/policy`,
    method: 'get',
  })
}