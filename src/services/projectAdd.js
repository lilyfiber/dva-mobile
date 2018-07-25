import request  from '../utils/request';

export async function createProject (params) {
  return request({
    url: '/qc/api/mobile/addProject/',
    method: 'post',
    data: params,
  });
}

export async function modifyProject(params) {
  return request({
    url: '/qc/api/mobile/modifyProject/',
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