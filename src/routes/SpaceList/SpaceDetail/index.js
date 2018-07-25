import React, { PropTypes } from 'react';
import { connect } from 'dva';
import { Flex, Grid } from 'antd-mobile';
import QueueAnim from 'rc-queue-anim';
import styles from './style.css';

function showMoney(park) {
  // 平均月租有效
  // if(['0', '免费'].indexOf(park.dailyRent) === -1)
  // {
  //   return (
  //   	<div>
  //   		<p className={styles.content}>平均日租金:{park.dailyRent}元/日/平方米</p>
  //   		<p className={styles.content}>{(['0', '免费', '', null].indexOf(park.property) === -1) ? `物业费:${park.property}元/月/㎡`: '物业费:免费'}</p>
  //   	</div>
  //   );
  // }

  // // 工位月租有效
  // if(['0', '免费'].indexOf(park.feeDesc) === -1)
  // {
  //   return (
  //   	<div>
  //    		<p className={styles.content}>工位租金:{park.feeDesc}元/工位/月</p>
  //   		<p className={styles.content}>{(['0', '免费', '', null].indexOf(park.property) === -1) ? `物业费:${park.property}元/月/㎡`: '物业费:免费'}</p>
  //   	</div>
  //   );
  // }

  // //物业费用
  // return (
  // 	<div>
  //    	<p className={styles.content}>免租金</p>
  //   	<p className={styles.content}>{(['0', '免费', '', null].indexOf(park.property) === -1) ? `物业费:${park.property}元/月/㎡`: '物业费:免费'}</p>
  // 	</div>
  // );
  return (
  	<div>
     	<p className={styles.content}>{(['0', '免费', '', null].indexOf(park.dailyRent) === -1) ? `平均日租金:${park.dailyRent}元/日/㎡`: ''}</p>
     	<p className={styles.content}>{(['0', '免费', '', null].indexOf(park.feeDesc) === -1) ? `工位租金:${park.feeDesc}元/工位/月`: ''}</p>
    	<p className={styles.content}>{(['0', '免费', '', null].indexOf(park.property) === -1) ? `物业费:${park.property}元/月/㎡`: '物业费:免费'}</p>
  	</div>
  );
}

const SpaceDetail = ({dispatch, spaceDetail}) => {
	const showAnim=spaceDetail.showAnim;
	
	const park = spaceDetail;
	const menuItems = {icon: String.fromCharCode(0xe90e)};
	if(!park.id)
	{
		return null;
	}

	// 申请入住
	const toApply = (spaceID) => {
		dispatch({type: 'spaceDetail/toApply', payload: spaceID});
	};

	// 政策详情
	const policyDetail = (params) => {
		dispatch({type: 'spaceDetail/policyDetail', payload: {
			spaceID: params.spaceID,
			policyID: params.policyID,
		}});
	}

  const callphone = (num) => { 
    window.location.href = "tel:" + num;
  }

	const policyNodes = spaceDetail.policyNodes.filter(node => node.policies.length > 0);
	const renderGridItem = (item) => {
		return <div key={item.text} className={[styles.gridNode, item.disabled ? styles.active: ""].join(" ")}>
				<i className={styles.icon}>{item.icon}</i>
				<br/>
				<span className={styles.gridLabel}>{item.text}</span>
		</div>
	}

 	return (
		<div className={styles.wrap} key="spaceDetail">
			<Flex className={styles.box} style={{ alignItems: 'flex-start' }}>
				<Flex.Item className={styles.title} style={{flex: 0.25}}>领域</Flex.Item>
				<Flex.Item className={styles.content}>{park.field}</Flex.Item>
			</Flex>
			<Flex className={styles.box} style={{ alignItems: 'flex-start' }}>
				<Flex.Item className={styles.title} style={{flex: 0.2}}>设施</Flex.Item>
				<Flex.Item className={styles.content}>
					<Grid data={park.facilities} columnNum={3} hasLine={false} renderItem={renderGridItem} />
				</Flex.Item>
			</Flex>
			<Flex className={styles.box} style={{ alignItems: 'flex-start' }}>
				<Flex.Item className={styles.title} style={{flex: 0.2}}>费用</Flex.Item>
				<Flex.Item className={styles.content}>
					{showMoney(park)}
				</Flex.Item>
			</Flex>
			<Flex className={styles.box} style={{ alignItems: 'flex-start' }}>
				<Flex.Item className={styles.title} style={{flex: 0.25}}>政策</Flex.Item>
				<Flex.Item className={styles.content}>
					{policyNodes.map(node => (
						<div key={node.name}>
							<p className={styles.content} style={{ color: '#108EE9'}}>{node.name}</p>
							<ol className={styles.policyList}>
								{node.policies.map(policy => <li className={styles.policy} key={policy.id} onClick={() => policyDetail({spaceID: park.id, policyID: policy.id})}>{policy.name}</li>)}
							</ol>
						</div>
					))}
				</Flex.Item>
			</Flex>
			<Flex className={styles.box} style={{ alignItems: 'flex-start' }}>
				<Flex.Item className={styles.title} style={{flex: 0.5}}>空间联系人</Flex.Item>
				<Flex.Item className={styles.content}>
					<p className={styles.content}><span>{park.contacts}</span><i className={styles.call} onClick={()=> callphone(spaceDetail.contactsPhone)}>{menuItems.icon}</i></p>
				</Flex.Item>
			</Flex>
			<div className={styles.apply} onClick={() => toApply(park.id)}>申请入驻</div>
			<div style={{textAlign: 'center', color: '#888', fontSize: '28px'}}>
        {park ? '' : '当前页面暂无数据'}   
      </div>
		</div>
	)
}

SpaceDetail.propTypes = {
  dispatch: PropTypes.func,
  spaceDetail: PropTypes.object,
};

export default connect(({spaceDetail}) => ({spaceDetail}))(SpaceDetail);
