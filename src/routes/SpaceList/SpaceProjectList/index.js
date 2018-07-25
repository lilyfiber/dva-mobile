import React, { PropTypes } from 'react';
import { connect } from 'dva';
import { Button, Flex, ListView, Icon, NoticeBar, WhiteSpace } from 'antd-mobile';
import QueueAnim from 'rc-queue-anim';
import styles from './SpaceProjectList.css';
import Spaceproject from "../../../components/Spaceproject";

const SpaceProjectList = ({dispatch, spaceProjectList}) => {
  const projects = spaceProjectList.projects;

  // 项目详情
  const GotoProjectDetail = (id) => {
    dispatch({type: 'spaceProjectList/gotoProjectDetail', payload: {projectID: id}});
  }
  
  return (
    <div key="spaceProjectList">
      <div className={styles.content}>
        {projects.map(project => (
          <Spaceproject key={project.id} park={project} onClick={()=>{GotoProjectDetail(project.id)}}/>
        ))}  
      </div>
      <div style={{textAlign: 'center', color: '#888', fontSize: '28px'}}>
        {projects ? '当前页面暂无数据' : ''}   
      </div>
    </div>
  )
}
  
SpaceProjectList.propTypes = {
    dispatch: PropTypes.func,
    spaceProjectList: PropTypes.object,
};

export default connect(({spaceProjectList}) => ({spaceProjectList}))(SpaceProjectList);