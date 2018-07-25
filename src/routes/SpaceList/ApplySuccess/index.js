import React, { PropTypes } from 'react';
import { connect } from 'dva';
import HeaderGQT from "../../../components/HeaderGQT";
import {List, InputItem, TextareaItem, WhiteSpace, Button, Flex , ImagePicker} from 'antd-mobile';
import QueueAnim from 'rc-queue-anim';
import ImageUploader from "../../../components/ImageUploader";
import buildForm from "../../../components/FormBuilder";
import {Icon, Result} from 'antd-mobile';
import style from './success.css';

const ApplySuccess = ({dispatch, applySpace}) => {
  const toBack = () =>{
    dispatch({type:'applySuccess/toBack'})
  }

  return (
    <div>
      <style type="text/css">
      {`
        .am-result .am-result-pic{
          width: 1.2rem;
          height: 1.2rem;
          margin: 0 auto;
          line-height: 1.2rem;
          background-size: 1.2rem 1.2rem;
        }

        .am-result .am-result-title{
          margin-top: 0.3rem !important;
        }
      `}
      </style>
      <div className={style.control} key="applySuccess">
        <Result
            img={<Icon type="check-circle" className={style.icon} style={{ fill: '#1F90E6' }} />}
            title="入驻申请提交成功"
            message="若审核通过会与您联系" />
      </div>
      <div className={style.floatLayer}>
        <Button className={style.backText} onClick={toBack}>返回</Button>
      </div>
    </div>
  );
}

ApplySuccess.propTypes = {
  dispatch: PropTypes.func,
  ApplySuccess: PropTypes.object,
};

export default connect(({applySpace}) => ({applySpace}))(ApplySuccess);