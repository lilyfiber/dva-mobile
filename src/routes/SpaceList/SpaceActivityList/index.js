import React, { PropTypes } from 'react';
import { connect } from 'dva';
import { Button, Flex, ListView, Icon } from 'antd-mobile';
import QueueAnim from 'rc-queue-anim';

import style from './style.css';
import HotActivite from "../../../components/HotActivite";
import ParkInfo from "../../../components/ParkInfo";


const SpaceActivityList = ({dispatch, spaceActivityList}) => {
  let loading = spaceActivityList.loading;

  const activityDetail = (rowData) =>{
    if(rowData.create_id)
    {
      location.href = "http://t2.zetadata.com.cn/event/detail/" + rowData.create_id;
    }
    else
    {
      dispatch({type:'activityList/detailActivityShow', payload: rowData.id});
    }
  };

  //加载字段提示问题 
  const showTips = () => {
    if(!loading){
      return `加载完成`;
    }
  }

  const row = (rowData, sectionID, rowID) => {
    return (
      <div>
          <HotActivite hotEvent={rowData} onClick={() => activityDetail(rowData)}/>
      </div> 
    );
  };
    
  return (
    <ListView 
      dataSource={spaceActivityList.dataSource}
      renderRow={row}
      renderFooter={() =>
        <div style={{ paddingTop: '0.8rem', textAlign: 'center'}}>
          {showTips()}
        </div>
      }
      useBodyScroll />
  );
}

SpaceActivityList.propTypes = {
    dispatch: PropTypes.func,
    spaceActivityList: PropTypes.object,
};

export default connect(({spaceActivityList}) => ({spaceActivityList}))(SpaceActivityList);