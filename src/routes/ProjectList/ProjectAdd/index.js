import React, { PropTypes } from 'react';
import { connect } from 'dva';
import QueueAnim from 'rc-queue-anim';
import HeaderGQT from "../../../components/HeaderGQT";
import ImageUploader from "../../../components/ImageUploader";
import buildForm from "../../../components/FormBuilder";
import styles from './style.css';

const ProjectAdd = ({dispatch, projectAdd}) => {
  const cityList = projectAdd.cityList;
  let formInstance = null;

  const projectDetail = projectAdd.projectDetail;

  const showCity = !projectDetail || (projectDetail && projectDetail.cityNodeID);

  const Form = buildForm([
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
      ]
      .concat(showCity ? [{name: 'cityNodeID', label: '所属城市', required: true, options: cityList}]: [])
      .concat(
      [
        {name: 'name',  label: '项目名称', required: true},
        {name: 'audience',  label: '产品受众', required: true},
        {name: 'brief',  label: '项目定位', required: true, placeholder: '一句话描述项目定位'},
        {name: 'description',  label: '项目介绍', required: true, type: 'textarea', rows: 3},
        {name: 'logo', label: 'LOGO', required: true, count: 1, size: {width: 512, height: 512}},
        {name: 'medias', label: '介绍图片', required: true, count: 3, size: {width: 640, height: 480}}
      ])
    }
  ]);

  // 添加项目模块下的项目详情
  const nextAddProject = () => {
    // 校验并发布
    formInstance.validateFields((error, data) => {
      if(error)
      {
        alert('请正确完整填写信息')
        return;
      }

      dispatch({type: 'projectAdd/nextAddProject', payload: data});
    });
  }

  return (
    <div key="projectAdd">
      <HeaderGQT />
      <Form ref={(form) => formInstance = form} value={projectDetail} />
      <div className={styles.next} onClick={nextAddProject}>下一步</div>
    </div>
  );
};

ProjectAdd.propTypes = {
    dispatch: PropTypes.func,
    projectAdd: PropTypes.object,
};

export default connect(({projectAdd}) => ({projectAdd}))(ProjectAdd);