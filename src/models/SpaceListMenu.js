import { routerRedux } from 'dva/router';
import { query } from '../services/node.js';
import { parse } from 'qs';

export default {
	namespace: 'spaceListMenu',
	state: {
		id: 0,
		spaceID: 1,
		name: '苏大天宫孵化器',
		selectedKey: "1",
		resources: [],
	},
	
	subscriptions: {
		setup({ dispatch, history }) {  // eslint-disable-line
			history.listen(({ pathname }) => {
				const locationParts = location.pathname.match(/space\/(\d+)\/([^\/]*)/);
				if (locationParts) {
					const spaceID = locationParts[1];
					const action = locationParts[2];
					dispatch({type: "fetch", payload: {id: spaceID, action: action}});
				}
			});
		},
	},

	effects: {
		*goto({ payload }, { put }) {
				// 菜单跳转
				yield put(routerRedux.replace('/space/' + payload));
		},

		*fetch({ payload }, { select, call, put }) {
			const spaceID = payload.id;

			const result = yield call(query, parse(payload));
			const node = result.data.node;

			switch(payload.action)
			{
				case "":
				case "apply":
				case "applySuccess":
				case "policy":
					yield put({ type: 'highMenu', payload: {key: "1", spaceID, node} });
					break;
				case "project":
					yield put({ type: 'highMenu', payload: {key: "2", spaceID, node} });
					break;
				case "mentor":
					yield put({ type: 'highMenu', payload: {key: "3", spaceID, node} });
					break;
				case "activity":
					yield put({ type: 'highMenu', payload: {key: "4", spaceID, node} });
					break;
			}
		}
	},

	reducers: {
		highMenu (state, action) {
			return { ...state,
				...action.payload.node,
				selectedKey: action.payload.key,
				spaceID: action.payload.spaceID,
			}
		}
	}
}