import { ListView } from 'antd-mobile';
import { routerRedux } from 'dva/router';
import { query, update } from '../services/spaceList.js';
import { parse } from 'qs';

export default {
	namespace: 'spaceList',
	state: {
    // 苏青优店
    dataSourceA: new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    }),

    dataSourceB: new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    }),
    uParks: [],
    cParks: [],
    parks: [], // 全部C空间
    centerPoint: {longitude: 118.765746, latitude: 32.067183},
    isLoading: false,
  },
	
	subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      history.listen(location => {
        // 页面正确则装载
        if(location.pathname === 'space')
        {
          dispatch({type: "fetch"});
        }
      });
    },
  },

  effects: {
    *fetch({ payload }, { call, put, select}) {
      const state = yield select(state => state.spaceList);
      if(state.isLoading )
      {
        return;
      }
      yield put({type: "loading"});
      const result = yield call(query);

      if (!result || result.code !== 0) {
        throw new Error(result.message);
      }

      const parks = result.data;

      yield put({
        type: 'loaded',
        payload: parks
      });
    },

    // 园区详情页面跳转
    *detailShow({ payload }, { put }) {  // eslint-disable-line
      // 跳转空间列表
      yield put(routerRedux.push('/space/' + payload + '/'));
    },
  },

  reducers: {
    loading(state, action) {
      return {
        ...state,
        isLoading: true,
      };
    },
    
    loaded(state, action) {
      const parks = action.payload;
      //  && park.park.logo_url
      const uParks = parks.filter(park => (park.park.mobileShow == 'true') && (park.park.parkType === '苏青优店'));
      const cParks = parks.filter(park => park.park.parkType === '苏青C空间' && park.park.logo_url);

      parks.forEach(park => {
        park.iconType = park.park.parkType;
      });

      return { ...state,
        parks,
        uParks,
        cParks,
        dataSourceA: state.dataSourceA.cloneWithRows(uParks),
        dataSourceB: state.dataSourceB.cloneWithRows(cParks),
        isLoading: false,
      }
    },

    filterByName(state, action) {
      const {uParks, cParks} = state;

      if(!action.payload)
      {
        return {
          ...state,
          dataSourceA: state.dataSourceA.cloneWithRows(uParks),
          dataSourceB: state.dataSourceB.cloneWithRows(cParks),
        }
      }

      return {
        ...state,
        dataSourceA: state.dataSourceA.cloneWithRows(uParks.filter(park => park.name.indexOf(action.payload) !== -1)),
        dataSourceB: state.dataSourceB.cloneWithRows(cParks.filter(park => park.name.indexOf(action.payload) !== -1)),
      }
    }
  },
};