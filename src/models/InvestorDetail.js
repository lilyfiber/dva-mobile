import { routerRedux } from 'dva/router';
import { ListView } from 'antd-mobile';
import { parse } from 'qs';
import { queryInestorDetail} from '../services/investorDetail.js';

export default {
  namespace: 'investorDetail',
  state: {
    logo: '', // 投资人照片
    name: '', // 姓名
    title: '', // 标题
    round: '', // 轮次
    area: '', // 领域
    company: '', // 基金
    description: '', // 投资人描述
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      return history.listen(({pathname,queryInestorDetail}) => {
        const locationParts = pathname.match(/investor\/(\d+)/);
        if (locationParts) {
          dispatch({type: "queryInestorDetail", payload: {id: locationParts[1]}});
        }
      });
    },
  },

  effects: {
    // 查询投资人详情页
    *queryInestorDetail({ payload }, { call, put }){
      const result = yield call(queryInestorDetail, parse(payload));
      if(!result || result.code != '0'){
        throw new Error(result.message);
      }

      yield put({
        type: 'investorloaded',
        payload: result.data
      });
    }
  },

  reducers: {
    investorloaded(state, action) {
      return { 
        ...state,
        ...action.payload
      };
    },
  },
};