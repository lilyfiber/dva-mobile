import styles from './fileUploader.css';
const $ = require('jquery');

export default class fileUploader extends React.Component {
  propTypes: {
    onChange: PropTypes.func,
    value: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.state = {
      files: [],
    };

    this.onChooseFile = this.onChooseFile.bind(this);
    this.removeImg = this.removeImg.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const oldFiles = this.state.oldFiles;
    if(nextProps.files && nextProps.files != oldFiles)
    {
      this.setState(nextProps.files);
    }
  }

  onChooseFile(e) {
    let {onChange} = this.props;
    let files = e.target.files;
    if(files.length == 0)
    {
        return;
    }

    const file = files[0];
    const that = this;

    // 上传
    const form = new FormData();
    form.append('file', file);

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
      files = files.concat([{name: file.name, path: response.webPath}]);
      that.setState({files});
      $(that.fileControl).val('');

      onChange(files);
    });
  }

  getValue() {
    const {files} = this.state;
    return files;
  }

  removeImg = (files, file) => {
    this.setState({files: files.filter((fileCode) => {return (fileCode != file)})});
  }

  render() {
    const {title, count} = this.props;
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
              <div key={file.path} className={styles.imgDiv}>
                <div className={styles.preview}>{file.name}</div>
                <div className={styles.removeImg} onClick={() => {this.removeImg(files, file)}}></div>
              </div>
            )}
            <div style={{display: (!count || count > files.length) ? 'block': 'none'}} className={styles.uploadButton} onClick={() => $(this.fileControl).click()}>
              +
            </div>
          </div>
        </div>
        <input ref={(fileControl) => this.fileControl = fileControl} style={{display: 'none'}} type="file" defaultValue={""} onChange={this.onChooseFile.bind(this)} />
      </div>
    )
  }
}