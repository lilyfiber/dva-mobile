const Mock = require('mockjs')
import mockStorge from '../src/utils/mockStorge'

let dataKey = mockStorge('SpaceList', Mock.mock({
	'data|100': [
		{
			'id+1': 1,
			logo: 'https://zos.alipayobjects.com/rmsportal/dKbkpPXKfvZzWCM.png',
			title: '苏大天宫孵化器',
			field: ['IT互联网络', '文化传媒', '通信'],
		  project: ['PU口袋校园', '安靠电源', '汇博机器', '雪松湾'],
		  type: '苏青优店',
		  city: '南京',
		}
	],
}))

let spaceListData = global[dataKey]

module.exports = {

	'GET /api/spaceList' (req, res) {
		res.json(global[dataKey])
	},
}
