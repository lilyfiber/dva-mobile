import request  from '../utils/request';
import qs, {parse} from 'qs';

// 找投资列表查询
export async function queryInvestorList (params) {
  return request({
    url: '/api/mobile/investor',
    method: 'get',
    data: params,
  })
}