import React from 'react'
import "./BaiduMap.scss";
import $ from "jquery";

const iconDescMap = {
  "苏青优店": {icon: require('../../assets/upark.png'), size: new BMap.Size(90, 90)},
  "苏青C空间": {icon: require('../../assets/cpark.png'), size: new BMap.Size(90, 90)},
};

const moreIcon = require('../../assets/cpark_more_1.png');

class BaiduMap extends React.Component {
  /**
   * @constructor
   * @id {String} the id to create DOM id
   */
  constructor(props) {
    // console.log('props:',props);
    super(props);
    this.onMapMove = this.onMapMove.bind(this)
    this.saveMapElement = this.saveMapElement.bind(this);
    this.stopSendMoveEvent = 1;
  }

  saveMapElement(mapElement) {
    this.mapElement = mapElement;
  }

  /**
   * @method componentDidMount
   **/
  componentDidMount() {
    const map = new BMap.Map(this.mapElement, {
      // 启用高清底图
      enableHighResolution: true,
      enableAutoResize: true,
      enableMapClick: false,
    });

    map.enableScrollWheelZoom();
    map.enablePinchToZoom();

    // 地图移动时通知上一层移动了
    map.addEventListener("moveend", this.onMapMove);
    
    this.map = map;

    const {address} = this.props;
    if(address)
    {
      var geocoder = new BMap.Geocoder();
      geocoder.getPoint(address, (point) => {
        if(!point)
        {
          point = {lat: 32.060255, lng: 118.796877};
        }

        const pt = {
          longitude: point.lng,
          latitude: point.lat,
          iconType: '苏青C空间',
        }

        this.drawPoints([pt], [pt]);
      });
      return;
    }
    
    this.drawPoints();
  }

  componentDidUpdate(prevProps) {
    if(!this.props.points){
      return;
    }

    if(prevProps.points === this.props.points){
      return;
    }
    
    // 卸载聚簇
    if(this.markerClusterer)
    {
      this.markerClusterer.clearMarkers();
    }

    this.map.clearOverlays();

    this.drawPoints();
  }

  componentWillUnmount(){
    // 卸载聚簇
    if(this.markerClusterer)
    {
      this.markerClusterer.clearMarkers();
    }

    const map = this.map;
    
    // 清除覆盖物
    map.clearOverlays();

    // 卸载移动事件
    map.removeEventListener("moveend", this.onMapMove);
  }

  onMapMove() {
    const {map, props} = this;
    const {onMapMove} = props;

    if(this.stopSendMoveEvent > 0)
    {
      this.stopSendMoveEvent--;
      return;
    }

    if(!onMapMove)
    {
      return;
    }

    onMapMove(map.getCenter());
  }

  drawPoints(points, initFocusPoints) {
    // 从属性获知全部点，点击回调和初始化放大的焦点
    const { onIconClick } = this.props;
    if(!points)
    {
      points = this.props.points;
    }

    if(!initFocusPoints)
    {
      initFocusPoints = this.props.initFocusPoints;
    }

    // 将所有点加入地图
    const markers = points.map(point => {
      const iconDesc = iconDescMap[point.iconType];
      if(!iconDesc)
      {
        throw new Error("图标类型没有登记！" + point.iconType);
      }

      const icon = new BMap.Icon(iconDesc.icon, iconDesc.size);
      const position = new BMap.Point(point.longitude, point.latitude);
      const marker = new BMap.Marker(position, {icon});

      // 监听图标点击
      marker.addEventListener("click", function(e){
        if(!onIconClick)
        {
          return;
        }

        onIconClick(point);
      });

      return marker;
    });

    // 根据初始焦点设定地图位置
    if(!initFocusPoints || initFocusPoints.length == 0)
    {
      return;
    }

    // 求最佳视野
    const map = this.map;
    const focusPoints = initFocusPoints.map(point => new BMap.Point(point.longitude, point.latitude));
    this.stopSendMoveEvent++;
    map.setViewport(focusPoints);
    
    // 生成聚簇
    this.markerClusterer = new BMapLib.MarkerClusterer(map, {
      markers,
      styles: [{
        url: moreIcon,  //图标路径
        size: new BMap.Size(84, 90),  //图标大小
        textColor: '#fff',  //文字颜色
        textSize: 24,  //字体大小
      }]
    });
  }

  /**
   * @method render
   */
  render() {
    return <div ref={this.saveMapElement} style={{height: '100%'}} className="fullScreeen"></div>;
  }
}

export default BaiduMap