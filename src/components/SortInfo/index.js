import React, { Component, PropTypes } from 'react';
import {Modal, PickerView, WingBlank, WhiteSpace, Button, Checkbox, List} from 'antd-mobile';
import styles from './style.css';

class SortInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      sValue: null, 
      cols:1
    };  
  }
  
  showModal = key => (e) => {
    e.preventDefault(); // 修复 Android 上点击穿透
    this.setState({
      [key]: true,
    });
  }

  onClose = () => () => {  
    this.setState({
      modal: false,
    });
  }
  
  onChange = (value) => {
    this.setState({
      value,
    });
  };
  render() {
    const props = this.props;
    const datas = props.content;
    const title = props.title;
    const sortTime = props.sortTime;

    return (
      <div>
        <WingBlank>
          <Button onClick={this.showModal('modal')} style={{backgroundColor:'transparent', border:0, color:'white', marginTop:'10px', fontSize:'0.31rem'}}>{title}</Button>
        </WingBlank>
        <Modal
          transparent
          maskClosable={true}
          visible={this.state.modal}
          onClose={this.onClose('modal')}
          footer={[{ text: '确定', onPress: () => {this.onClose('modal')(); sortTime(this.state.sValue)} }]}
        >
          <div className={styles.close}>
            <div className={styles.closeBtn} onClick={this.onClose('modal')}>关闭</div>
          </div>
          <PickerView
            data={datas}
            value={this.state.sValue}
            cascade={false}
            onChange={v =>this.setState({sValue: v})}
          />
        </Modal> 
      </div>    
    );
  }
}

SortInfo.propTypes = {
  SortInfo: PropTypes.object,
};

// 关联model
export default SortInfo;