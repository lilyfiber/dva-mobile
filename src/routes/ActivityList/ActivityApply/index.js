import React, { PropTypes } from 'react';
import { connect } from 'dva';
import {List, InputItem, WhiteSpace, Button, TextareaItem, Flex, Result, Icon} from 'antd-mobile';
import QueueAnim from 'rc-queue-anim';

import { createForm } from 'rc-form';
import HeaderGQT from "../../../components/HeaderGQT";
import styles from './activityapply.css';

/*let checkPass = {};
let data = {};
let messagePass = '联系信息';
let styleForm = {};
let that;

class ActivityApplyForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      isLoading: false,
      props
    };
  }

  componentWillMount() {
    this.requiredDecorator = this.props.form.getFieldDecorator(this.state.props.name, {
      rules: this.state.props.rule,
    });
  }

  render() {
    let errors;
    const { getFieldProps, getFieldError } = this.props.form;
    let divClassName;

    function errorPass(key,state){
      let message = state.props.message

      if(!message){
        message = '请填写' + state.props.label;
      }
      checkPass[key] = false;
      if(state.isLoading){
        state.isLoading = true;
        return (<span style={{marginLeft: '2.4rem',  height: '0.4rem',  color: 'red',  fontSize: '.34rem'}}>{message}</span>)
      }else{
        state.isLoading = true;
      }
    }

    if(this.props.type != 'textarea'){
      divClassName = 'addFormDiv';
    }else{
      divClassName = 'addFormDivByTextarea';
    }

    function getInputItem(state)
    {
      let props = state.props;
      let key = props.name;
      let description = props.label;
      let rule = props.rule;
      let message = props.message;
      let placeholder = props.placeholder;
      let result = getFieldProps(key);
      let inputStyle = props.inputStyle;
      let divStyle = props.divStyle;
      let type = props.type;
      let options = props.option;

      let requiredClassName;

      if(!type){
        type = 'text'
      }
      if(rule && rule.length && rule[0].required){
        requiredClassName = 'requiredIcom';
      }else{
        requiredClassName = 'noRequiredIcom';
      }

      data[key] = result.value;

      placeholder = placeholder ? placeholder: '请在此填写' + description;

      return (
        <div>
          <div>
            <div style={{display:'inline-block', width: '35%', float: 'left'}}>
              <div style={{height: '0.4rem', top:'0%'}}>
                <span className={styles.addFormLabel}>{description}</span>
                <span className={styles[requiredClassName]}>*</span>
              </div>
            </div>
            <div style={{display:'inline-block', width: '60%'}}>
              {
                 (
                    <input className={styles.addFormInput} placeholder={placeholder} {...getFieldProps(key, {
                      rules: rule,
                    })}/>
                  )
              }
            </div>
          </div>
          <div style={{}}>
            {
              (type == 'select') ?
              (
                checkPass[key] = true
              ) : (
                (errors = getFieldError(key)) ? errorPass(key,state) : (data[key] ? checkPass[key] = true : errorPass(key,state))
              )
              
            }
          </div>
        </div>
      )
    }

    return (
      <div className={styles[divClassName]}>
        {getInputItem(this.state)}
      </div>
    )
  }
}

const ActivityApplyFormElement = createForm()(ActivityApplyForm);

// class ImageForm extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       modalWindow: false,
//       props,
//       files: props.files
//     };
//   }
//   showModal = key => (e) => {
//     console.log('open model');
//     // 现象：如果弹出的弹框上的 x 按钮的位置、和手指点击 button 时所在的位置「重叠」起来，
//     // 会触发 x 按钮的点击事件而导致关闭弹框 (注：弹框上的取消/确定等按钮遇到同样情况也会如此)
//     e.preventDefault(); // 修复 Android 上点击穿透
//     this.setState({
//       [key]: true,
//     });
//   }
  
//   onClose = key => () => {
//     this.setState({
//       [key]: false,
//     });
//     console.log('close model state:',this.state);
//   }
//   render() {
//     console.log('render model state:',this.state);
//     let that = this;
//     let pictureFiles = this.state.props.files;

//     function onChangeModel(files, type, index){
//       // e.preventDefault(); // 修复 Android 上点击穿透
//       that.setState({
//         ['modalWindow']: true,
//         files: files
//       });
//       console.log(that.state);
//       console.log(files);
//       pictureFiles = files;
//       that.state.props.onChange(files, type, index);
//     }

//     console.log('pictureFiles:',pictureFiles);

    
//   }
// }


const ActivityApply = ({dispatch, activityapply}) => {
  console.log(activityapply);
  data.logo = (activityapply.fileLogo && activityapply.fileLogo.length) ? activityapply.fileLogo[0].url : '';
  const getSelectValue = (key) => {
    let selectCount = document.getElementById(key + "select").options;
    for(let i = 0 ; i<selectCount.length;i++){
      if(selectCount[i].selected){
        data[key] = selectCount[i].value;
      }
    }
  }

  
  const toApply = () => {
    
    console.log('data:',data);
    let allPass = true;
    for(let i in checkPass){
      allPass = allPass && checkPass[i];
    }
    console.log('checkPass:',checkPass);
    if(allPass){
      dispatch({type: 'activityapply/success', payload: data});
    }else{
        alert('请正确完整填写信息')
    }
  }
  //返回
  const toBack = () => {
  }

  if (activityapply.success) {
    return (
      <div>
        <HeaderGQT />
        <div className={styles.right}>
          <img  src={require("../../../assets/对号.jpg")} />
        </div>
        <div className={styles.tip}>
          已确认参会
        </div>
        <div className={styles.content}>
          <p className={styles.time}>{activityapply.data.actTime}</p>
          <p className={styles.place}>{activityapply.data.addr}</p>
        </div>
        <div className={styles.actSign} onClick={toBack}>返回</div>
      </div>
    )
  }

  return (
    <div style={{height: 800}}>
      <HeaderGQT />
      <div className={styles.text}>
        <List renderHeader={() => '联系信息'}>
          <ActivityApplyFormElement name={'contact'} label={'姓名'} rule={[{required: true}]}/>
          <ActivityApplyFormElement name={'phone'} label={'手机'} rule={[{required: true}, {pattern: /^1[34578]\d{9}$/}]} message={"请填正确手机号"}/>
          <ActivityApplyFormElement name={'company'} label={'单位'} />
          <ActivityApplyFormElement name={'job'} label={'职位'} />
        </List>
      </div>
     <div className={styles.content}>
        <p className={styles.time}>{activityapply.data.actTime}</p>
        <p className={styles.place}>{activityapply.data.addr}</p>
      </div>
      <div className={styles.actSign} onClick={toApply}>活动报名</div>
    </div>
  )
}

ActivityApply.propTypes = {
    dispatch: PropTypes.func,
    activityapply: PropTypes.object,
};

export default connect(({activityapply}) => ({activityapply}))(ActivityApply);*/
let checkPass = {};
let data = {};
class ActivityApplyForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      props
    };
  }

  componentWillMount() {
    this.requiredDecorator = this.props.form.getFieldDecorator(this.state.props.name, {
      rules: this.state.props.rule,
    });
  }


  render() {
    let errors;
    const { getFieldProps, getFieldError } = this.props.form;

    // 错误信息提示
    function errorPass(key,placeHolder){
      checkPass[key] = false;
      return (<span style={{color:"red"}}>{placeHolder}</span>)
    }
    // 获取输入框的值
    function getInputItem(key, description, rule, placeHolder)
    {
      let result = getFieldProps(key);
      data[key] = result.value;
      placeHolder = placeHolder ? placeHolder: description;
      
      return (
        <div>
          <InputItem
            clear
            autoFocus
            {...getFieldProps(key, {
            onChange(){this.submit},
            rules: rule,
          })}>
            <span className={styles.size}>{description}</span>{rule[0] && rule[0].required? <span style={{color:"red"}}>*</span>:<span></span>}
          </InputItem>
          {(errors = getFieldError(key)) ? errorPass(key,placeHolder) : (result.value ? checkPass[key] = true : checkPass[key] = false)}
        </div>
      )
    }

    return (
      <div>
        {getInputItem(this.state.props.name, this.state.props.label, this.state.props.rule, this.state.props.message)}
      </div>
    )
  }
}

const ActivityApplyFormElement = createForm()(ActivityApplyForm);

const ActivityApply = ({dispatch, activityapply}) => {
  const actId = activityapply.actId;

  const dataList = [
    {name:'name', label:'姓名', rule:[{required: true}], message:"姓名是必填字段"},
    {name:'phone', label:'手机', rule:[{required: true}, {pattern: /^1[34578]\d{9}$/}], message:"请填正确手机号"},
    {name:'company', label:'单位', rule:[{required: true}] },
    {name:'job', label:'职位', rule:[{required: true}]},
    {name:'description', label:'描述', rule:[]},
    {name:'mobile', label:'电话', rule:[]},
    {name:'position', label:'位置', rule:[]},
    {name:'openId', label:'当前用户', rule:[]},
    {name:'unit', label:'单位', rule:[]},
  ];

  // 去申请
  const toApply = () => {
    let allPass = true;
    for(let i in checkPass){
      allPass = allPass && checkPass["name"]&& checkPass['phone']&& checkPass['company']&& checkPass['job'];
    }
    if(allPass){
      dispatch({type: 'activityapply/addActJoin', payload: data});
    }else{
      alert('请正确完整填写信息')
    }
   
  }
  // 返回
  const toBack = () => {
    history.back(-1);
  }

  if (activityapply.success) {
    return (
      <div>
        <HeaderGQT />
        <div className={styles.right}>
          <img  src={require("../../../assets/对号.jpg")} />
        </div>
        <div className={styles.tip}>
          已确认参会
        </div>
        <div className={styles.content}>
          <p className={styles.time}></p>
          <p className={styles.place}></p>
        </div>
        <div className={styles.actSign} onClick={toBack}>返回</div>
      </div>
    )
  }
  return (
    <div>
      <HeaderGQT />
      <QueueAnim key="activityApply">
        <div>
          <img className={styles.img}/>
          <div className={styles.input}>
            <List className={styles.list} renderHeader={() => '联系信息'}>
              {dataList.map(list => <ActivityApplyFormElement key={list.name} name={list.name} label={list.label} rule={list.rule} message={list.message}/>)}
            </List>
          </div>
          <div className={styles.content}>
            <div className={styles.time}><ActivityApplyFormElement name={'time'} key={'time'} label={'时间'} rule={[]} /></div>
            <div className={styles.place}><ActivityApplyFormElement name={'address'} key={'address'} label={'地点'} rule={[]} /></div>
          </div>
        </div>
      </QueueAnim>
    </div>
  )
}

ActivityApply.propTypes = {
    dispatch: PropTypes.func,
    activityapply: PropTypes.object,
};

export default connect(({activityapply}) => ({activityapply}))(ActivityApply);