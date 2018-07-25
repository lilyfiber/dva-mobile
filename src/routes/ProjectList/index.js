import React, { PropTypes } from 'react';
import { connect } from 'dva';
import { Button, Flex, ListView, Icon,SearchBar ,Popup, List, InputItem,WhiteSpace, WingBlank, Modal} from 'antd-mobile';
import QueueAnim from 'rc-queue-anim';
import style from './project.css';
import HeaderGQT from "../../components/HeaderGQT";
import ParkInfo from "../../components/ParkInfo";
import Spaceproject from "../../components/Spaceproject";
import ActivityType from "../../components/ActivityType";
import ProjectScope from "../../components/ProjectScope";


const ProjectList = ({dispatch, projectList}) => { 
  let loading = projectList.loading;
  const offset = projectList.offset;
  const pageSize = projectList.pageSize;
  let noData = projectList.noData;

  const onClick = (e) => {
    e.preventDefault(); // 修复 Android 上点击穿透
     Popup.show(<PopupContent onClose={() => Popup.hide()} />);
  };

  const projectField ={
    title:'项目领域▼',
    content: [
      [    
        {
          label: '全部',
          value: '全部',
        },
        {
          label: 'IT互联网',
          value: 'IT互联网',
        },
        {
          label: '文化传媒',
          value: '文化传媒',
        },
        {
          label: '通信',
          value: '通信',
        },
        {
          label: '物联网',
          value: '物联网',
        },
        {
          label: '金融商贸',
          value: '金融商贸',
        },
        {
          label: '教育培训',
          value: '教育培训',
        },
        {
          label: '医疗生物',
          value: '医疗生物',
        },
        {
          label: '司法法律',
          value: '司法法律',
        },
        {
          label: '房产建筑',
          value: '房产建筑',
        },
        {
          label: '服务业',
          value: '服务业',
        },
        {
          label: '汽车交通',
          value: '汽车交通',
        },
        {
          label: '轻工贸易',
          value: '轻工贸易',
        },
        {
          label: '电子电气',
          value: '电子电气',
        },
        {
          label: '机械重工',
          value: '机械重工',
        },
        {
          label: '农林牧渔',
          value: '农林牧渔',
        },
        {
          label: '光电新能源',
          value: '光电新能源',
        },
        {
          label: '化工环保',
          value: '化工环保',
        },
        {
          label: '其他',
          value: '其他',
        }
      ]  
    ]  
  }

  const teamScope ={
    title:'团队规模▼',
    content: [
      [
        {
          label: '全部',
          value: '全部',
        },
        {
          label: '少于5人',
          value: '少于5人',
        },{
          label: '5-20人',
          value: '5-20人',
        },{
          label: '21-50人',
          value: '21-50人',
        },{
          label: '50人以上',
          value: '50人以上',
        }
      ]
    ]
  }

  // 加载到底
  const onEndReached = () => {
    dispatch({type:'projectList/queryProjectList'});
  };

  // 项目详情
  const GotoProjectDetail = (projectID) => {
    dispatch({type: 'projectList/projectDetail', payload: projectID});
  };

  // 根据项目领域进行过滤
  const selectType = (result) => {
    let field = null;
    if(!result || result == null){
      field = '';
    }else if(result[0] == '全部'){
      field = '';
    }else{
      field = result[0];
    }
    dispatch({type:'projectList/setFields', payload: field})
  };

  // 根据团队规模进行过滤
  const selectScope = (result) => {
    let scope = null;
    if(!result || result == null){
      scope = '';
    }else if(result[0] == '全部'){
      scope = ''
    }else{
      scope = result[0];
    }
  
    dispatch({type:'projectList/setScopes', payload: scope})
  };

  //加载字段提示问题 
  const showTips = () =>{
    if(noData&&offset == 0&&!loading){
      return `当前页面暂无数据`
    }else if(!noData&&loading){
      return `加载中`
    }else if(noData&&!loading){
      return `当前是最后一页`
    }
  }
 
  const row = (rowData, sectionID, rowID) => {
    return (
      <Spaceproject key={rowID} park={rowData} onClick={()=>{GotoProjectDetail(rowData.id)}}/>
    );
  };
  
  // 进入我的项目
  const myProject = () => {
    dispatch({type: 'projectList/myProject'});
  }

  return (
    <div style={{backgroundColor: '#f2f2f2'}}>
      <style type="text/css">
      {`
        .am-whitespace.am-whitespace-md{
          height: 0rem !important;
        }
        .am-flexbox.am-flexbox-align-middle{
          margin-bottom: 0.15rem;
        }
        .list-view-section-body{
          background-color: #f2f2f2;
        }
        .am-list-body {
          background-color: transparent !important;
          border-top: 1px solid transparent !important;
        }
        .list-view-section-body {
          background-color: transparent !important;
        }
        .am-button {
          font-size: 0.3rem !important;
        }
      `}
      </style>
      
      <div>
        <HeaderGQT />
        <QueueAnim>
          <div key="projectList">
            <div className={style.activity}>
              <div className={style.input}>
                <div style={{paddingTop:'0.1rem'}}>
                  <SearchBar className={style.search}  placeholder="按项目名称搜索" onChange={value => {dispatch({type:'projectList/filterByName', payload:value})}} onCancel={value => dispatch({type:'projectList/filterByName', payload: null})} />
                </div>
              </div>
              <Flex className={style.list}>
                <Flex.Item className={style.listItem} >        
                  <div className={style.filter}><ActivityType selectType={selectType} {...projectField} /></div>
                </Flex.Item>
        
                <Flex.Item className={style.listItem} >
                  <div className={style.filter}><ProjectScope selectScope={selectScope} {...teamScope}/></div>
                </Flex.Item>
              </Flex>
            </div>
            <div className={style.content}>
              <ListView
                dataSource={projectList.dataSource}
                renderFooter={() => 
                  <div style={{ padding: 30, textAlign: 'center'}} >
                    {showTips()}
                  </div>
                }
                initialListSize={projectList.backtoPage ? projectList.offset: undefined}
                useBodyScroll
                renderRow={row} 
                pageSize={20}
                scrollRenderAheadDistance={500}
                scrollEventThrottle={20}
                onEndReached={()=>{onEndReached()}}
                onEndReachedThreshold={40}
                style={{
                  margin: '-0.25rem 0 0 0'
                }}
              />
            </div>
          </div>
        </QueueAnim>
      </div>
      
      <div>
        <div className={style.add} onClick={myProject}>我的项目</div> 
      </div>
    </div>
  );
}


ProjectList.propTypes = {
    dispatch: PropTypes.func,
    projectList: PropTypes.object,
};

export default connect(({projectList}) => ({projectList}))(ProjectList);