import { routerRedux } from 'dva/router';

export default {
	namespace: 'applySuccess',
  state: {
    spaceID: null,
  },

  subscriptions:{
    setup({dispatch, history}) {  // eslint-disable-line
      history.listen(location => {
        // 仅处理当前页面逻辑
        const locationParts = location.pathname.match(/space\/(\d+)/);
        if (!locationParts) {
          return;
        }

        const spaceID = locationParts[1];
        dispatch({type: "loaded", payload: {spaceID}});
      });
    }
  },

  effects: {
    *toBack({ payload }, { call, put, select }) {
      const state = yield select(allState => allState.applySuccess);
      yield put(routerRedux.push('/space/' + state.spaceID + '/'));
    },
  },

  reducers: {
    // 获取
    loaded(state, action){
      return {
        ...state,
        ...action.payload,
      }
    }
  }
};