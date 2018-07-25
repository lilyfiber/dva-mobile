import { routerRedux } from 'dva/router';
import { ListView } from 'antd-mobile';
import { parse } from 'qs';
import { query} from '../services/activityList.js';

const pageSize = 20;
export default {
	namespace: 'activityList',

  // 找活动列表
	state: {
    offset: 0,
    rows: [],
    dataSource: new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    }),
    isLoading: false,
    noData: false,
    pageSize,
    type: null,
    sort: null,
    orderBy: null,
  },
  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line   
      return history.listen(({pathname,query}) => {
        if(pathname === 'activity') {
          dispatch({type:'getActivityList', payload: {offset: 0, pageSize}});
        }
      });
    },
  },

  effects: {
    *setTypes({payload},{call, put, select}){
      // 清理已经加载的数据，并且设置过滤条件
      yield put({type: 'reset', payload});
      // 重新拉取数据
      yield put({type: 'getActivityList', payload: {offset: 0}})
    },

    *sortTimes({payload},{call, put, select}){
      // 清理已经加载的数据，并且设置过滤条件
      yield put({type: 'resetSort', payload});
      // 重新拉取数据
      yield put({type: 'getActivityList', payload: {offset: 0}})
    },

    // 名称过滤
    *sortNames({ payload }, { call, put, select }){
      // 清理已经加载的数据，并且设置过滤条件
      yield put({type: 'resetName', payload: payload });
      // 重新拉取数据
      yield put({type: 'getActivityList', payload: {offset: 0}})
    },

    *getActivityList({payload},{call, put, select}) {
      const state = yield select(state => state.activityList);
      if(state.isLoading || state.noData)
      {
        return;
      }

      if(state.rows.length > 0 && payload)
      {
        return;
      }

      yield put({type: "loading"});
      const params = {offset: payload.offset, pageSize};

      // 活动类型过滤
      if(state.type)
      {
        params.type = state.type;
      }
 
      // 活动排序
      if(state.sort){
        params.sort = state.sort;
      }
      if(state.orderBy){
        params.orderBy = state.orderBy;
      }

      // 姓名过滤
      if(state.nameLists)
      {
        params.name = state.nameLists;
      }

      const result = yield call(query, parse(params));
      if(!result || result.code != '0'){
        throw new Error(result.message);
      }

      let resultData = result.data;
      yield put({
        type: 'save',
        payload: resultData
      });
    },

    //热门活动详情页跳转
    *detailActivityShow({payload}, {put}){
      // 跳转活动列表
      yield put(routerRedux.push( '/activity/' + payload));
    },
  },

  reducers: {
    reset(state, action) {
      return {
        ...state,
        offset: 0,
        rows: [],
        type: action.payload,
        noData: false,
      }
    },
    resetSort(state,action){
      return {
        ...state,
        offset: 0,
        rows: [],
        sort: action.payload.sort,
        orderBy: action.payload.orderBy,
        noData: false,
      }
    },
    resetName(state,action){
      return {
        ...state,
        offset: 0,
        rows: [],
        nameLists: action.payload,
        noData: false,
      }
    },

    loading(state, action) {
      return {
        ...state,
        isLoading: true,
      };
    },

    save(state,action){
      let rows = state.rows.concat(action.payload);
      return {
        ...state,
        rows,
        offset: rows.length,
        dataSource: state.dataSource.cloneWithRows(rows),
        isLoading: false,
        noData: action.payload.length != pageSize
      };
    },

    /*filterByName(state, action) {
      const rows = state.rows;
      if(!action.payload)
      {
        return {
          ...state,
          dataSource: state.dataSource.cloneWithRows(rows),
          isLoading: false
        }
      }

      return {
        ...state,
        dataSource: state.dataSource.cloneWithRows(rows.filter(activity =>activity.name.indexOf(action.payload) !== -1)),
        isLoading: true
      }
    },*/

  },
};