import request  from '../utils/request';

export async function addActJoin (params) {
  return request({
    url: '/qc/api/mobile/addActJoin/',
    method: 'post',
    data: params,
  });
}