import React, { PropTypes } from 'react';
import { Router, Route } from 'dva/router';
import { isWeiXin } from './utils/wechat.js';

const cached = {}
const registerModel = (app, model) => {
  if (!cached[model.namespace]) {
    app.model(model)
    cached[model.namespace] = 1
  }
}

let lastPathName = null;

const Routers = function ({ history, app }) {
  history.listen(({pathname}) => {
    // 没有上一页，不处理
    if(!lastPathName)
    {
      lastPathName = pathname;
      return;
    }

    // console.log(lastPathName, pathname);
    const lastLevel = lastPathName.split('/').length;
    const level = pathname.split('/').length;

    // 从内部页面切换到外部页面，保持位置
    if(level < lastLevel)
    {
      lastPathName = pathname;
      return;
    }

    // 同级页面切换，进行位置恢复
    window.scrollTo(0, 0);
    lastPathName = pathname;
  });

  const routes = [
    {
      // 主菜单
      path: '/',
      getComponent(nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/menu')),
          cb(null, require('./routes/Menu'))
        });
      },

      getIndexRoute (nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/home'))
          cb(null, { component: require('./routes/home') })
        })
      },
    

      childRoutes: [
        {
          // 空间列表
          path: 'space',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/SpaceList')),
              cb(null, require('./routes/SpaceList'))
            })
          },
        },
        {
          // 项目列表
          path: 'project',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/ProjectList')),
              cb(null, require('./routes/ProjectList'))
            })
          },
        },
        {
          // 投资人列表
          path: 'investor',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/InvestorList')),
              cb(null, require('./routes/InvestorList'))
            })
          },
        },
        {
          //活动列表
          path: 'activity',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/ActivityList')),
              cb(null, require('./routes/ActivityList'))
            })
          },
        }
      ]
    },
    {
      // 园区
      path: '/space/:spaceID/',

      // 园区菜单
      getComponent (nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/SpaceListMenu')),
          cb(null, require('./routes/SpaceList/SpaceListMenu'))
        })
      },
      getIndexRoute (nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/SpaceDetail'))
          cb(null, { component: require('./routes/SpaceList/SpaceDetail') })
        })
      },
      childRoutes: [
        {
          // 园区项目列表
          path: 'project',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/SpaceProjectList')),
              cb(null, require('./routes/SpaceList/SpaceProjectList'))
            })
          },
        },
        {
          // 园区导师列表
          path: 'mentor',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/MentorList')),
              cb(null, require('./routes/SpaceList/MentorList'))
            })
          },
        },
        {
          //园区活动列表
          path: 'activity',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/SpaceActivityList')),
              cb(null, require('./routes/SpaceList/SpaceActivityList'))
            })
          },
        },
        {
          // 园区政策详情
          path: 'policy/:policyID',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/PolicyDetail')),
              cb(null, require('./routes/SpaceList/PolicyDetail'))
            })
          },
        },
        {
          // 申请入驻
          path: 'apply',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/ApplySpace')),
              cb(null, require('./routes/SpaceList/ApplySpace'))
            })
          },
        },
        // 填写申请入驻成功
        {
          path: 'applySuccess',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/ApplySuccess')),
              cb(null, require('./routes/SpaceList/ApplySuccess'))
            })
          },
        }
      ]
    },
    {
      // 项目添加
      path: '/project/add',
      getComponent (nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/ProjectAdd')),
          cb(null, require('./routes/ProjectList/ProjectAdd'))
        })
      },
    },
    {
      // 项目编辑
      path: '/project/:projectID/edit',
      getComponent (nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/ProjectAdd')),
          cb(null, require('./routes/ProjectList/ProjectAdd'))
        })
      },
    },
    {
      //项目诉求
      path: '/project/:projectID/requirement',
      getComponent (nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/ProjectRequirement')),
          cb(null, require('./routes/ProjectList/ProjectRequirement'))
        })
      },
    },
    {
      // 园区项目详情
      path: '/project/:projectID',
      getComponent (nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/ProjectDetail')),
          cb(null, require('./routes/ProjectList/ProjectDetail'))
        })
      },
    },
    {
      // 投资人详情
      path: '/investor/:investorId',
      getComponent (nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/InvestorDetail')),
          cb(null, require('./routes/InvestorList/InvestorDetail'))
        })
      },
    },
    
    {
      // 我的项目
      path: '/me/project',
      getComponent (nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/MyProject')),
          cb(null, require('./routes/ProjectList/MyProject'))
        })
      },
    },    
    {
      // 园区政策详情
      path: '/policy/:policyID',
      getComponent (nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/PolicyDetail')),
          cb(null, require('./routes/SpaceList/PolicyDetail'))
        })
      },
    },    
    {  
      //活动详情
      path: '/activity/:activityID',
      getComponent (nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/ActivityDetail')),
          cb(null, require('./routes/ActivityList/ActivityDetail'))
        })
      },
    },  
    {
      //活动报名
      path: '/activity/:activityID/apply',
      getComponent (nextState, cb) {
        require.ensure([], require => {
          registerModel(app, require('./models/ActivityApply')),
          cb(null, require('./routes/ActivityList/ActivityApply'))
        })
      },
    }, 
  ];

  return <Router history={history} routes={routes} />
}

Routers.propTypes = {
  history: PropTypes.object,
  app: PropTypes.object,
}

export default Routers;