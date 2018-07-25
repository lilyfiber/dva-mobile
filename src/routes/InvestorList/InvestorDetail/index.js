import React, { PropTypes } from 'react';
import { connect } from 'dva';
import { ListView, TabBar, Icon, Flex, WhiteSpace } from 'antd-mobile';
import QueueAnim from 'rc-queue-anim';

import HeaderGQT from "../../../components/HeaderGQT";
import styles from './style.css';
  // 投资人详情
  const InvestorDetail = ({dispatch, investorDetail}) => {
    return (
      <div style={{backgroundColor: '#F2F2F2', height: '100%'}}>
        <style type="text/css">
        {`
          .am-list-body {
            background-color: rgba(0,0,0,0) !important;
            border-top: none !important;
          }
          /*.am-flexbox .am-flexbox-item:first-child{
            margin-top: -0.58rem;
          }*/
        `}
        </style>
        <HeaderGQT />
        <QueueAnim>
          <div key="investorDetail">
            <div className={styles.image} style={{'backgroundImage': `url('${investorDetail.logo}')`}}></div>
            <Flex className={styles.details} >
              <Flex.Item style={{flex: 0.25}} className={styles.names}>{investorDetail.name}</Flex.Item>
              <Flex.Item className={styles.borders}>
                <div className={styles.rborder}>
                  <div className={styles.introduce}>{investorDetail.company}</div>
                  <div className={styles.introduce}>{investorDetail.profession}</div>
                  <div className={styles.introduce}>{investorDetail.round}</div>
                </div>
              </Flex.Item>
            </Flex>    
            <div className={styles.bot}>
              <div className={styles.detail}>个人简介</div>
              <div className={styles.introduces}>{investorDetail.description}</div>
            </div>
          </div>
        </QueueAnim>
      </div>
    );
  }

InvestorDetail.propTypes = {
    dispatch: PropTypes.func,
    investorDetail: PropTypes.object,
};

export default connect(({investorDetail}) => ({investorDetail}))(InvestorDetail)