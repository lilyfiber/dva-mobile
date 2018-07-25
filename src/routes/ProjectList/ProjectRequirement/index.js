import React, { PropTypes } from 'react';
import { connect } from 'dva';
import { Flex, Tag, InputItem } from 'antd-mobile';
import QueueAnim from 'rc-queue-anim';
import buildForm from "../../../components/FormBuilder";
import HeaderGQT from "../../../components/HeaderGQT";
import style from './require.css';

const ProjectRequirement = ({dispatch, projectRequirement}) => {
  const {HR, outsoucing, projectDetail} = projectRequirement;
  let financialForm = null;
  let hrForm = null;
  let outsoucingForm = null;

  if(!projectDetail)
  {
    return null;
  }

  const FinancialForm = buildForm([
    {
      section: '融资需求',
      fields: [
        {name: 'financeStage', label: '项目阶段', options: ['暂无需求', '种子轮', '天使轮', 'A轮及以上']},
        {name: 'financeAmount', label: '融资金额', type: 'number', unit: '万元'},
        {name: 'outRate', label: '出让股权', type: 'number', unit: '%'},
      ]
    }
  ]);

  const HRForm = buildForm([
    {
      section: '人才需求',
      subTitle: '点击名称勾选或取消',
      fields: [
        {name: '技术', label: '技术', type: 'tags', options: ['Android', 'iOS', 'PHP', 'Java', 'HTML5', '数据库', '测试', '运维', '架构师', '技术总监']},
        {name: '市场', label: '市场', type: 'tags', options: ['市场策划', '市场公关', '商务渠道', '销售', '客户代表', '市场总监', '公关总监', '销售总监']},
        {name: '运营', label: '运营', type: 'tags', options: ['新媒体运营', '产品运营', '数据运营', '活动运营', '编辑', '客服', '运营总监']},
        {name: '职能', label: '职能', type: 'tags', options: ['HR', '行政', '财务', '行政总监', '财务总监']}
      ]
    }
  ]);

  const OutsoucingForm = buildForm([
    {
      section: '外包服务需求',
      subTitle: '点击名称勾选或取消',
      fields: [
        {name: '技术', label: '技术', type: 'tags', options: ['网站', 'APP', '微信公众帐号', 'UI设计', '系统集成']},
        {name: '代运营', label: '代运营', type: 'tags', options: ['网站代运营','微信代运营', '微博代运营', '电商代运营']},
        {name: '财务金融', label: '财务金融', type: 'tags', options: ['财务代帐', '投融资对接']},
        {name: '法律', label: '法律', type: 'tags', options: ['合同管理', '欠款清理', '人力资源', '知识产权', '架构设计', '股权设置', '投融资']},
        {name: '广告传媒', label: '广告传媒', type: 'tags', options: ['视频制作','平面广告', '投放渠道']},
        {name: '商务渠道', label: '商务渠道', type: 'tags', options: ['政府渠道','大企业渠道', '中小企业渠道', '实体商户渠道', '电商渠道']},
      ]
    }
  ]);

  const GetFormValues = (formInstance) => {
    return new Promise((resolve, reject) => {
      formInstance.validateFields((error, data) => {
        resolve(data);
      });
    });
  };

  const Skip = () => {
    dispatch({type: 'projectRequirement/gotoMyProject'});
  };

  const updateProject = () => {
    let financialData = null;
    let hrData = null;
    return GetFormValues(financialForm)
    .then((result) => {
      financialData = result;
      return GetFormValues(hrForm)
    })
    .then((result) => {
      hrData = result;
      return GetFormValues(outsoucingForm)
    })
    .then((result) => {
      const outsoucingData = result;
      const payload = {
        ...financialData,
        talentDemand: hrData,
        outSerDemand: outsoucingData
      };

        dispatch({type: 'projectRequirement/updateProject', payload});
    });
  }

  return (
    <div>
      <HeaderGQT />
      <div className={style.top}>
        <div className={style.content}>
          <ul>
            <li className={style.title}>{projectDetail.name}</li>
            <li className={style.explain}>领域: <span>{projectDetail.field}</span></li>
            <li className={style.explain}>产品受众: <span>{projectDetail.audience}</span></li>
            <li className={style.explain}>团队规模: <span>{projectDetail.scope}</span></li>
          </ul>
          <img className={style.image} src={projectDetail.logo} />     
        </div>
      </div>
      <div className={style.add}>
        <FinancialForm ref={form => financialForm = form} value={projectDetail} />
      </div>
      <div className={style.introduce}>
        <HRForm ref={form => hrForm = form} value={HR} />
      </div>
      <div className={style.introduce}>
        <OutsoucingForm ref={form => outsoucingForm = form} value={outsoucing} />
      </div>
      <Flex>
        <Flex.Item>
          <div className={style.jump} onClick={Skip}>跳过</div>
        </Flex.Item>
        <Flex.Item>
          <div className={style.jump} onClick={updateProject}>保存</div>
        </Flex.Item>
      </Flex>
    </div>
  );
}

ProjectRequirement.propTypes = {
  dispatch: PropTypes.func,
  projectRequirement: PropTypes.object,
}

export default connect(({projectRequirement}) => ({projectRequirement}))(ProjectRequirement);