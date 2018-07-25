import React, { PropTypes } from 'react';
import { connect } from 'dva';
import { Flex, ListView, Tabs, WhiteSpace, Button } from 'antd-mobile';
import QueueAnim from 'rc-queue-anim';

import BaiduMap from "../components/BaiduMap";
import HeaderGQT from "../components/HeaderGQT";
import ParkInfo from "../components/ParkInfo";
import HotActivite from "../components/HotActivite";
import styles from './home.css';

const Home = ({dispatch, home}) => {
  // 全部园区，用来给地图进行渲染用的
  const parks = home.parks;

  // 附近的园区
  const nearbyParks = home.nearbyParks;

  const hotEvents = home.hotEvents;
  const spaceCount = home.spaceCount;
  const projectCount = home.projectCount;
  const policyCount = home.policyCount;
  const activityCount = home.activityCount;
  const centerPoint = home.centerPoint;

  const jump = (place) => {
    dispatch({type: "menu/goto", payload: place});
  }

  const detailParkShow = (park) => {
    if(!park || !park.park.mobileShow)
    {
      alert(park.name + "数据更新中")
      return;
    }

    dispatch({type:'home/detailParkShow', payload: park.park.id});
  };
  const detailActivityShow = (activityID) => {
      dispatch({type:'home/detailActivityShow', payload: activityID})
  };

  return(
    <div style={{backgroundColor: '#f2f2f2'}}>
      <HeaderGQT />
      <QueueAnim>
        <div key="home">
          <div className={styles.map}>
            <BaiduMap points={parks} initFocusPoints={nearbyParks} onMapMove={(center) => {dispatch({type: "home/mapMove", payload: center})}} onIconClick = {detailParkShow}/>
          </div>
          <Flex className={styles.list}>
            <Flex.Item className={styles.listItem} ><div className={styles.font}>{spaceCount}个</div><div className={styles.name} onClick={() => jump("/space")}>苏青C空间</div></Flex.Item>
            <Flex.Item className={styles.listItem} ><div className={styles.font}>{projectCount}个</div><div className={styles.name} onClick={() => jump("/project")}>创业项目</div></Flex.Item>
            <Flex.Item className={styles.listItem} ><div className={styles.font}>{policyCount}条</div><div className={styles.name} onClick={() => jump("/space")}>创业政策</div></Flex.Item>
            <Flex.Item className={styles.listItem}  style={{borderRight: "none"}}><div className={styles.font}>{activityCount}个</div><div className={styles.name} onClick={() => jump("/activity")}>创业活动</div></Flex.Item>
          </Flex>
          <div className={styles.space}>
            附近的苏青C空间
          </div>
          <div className={styles.content}>
            {nearbyParks.map(list => <ParkInfo key={list.id} park={list} onClick={()=>{detailParkShow(list)}}/>)}

            <div className={styles.circleButton} onClick={() => jump("/space")}>更多</div>
            <div className={styles.activity}>热门活动</div>
          </div>
          {
            hotEvents.map(hotEvent =><HotActivite key={hotEvent.id} hotEvent={hotEvent} onClick={() =>detailActivityShow(hotEvent.id)}/>)
          }
          <div className={styles.circleButton} onClick={() => jump("/activity")}>更多</div>
        </div>
      </QueueAnim>
    </div>
  );
 }
 
Home.propTypes = {
    dispatch: PropTypes.func,
    home: PropTypes.object,
};
export default connect(({home}) => ({home}))(Home);

