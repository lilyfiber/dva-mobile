import { routerRedux } from 'dva/router';

export default {
	namespace: 'menu',
	state: {
    selectedTab: '/'
  },
	
	subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      history.listen(({ pathname }) => {
        if (pathname === '/') {
          dispatch({type: "highMenu", payload: '/'});
        } else if(pathname === 'space') {
          dispatch({type: "highMenu", payload: 'space'});
        } else if (pathname === 'project') {
          dispatch({type: "highMenu", payload: 'project'});
        } else if (pathname === 'investor') {
          dispatch({type: "highMenu", payload: 'investor'});
        } else if (pathname === 'activity') {
          dispatch({type: "highMenu", payload: 'activity'});
        }
      });
    },
  },

  effects: {
   *goto({ payload }, { put }) {
      // 菜单跳转
      yield put(routerRedux.replace(payload));
      // 高亮显示
      yield put({type: 'highMenu', payload: payload});
    },
  },

  reducers: {
    highMenu(state, action) {
      return { ...state,
        selectedTab: action.payload
      }
    },
  },

};