require('cropper/dist/cropper.css');
import styles from './imageUploader.css';
import Cropper from 'cropper/dist/cropper.js';
const $ = require('jquery');
import { isAndroidDevice } from '../../utils/device.js';
require('blueimp-canvas-to-blob');

export default class imageUploaderWechat extends React.Component {
  propTypes: {
    onChange: PropTypes.func,
    value: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.state = {
      showCropper: false,
      files: props.value ? props.value.concat(): [],
    };

    this.photoContent = null;
    this.img = null;
    this.initCropper = this.initCropper.bind(this);
    this.doCut = this.doCut.bind(this);
    this.removeImg = this.removeImg.bind(this);
    this.startSelectFile = this.startSelectFile.bind(this);
    this.getValue = this.getValue.bind(this);
  }

  componentWillUpdate(nextProps) {
    const oldFiles = this.state.files;
    if(nextProps.files && nextProps.files != oldFiles)
    {
      this.setState(nextProps.files);
    }
  }

  startSelectFile() {
    // alert('37 开始选择');
    const that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        const localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
        // alert(`45 选择结果${localIds.length}`);

        wx.getLocalImgData({
          localId: localIds[0], // 图片的localID
          success: function (res) {
            let localData = res.localData; // localData是图片的base64数据，可以用img标签显示

            try
            {
              const isAndroid = isAndroidDevice(); //android终端
              if(isAndroid)
              {
                localData = `data:image/jpeg;base64,${localData}`;
              }
              else
              {
                localData = localData.replace('jgp', 'jpeg');
              }

              that.photoContent = localData;
              that.setState({showCropper: true});
            }
            catch(e)
            {
              alert(JSON.stringify(e));
            }
          }
        });
      }
    });
  }

  initCropper(img) {
    if(!this.photoContent)
    {
      return;
    }

    // alert(`72 初始化裁剪器`);

    let {size} = this.props;
    if(!size)
    {
      size = {width: 512, height: 512};
    }

    this.img = $(img).cropper({
      aspectRatio: size.width / size.height,
      cropBoxResizable: false,
      crop: function(e) {

      },

      cropend: function(e) {
        var cropBoxData = $(img).cropper('getCropBoxData');
        $(img).cropper('setCropBoxData',{left: cropBoxData.left, top: cropBoxData.top, width: size.width, height: size.height});
      },

      ready: function(e) {
        var containerData = $(img).cropper('getContainerData');
        $(img).cropper('setCropBoxData',{left: (containerData.width - size.width) / 2, top: (containerData.height - size.height) / 2, width: size.width, height: size.height});
      },
    });
  }

  getValue() {
    const {files} = this.state;
    return files;
  }

  doCut() {
    let {size, onChange} = this.props;
    if(!size)
    {
      size = {width: 512, height: 512};
    }

    const img = this.img;
    const canvas = img.cropper('getCroppedCanvas', {width: size.width, height: size.height, fillColor: '#ffffff'});
    const that = this;
    
    // 关闭Cropper
    img.cropper('destroy');
    this.photoContent = null;
    this.setState({showCropper: false});

    // alert(`119 裁剪完毕`);

    // 转换为JPG
    try
    {
      canvas.toBlob(function(blob)
      {
        // alert(`124 转换完毕`);

        // 上传
        const form = new FormData();
        form.append('file', blob);
        fetch('/qc/upload/fileload', {
          method: "POST",
          body: form,
          enctype: 'multipart/form-data',
        })
        .then((response) => response.json())
        .then((response) => {
          if (response.code != 0) {
            alert(response.mesage);
            return;
          }

          // alert(`141 上传完毕`);

          let {files} = that.state;
          files = files.concat([response.webPath]);
          that.setState({files});
          $(that.fileControl).val('');
          onChange(files);
        });
      }, 'image/jpeg', 0.9);
    }
    catch(e)
    {
      alert(JSON.stringify(e));
    }
  }

  removeImg = (files, file) => {
    this.setState({files: files.filter((fileCode) => {return (fileCode != file)})});
  }

  render() {
    const {title, count, size} = this.props;
    const {showCropper, files} = this.state;

    return (
      <div className={styles.control}>
        <div className={styles.row}>
          <div className={styles.filedName}>
            {title}
          </div>
          <div className={styles.previews}>
            {files.map((file, index) => 
              <div key={file + index} className={styles.imgDiv} style={{'width':`${size.width/size.height*1.8 + 1.2}rem`}}>
                <div className={styles.preview} style={{'backgroundImage': `url(${file})`, 'width':`${size.width/size.height*1.8}rem`}}></div>
                <div className={styles.removeImg} onClick={() => {this.removeImg(files, file)}}></div>
              </div>
            )}
            <div style={{display: (!count || count > files.length) ? 'block': 'none'}} className={styles.uploadButton} onClick={() => this.startSelectFile()}>
              +
            </div>
          </div>
        </div>
        <div className={styles.cropperBg} style={{display: showCropper ? "block": "none"}}>
          <img ref={(img) => this.img = img} onLoad={() => this.initCropper(this.img)} src={this.photoContent} className={styles.img} />
          <button className={styles.actionButton} onClick={this.doCut}>裁剪</button>
        </div>
      </div>
    )
  }
}