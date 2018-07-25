import { routerRedux } from 'dva/router';
import { queryTeacher } from '../services/mentorList.js'
import { parse } from 'qs'
import { ListView } from 'antd-mobile';

export default {
  namespace: 'mentorList',

  // 导师列表页 
  state: {
    dataSource: new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    }),
    
    loading: false,
    noData: false,
    showAnim:true,//是否显示动画
  },
  
  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      history.listen(location => {
        const locationParts = location.pathname.match(/space\/(\d+)\/(.*)/);
        if (locationParts) {
          const spaceID = locationParts[1];
          const action = locationParts[2];
          if(action == 'mentor')
          {
            dispatch({type: "queryTeacher", payload: {id: spaceID}});
          }
        }
      });
    },
  },

  effects: {
    *queryTeacher({ payload }, { call, put }) {
      const result = yield call(queryTeacher, parse(payload));

      if(!result || result.code != '0') {
        throw new Error(result.message);
      }

      yield put({
        type: 'loaded',
        payload: result.data
      });
    }
  },

  reducers: {
    loaded(state, action) {
      return { ...state,
        dataSource: state.dataSource.cloneWithRows(action.payload)
      };
    },
  },
};