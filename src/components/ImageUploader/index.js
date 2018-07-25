require('cropper/dist/cropper.css');
import styles from './imageUploader.css';
import Cropper from 'cropper/dist/cropper.js';
const $ = require('jquery');
require('blueimp-canvas-to-blob');

const reader = new FileReader();

export default class imageUploader extends React.Component {
  propTypes: {
    onChange: PropTypes.func,
    value: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.state = {
      showCropper: false,
      photoContent: null,
      files: props.value ? props.value.concat(): [],
    };

    this.img = null;
    this.onChooseImage = this.onChooseImage.bind(this);
    this.initCropper = this.initCropper.bind(this);
    this.doCut = this.doCut.bind(this);
    this.removeImg = this.removeImg.bind(this);
  }

  componentWillUpdate(nextProps) {
    const oldFiles = this.state.files;
    if(nextProps.files && nextProps.files != oldFiles)
    {
      this.setState({files: nextProps.files});
    }
  }

  onChooseImage(e) {
    let files = e.target.files;
    if(files.length == 0)
    {
      alert('没有选中图片！');
      return;
    }

    const file = files[0];
    const that = this;

    reader.onload = ((theFile) => {
      return function(e) {
        alert("50onload成功");
        that.setState({showCropper: true, photoContent: e.target.result});
      };
    })(file);

    reader.onerror = ((e) => {
      alert(("图片Reader错误:" + JSON.stringify(e)));
    });

    reader.readAsDataURL(file);
    alert(`开始加载图片！`);
  }

  initCropper(img, photoContent) {
    if(!photoContent)
    {
      return;
    }

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
        $(img).cropper('setCropBoxData', {left: cropBoxData.left, top: cropBoxData.top, width: size.width, height: size.height});
      },

      ready: function(e) {
        var containerData = $(img).cropper('getContainerData');
        $(img).cropper('setCropBoxData', {left: (containerData.width - size.width) / 2, top: (containerData.height - size.height) / 2, width: size.width, height: size.height});
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
    this.setState({showCropper: false, photoContent: null});

    // 转换为JPG
    canvas.toBlob(function(blob)
    {
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

        let {files} = that.state;
        files = files.concat([response.webPath]);
        that.setState({files});
        $(that.fileControl).val('');
        onChange(files);
      });
    }, 'image/jpeg', 0.9);
  }

  removeImg = (files, file) => {
    this.setState({files: files.filter((fileCode) => {return (fileCode != file)})});
  }

  render() {
    const {title, count, size} = this.props;
    const {showCropper, photoContent, files} = this.state;
    const that = this;

    return (
      <div>
        <div className={styles.row}>
          <div className={styles.filedName}>
            {title}
          </div>
          <div className={styles.previews}>
            {files.map(file => 
              <div key={file} className={styles.imgDiv} style={{'width':`${size.width/size.height*1.8 + 1.2}rem`}}>
                <div className={styles.preview} style={{'backgroundImage': `url(${file})`, 'width':`${size.width/size.height*1.8}rem`}}></div>
                <div className={styles.removeImg} onClick={() => {this.removeImg(files, file)}}></div>
              </div>
            )}
            <div style={{display: (!count || count > files.length) ? 'block': 'none'}} className={styles.uploadButton} onClick={() => $(that.fileControl).click()}>
              +
            </div>
          </div>
        </div>
        <input ref={(fileControl) => this.fileControl = fileControl} style={{display: 'none'}} type="file" onChange={this.onChooseImage} />
        <div className={styles.cropperBg} style={{display: showCropper ? "block": "none"}}>
          <img ref={(img) => this.initCropper(img, photoContent)} src={photoContent} className={styles.img} />
          <button className={styles.actionButton} onClick={this.doCut}>裁剪</button>
        </div>
      </div>
    )
  }
}