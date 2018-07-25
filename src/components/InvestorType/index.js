import React, { Component, PropTypes } from 'react';
import {Modal, PickerView, WingBlank, WhiteSpace, Button, Checkbox, List} from 'antd-mobile';
import styles from './index.css';

const CheckboxItem = Checkbox.CheckboxItem;
const AgreeItem = Checkbox.AgreeItem;

class ActivityTypePicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      value: null
    }; 

  }

  showModal = () => (e) => {
    e.preventDefault(); // 修复 Android 上点击穿透
    this.setState({
      modal: true,
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
    const selectType = props.selectType;

    return (
      <div>
        <style type="text/css">
            {`
              .am-modal-button-group-v .am-modal-button {
                font-size:0.3rem !important;
              }
              .am-picker-col-item {
                font-size:0.34rem !important;
              }
            `}
          </style>
        <WingBlank>
          <Button onClick={this.showModal('modal')} style={{backgroundColor:'transparent', border:0, color:'white',marginTop:'10px', fontSize:'0.31rem'}}>{title}</Button>
        </WingBlank>
        <Modal style={{height:'7.2rem', overflow:'scroll', width:'5.0rem', border: '1px solid none'}}
          transparent
          maskClosable={true}
          visible={this.state.modal}
          onClose={this.onClose('modal')}
          footer={[{ text: '确定', onPress: () => {this.onClose()(); selectType(this.state.value)} }]}
        >
        <div className={styles.close}>
          <div className={styles.closeBtn} onClick={this.onClose('modal')}>关闭</div>
        </div>
        <PickerView 
          data={datas}
          value={this.state.value}
          cascade={false}
          onChange={this.onChange}
        />   
        </Modal> 
      </div>    
    );
  }
}

ActivityTypePicker.propTypes = {
  ActivityTypePicker: PropTypes.object,
};

// 关联model
export default ActivityTypePicker;
