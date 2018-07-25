import './index.html';
import 'babel-polyfill';
import dva from 'dva';
import load from 'little-loader';
	
import createLoading from 'dva-loading';
import { useRouterHistory } from 'dva/router';
import { createHistory } from 'history';

load('//res.wx.qq.com/open/js/jweixin-1.2.0.js', function(err)
{
	load('//api.map.baidu.com/getscript?v=2.0&ak=gGbmpX5C0dlBL1ezFLTAztBVj5dvUN5x&services=&t=20161219171637', function(err)
	{
    load('//api.map.baidu.com/library/TextIconOverlay/1.2/src/TextIconOverlay_min.js', function(err)
    {
			load('//api.map.baidu.com/library/MarkerClusterer/1.2/src/MarkerClusterer_min.js', function(err)
			{
				let history = useRouterHistory(createHistory)({basename: ROOTPATH});

				// 1. Initialize
				const app = dva({
				  ...createLoading(),
				  history,
				  onError(error){
				    console.error('app onError -- ', error);
				    alert(JSON.stringify(error));
				  },
				});

				// 2. Plugins
				// app.use({});

				// 3. Model 注意这里的Model是全局性质的单页Model应该在router.js里面懒加载
				// app.model(require('./models/splash'));

				// 4. Router
				app.router(require('./router'));

				// 5. Start
				app.start('#root');
			});
		});
	});
});