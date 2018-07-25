import React, { PropTypes } from 'react';
import { connect } from 'dva';
import { ListView, Flex, SearchBar, List, Button, InputItem, Modal, WhiteSpace, WingBlank, Menu, Dropdown, Icon} from 'antd-mobile';
import QueueAnim from 'rc-queue-anim';

import style from './style.css';
import HeaderGQT from "../../components/HeaderGQT";
import HotActivite from "../../components/HotActivite";
import ActivityType from "../../components/ActivityType";
import SortInfo from "../../components/SortInfo";

const ActivityList = ({dispatch, activityList}) => {
  let isLoading = activityList.isLoading;
  let offset = activityList.offset;
  const pageSize = activityList.pageSize;
  let noData = activityList.noData;

  const activityType ={
    title:'活动类型▼',
    content: [
      [  
        {
          label: '全部',
          value: '',
        },  
        {
          label: '路演',
          value: 1,
        },
        {
          label: '培训',
          value: 2,
        },
        {
          label: '沙龙',
          value: 3,
        },
        {
          label: '其他',
          value: 4,
        }
      ]  
    ]
  }

  const activtiySort ={
    title:'排序▼',
    content: [
      [
        {
          label: '按注册时间',
          value: 'registerEnd',
        },
        {
          label: '按活动开始时间',
          value: 'start_time',
        },
        {
          label: '按活动结束时间',
          value: 'end_time',
        }
      ],[
        {
          label: '升序↑',
          value: 'asc',
        },{
          label: '降序↓',
          value: 'desc',
        }
      ]
    ]
  }

  const row = (rowData, sectionID, rowID) => {
    return (
      <HotActivite hotEvent={rowData} onClick={() => detailActivityShow(rowData)}/>    
    );
  };

  // 加载到底
  const onEndReached = () => {
    dispatch({type:'activityList/getActivityList', payload: {offset, pageSize}});
  };

  // 活动详情跳转
  const detailActivityShow = (rowData) => {
    if(rowData.create_id)
    {
      location.href = "http://t2.zetadata.com.cn/event/detail/" + rowData.create_id;
    }
    else
    {
      dispatch({type:'activityList/detailActivityShow', payload: rowData.id});
    }
  }

  // 根据活动状态进行过滤
  const selectType = (result) => {
    let type = null;
    if(!result || result == null){
      type = '';
    }else if(result[0] == '全部'){
      type = '';
    }else{
      type = result[0];
    }
   
    dispatch({type:'activityList/setTypes', payload: type})
  };

  // 根据时间进行排序
  const sortTime = (time) =>{
    let sort = null;
    let orderBy = null;
    if(time == null){
      sort = null;
      orderBy = null;
    }else{
      orderBy = time[0];
      sort = time[1];
    }
    dispatch({type:'activityList/sortTimes', payload: {sort, orderBy}});
  }

   // 投资人姓名过滤
  const sortName = (result) =>{
    dispatch({type:'activityList/sortNames', payload: result});
  }

  //加载字段提示问题 
  const showTips = () =>{
    if(noData&&offset == 0&&!isLoading){
      return `当前页面暂无数据`
    }else if(!noData&&isLoading){
      return `加载中`
    }else if(noData&&!isLoading){
      return `当前是最后一页`
    }
    
  }

  return (
    <div style={{backgroundColor: '#f2f2f2'}} key="activityList">
      <style type="text/css">
      {`
        .am-whitespace.am-whitespace-md{
          height: 0rem !important;
        }
        .am-flexbox.am-flexbox-align-middle{
          margin-bottom: 0.15rem;
        }
        .activity___2yg6-{
          height: 2.13rem !important;
        }
        .am-button {
          font-size: 0.3rem !important;
        }
      `}
      </style>
      <HeaderGQT />
      <QueueAnim >
        <div key="activityList">
          <div className={style.activity}>
            <div className={style.input}>
              <div style={{paddingTop:'0.1rem'}}>
                <SearchBar className={style.search}  placeholder="按项目名称搜索" onChange={value => {dispatch({type:'projectList/filterByName', payload:value})}} onCancel={value => dispatch({type:'projectList/filterByName', payload: null})} />
              </div>
            </div>
            <Flex className={style.list}>
              <Flex.Item className={style.listItem} >        
                <div className={style.filter}><ActivityType selectType={selectType} {...activityType}/></div>
              </Flex.Item>
            </Flex>
          </div>

          <ListView 
            dataSource={activityList.dataSource}
            renderFooter={() => 
              <div style={{ padding: 30, textAlign: 'center' }}>
                {showTips()}
              </div>
            }
            initialListSize={activityList.offset}
            useBodyScroll
            renderRow={row}
            pageSize={20}
            scrollRenderAheadDistance={500}
            scrollEventThrottle={20}
            onEndReached={()=>{onEndReached()}}
            onEndReachedThreshold={10}
            style={{
              margin: '-0.15rem 0 0 0'
            }} />
        </div>
      </QueueAnim>
    </div>
  );
}

ActivityList.propTypes = {
	dispatch: PropTypes.func,
  activityList: PropTypes.object,
}

export default connect(({activityList}) => ({activityList}))(ActivityList);