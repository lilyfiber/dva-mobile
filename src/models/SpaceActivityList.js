import { routerRedux } from 'dva/router';
import { ListView } from 'antd-mobile';
import { queryActivityList } from '../services/spaceActivityList.js';
import { parse } from 'qs';
 
export default {
    namespace: 'spaceActivityList',

    // 找空间下的活动列表
    state: {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
        sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
      }),
      
      loading: false,
      showAnim:true,//是否显示动画
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      history.listen(({pathname}) => {
        const locationParts = location.pathname.match(/space\/(\d+)\/(.*)/);
        if (locationParts) {
          const spaceID = locationParts[1];
          const action = locationParts[2];
          if(action == 'activity')
          {
            dispatch({type: "queryActivityList", payload: {id: spaceID}});
          }
        }
      });
    },
  },

  effects: {
    // 查询活动列表
    *queryActivityList({ payload }, { call, put }) {
      const result = yield call(queryActivityList, parse(payload));

      if(!result || result.code != '0') {
        throw new Error(result.message);      }

      yield put({
        type: 'loaded',
        payload: result.data,
      })
    },
    // 活动详情
    *activityDetail({ payload }, { call, put }) {
      yield put(routerRedux.push('/activity/' + payload));
    },
  },

  reducers: {
    loaded(state, action) {
      return { ...state,
        dataSource: state.dataSource.cloneWithRows(action.payload)
      };
    }
  },
};