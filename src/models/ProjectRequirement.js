import { routerRedux } from 'dva/router';
import { query } from '../services/projectDetail.js';
import { modifyProject } from '../services/projectAdd.js';
import { getWechatUserURL, getWechatUser, getWechatJSSDK} from '../services/wechat.js';
import globalVars from '../user.js';
import { isWeiXin } from '../utils/wechat.js';
import { parse } from 'qs'

export default {
	namespace: 'projectRequirement',

	state: {
    userID: null,
    projectDetail: null,
    HR: null,
    outsoucing: null,
    data: {
      logo: require("../assets/frame_image.png"),
      title: '企查查',
      field: '苏州',
      introduce: 'IT互联网',
      publics: ['大众、创业'],
      scale: '少于5人',
      technology: ['Android', 'iOS', 'PHP', 'Java', 'HTML5', '数据库', '测试', '运维', '架构师', '技术总监'],
      market:['市场策划', '市场公关', '商务渠道', '销售', '客户代表', '市场总监', '公关总监', '销售总监'],
      marketTwo:['新媒体运营', '产品运营', '数据运营', '活动运营', '编辑', '客服', '运营总监'],
      functions:['HR', '行政', '财务', '行政总监', '财务总监'],
      techlogolyTwo:['网站', 'APP', '微信公众帐号', 'UI设计', '系统集成'],
      operation:['网站代运营','微信代运营', '微博代运营', '电商代运营'],
      finanical:['财务代帐', '投融资对接'],
      legal:['合同管理', '欠款清理', '人力资源', '知识产权', '架构设计', '股权设置', '投融资'],
      advert:['视频制作','平面广告', '投放渠道'],
      business:['政府渠道','大企业渠道', '中小企业渠道', '实体商户渠道', '电商渠道'],
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      // 这里加载服务器上的项目详情
      history.listen(({pathname}) => {
        const requirementParams = pathname.match(/project\/([^/]+)\/requirement/);
        if(!requirementParams)
        {
          return;
        }

        let projectID = requirementParams[1];

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
              dispatch({type: "getUserIDByCode", payload: {code: matchCodes[1], projectID}});

              // 剩余加载流程在effects中补充
              return;
            }
            else
            {
              // 从接口获取跳转URL并且跳转
              // alert(`58 redirectToWechatAuthPage`);
              dispatch({type: "redirectToWechatAuthPage", payload: {projectID}});

              // 页面会重新加载
              return;
            }
          }
        }

        // 初始化：启动JSSDK
        // alert(`59 initPage`);
        dispatch({type: "initPage", payload: {userID, projectID}});
      });
    }
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

      const talentDemand = JSON.parse(projectDetail.talent_demand);
      const HR = {};
      if(talentDemand && talentDemand.forEach)
      {
        talentDemand.forEach(part => HR[part.name] = part.value);
      }

      const outSerDemand = JSON.parse(projectDetail.out_Ser_Demand);
      const outsoucing = {};
      if(outSerDemand && outSerDemand.forEach)
      {
        outSerDemand.forEach(part => outsoucing[part.name] = part.value);
      }
      
      projectDetail.financeAmount = projectDetail.finance_amount;
      projectDetail.financeStage = [projectDetail.finance_stage];
      projectDetail.outRate = projectDetail.out_rate;

      delete projectDetail.talent_demand;
      delete projectDetail.out_Ser_Demand;
      delete projectDetail.finance_amount;
      delete projectDetail.finance_stage;
      delete projectDetail.out_rate;

      payload.projectDetail = projectDetail;
      payload.HR = HR;
      payload.outsoucing = outsoucing;

      // 记录初始化结果
      yield put({type:'loaded', payload});
    },

    // 跳转至我的项目
    *gotoMyProject({ payload }, { call, put, select }) {
      yield put(routerRedux.replace('/me/project'));
    },

    // 创建新项目完成后的项目详情页跳转
    *updateProject({ payload }, { call, put, select }) {
      const state = yield select(allState => allState.projectRequirement);
      const projectDetail = state.projectDetail ? state.projectDetail: {};
      const userID = state.userID;

      const talentMap = payload.talentDemand;
      const talents = [];
      for(const key in talentMap)
      {
        const values = talentMap[key];
        talents.push({name: key, value: values ? values: []});
      }

      const outsouceMap = payload.outSerDemand;
      const outsouces = [];
      for(const key in outsouceMap)
      {
        const values = outsouceMap[key];
        outsouces.push({name: key, value: values ? values: []});
      }

      // 原始信息（主要是下一页的信息），叠加编辑后字段，再叠加转换
      const data = {
        ...projectDetail,
        financeAmount: payload.financeAmount,
        financeStage: payload.financeStage[0],
        outRate: payload.outRate,
        talentDemand: JSON.stringify(talents),
        outSerDemand: JSON.stringify(outsouces),
        logo: projectDetail.logo[0],
        field: projectDetail.field[0],
        scope: projectDetail.scope[0],
        medias: projectDetail.medias.map(url => ({description: "", fileType: 1, sourceId: "", url})),
        cityNodeID: projectDetail.cityNodeID ? projectDetail.cityNodeID[0]: undefined,
        userID
      };

      // 判断走编辑还是走新增
      let result = yield call(modifyProject, data);
      if(!result || result.code != '0'){
        throw new Error(result.message);
      }

      yield put(routerRedux.replace('/me/project'));
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