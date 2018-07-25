import styles from './activite.css';
import React, { Component, PropTypes } from 'react';
import { Flex } from 'antd-mobile';
import moment from 'moment';
moment.locale("zh-CN");

const getNormalDateStr = function(timeDate)
{
  if(!timeDate)
  {
    return;
  }

	return timeDate.slice(0, 4) + '-' + timeDate.slice(4, 6) + '-' + timeDate.slice(6, 8) + 'T' + timeDate.slice(8, 10) + ':' + timeDate.slice(10, 12) + ':' + timeDate.slice(12, 14) + '.000+08:00';
}

// 格式化时间为 中文格式
const formatTime = function(hotEvent)
{
  const bt = new Date(getNormalDateStr(hotEvent.start_time));
	const base = moment(bt).format('MMMDo dddd HH:mm');
	if(hotEvent.start_time && hotEvent.end_time)
	{
		const et = new Date(getNormalDateStr(hotEvent.end_time));
		if(bt.getTime() == et.getTime())
		{
			return base;
		}

		return `${base}-${moment(et).format('HH:mm')}`;
	}

	return base;
}
		
const HotInvestor = (props) => {
	let {hotEvent, ...others} = props;
	if(!hotEvent)
	{
		hotEvent = {
			logo: require("../../assets/me.png"),
			name:"王强",
			company:"卫岗1号，南农大本部行政北楼D602",
			area:'培训',
			title: '联合创始人'
		};
	}

	return (
		<Flex {...others} className={styles.activite} style={{alignItems: 'flex-start'}}>
			<Flex.Item className={styles.image} style={{flex: 0.7}}>
				<img className={styles.img} src={hotEvent.logo} />
			</Flex.Item>
			<Flex.Item className={styles.main}>
				<p className={styles.title}>{hotEvent.name}</p>
				<p className={styles.address}>{hotEvent.company}</p>
				<p className={styles.address}>{hotEvent.title}</p>
				<p className={styles.address}>{hotEvent.area}</p>
				<p className={styles.address}>{hotEvent.round}</p>
			</Flex.Item>
		</Flex>
	);
}

HotInvestor.propTypes = {
	dispatch: PropTypes.func,
  HotInvestor: PropTypes.object,
};

export default HotInvestor;