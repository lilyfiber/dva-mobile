import React, { PropTypes } from 'react';
import { connect } from 'dva';
import HeaderGQT from "../../../components/HeaderGQT";
import {List, InputItem, TextareaItem, WhiteSpace, Button, Flex , ImagePicker} from 'antd-mobile';
import QueueAnim from 'rc-queue-anim';

import ImageUploader from "../../../components/ImageUploader";
import buildForm from "../../../components/FormBuilder";
import styles from './apply.css';


const ApplySpace = ({dispatch, applySpace}) => { 
  const cityList = applySpace.cityList;
  
  const showAnim = applySpace.showAnim;
  
  let formInstance = null;
  const {projects, project} = applySpace;

  const showCity = !project || (project && project.cityNodeID);

  // 点击提交申请入驻并且跳转
  const nextToApplySuccess = () => {
    // 临时措施
    formInstance.validateFields((error, data) => {
      if(error)
      {
        alert('请正确完整填写信息')
        return;
      }
      
      dispatch({type: 'applySpace/nextApply', payload: data});
    });
  }

  // 加载存在的项目
  const searchProject = (projects) => {
    // 临时措施
    dispatch({type: 'applySpace/searchProject', payload: projects[0]});
  }

  const Form = buildForm(
    ((projects && projects.length) ? [{
      section: '我的项目',
      subTitle: '选择已经提交的项目',
      fields: [
        {name: 'project', label: '项目选择', required: false, options: projects.map(project => ({label: project.name, value: project.id})), onChange: searchProject},
      ]
    }]:[]).concat([
      {
        section: '联系信息',
        fields: [
          {name: 'contact', label: '姓名', required: true},
          {name: 'phone', label: '手机', required: true, rules: [{pattern: /^1[34578]\d{9}$/, message: '请填正确手机号'}]},
          {name: 'email', label: '邮件', required: true, rules: [{pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, message: '请填正确邮件的格式'}]},
        ]
      },
      {
        section: '项目信息',
        fields: [
          {name: 'scope', label: '团队规模', required: true, options: ['少于5人','5-20人','21-50人','50人以上']},
          {name: 'field', label: '所属领域', required: true, options: ['IT互联网','文化传媒','通信','物联网','金融商贸','教育培训','医疗生物','司法法律','房产建筑','服务业','汽车交通','轻工贸易','电子电气','机械重工','农林牧渔','光电新能源','化工环保','其他']},
          {name: 'name',  label: '项目名称', required: true},
          {name: 'audience',  label: '产品受众', required: true},
          {name: 'brief',  label: '项目定位', required: true, placeholder: '一句话描述项目定位'},
          {name: 'description',  label: '项目介绍', required: true, type: 'textarea', rows: 3},
          {name: 'logo', label: 'LOGO', required: true, count: 1, size: {width: 512, height: 512}},
          {name: 'medias', label: '介绍图片', required: true, count: 3, size: {width: 640, height: 480}}
        ]
        .concat(showCity ? [{name: 'cityNodeID', label: '所属城市', required: true, options: cityList}]: [])
      },
      {
        section: '申请入驻',
        fields: [
          {name: 'companyname', label: '公司全称', required: true},
          {name: 'operDynamics', label: '运营状态', required: true, options:['尚未启动','已启动'] },
          {name: 'busTechBook', label: '商业计划书', required: true, type: 'file'}
        ]
      },
    ])
  ); 

  return (
    <div>
      <style type="text/css">
      {`
        .am-tabs-bar {
          display: none;
        }
      `}
      </style>
      <Form ref={(form) => formInstance = form} value={project}/>
      <div className={styles.next} onClick={nextToApplySuccess}>申请入驻</div>
    </div>
  );
};

ApplySpace.propTypes = {
    dispatch: PropTypes.func,
    applySpace: PropTypes.object,
};

export default connect(({applySpace}) => ({applySpace}))(ApplySpace);