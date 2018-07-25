import React, { PropTypes } from 'react';
import { connect } from 'dva';
import { ListView, TabBar, Icon, Flex } from 'antd-mobile';
import QueueAnim from 'rc-queue-anim';
import style from './Mentor.css';

const MentorList = ({dispatch, mentorList}) => {
  const showAnim=mentorList.showAnim;

  let loading = mentorList.loading;

  //加载字段提示问题 
  const showTips = () =>{
    if(!loading){
     return `加载完成`
    } 
  }

  const row = (rowData, sectionID, rowID) => {
    return (
      <div key={rowID} className={style.row}>
        <Flex style={{alignItems: 'flex-start'}}>
          <img className={style.img} src={rowData.photo} />
          <Flex.Item>
              <ul className={style}>
                <li className={style.content}><h3>{rowData.name}</h3></li>
                <li className={style.tips}>{rowData.post}</li>
                <li className={style.tips}><span>擅长领域：</span>{rowData.field}</li>
              </ul>
          </Flex.Item>
        </Flex>
        <p style={{marginTop: '0.2rem', lineHeight: '0.5rem'}} className={style.content}>
          {rowData.description}
        </p>
      </div>
    );
  };
  return (
    <div>
      <style type="text/css">
      {`
        .am-list-body{
          background-color: #F2F2F2 !important;
        }
      `}
      </style>
      <ListView
        dataSource={mentorList.dataSource}
        renderRow={row}
        renderFooter={() => 
          <div style={{ padding: 30, textAlign: 'center' }}>
            {showTips()} 
          </div>
        }
        useBodyScroll
        style={{
          margin: '0 0 0 0'
        }} 
      />
    </div>
  );
}

MentorList.propTypes = {
    dispatch: PropTypes.func,
    mentorList: PropTypes.object,
};

export default connect(({mentorList}) => ({mentorList}))(MentorList);