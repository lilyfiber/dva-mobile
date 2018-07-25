import React, { Component, PropTypes } from 'react';
import {Modal, PickerView, WingBlank, WhiteSpace, Button, Checkbox, List} from 'antd-mobile';
import styles from './index.css';

const CheckboxItem = Checkbox.CheckboxItem;
const AgreeItem = Checkbox.AgreeItem;

class ProjectScope extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      value: null,
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
    const selectScope = props.selectScope;

    return (
      <div>
        <WingBlank>
          <Button onClick={this.showModal('modal')} style={{backgroundColor:'transparent', border:0, color:'white',marginTop:'10px', fontSize:'0.31rem'}}>{title}</Button>
        </WingBlank>
        <Modal 
          transparent
          maskClosable={true}
          visible={this.state.modal}
          onClose={this.onClose('modal')}
          footer={[{ text: '确定', onPress: () => {this.onClose()(); selectScope(this.state.value)} }]}
        >
          <div className={styles.close}>
            <div className={styles.closeBtn} onClick={this.onClose()}>关闭</div>
          </div>
          <PickerView style={{height:'100px'}}
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

ProjectScope.propTypes = {
  ProjectScope: PropTypes.object,
};

// 关联model
export default ProjectScope;
