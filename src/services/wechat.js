import request  from '../utils/request';
import {isiOSDevice}  from '../utils/device';
import globalVars from '../user.js';

// 获取用户Code用的跳转页面URL
export async function getWechatUserURL () {
  return request({
    url: '/api/mobile/checkUser',
    method: 'post',
    data: {url: location.href},
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'same-origin'
  });
}

// 用code换取用户userID
export async function getWechatUser (code) {
  alert(`/api/mobile/wechat/user code=${code}`)
  return request({
    url: '/api/mobile/wechat/user',
    method: 'post',
    data: {code},
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'same-origin'
  });
}

// 获取用户JSSDK配置信息
export async function getWechatJSSDK () {
  let url = location.href;
  if(isiOSDevice() && globalVars.firstURL)
  {
    url = globalVars.firstURL;
  }

  url = url.split('#')[0];

  return request({
    url: '/api/mobile/wechat/',
    method: 'post',
    data: {url},
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'same-origin'
  });
}
