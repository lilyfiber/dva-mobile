import request  from '../utils/request';
import qs, {parse} from 'qs';

export async function query (params) {
  return request({
    url: '/api/mobile/event',
    method: 'get',
    data: params,
  });
}
