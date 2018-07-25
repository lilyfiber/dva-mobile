import React, { PropTypes } from 'react';
import { connect } from 'dva';
import { Flex, Tabs, SearchBar, ListView } from 'antd-mobile';
import QueueAnim from 'rc-queue-anim';

import BaiduMap from "../../components/BaiduMap";
import HeaderGQT from "../../components/HeaderGQT";
import ParkInfo from "../../components/ParkInfo";
import styles from './index.css';

const TabPane = Tabs.TabPane;

const SpaceList = ({dispatch, spaceList}) => {
  const parks = spaceList.parks;
  let isLoading = spaceList.isLoading;
  const detailParkShow = (park) => {
    if(!park || !park.park.mobileShow)
    {
      alert(park.name + "数据更新中")
      return;
    }

    dispatch({type:'spaceList/detailShow', payload: park.park.id})
  };

  const row = (rowData, sectionID, rowID) => {
    return (
      <ParkInfo park={rowData} onClick={()=>{detailParkShow(rowData)}} /> 
    );
  };

  // 搜索
  const search = () => {
    state = {
      value: '',
      focused: false,
    };
    onChange = (value) => {
      this.setState({ value });
    };
    clear = () => {
      this.setState({ value: '' });
    }
  };

  return (
    <div style={{backgroundColor: '#f2f2f2'}}>
      <style type="text/css">
      {`
        .am-tabs-bar{
          margin: 0 0.25rem 0 0.25rem;
        }
        .am-tabs-tab{
          height: 0.6rem !important;
          line-height: 0.6rem !important;
          font-size: 0.3122rem !important;
          color: #00C2FF !important;
        }
        .am-tabs-ink-bar{
          background-color: #00C2FF !important;
        }
        .am-list-body{
          background-color: #F2F2F2 !important;
        }
      `}
      </style>
      <HeaderGQT />
      <div className={styles.map}>
        <BaiduMap points={parks} initFocusPoints={parks} onIconClick={detailParkShow}/>
      </div>
      <div className={styles.space}>
        <div className={styles.input}>
          <SearchBar className={styles.search} placeholder={"按苏青C空间名称搜索"} onChange={value => dispatch({type:'spaceList/filterByName', payload: value})} onCancel={value => dispatch({type:'spaceList/filterByName', payload: null})} />
        </div>
      </div>
      <Tabs className={styles.content} defaultActiveKey='1' swipeable={false}>
        <TabPane tab="苏青优店" key="1" >
          <ListView
            dataSource={spaceList.dataSourceA}
            renderRow={row} 
            renderFooter={() => 
              <div style={{ padding: 30, textAlign: 'center' }}>
                {isLoading?'加载中':'当前是最后一页'}
              </div>
            } 
            initialListSize={spaceList.uParks.length}
            useBodyScroll
            style={{ 
              overflow: 'auto',
              margin: '0 0 1rem 0'}} />
        </TabPane>
        <TabPane tab="苏青C空间" key="2" >
          <ListView
            dataSource={spaceList.dataSourceB}
            renderRow={row} 
            renderFooter={() => 
              <div style={{ padding: 30, textAlign: 'center' }}>
                {isLoading?'加载中':'当前是最后一页'}
              </div>
            }
            initialListSize={spaceList.cParks.length}
            pageSize={20}
            useBodyScroll
            style={{ 
              overflow: 'auto',
              margin: '0 0 1rem 0'}} />
        </TabPane>
      </Tabs>
    </div>
  );
}

SpaceList.propTypes = {
    dispatch: PropTypes.func,
    spaceList: PropTypes.object,
};

export default connect(({spaceList}) => ({spaceList}))(SpaceList);



