import React, { PropTypes } from 'react';
import { connect } from 'dva';
import { ListView, TabBar, Icon, Flex ,SearchBar, Popup, List, Button, InputItem, WhiteSpace, WingBlank, Modal, PickerView} from 'antd-mobile';
import QueueAnim from 'rc-queue-anim';

import style from './style.css';
import HotInvestor from "../../components/HotInvestor";
import HeaderGQT from "../../components/HeaderGQT";
import InvestorType from "../../components/InvestorType";
import InvestorSortInfo from "../../components/InvestorSortInfo";
import SortInfo from "../../components/SortInfo";

const InvestorList = ({dispatch, investorList}) => {
  let noData = investorList.noData;
  let isLoading = investorList.isLoading;
  const offset = investorList.offset;
  const pageSize = investorList.pageSize;

  const onClick = (e) => {
    e.preventDefault(); // 修复 Android 上点击穿透
     Popup.show(<PopupContent onClose={() => Popup.hide()} />);
  };

  // 投资领域

  const investorType ={
    title:'投资领域▼',
    content: [
    [   
      {
        label: '全部',
        value: '全部',
      },
      {
        label: '教育',
        value: '教育',
      },
      {
        label: '体育',
        value: '体育',
      },
      {
        label: '文娱传媒',
        value: '文娱传媒',
      },
      {
        label: '电商',
        value: '电商',
      },
      {
        label: '企业服务',
        value: '企业服务',
      },
      {
        label: '硬件',
        value: '硬件',
      },
      {
        label: '游戏',
        value: '游戏',
      },
      {
        label: '电子商务',
        value: '电子商务',
      },
      {
        label: 'O2O',
        value: 'O2O',
      },
      {
        label: '医疗健康',
        value: '医疗健康',
      },
      {
        label: '金融',
        value: '金融',
      },
      {
        label: '消费品',
        value: '消费品',
      },
      {
        label: '新科技',
        value: '新科技',
      },
      {
        label: '出海',
        value: '出海',
      },
      {
        label: '云服务',
        value: '云服务',
      },
      {
        label: '数据服务',
        value: '数据服务',
      },
      {
        label: 'B2B',
        value: 'B2B',
      },
      {
        label: '汽车交通',
        value: '汽车交通',
      },
      {
        label: '消费升级',
        value: '消费升级',
      },
      {
        label: '原创IP',
        value: '原创IP',
      },
      {
        label: '影视',
        value: '影视',
      },
      {
        label: '工具',
        value: '工具',
      },
      {
        label: 'VR.AR',
        value: 'VR.AR',
      },
      {
        label: '人工智能',
        value: '人工智能',
      },
      {
        label: '其他',
        value: '其他',
      }
     ]  
    ]
  };

  // 投资阶段
  const investorSort ={
    title:'投资阶段▼',
    content: [
    [  
      {
        label: '全部',
        value: '全部',
      },  
      {
        label: 'Pre-A轮',
        value: 'Pre-A轮',
      },
      {
        label: '天使轮',
        value: '天使轮',
      },
      {
        label: '种子轮',
        value: '种子轮',
      },
      {
        label: 'A轮',
        value: 'A轮',
      },
      {
        label: 'B轮',
        value: 'B轮',
      },
      {
        label: 'A+轮',
        value: 'A+轮',
      },
      {
        label: 'B+轮',
        value: 'B+轮',
      },
      {
        label: 'C轮',
        value: 'C轮',
      },
      {
        label: 'D轮',
        value: 'D轮',
      },
      {
        label: 'E轮',
        value: 'E轮',
      },
      {
        label: 'E轮及以后',
        value: 'E轮及以后',
      },
      {
        label: 'F轮',
        value: 'F轮',
      },
      {
        label: '其他',
        value: '其他',
      }
     ]  
    ]
  };

  const row = (rowData, sectionID, rowID) => {
    return (
      <HotInvestor hotEvent={rowData} onClick={() => detailInvestorShow(rowData.id)}/>    
    );
  };

  // 搜索
  const search = () =>{
    state ={
      value: '',
      focused: false,
      isLoading: false,
    };

    onChange = (value) =>{
      this.setState({value});
    };
    clear = () =>{
      this.setState({value: '', isLoading: true})
    }
  };

  // 页面初始化加载
  const onEndReached = () => {
    dispatch({type:'investorList/queryInvestorList'});
  };

  // 跳转投资人详情页
  const detailInvestorShow = (investorID) => {
    dispatch({type:'investorList/detailInvestorShow', payload: investorID})
  };

  // 投资类型过滤
  const selectType = (result) => {

    dispatch({type: 'investorList/setTypes', payload: result})
  }

  // 投资阶段过滤
  const selectRound = (result) => {

    dispatch({type: 'investorList/selectRounds', payload: result})
  }

  // 投资人姓名过滤
  const sortName = (result) =>{
    dispatch({type:'investorList/sortNames', payload: result});
  }
  
  //加载字段提示问题 
  const showTips = () =>{
    if(noData&&offset == 0&&!isLoading){
      return `当前页面暂无数据`;
    }else if(!noData&&isLoading){
      return `加载中`;
    }else if(noData&&!isLoading){
      return `当前是最后一页`;
    } 
  }

  // 
  return (
    <div style={{backgroundColor: '#f2f2f2'}}>
      <style type="text/css">
        {`
          .am-list-body {
            background-color: transparent !important;
            border-top: 0px;
          }
          .activity___1KOIy{
            height: 1.8rem;
          }
          .am-button {
            font-size: 0.3rem !important;
          }
        `}
      </style>
      <HeaderGQT />
      <QueueAnim>
        <div key="inverstorList">
          <div className={style.activity}>
            <div className={style.input}>
              <div style={{paddingTop:'0.1rem'}}>
                <SearchBar className={style.search}  placeholder="按投资人姓名搜索" onChange={value => {dispatch({type:'investorList/sortNames', payload:value})}} onCancel={value => dispatch({type:'investorList/sortNames', payload: null})} />
              </div>
            </div>
            <Flex className={style.list}>
              <Flex.Item className={style.listItem} >        
                <div className={style.filter}><InvestorType selectType={selectType} {...investorType} /></div>
              </Flex.Item>
              <Flex.Item className={style.listItem} >
                <div className={style.filter}><InvestorSortInfo selectRound={selectRound} {...investorSort} /></div>
              </Flex.Item>
            </Flex>
          </div>
          <ListView
            dataSource={investorList.dataSource}
            renderFooter={() => 
              <div style={{ padding: 30, textAlign: 'center' }}>
                {showTips()}
              </div>
            }
            initialListSize={investorList.backtoPage ? offset: undefined}
            useBodyScroll
            renderRow={row}
            pageSize={20}
            scrollRenderAheadDistance={500}
            scrollEventThrottle={20}
            onEndReached={()=>{onEndReached()}}
            onEndReachedThreshold={10}
            style={{margin: '0.07rem 0 0 0'}} />
        </div>
      </QueueAnim>
    </div>
  );
}

InvestorList.propTypes = {
    dispatch: PropTypes.func,
    investorList: PropTypes.object,
};

export default connect(({investorList}) => ({investorList}))(InvestorList);