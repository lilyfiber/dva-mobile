import React, { PropTypes } from 'react';
import { connect } from 'dva';
import { ListView, List, Flex, Card, TextareaItem, WhiteSpace, Button} from 'antd-mobile';
import QueueAnim from 'rc-queue-anim';

import BaiduMap from "../../../components/BaiduMap";
import HeaderGQT from "../../../components/HeaderGQT";
import ParkInfo from "../../../components/ParkInfo";
import styles from './index.css';
import moment from 'moment';
moment.locale("zh-CN");

const Item = List.Item;

const getNormalDateStr = function(timeDate)
{
  if(!timeDate)
  {
    return;
  }

  return timeDate.slice(0, 4) + '-' + timeDate.slice(4, 6) + '-' + timeDate.slice(6, 8) + 'T' + timeDate.slice(8, 10) + ':' + timeDate.slice(10, 12) + ':' + timeDate.slice(12, 14) + '.000+08:00';
}

// 格式化时间为 中文格式
const formatTime = function(hotEvent)
{
  const bt = new Date(getNormalDateStr(hotEvent.start_time));
  const base = moment(bt).format('MMMDo dddd HH:mm');
  if(hotEvent.start_time && hotEvent.end_time)
  {
    const et = new Date(getNormalDateStr(hotEvent.end_time));
    if(bt.getTime() == et.getTime())
    {
      return base;
    }

    return `${base}-${moment(et).format('HH:mm')}`;
  }

  return base;
}

const row = (rowData, sectionID, rowID) => {
  if(rowID == 'parkNode'){
    return null;
  }
  return (
    <div className={styles.commentContent}>
      <Flex style={{alignItems: 'flex-start'}}>
        <img className={styles.bigHead}  src={rowData.logo_url} />
        <Flex.Item className={styles.business}>
          <p className={styles.sayPeople}>{rowData.organization}</p>{
            rowData.holder
            ?<p className={styles.sayWord}>{'联系人:'+rowData.holder + ' '+rowData.phone}</p>:''
          }
          
        </Flex.Item>
      </Flex>
    </div>    
  );
};



const ActivityDetail = ({dispatch, activityDetail}) => {
  const showParkInfo = (park) => {
    if(!park.park)
    {
      return null;
    }
    return (<ParkInfo park={park} onClick={()=>detailParkShow(park.park.id)}/>);
  }

  const activityApply = (activityID) => {
    dispatch({type:'activityDetail/activityApply', payload: activityID})
  };

  // 园区详情跳转
  const detailParkShow = (parkID) => {
    dispatch({type:'activityDetail/detailParkShow', payload: parkID})
  };

  const points = []; 

  if(activityDetail.loading){ 
    return null;
  }

  // 活动详情
  const eventdata = activityDetail.eventDetail;
  // 当前活动的园区详情
  const parkNode = activityDetail.parkNode;

  return (
    <div>
      <style type="text/css">
      {`
        .am-textarea-control textarea{
          line-height: normal !important;
          font-size: 0.3122rem !important;
        }
        .am-list-body{
          background-color: transparent !important;
          border: none !important;
        }
        .am-list-body{
          background-color: transparent !important;
          border: none !important;
        }
        .am-textarea-control{
          padding: 0 !important;
        }
      `}
      </style>
      <HeaderGQT />
      <QueueAnim>
        <div key="activityDetail">
          <img className={styles.img} src={eventdata.logo_url} />
          <div className={styles.content}>
            <p className={styles.title}>{eventdata.name}</p>
            <p className={styles.detail}>{eventdata.content}</p>
            <p className={styles.info}><i className={styles.time} /><span className={styles.label}>时间：{formatTime(eventdata)}</span></p>
            <p className={styles.info}><i className={styles.place} /><span className={styles.label}>地点：{eventdata.address}</span></p>
          </div>
          <div className={styles.map}>
            <BaiduMap address={eventdata.address}/>
          </div>
          <div className={styles.fabulous}>
            {showParkInfo(parkNode)}
            <Flex className={styles.good}>
                <Flex.Item>
                  <Flex>
                    <Flex.Item style={{flex: 0.13}}><img className={styles.head} src={activityDetail.img1} /></Flex.Item>
                    <Flex.Item style={{flex: 0.13}}><img className={styles.head} src={activityDetail.img2} /></Flex.Item>
                    <Flex.Item style={{flex: 0.13}}><img className={styles.head} src={activityDetail.img3} /></Flex.Item>
                  </Flex>
                </Flex.Item>        
                <Flex.Item style={{flex: 0.32, textAlign: 'right'}}>
                  <img src={activityDetail.img4} />
                  &nbsp;
                  <span className={styles.num}>120</span>
                </Flex.Item>
              </Flex>
          </div>
          <div className={styles.comment}>
            <div className={styles.text}>最新评论</div>
            <div className={styles.infotmation}>
              <Flex style={{alignItems: 'flex-start'}}>
                <img className={styles.bigHead}  src={activityDetail.img2} />
                <Flex.Item className={styles.business}>
                  <p className={styles.sayPeople}>{eventdata.holder}</p>
                  <TextareaItem className={styles.textaream} placeholder={'欢迎分享您对活动的评论或期待'} 
                    rows={2}>
                  </TextareaItem>
                </Flex.Item>
              </Flex>
              <div className={styles.say}>评论</div>
            </div>
            <ListView
                dataSource={activityDetail.dataSource}
                renderRow={row} 
                useBodyScroll /> 
          </div>
        </div>
      </QueueAnim>
    </div>
    
  )
}

ActivityDetail.propTypes = {
	dispatch: PropTypes.func,
  activityDetail: PropTypes.object,
}

export default connect(({activityDetail}) => ({activityDetail}))(ActivityDetail);