import { routerRedux } from 'dva/router';
import { query } from '../services/projectDetail.js';
import { createProject, modifyProject, getCity } from '../services/projectAdd.js';
import { getWechatUserURL, getWechatUser, getWechatJSSDK} from '../services/wechat.js';
import { parse } from 'qs'
import { isWeiXin } from '../utils/wechat.js';
import globalVars from '../user.js';

export default {
  namespace: 'projectAdd',
  state: {
    cityList: [],
    userID: null,
    projectDetail: null,
  },
  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      // 这里加载服务器上的项目详情
      history.listen(({pathname}) => {
        const editParams = pathname.match(/project\/([^/]+)\/edit/);
        let projectID = "add";

        if(editParams)
        {
          projectID = editParams[1];
        }

        // 仅处理当前页面逻辑
        if(('project/add' != pathname) && !editParams)
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
              dispatch({type: "getUserIDByCode", payload: {code: matchCodes[1], projectID}});

              // 剩余加载流程在effects中补充
              return;
            }
            else
            {
              // 从接口获取跳转URL并且跳转
              dispatch({type: "redirectToWechatAuthPage", payload: {projectID}});

              // 页面会重新加载
              return;
            }
          }
        }

        userID=6;

        // 初始化：启动JSSDK
        dispatch({type: "initPage", payload: {userID, projectID}});
      });
    },
  },

  effects: {
    // 获取跳转页面地址，并且跳转至页面
    *redirectToWechatAuthPage({payload}, {call, put, select}){
      // 调用接口
      const result = yield call(getWechatUserURL, {url: window.location.href});
      if (!result || result.code !== 2) {
        throw new Error(result.message);
      }

      switch(result.type)
      {
        case 'got':
          const userID = result.userID;
          // 初始化：启动JSSDK
          yield put({type: "initPage", payload: {userID, projectID: payload.projectID}});
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

      // 保存
      const userID = result.data.id;
      // openID = result.data.userId
      // unionID = result.data.unionID
      globalVars.userID = userID;

      // 初始化：启动JSSDK
      yield put({type: 'initPage', payload: {userID, projectID: payload.projectID}});
    },

    // 初始化：启动JSSDK
    *initPage({payload}, {call, put, select}){
      const userID = payload.userID;
      const projectID = payload.projectID;

      // 加载文档
      if(projectID != "add")
      {
        const result = yield call(query, {id: projectID});
        if (!result || result.code !== 0) {
          throw new Error(result.message);
        }

        const data = result.data;
        const projectDetail = data.projectDetail;

        // 后台json字符串转json
        projectDetail.scope = [projectDetail.scope];
        projectDetail.field = [projectDetail.field];
        if(data.parkNode.type == '-2'){
          projectDetail.cityNodeID = [data.parkNode.id];
        }

        projectDetail.logo = [projectDetail.logo];

        projectDetail.medias = projectDetail.resources.map((resource) => resource.url);

        projectDetail.financeAmount = projectDetail.finance_amount;
        projectDetail.financeStage  = projectDetail.finance_stage;
        projectDetail.outRate       = projectDetail.out_rate;
        projectDetail.talentDemand  = projectDetail.talent_demand;
        projectDetail.outSerDemand  = projectDetail.out_Ser_Demand;
        delete projectDetail.finance_amount;
        delete projectDetail.finance_stage;
        delete projectDetail.out_rate;
        delete projectDetail.talent_demand;
        delete projectDetail.out_Ser_Demand;

        payload.projectDetail = projectDetail;
      }
      else
      {
        payload.projectDetail = null;
      }

      const city = yield call(getCity);
      if(!city || city.code != 0){
        throw new Error(city.message)
      }
      
      const cityOrders = ['南京市', '无锡市', '徐州市', '常州市', '苏州市', '南通市', '连云港市', '淮安市', '盐城市', '扬州市', '镇江市', '泰州市', '宿迁市'];
      payload.cityList = city.data.map((city) => ({label: city.name, value: city.id})).sort((a, b) => cityOrders.indexOf(a.label) - cityOrders.indexOf(b.label));

      // 真实的微信环境，注册一下JSSDK
      // alert(`117 初始化页面 ${userID}`);
      if(isWeiXin())
      {
        const result = yield call(getWechatJSSDK);
        const config = result.result;

        // alert(`123 微信授权 ${JSON.stringify(config)}`);

        // 微信授权
        wx.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: 'wx51d8139cf5a402d7', // 必填，公众号的唯一标识
          timestamp: config.timestamp, // 必填，生成签名的时间戳
          nonceStr: config.nonceStr, // 必填，生成签名的随机串
          signature: config.signature,// 必填，签名，见附录1
          jsApiList: ['chooseImage','uploadImage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });
      }

      // 根据用户ID加载其已有的项目，供用户选择

      // 记录初始化结果
      yield put({type:'loaded', payload});
    },

    // 创建新项目完成后的项目详情页跳转
    *nextAddProject({ payload }, { call, put, select }) {
      const state = yield select(allState => allState.projectAdd);
      const projectDetail = state.projectDetail ? state.projectDetail: {};

      // 原始信息（主要是下一页的信息），叠加编辑后字段，再叠加转换
      const data = {
        ...projectDetail,
        ...payload,
        logo: payload.logo[0],
        field: payload.field[0],
        scope: payload.scope[0],
        medias: payload.medias.map(url => ({description: "", fileType:1, sourceId:"", url})),
        cityNodeID: payload.cityNodeID ? payload.cityNodeID[0]: undefined,
        userID: state.userID, // 登陆用户的ID
      };

      // 判断走编辑还是走新增
      let result = null;
      if(data.id)
      {
        result = yield call(modifyProject, data);
      }
      else
      {
        result = yield call(createProject, data);
      }
      
      if(!result || result.code != '0'){
        throw new Error(result.message);
      }

      yield put(routerRedux.push(`/project/${result.data.id}/requirement`));
    },
  },

  reducers: {
    loaded(state, action) {
      return { 
        ...state,
        ...action.payload,
      };
    },
  },

};