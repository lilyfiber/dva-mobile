import React, { PropTypes } from 'react';
import { connect } from 'dva';
import { Tabs } from 'antd-mobile';
import HeaderGQT from "../../components/HeaderGQT";
import styles from "./SpaceListMenu.css";
import { Carousel } from 'antd-mobile';

const SpaceListMenu = ({dispatch, spaceListMenu, children}) => {
  const TabPane = Tabs.TabPane;

  const callback = (key) => {
    let payload = '';
    switch (key) {
      case '1':
        payload = spaceListMenu.spaceID +'/';
        break;
      case '2':
        payload = spaceListMenu.spaceID +'/project';
        break;
      case '3':
        payload = spaceListMenu.spaceID +'/mentor';
        break;
      case '4':
        payload = spaceListMenu.spaceID +'/activity';
        break;
    }
    
    dispatch({type:'spaceListMenu/goto', payload: payload});
  }

  return (
    <div className={styles.fullPage}>
      <style type="text/css">
      {`
        .am-tabs-content{
          flex: 1;
        }
        .am-tabs-tabpane{
          display: flex;
          flex-direction: column;
        }
        .am-tabs-tab {
          height: 0.9rem !important;
          line-height: 0.9rem !important;
          background-color: #00C2FF !important;
          border-bottom: 1px solid transparent !important;
          color: #FFF !important;
          box-sizing: initial !important;
          font-size: 0.32rem !important;
        }
        .am-tabs-ink-bar {
          background-color: #FFF !important;
        }
        .am-tabs-bar {
          margin: 0 !important;
        }
      `}
      </style>
      <HeaderGQT />
      <div className={styles.top}>
        <Carousel style={{height: '3.2rem', overflow: 'hidden'}} dots={false} autoplay={spaceListMenu.resources.length > 1} easing={"easeInOutQuart"} infinite className={styles.img}>
          {spaceListMenu.resources.map(resource => <div key={resource.id}><img style={{width: '100%'}} onLoad={() => {window.dispatchEvent(new Event('resize'));}} src={resource.url} /></div>)}
        </Carousel>
        <div className={styles.name}>{spaceListMenu.name}</div>
      </div>
      <Tabs style={{flex: 1, display: 'flex', flexDirection: 'column'}} defaultActiveKey={spaceListMenu.selectedKey} swipeable={false} onChange={callback}>
        <TabPane tab="简介" key="1">
          {children}
        </TabPane>
        <TabPane tab="项目" key="2">
          {children}
        </TabPane>
        <TabPane tab="导师" key="3">
          {children}
        </TabPane>
        <TabPane tab="活动" key="4">
          {children}
        </TabPane>
      </Tabs>
    </div>
  )
}

SpaceListMenu.propTypes = {
    dispatch: PropTypes.func,
    spaceListMenu: PropTypes.object,
};

export default connect(({spaceListMenu}) => ({spaceListMenu}))(SpaceListMenu);