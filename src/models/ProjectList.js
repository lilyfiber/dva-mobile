import { ListView } from 'antd-mobile';
import { routerRedux } from 'dva/router';
import { parse } from 'qs';
import { queryProjectList, myProjectCheckCode, myProjectUser} from '../services/projectList.js';
import global from '../user.js';


const pageSize = 20;
export default {
	namespace: 'projectList',
	state: {
    offset: 0,
    rows: [],
    loading: false,
    noData: false,
    field: null, //项目领域
    scope: null, //团队规模
    nameLists: null, // 投资人姓名
    // bAgainGet:false,
    backtoPage: true,
    pageSize, 
    dataSource: new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    }),
  },

	subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      return history.listen(({pathname}) => { 
        if(pathname === 'project') { 
          dispatch({type: 'backtoPage'});
          dispatch({type:'queryProjectList', payload: true});
        }
      });
    },
  },

  effects: {
    // 筛选领域
    *setFields({payload}, {call, put, selsect}){
      // 清理已经加载的数据，并且设置过滤条件
      yield put({type: 'resetField', payload});
      // 重新拉取数据
      yield put({type: 'queryProjectList', payload: {offset: 0}})
    },
    // 筛选团队规模
    *setScopes({payload}, {call, put, selsect}){
      // 清理已经加载的数据，并且设置过滤条件
      yield put({type: 'resetScopes', payload});
      // 重新拉取数据
      yield put({type: 'queryProjectList', payload: {offset: 0}})
    },

    *queryProjectList({ payload }, { call, put, select }) {  // eslint-disable-line
      const state = yield select(state => state.projectList);
      if(state.loading || state.noData)
      {
        return;
      }

      if(state.rows.length > 0 && payload)
      {
        return;
      }

      yield put({type: 'loading'});
      const params = {offset: state.offset, pageSize};

      // 项目领域过滤
      if(state.field){
        params.field = state.field;
      }
      // 团队规模过滤
      if(state.scope){
        params.scope = state.scope;
      }
      const result = yield call(queryProjectList, parse(params));

      if(!result || result.code != '0'){
        throw new Error(result.message);
      }

      let resultData = result.data;

      yield put({
        type:'querySuccess',
        payload: resultData,
        /*bAgainGet:true,*/
      })
    },

    //我的项目
    *myProject({ payload }, { put }) {  // eslint-disable-line
      yield put(routerRedux.push('/me/project'));
    },
    
    // 项目详情
    *projectDetail({ payload }, { put }) {  // eslint-disable-line
      yield put(routerRedux.push('/project/' + payload));
    },
  },

  reducers: {
    backtoPage(state, action) {
      return {
        ...state,
        backtoPage: true,
      }
    },

    // 投资领域
    resetField(state, action) {
      return {
        ...state,
        rows: [],
        offset: 0,
        field: action.payload,
        noData: false
      }
    },
    // 团队规模
    resetScopes(state, action) {
      return {
        ...state,
        rows: [],
        offset: 0,
        scope: action.payload, 
        noData: false
      }
    },

    loading(state, action) {
      return { 
        ...state,
        loading: true,
      };
    },

    querySuccess(state,action){
      let rows = state.rows.concat(action.payload);
      return {
        ...state,
        rows,
        offset: rows.length,
        dataSource: state.dataSource.cloneWithRows(rows),
        loading: false,
        noData: action.payload.length != pageSize,
        backtoPage: false,
      };
    },

    filterByName(state, action) {
      const rows = state.rows;
      if(!action.payload)
      {
        return {
          ...state,
          dataSource: state.dataSource.cloneWithRows(rows),
          loading: false
        }
      }
      return {
        ...state,
        dataSource: state.dataSource.cloneWithRows(rows.filter(project =>project.name.indexOf(action.payload) !== -1)),
        loading: true
      }
    },
  }
};