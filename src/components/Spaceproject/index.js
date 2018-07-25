import React, { Component, PropTypes } from 'react';
import styles from './spaceproject.css';
import {Flex} from 'antd-mobile';

const Spaceproject = (props) => {
  let {park,...others} = props;
  if(!park)
  {
    park = {
      name:'苏大天宫孵化器',
      logo:"../../assets/frame_image.png",
      field:"IT互联网，文化传媒，通信，PU口袋校园，安靠电源，汇博机器，雪松湾"
    };
  }
  const detail = park;
  if(!detail)
  {
    return null;
  }
  return (
    <div> 
      <Flex {...others} className={styles.list} >
        <img  className={styles.image} src={park.logo} />
        <Flex.Item className={styles.sapceprojectdata}>
            <Flex >
                <Flex.Item className={styles.name}>{detail.name}</Flex.Item>
                <div className={styles.field}>{detail.field}</div>
            </Flex>
            <div className={styles.introducedata}>{detail.description}</div>
            <div className={styles.introducedata}>团队规模：{detail.scope}</div>

        </Flex.Item>
      </Flex>
    </div> 
  );
}

Spaceproject.propTypes = {
  Spaceproject: PropTypes.object,
};

// // 关联model
export default Spaceproject;