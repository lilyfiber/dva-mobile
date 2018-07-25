import { routerRedux } from 'dva/router';
import { query } from '../services/projectDetail.js';
import { parse } from 'qs';
 
export default {
	namespace: 'projectDetail',

  // 找空间下的项目详情
	state: {
    projectData: null,
  },

	subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      history.listen(location => {
        const locationParts = location.pathname.match(/project\/(\d+)/);
        if (locationParts) {
          dispatch({type: "query", payload: {id: locationParts[1]}});
        }
      });  
    },
  },

  effects: {
    // 园区详情页面跳转
    *detailParkShow({ payload }, { put }) {  // eslint-disable-line
      // 跳转空间列表
      yield put(routerRedux.push('/space/' + payload + '/'));
    },

    *query({ payload }, { call, put }) {  // eslint-disable-line
      // 获取后台数据
      const result = yield call(query, parse(payload));

      if (!result || result.code !== 0) {
        throw new Error(result.message);
      }

      const data = result.data;
      const projectDetail = data.projectDetail;

      // 后台json字符串转json
      projectDetail.talent_demand = JSON.parse(projectDetail.talent_demand);
      projectDetail.out_Ser_Demand = JSON.parse(projectDetail.out_Ser_Demand);

      yield put({
        type: 'loaded', 
        payload: data
      });
    },
  },

  reducers: {
    loaded(state, action) {
      return { 
        ...state,
        ...action.payload
      }
    }
  }
}