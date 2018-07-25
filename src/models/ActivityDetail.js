import { routerRedux } from 'dva/router';
import { ListView } from 'antd-mobile';
import { parse } from 'qs';
import { update, query} from '../services/activityDetail.js';

/*const data = ['1', '2'];*/
export default {
	namespace: 'activityDetail',
	state: {
	  img1: require('../assets/img1.png'),
	  img2: require('../assets/img2.png'),
	  img3: require('../assets/img3.png'),
	  img4: require('../assets/heart.png'),
    eventDetail: null,
    parkNode: null,
    loading: true,
    dataSource: new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2
    })
	},

	subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      return history.listen(({pathname, query}) => {
        const locationParts = pathname.match(/activity\/(\d+)/);
        if(locationParts && locationParts.length > 0)
        {
          const activityID = locationParts[1];
          dispatch({type: "getActivityDetail", payload: {id: activityID}});
        }
      });
    },
  },

	effects: {
    *activityApply({ payload }, { put }) {  // eslint-disable-line
      //跳转到报名
      yield put(routerRedux.push({pathname:'/activity/'+payload+'/apply',query:{id:payload}}));
    },
    *getActivityDetail({payload},{call,put}){
    	const result = yield call(query,parse(payload));

      if(!result || result.code != '0'){
        throw new Error(result.message);
      }

      const data = result.data;
      const parkNode = data.parkNode;
      if(parkNode.park)
      {
        parkNode.iconType = parkNode.park.parkType;
      }
      else
      {
        parkNode.iconType = '苏青C空间';
      }
     
      yield put({
        type:'loaded',
        payload: result.data
      });
    },

    // 园区详情页面跳转
    *detailParkShow({ payload }, { put }) {  // eslint-disable-line
      // 跳转空间列表
      yield put(routerRedux.push('/space/' + payload + '/'));
    },
  },

  reducers: {
    loaded(state, action) {
      return { ...state,
        ...action.payload,
        dataSource: state.dataSource.cloneWithRows(action.payload),
        loading: false,
      }
    },
  }
}