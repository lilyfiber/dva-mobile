import request  from '../utils/request';
import qs, {parse} from 'qs';

export async function queryProjectList (params) {
  return request({
    url: '/api/mobile/project',
    method: 'get',
    data: params,
  });
}

