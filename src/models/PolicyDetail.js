import { routerRedux } from 'dva/router';
import { queryPolicy } from '../services/policyDetail.js'
import { parse } from 'qs'

// 去除html标签
function deleteHtml(params) {
  const match = params.replace(/<\/?.+?>/g,"");
  const matchHtml = match.replace(/&nbsp;/g,"");
  return matchHtml;
}

export default {
	namespace: 'policyDetail',
	state: {
    policy: [],
    park: [],
  },

	subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      history.listen(location => {
        const locationParts = location.pathname.match(/space\/\d+\/\w+\/(\d+)/);
        if (locationParts) {
          dispatch({type: "queryPolicy", payload: {id: locationParts[1]}})
        }
      }); 
    },
  },

  effects: {
    // 政策详情
    *queryPolicy({ payload }, { call, put }) {
     const result = yield call(queryPolicy, payload);
      if(!result || result.code !== 0) 
      {
        throw new Error(result.message);
      }

      // 去除html标签
      const policy = result.data.policy;
      policy.impel = deleteHtml(policy.impel);
      policy.name = deleteHtml(policy.name);
      policy.content = deleteHtml(policy.content);
      policy.condition = deleteHtml(policy.condition);

      // 电话号码提取挖掘
      if(policy.contacts && !policy.phone)
      {
        const mobilePhones = policy.contacts.match(/1[3|4|5|7|8]\d{9}/);
        if(mobilePhones && mobilePhones.length > 1)
        {
          policy.contacts = policy.contacts.repace(/1[3|4|5|7|8]\d{9}/, '');
          policy.phone = mobilePhones[0];
        }

        const phones = policy.contacts.match(/(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}/);
        if(phones && phones.length > 1)
        {
          policy.contacts = policy.contacts.repace(/(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}/, '');
          if(!policy.phone)
          {
            policy.phone = policy.contacts.replace(/\s+/, '');
          }
        }

      }

      yield put({
        type: "loaded",
        payload: {
          park: result.data.parkNode,
          policy,
        }
      });
    },
  },

  reducers: {
    loaded(state, action) {
      const { policy, park } = action.payload;
      return { ...state,
        policy: policy,
        park
      };
    },
  },
};