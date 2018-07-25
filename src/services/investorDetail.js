import request  from '../utils/request';
// 查询找投资人详情页
export async function queryInestorDetail (params) {
  return request({
    url: `/api/mobile/${params.id}/investor/`,
    method: 'get',
  });
}