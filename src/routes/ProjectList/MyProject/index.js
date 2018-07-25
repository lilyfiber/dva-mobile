import React, { PropTypes } from 'react';
import { connect } from 'dva';
import { Flex, ListView } from 'antd-mobile';
import QueueAnim from 'rc-queue-anim';
import HeaderGQT from "../../../components/HeaderGQT";
import style from './myproject.css';

const MyProject = ({dispatch, myProject}) => {
  const addProject = () => {
    dispatch({type: 'myProject/addProject'});
  };

  // 项目详情
  const GotoProjectDetail = (projectID) => {
    dispatch({type: 'myProject/projectDetail', payload: projectID});
  }

  const row = (rowData, sectionID, rowID) => {
    return (
      <div key={rowID}  className={style.frame} onClick={()=>{GotoProjectDetail(rowData.id)}}>
        <div className={style.content}>
          <ul>
            <li className={style.title}>{rowData.name}<span className={style.field}>{rowData.field}</span></li>
            <li className={style.introduce}><span>{rowData.description}</span></li>
          </ul>
        </div>
        <div>
          <div className={style.image} >
             <img className={style.bigHead} src={rowData.logo} />
          </div>      
        </div>
      </div>
    );
  };

  return (
    <div key="myProject">
      <style type="text/css">
      {`
        .am-list-body
        {
          background-color: #f5f5f9;
        }
      `}
      </style>
      <HeaderGQT />
      <QueueAnim >
        <div key="myProject">
          <div className={style.map}></div>
          <ListView
            dataSource={myProject.dataSource}
            renderRow={row}
            style={{
              height: document.documentElement.clientHeight/2,
              overflow: 'auto',
              margin: '0 0 0.5rem 0',
            }} />
          <div className={style.actSign} onClick={addProject}>创建新项目</div>
        </div>
      </QueueAnim>
    </div>
  );
}

MyProject.propTypes = {
  dispatch: PropTypes.func,
  myProject: PropTypes.object,
};

export default connect(({myProject}) => ({myProject}))(MyProject);