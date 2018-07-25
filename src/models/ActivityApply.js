import { routerRedux } from 'dva/router';
import { addActJoin } from '../services/activityApply.js'
import { parse } from 'qs'

export default {
  namespace: 'activityapply',
  state: {
    activityapply: null,
    success: false,
    actId: null,
    showAnim:true,//是否显示动画
  },
  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      return history.listen(({pathname, addActJoin}) => {
        const locationParts = pathname.match(/activity\/(\d+)/);
        if(locationParts && locationParts.length > 0)
        {
          const activityID = locationParts[1];
          dispatch({type: "loading",payload:{actId: activityID}});
        }
      })
    },
  },

  effects: {
    // 活动报名完成后跳转
    *addActJoin({ payload }, { call, put }) {  // eslint-disable-line
      yield put({type: "loading",payload});
      const result = yield call(addActJoin, payload);
      if(!result || result.code != '0'){
        throw new Error(result.message);
      }
      yield put({type: 'success', payload: payload});
    }
  },

  reducers: {
    loading(state, action){
      return {
        ...state,
        actId: action.payload.actId
      }

    },
    success(state, action) {
      return { 
        ...state,
        success: action.payload
      };
    },
  },
};
