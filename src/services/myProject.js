import request  from '../utils/request';
import qs, {parse} from 'qs';


export async function queryUserProjectList (params){
  return request({
    url: `/api/mobile/wechat/${params}/project`,
    method: 'get',
    data: params,
  })
}