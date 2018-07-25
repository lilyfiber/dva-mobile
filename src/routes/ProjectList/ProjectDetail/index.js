import React, { PropTypes } from 'react';
import { connect } from 'dva';
import { Flex, InputItem, WhiteSpace } from 'antd-mobile';
import QueueAnim from 'rc-queue-anim';
import HeaderGQT from "../../../components/HeaderGQT";
import ParkInfo from "../../../components/ParkInfo";
import style from './projectdetail.css';

const ShowFinancilRequirement = (projectData) => {
  if(!projectData.finance_amount)
  {
    return null;
  }

  return (<Flex className={style.details} style={{alignItems: 'flex-start'}}>
    <img className={style.images} src={require("../../../assets/company_1.png")} />
    <Flex.Item>
      <div className={style.inv}>融资需求</div>
      <div className={style.addr}>{`${projectData.finance_stage} ${projectData.finance_amount}万元 出让股权${projectData.out_rate}%`}</div>
    </Flex.Item>
  </Flex>)
}

const ShowRequirement = (requirements, label, icon) => {
  const lines = [];

  if(!requirements)
  {
    return null;
  }

  requirements.forEach(requirement => {
    if(requirement.value.length == 0)
    {
      return;
    }

    lines.push( <div key={requirement.name} className={style.addr}><span>{requirement.name}: </span>{requirement.value.join(", ")}</div>);
  });

  if(lines.length == 0)
  {
    return null;
  }

  return (
    <Flex className={style.center} style={{alignItems: 'flex-start'}}>
      <img className={style.images} src={icon} />
      <Flex.Item>   
        <div className={style.inv}>{label}</div>
          {lines}
      </Flex.Item>
    </Flex>
  );
}
const menuItems = {icon: String.fromCharCode(0xe90e)};

const ProjectDetail = ({dispatch, projectDetail}) => {

  const showAnim = projectDetail.showAnim;

  const detailParkShow = (park) => {
    if(typeof(park) !='undefined'){
      dispatch({type:'projectDetail/detailParkShow', payload: park.park.id})
    }
  }

  const ShowPark = (parkData) => {
    if(!parkData || parkData.type == -2)
    {
      return null;
    }

    return (
      <div onClick={() => {detailParkShow(parkData)}}>
        <div className={style.space}>所在园区</div>
        <div className={style.park}>
          <ParkInfo park={parkData}/>
        </div>
      </div>
    )
  }


  const callphone = (num) => {   
    window.location.href = "tel:" + num;
  }

  const parkData = projectDetail.parkNode;
  const projectData = projectDetail.projectDetail;

  // 判断字段
  if (!projectData) {
    return null;
  }

  return (
    <div style={{backgroundColor: '#F2F2F2', height: '100%'}}>
      <HeaderGQT />
      <QueueAnim >
        <div className={style.projectDetail} key="projectdetail">
          <div className={style.top}>
            <div className={style.content}>
              <ul>
                <li className={style.title}>{projectData.name}</li>
                <li className={style.introduce}>领域: <span>{projectData.field}</span></li>
                <li className={style.introduce}>产品受众: <span>{projectData.audience}</span></li>
                <li className={style.introduce}>团队规模: <span>{projectData.scope}</span></li>
                <li className={style.brief}>{projectData.brief}</li>
              </ul>
            </div>
            <div className={style.image} style={{'backgroundImage': `url('${projectData.logo}')`}}></div>
          </div>
          {ShowFinancilRequirement(projectData)} 
          {ShowRequirement(projectData.talent_demand, "人才需求", require("../../../assets/company_2.png"))}
          {ShowRequirement(projectData.out_Ser_Demand, "外包服务需求", require("../../../assets/company_3.png"))}
          <div className={style.center}> 
            <div className={style.addrs}>
              {projectData.description}
            </div>
          </div>  
          {ShowPark(parkData)}
          <div className={style.call} onClick={()=> callphone(projectData.phone)}><i className={style.phone}>{menuItems.icon}</i></div>
        </div>
      </QueueAnim>
    </div>
    
  );
}

ProjectDetail.propTypes = {
  dispatch: PropTypes.func,
  spaceProjectDetail: PropTypes.object,
};

export default connect(({projectDetail}) => ({projectDetail}))(ProjectDetail);


