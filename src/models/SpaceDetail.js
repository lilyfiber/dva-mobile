import { routerRedux } from 'dva/router';
import { queryPark, updatePark, getCity } from '../services/spaceDetail.js'
import { parse } from 'qs'

const menuItems = [
  {icon: String.fromCharCode(0xe905), text: "餐厅"},
  {icon: String.fromCharCode(0xe906), text: "车位"},
  {icon: String.fromCharCode(0xe907), text: "会议中心"},
  {icon: String.fromCharCode(0xe908), text: "酒店"},
  {icon: String.fromCharCode(0xe90a), text: "银行"},
  {icon: String.fromCharCode(0xe909), text: "班车"},
  {icon: String.fromCharCode(0xe90c), text: "超市"},
  {icon: String.fromCharCode(0xe90b), text: "宿舍"},
  {icon: String.fromCharCode(0xe90d), text: "健身设施"},
];

export default {
	namespace: 'spaceDetail',

	// 园区空间详情页：领域、设施、费用、政策、联系
	state: {
		id: null, // 园区空间详情页接口传参
		field: '', // 领域
		facilities: menuItems.map((value, i) => ({
		  icon: value.icon,
		  text: value.text,
		  disabled: false
		})), // 设施
		dailyRent: '', // 租金
		property: '', // 物业费
		policies: {}, // 政策
		contacts: '', // 联系
		showAnim:true,//是否显示动画
	},
	
	subscriptions: {
		setup({ dispatch, history }) {  // eslint-disable-line
			history.listen(location => {
				const locationParts = location.pathname.match(/space\/(\d+)/);
				if (locationParts) {
					dispatch({type: "queryPark", payload: {id: locationParts[1]}});
				}
			});     
    },
	},

	effects: {
		// 政策
	  *policyDetail({ payload }, { call, put }) {
      	yield put(routerRedux.push('/space/' + payload.spaceID + '/policy/' + payload.policyID));
	  },

		// 申请入驻
	  *toApply({ payload }, { call, put }) {
      yield put(routerRedux.push('/space/' + payload + '/apply'));
	  },

	  // 查询园区空间详情页信息
	  *queryPark({ payload }, { call, put }) {
	  	const result = yield call(queryPark, parse(payload));
	  	if(!result || result.code !== 0)
	  	{
	  		throw new Error(result.message);
	  	}

	  	const { facilities } = result.data;
	  	const equipment = [];
	  	if (!facilities) {
	  		alert(result.data);
	  		return;

	  	}

	  	let phone = result.data.contacts;
	  	// 去空格
			phone = phone.replace(/\s+/g, "");
			// 提取号码
			const contactsPhone = phone.match(/\d+/g);
			// 去号码
			phone = phone.replace(/\d+/g, "");
			result.data.contacts = phone;
			if (contactsPhone == null) {
				result.data.contactsPhone = result.data.mobile;
			}
			else {
				result.data.contactsPhone = contactsPhone[0];
			}

  		const facilityMap = {};
  		facilities.trim().split(',').forEach(facility => facilityMap[facility] = true);

	  	for (var i = 0; i < menuItems.length; i++) {
	  		if (facilityMap[menuItems[i].text]) {
	  			equipment.push({
	  				icon: menuItems[i].icon,
					  text: menuItems[i].text,
					  disabled: true
	  			});
	  		}
	  		else {
	  			equipment.push({
	  				icon: menuItems[i].icon,
					  text: menuItems[i].text,
					  disabled: false
	  			});
	  		}
	  	}
			result.data.facilities = equipment;

			yield put ({
				type: 'parkInfo',
				payload: {
					park: result.data
				}
		  })
	  },
	},

	reducers: {
    // 查询园区空间详情页信息
    parkInfo (state, action) {
    	const { park } = action.payload;
    	return { 
    		...state, 
    		...park,
    	}
    }
	},

}