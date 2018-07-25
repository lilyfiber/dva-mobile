import React, { Component, PropTypes } from 'react';
import styles from './dataframe.css';
import {Flex} from 'antd-mobile';

function showMoney(park) {
  // 平均月租有效
  if(['0', '免费', '', null].indexOf(park.park.dailyRent) === -1)
  {
    return (
      <li><span>日租:{park.park.dailyRent}元/㎡</span>&nbsp;<span>{(['0', '免费', '', null].indexOf(park.park.property) === -1) ? `物业费:${park.park.property}元/月/㎡`: '物业费:免费'}</span></li>
    );
  }

  // 工位月租有效
  if(['0', '免费', '', null].indexOf(park.park.feeDesc) === -1)
  {
    return (
      <li><span>月租:{park.park.feeDesc}元/工位</span>&nbsp;<span>{(['0', '免费', '', null].indexOf(park.park.property) === -1) ? `物业费:${park.park.property}元/月/㎡`: '物业费:免费'}</span></li>
    );
  }

  return (
    <li><span>免租金</span>&nbsp;<span>{(['0', '免费'].indexOf(park.park.property) === -1) ? `物业费:${park.park.property}元/月/㎡`: '物业费:免费'}</span></li>
  );
}

const ParkInfo = (props) => {
	let {park,...others} = props;
	if(!park)
	{
		park = {
      name:'苏大天宫孵化器',
      park: {
        logo_url: require("../../assets/frame_image.png"),
        field: "IT互联网，文化传媒，通信",
        companys: "PU口袋校园，安靠电源，汇博机器，雪松湾"
      }
    };
	}

  if(!park.park){
    return null;
  }

	return (
		<Flex {...others} className={styles.frame}>
		  <img className={styles.image} src={park.park.logo_url} />
		  <Flex.Item className={styles.parkdata}>
      	<div className={styles.titledata} >{park.name}</div>
      	<div className={styles.fielddata}>
          <ol>
            <li><span>领域: </span><span>{park.park.field}</span></li>
            {showMoney(park)}
          </ol>
        </div>
   		</Flex.Item>
		</Flex>
	);
}

ParkInfo.propTypes = {
  ParkInfo: PropTypes.object,
};

// 关联model
export default ParkInfo;
