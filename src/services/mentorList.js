import request  from '../utils/request';

export async function queryTeacher (params) {
  return request({
    url: `/api/mobile/park/${params.id}/teacher`,
    method: 'get'
  })
}