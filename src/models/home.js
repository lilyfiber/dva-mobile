import { ListView } from 'antd-mobile';
import { routerRedux } from 'dva/router';
import { update, query } from '../services/home.js'
import { getWechatJSSDK } from '../services/wechat.js'
import { parse } from 'qs';
import { isWeiXin } from '../utils/wechat.js';
import { isiOSDevice } from '../utils/device.js';
import globalVars from '../user.js';

// GPS坐标转换工具
const coordtransform = require('coordtransform');

// 计算两组经纬度的坐标
function getDistance(pAlongitude, pAlatitude, pBlongitude, pBlatitude)
{
  var xA = parseFloat(pAlongitude);
  var yA = parseFloat(pAlatitude);

  var xB = parseFloat(pBlongitude);
  var yB = parseFloat(pBlatitude);

  return (xA - xB) * (xA - xB) + (yA - yB) * (yA - yB);
}

// 获取附近的园区
function getNearbyParks(center, parks, count)
{
  const uParks = parks.concat()
  .filter((park) => (park.park.mobileShow == 'true') && (park.park.parkType == '苏青优店') && park.park.logo_url)
  .map((park) => {
    park.distance = getDistance(center.longitude, center.latitude, park.longitude, park.latitude)
    return park;
  });

  uParks.sort(compareDistance("distance"));
  return uParks.slice(0, count);
}

// 按区域对比
function compareDistance(property){
  return function(a,b){
    let value1 = a[property];
    let value2 = b[property];
    return value1 - value2;
  }
}

function getLocationFromWeixin() {
  return new Promise(function(resolve, reject){
    wx.ready(function() {  
      wx.getLocation({  
        type: 'gcj02',
        success: function (res) {  
          let latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90  
          let longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。  
          let speed = res.speed; // 速度，以米/每秒计  
          let accuracy = res.accuracy; // 位置精度 
          // 将火星系坐标转换为百度坐标系
      
          const data = coordtransform.gcj02tobd09(longitude, latitude);
          const centerPoint = {longitude: data[0], latitude: data[1]};
          resolve(centerPoint);
        },  
        cancel: function (e) {  
          //这个地方是用户拒绝获取地理位置  
          reject(e);
        }  
      });
    });
  });
}

// 显示苏青C空间、项目、政策、活动
export default {
	namespace: 'home',
	state: {
    spaceCount: 0, // 苏青C空间统计
    projectCount: 0, // 项目统计
    policyCount: 0, //政策统计
    activityCount: 0, //活动统计

    parks: [], // 全部C空间
    nearbyParks: [],
    centerPoint: {latitude: 32.060255, longitude: 118.796877},
    hotEvents: [], //热门活动
    isLoading: true,
  },
	
	subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
      history.listen(location => {
        // 页面正确则装载
        if(location.pathname === '/')
        {
          // 首页数据显示
          dispatch({type: "fetch"});
        }
      });
    },
  },

  effects: {
    // 首页地图微信
    *wechatPost({payload}, {call, put}){
      const inWechat = isWeiXin();
      if(!inWechat){
        // 不在微信，所以不进行微信定位的微信JSSDK初始化工作
        return;
      }

      // iOS平台, 记录URL
      if(isiOSDevice())
      {
        globalVars.firstURL = location.href;
      }

      const result = yield call(getWechatJSSDK);
      if (!result || result.code !== 2) {
        throw new Error(result.message);
      }

      wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: 'wx51d8139cf5a402d7', // 必填，公众号的唯一标识
        timestamp: result.result.timestamp, // 必填，生成签名的时间戳
        nonceStr: result.result.nonceStr, // 必填，生成签名的随机串
        signature: result.result.signature,// 必填，签名，见附录1
        jsApiList: ['getLocation'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
      });

      try
      {
        const centerPoint = yield getLocationFromWeixin();
        put({type: 'mapMove', payload: {lng: centerPoint.longitude, lat: centerPoint.latitude}});
      }
      catch(e)
      {
        alert('定位失败！');
      }
    },

    // 抓取到全部园区和活动信息
    *fetch({payload}, {call, put}){
      const result = yield call(query);

      if (!result || result.code !== 0) {
        throw new Error(result.message);
      }

      const data = result.data;

      // .filter(park => park.park.parkType == '苏青优店')
      yield put({
        type: 'loaded',
        payload: {
          parks: data.parks.map(park => {
            park.iconType = park.park.parkType;
            if(!park.iconType){
              park.iconType = '苏青C空间'
            }
            return park;
          }),

          hotEvents:  data.hotEvents,
          spaceCount: data.statist.parks.parkCount,
          projectCount: data.statist.projects.projctCount,
          policyCount: data.statist.policys.policyCount,
          activityCount: data.statist.events.eventCount,
        },
      });

      // 基础信息完成后开始加载微信业务
      yield put({type: 'wechatPost'});
    },

    // 园区详情页面跳转
    *detailParkShow({ payload }, { put }) {  // eslint-disable-line
      // 跳转空间列表
      yield put(routerRedux.push('/space/' + payload + '/'));
    },

    //热门活动详情页跳转
    *detailActivityShow({payload}, {put}){
      // 跳转活动列表
      yield put(routerRedux.push({pathname:'/activity/' + payload + '/', query:{id:payload}}));
    },

  },

  reducers: {
    loaded (state, action) {
      const { parks, hotEvents, spaceCount, projectCount, policyCount, activityCount} = action.payload;
      return { ...state,
        parks,
        nearbyParks: getNearbyParks(state.centerPoint, parks, 3),
        hotEvents,
        spaceCount, 
        projectCount, 
        policyCount, 
        activityCount,
      }
    },

    mapMove (state, action) {
      const centerPoint = {longitude: action.payload.lng, latitude: action.payload.lat};
      const { parks } = state;
      return { ...state,
        centerPoint,
        nearbyParks: getNearbyParks(centerPoint, parks, 3)
      }
    },
  },
};