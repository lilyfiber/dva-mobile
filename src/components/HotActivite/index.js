import styles from './activite.css';
import React, { Component, PropTypes } from 'react';
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

// 根据actType设置按钮颜色
const btnColor = function(actType){
	switch (actType){
    case '培训': return "#00C2FF"
    break;
    case '路演': return "#ef9400"
    break;
    case '沙龙': return "#00efa9"
    break;
    case '其他': return "#ef2200"
    break;
    default: return "#00C2FF"
    break;
  }
}
		
const HotActivite = (props) => {
	let {hotEvent, ...others} = props;
	if(!hotEvent)
	{
		hotEvent = {
			logo_url: require("../../assets/me.png"),
			name:"2017年三创讲堂第一期现代农业创业指南创新创意创业",
			address:"卫岗1号，南农大本部行政北楼D602",
			start_time:"20151112232407",
			actType:'培训'
		};
	}

	return (
		<div {...others} className={styles.activite} >
			<img className={styles.img} src={hotEvent.logo_url} />
			<div className={styles.main}>
				<p className={styles.title}>{hotEvent.name}</p>
				<p className={styles.address}>{hotEvent.address}</p>
				<p className={styles.time}>{formatTime(hotEvent)}</p>
				<div className={styles.btn} style={{backgroundColor:btnColor(hotEvent.actType)}}>{hotEvent.actType}</div>
			</div>
		</div>
	);
}

HotActivite.propTypes = {
	dispatch: PropTypes.func,
  HotActivite: PropTypes.object,
};

export default HotActivite;