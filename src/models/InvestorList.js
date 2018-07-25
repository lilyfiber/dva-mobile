import { ListView } from 'antd-mobile';
import { routerRedux } from 'dva/router';
import { queryInvestorList } from '../services/investorList.js';
import { parse } from 'qs';

const pageSize = 20;

export default {
	namespace: 'investorList',

	state: {
    id: '', // 投资人传参
    logo: '', // 投资人照片
    name: '', // 姓名
    title: '', // 标题
    round: '', // 轮次
    area: '', // 领域
    company: '', // 基金
    
    offset: 0, 
    rows: [],
    areaLists: null, // 投资类型
    roundLists: null, //投资阶段
    nameLists: null, // 投资人姓名
    sort: null, // 排序
    orderBy: null, // 排序
    noData: false,
    dataSource: new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    }),
    isLoading: false,
    pageSize,
    backtoPage: true,
    pageSize,
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      return history.listen(({pathname}) => {
        if(pathname === 'investor') {
          dispatch({type: 'backtoPage'});
          dispatch({type:'queryInvestorList', payload: true});
        }
      });
    },
  },

  effects: {

    // 投资领域过滤
    *setTypes({ payload },{ call, put, select }){
      // 清理已经加载的数据，并设置过滤条件
      yield put({ type: 'resetTypes', payload: payload });
      // 重新拉取数据
      yield put({type: 'queryInvestorList', payload: {offset: 0}})

    },

    // 投资阶段过滤
    *selectRounds({ payload }, { call, put, select }){
      // 清理已经加载的数据，并设置过滤条件
      yield put({ type: 'resetRoundTypes', payload: payload });
      // 重新拉取数据
      yield put({type: 'queryInvestorList', payload: {offset: 0}})
    },

    // 投资人名称过滤
    *sortNames({ payload }, { call, put, select }){
      // 清理已经加载的数据，并且设置过滤条件
      yield put({type: 'resetSort', payload: payload });
      // 重新拉取数据
      yield put({type: 'queryInvestorList', payload: {offset: 0}})
    },

    // 查询投资人列表
    *queryInvestorList({ payload },{ call, put, select }){
      // 页面加载
      const state = yield select(state => state.investorList);
      if(state.isLoading || state.noData)
      {
        return;
      }

      if(state.rows.length > 0 && payload)
      {
        return;
      }

      yield put({type: "loading" });
      const params = {offset: state.offset, pageSize};

      // 投资领域过滤
      if(state.areaLists)
      {
        params.area = state.areaLists.join(",");
      }

      // 投资阶段过滤
      if(state.roundLists)
      {
        params.round = state.roundLists.join(",");
      }

      // 投资人姓名过滤
      if(state.nameLists)
      {
        params.name = state.nameLists;
      }

      params.mobileShow = 'true'

      const result = yield call(queryInvestorList, parse(params));
      if(!result || result.code != '0'){
        throw new Error(result.message);
      }

      yield put({
        type: 'investorInfo',
        payload: result.data
      })
    },

    // 投资人详情页面跳转
    *detailInvestorShow({ payload }, {put}){
      yield put(routerRedux.push( '/investor/' + payload));
    }, 
  },

  reducers: {
    backtoPage(state, action) {
      return {
        ...state,
        backtoPage: true,
      }
    },

    // 投资人加载
    loading(state, action) {
      return { 
        ...state,
        isLoading: true,
      };
    },

    // 投资人类型
    resetTypes(state, action) {
      return {
        ...state,
        offset: 0,
        rows: [],
        areaLists: action.payload
      }
    },

    // 投资阶段
    resetRoundTypes(state, action) {
      return {
        ...state,
        offset: 0,
        rows: [],
        roundLists: action.payload
      }
    },

    // 名称过滤
    resetSort(state, action){
      return {
        ...state,
        offset: 0,
        rows: [],
        nameLists: action.payload
      }
    },

    investorInfo(state, action) {
      let rows = state.rows.concat(action.payload);
      return {
        ...state,
        rows,
        offset: rows.length,
        dataSource: state.dataSource.cloneWithRows(rows),
        isLoading: false,
        noData: action.payload.length != pageSize,
        backtoPage: false,
      };
    },
  },
};