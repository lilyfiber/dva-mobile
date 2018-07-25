import { routerRedux } from 'dva/router';
import { addProject, projectApply } from '../services/applySpace.js';
import { modifyProject,getCity } from '../services/projectAdd.js';
import { getWechatUserURL, getWechatUser, getWechatJSSDK} from '../services/wechat.js';
import { parse } from 'qs';
import globalVars from '../user.js';
import { isWeiXin } from '../utils/wechat.js';
import { queryUserProjectList } from '../services/myProject.js';

export default {
	namespace: 'applySpace',
	state: {
    userID: null,
    spaceID: null,
    showAnim:true,//是否显示动画
    projects: [],
    project: null,
    cityList: [],
  },
  subscriptions: {
    setup({dispatch, history}) {  // eslint-disable-line
      history.listen(location => {
        // 仅处理当前页面逻辑
        const locationParts = location.pathname.match(/space\/(\d+)/);
        if (!locationParts) {
          return;
        }

        // 尝试获取全局用户ID
        let userID = globalVars.userID;

        // 尝试获取认证码
        const matchCodes = window.location.href.match(/[A-z]*?code=([a-zA-Z0-9]*)/);

        // 是否在微信内
        const IsDebuging = window.location.href.indexOf('http://localhost') !== -1;

        const spaceID = locationParts[1];

        // alert(`34 Setup matchCodes=${matchCodes} IsDebuging=${IsDebuging} spaceID=${spaceID}`);

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
              dispatch({type: "getUserIDByCode", payload: {code: matchCodes[1], spaceID}});

              // 剩余加载流程在effects中补充
              return;
            }
            else
            {
              // 从接口获取跳转URL并且跳转
              // alert(`58 redirectToWechatAuthPage`);
              dispatch({type: "redirectToWechatAuthPage", payload: {spaceID}});

              // 页面会重新加载
              return;
            }
          }
        }

        // 初始化：启动JSSDK，记录spaceID
        // alert(`59 initPage`);

        
        
        dispatch({type: "initPage", payload: {spaceID, userID}});
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
          const spaceID = payload.spaceID;
          // 初始化：启动JSSDK，记录spaceID
          yield put({type: "initPage", payload: {spaceID, userID}});
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
      const spaceID = payload.spaceID;
      globalVars.userID = userID;

      // 初始化：启动JSSDK，记录spaceID
      yield put({type: 'initPage', payload: {spaceID, userID}});
    },

    // 初始化：启动JSSDK，记录spaceID
    *initPage({payload}, {call, put, select}){
      const userID = payload.userID;
      const spaceID = payload.spaceID;

      // 真实的微信环境，注册一下JSSDK
      // alert(`117 初始化页面 ${userID} ${spaceID}`);
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
      const projectsResult = yield call(queryUserProjectList, userID);
      if(!projectsResult || projectsResult.code != '0'){
        throw new Error(projectsResult.message);
      }

      const projects = projectsResult.data.map((projectDetail) => {
        // 后台json字符串转json
        projectDetail.scope = [projectDetail.scope];
        projectDetail.field = [projectDetail.field];

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

        return projectDetail;
      });

      const city = yield call(getCity);
      if(!city || city.code != 0){
        throw new Error(city.message)
      }
      
      const cityOrders = ['南京市', '无锡市', '徐州市', '常州市', '苏州市', '南通市', '连云港市', '淮安市', '盐城市', '扬州市', '镇江市', '泰州市', '宿迁市'];

      const cityList = city.data.map((city) => ({label: city.name, value: city.id})).sort((a, b) => cityOrders.indexOf(a.label) - cityOrders.indexOf(b.label));

      // 没有项目则直接跳转至创建项目页面
      yield put({type:'loaded', payload: {
        userID,
        spaceID,
        projects,
        cityList,
      }});
    },

    // 申请入驻时，保存数据跳转页面
    *nextApply({ payload }, { call, put, select }) {
      const state = yield select(allState => allState.applySpace);
      const nodeState = yield select(allState => allState.spaceListMenu);
      const parkID = nodeState.id;

      let projectID = null;
      const project = state.project ? state.project: {};

      // 否则创建新的项目
      const projectRequest = {
        ...project,
        contact: payload.contact,
        email: payload.email,
        phone: payload.phone,
        scope: payload.scope[0],
        field: payload.field[0],
        name: payload.name,
        audience: payload.audience, //项目受众
        brief: payload.brief, //项目定位
        description: payload.description, //项目介绍
        logo: payload.logo[0],
        medias: payload.medias.map(media => ({"description":"","fileType":1,"sourceId":"","url":media})),
        cityNodeID: payload.cityNodeID ? payload.cityNodeID[0]: undefined,
        userID: state.userID, // 登陆用户的ID
      }

      let projectResponse = null;
      if(projectRequest.id)
      {
        projectResponse = yield call(modifyProject, parse(projectRequest));
      }
      else
      {
        projectResponse = yield call(addProject, parse(projectRequest));
      }
      

      if(!projectResponse || projectResponse.code != '0'){
        throw new Error(projectResponse.message); 
      }

      // 获取项目ID
      projectID = projectResponse.data.id;

      const applyRequest = {
        companyName: payload.companyname, //公司名称
        operDynamics: payload.operDynamics[0],
        busTechBook: JSON.stringify(payload.busTechBook),
        projectName: payload.name,
        scope: projectRequest.scope,
        contact: payload.contact,
        phone: payload.phone,
        projectId: projectID,
        pId: parkID,
      }

      const applyResponse = yield call(projectApply, parse(applyRequest));
      if(!applyResponse || applyResponse.code != '0'){
        throw new Error(applyResponse.message); 
      }

      yield put(routerRedux.push('/space/' + state.spaceID + '/applySuccess'));
    },

    //加载项目
    *searchProject({ payload }, { put, select }) {
      const state = yield select(allState => allState.applySpace);
      let tmpPro = null;
      for(let i=0;i<state.projects.length;i++){
        if(state.projects[i].id==payload){
          tmpPro = state.projects[i];
          break;
        }
      }

      yield put({type:'loadExistedProject',payload:tmpPro});
    }
  },

  reducers: {
    // 加载已经存在的项目
    loadExistedProject(state, action){
      return {
        ...state,
        project: action.payload,
      }
    },

    // 获取城市信息
    loaded(state, action){
      return {
        ...state,
        ...action.payload,
      }
    }
  },
};