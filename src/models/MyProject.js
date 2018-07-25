import { routerRedux } from 'dva/router';
import { ListView } from 'antd-mobile';
import { getWechatUserURL, getWechatUser, getWechatJSSDK} from '../services/wechat.js';
import { queryUserProjectList } from '../services/myProject.js';
import globalVars from '../user.js';
import { parse } from 'qs';
import { isWeiXin } from '../utils/wechat.js';

export default {
	namespace: 'myProject',
	state: {
    dataSource: new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    }),
    isLoading: true,
    showAnim:true,//是否显示动画
  },
	
	subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      return history.listen(({pathname}) => {
        // 仅处理当前页面逻辑
        if('me/project' != pathname)
        {
          return;
        }

        // 尝试获取全局用户ID
        let userID = globalVars.userID;

        // 尝试获取认证码
        const matchCodes = window.location.href.match(/[A-z]*?code=([a-zA-Z0-9]*)/);

        // 是否在微信内
        const IsDebuging = window.location.href.indexOf('http://localhost') !== -1;

        // 判断如果是全局没有用户信息，则通过跳转页面方式获取用户信息
        if(!userID)
        {
          // 微信内就走认证流程，微信外直接给个默认userID
          if(IsDebuging || !isWeiXin())
          {
            userID = 1;
          }
          else
          {
            // 已经有code了，从接口获取URL
            if(matchCodes)
            {
              // 从Code获取userID
              // alert(`50 getUserIDByCode`);
              dispatch({type: "getUserIDByCode", payload: {code: matchCodes[1]}});

              // 剩余加载流程在effects中补充
              return;
            }
            else
            {
              // 从接口获取跳转URL并且跳转
              // alert(`58 redirectToWechatAuthPage`);
              dispatch({type: "redirectToWechatAuthPage"});

              // 页面会重新加载
              return;
            }
          }
        }

        // 初始化：启动JSSDK
        // alert(`59 initPage`);



        dispatch({type: "initPage", payload: {userID}});
      });
    },
  },

  effects: {
    // 获取跳转页面地址，并且跳转至页面
    *redirectToWechatAuthPage({payload}, {call, put, select}){
      // 调用接口
      const result = yield call(getWechatUserURL);
      if (!result || result.code !== 2) {
        throw new Error(result.message);
      }

      alert(`88跳转页面${JSON.stringify(result)}`);

      switch(result.type)
      {
        case 'got':
          const userID = result.userID;
          // 初始化：启动JSSDK
          yield put({type: "initPage", payload: {userID}});
          break;
        case 'jump':
          window.location.href = result.url;
          break;
      }
    },

    // 根据Code获取用户信息，并且继续初始化流程
    *getUserIDByCode({payload}, {call, put, select}){
      // 调用接口
      const code = payload.code;

      const result = yield call(getWechatUser, code);
      alert(`109获取微信用户信息${JSON.stringify(result)}`)

      // 保存
      const userID = result.data.id;
      // openID = result.data.userId
      // unionID = result.data.unionID
      globalVars.userID = userID;

      // 初始化：启动JSSDK
      yield put({type: 'initPage', payload: {userID}});
    },

    // 初始化：启动JSSDK
    *initPage({payload}, {call, put, select}){
      // 根据用户ID加载其已有的项目，供用户选择
      const userID = payload.userID;

      const result = yield call(queryUserProjectList, userID);
      if(!result || result.code != '0'){
        throw new Error(result.message);
      }

      const data = result.data;
      // 没有项目则直接跳转至创建项目页面
      if(data.length == 0)
      {
        yield put({type: 'addProject'});
        return;
      }

      // 记录初始化结果
      yield put({type:'loaded', payload: {
        userID,
        data
      }});
    },

    *addProject({}, { put }) {
      yield put(routerRedux.replace('/project/add'));
    },

    // 项目编辑
    *projectDetail({ payload }, { put }) {  // eslint-disable-line
      yield put(routerRedux.push('/project/' + payload + '/edit'));
    },
  },

  reducers: {
    loaded(state, action) {
      return { 
        ...state,
        dataSource: state.dataSource.cloneWithRows(action.payload.data),
        isLoading: false
      }
    },
  },

};