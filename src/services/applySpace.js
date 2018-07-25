import request  from '../utils/request';

export async function projectApply (params) {
  return request({
    url: '/qc/api/mobile/addProjectApplication',
    method: 'post',
    data: params,
    noCSRF: true,
  });
}
export async function addProject (params) {
  return request({
    url: '/qc/api/mobile/addProject/',
    method: 'post',
    data: params,
  });
}

export async function getCity (params) {
  return request({
    url: '/qc/api/mobile/city',
    method: 'get',
    data: params,
  });
}