import { routerRedux } from 'dva/router';
import { queryProjectList } from '../services/spaceProjectList.js'
import { parse } from 'qs';

// 显示当前园区的项目内容
export default {
  namespace: 'spaceProjectList',
  state: {
    projects: [],
    spaceID: null,
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      history.listen(({pathname}) => {
        const locationParts = pathname.match(/space\/(\d+)\/(.*)/);

        if (locationParts) {
          const spaceID = locationParts[1];
          const action = locationParts[2];
          if(action == 'project')
          {
            dispatch({type: "queryProjectList", payload: {id: spaceID}});
          }
        }
      });
    },
  },

  effects: {
    // 查询项目列表
    *queryProjectList({ payload }, { call, put }) {
      // 获取后台数据
      const result = yield call(queryProjectList, parse(payload));

      if(!result || result.code != '0') {
        throw new Error(result.message);
      }

      yield put({
        type: 'projectListInfo', 
        payload: {
          projects: result.data,
          spaceID: payload.id,
        }
      });  
    },

    // 项目详情
    *gotoProjectDetail({ payload }, { call, put }) {
      yield put(routerRedux.push('/project/' + payload.projectID));
    }, 
  },

  reducers: {
    projectListInfo(state, action) {
      return { 
        ...state,
        ...action.payload,
      };
    },
  },
};