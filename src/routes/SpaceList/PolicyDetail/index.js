import React, { PropTypes } from 'react';
import { connect } from 'dva';
import { Flex, InputItem, WhiteSpace } from 'antd-mobile';
import QueueAnim from 'rc-queue-anim';

import HeaderGQT from "../../../components/HeaderGQT";
import ParkInfo from "../../../components/ParkInfo";
import style from './policy.css';

const PolicyDetail = ({dispatch, policyDetail}) => {
  const policyData = policyDetail.policy;
  const parkData = policyDetail.park;
  const menuItems = {icon: String.fromCharCode(0xe90e)};
  const toCall = (num) => {
    window.location.href = "tel:" + num;
  }

  return (
    <div className={style.card}>
      <style type="text/css">
      {`
        .am-tabs-bar {
          display: none;
        }
      `}
      </style>
      
      <div className={style.content}>
        <QueueAnim>
          <div key="policyDetail">
            <h3 className={style.mainTitle}>{policyData.name}</h3>
            {
              policyData.content ? (
                <div>
                  <p className={style.firstTitle}>支持对象</p>
                  <div className={style.introduce} dangerouslySetInnerHTML={{__html: policyData.content}} />
                </div>
              ): null
            }
            {
              policyData.impel ? (
                <div>
                  <p className={style.firstTitle}>政策优惠</p>
                  <div className={style.introduce} dangerouslySetInnerHTML={{__html: policyData.impel}} />
                </div>
              ): null
            }
            {
              policyData.condition ? (
                <div>
                  <p className={style.firstTitle}>申请流程所需材料</p>
                  <div className={style.introduce} dangerouslySetInnerHTML={{__html: policyData.condition}} />
                </div>
              ): null
            }
            {
              policyData.contacts ? (
                <div>
                  <p className={style.firstTitle}>联系信息</p>
                  <div className={style.introduce} dangerouslySetInnerHTML={{__html: policyData.contacts}} />
                </div>
              ): null
            }
          </div>
        </QueueAnim>
      </div>
      
      {policyData.phone ? <div className={style.bottomBar} onClick={() => toCall(policyData.phone)}><i className={style.icon}>{menuItems.icon}</i><span className={style.ask}>联系 {policyData.phone}</span></div>: null}
    </div>
  );
}

PolicyDetail.propTypes = {
  dispatch: PropTypes.func,
  policyDetail: PropTypes.object,
};

export default connect(({policyDetail}) => ({policyDetail}))(PolicyDetail);