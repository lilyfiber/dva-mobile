import request  from '../utils/request';

// 获取园区活动详情页内容
export async function queryPark (params) {
  return request({
    url: `/api/mobile/park/${params.id}`,
    method: 'get'
  })
}

// 更新园区活动详情页内容
export async function updatePark (params) {
  return request({
    url: '/api/mobile/park',
    method: 'get',
    data: params,
  })
};


export async function getCity (params) {
  return request({
    url: '/qc/api/mobile/city',
    method: 'get',
    data: params,
  });
}