import {InputItem, Picker, TextareaItem, List} from 'antd-mobile';
import ImageUploaderWechat from '../ImageUploaderWechat';
import ImageUploader from '../ImageUploader';
import FileUploader from '../FileUploader';
import Tags from '../Tags';
import styles from './styles.css';
import { isWeiXin } from '../../utils/wechat.js';

const getImageUploader = (label, props, size, options) => {
  /*
  let inWeiXin = isWeiXin();
  if(inWeiXin)
  {
    return (
      <ImageUploaderWechat 
        count={options.count}
        title={<span>{label}<span className={styles.required} style={{display: options.required ? 'inline': 'none'}}>*</span></span>}
        {...props}
        size={size} />
    );
  }
  */

  return (
    <ImageUploader 
      count={options.count}
      title={<span>{label}<span className={styles.required} style={{display: options.required ? 'inline': 'none'}}>*</span></span>}
      {...props}
      size={size} />
  );
};

const FormItem = ({name, label, form, ...options}) => {
  // 根据字段配置，自动判断组件类型
  let type = options.type;

  let size = null;
  if(!type)
  {
    if(options.options)
    {
      type = "select";
    }
    else if(options.size)
    {
      type = "image";
      size = options.size;
    }
    else
    {
      type = 'text';
    }
  }

  if(!options)
  {
    throw new Error('输入组件初始化失败!');
  }

  // 默认空规则
  const rules = options.rules ? options.rules.concat(): [];

  // 增加必要判定及提示
  if(options.required)
  {
    switch(type)
    {
      case 'text':
      case 'textarea':
        rules.push({required: true, message: `${label} 必须填写`});
        break;
      case 'select':
        rules.push({required: true, message: `${label} 必须选择`});
        break;
      case 'image':
        rules.push({required: true, message: `${label} 必须上传至少一张图片`});
        break;
      case 'file':
        rules.push({required: true, message: `${label} 必须上传至少一份文件`});
        break;
    }
  }

  // 获取表单叠加的动态属性
  const props = form.getFieldProps(name, {validateTrigger: 'onBlur', rules, onChange: options.onChange});

  // 获取表单异常
  const error = form.getFieldError(name);

  // 根据类型统一配置字段
  switch(type)
  {
    case 'number':
    case 'text':
      return (
        <InputItem
          {...props}
          clear
          type={type}
          disabled={options.disabled}
          placeholder={options.placeholder}
          autoFocus={options.autoFocus}
          extra={error || options.unit}
          error={error ? true: false}
          className={type}
        >
          {label}
          <span className={styles.required} style={{display: options.required ? 'inline': 'none'}}>*</span>
        </InputItem>
      );
    case 'select':
      if(options.options && options.options.length && typeof options.options[0] == 'string'){
        options.options = options.options.map(option => ({label: option, value: option}));
      }

      return (
        <div className={styles.inputBlock}>
          <Picker
            {...props}
            disabled={options.disabled}
            extra={options.placeholder}
            title={options.title ? options.title: label}
            data={options.options ? options.options : []} 
            cols={options.cols ? options.cols: 1}
            style={{"paddingTop": "0.2rem"}}
          >
            <List.Item arrow="horizontal">
              {label}
              <span className={styles.required} style={{display: options.required ? 'inline': 'none'}}>*</span>
            </List.Item>
          </Picker>
          <div className={styles.tips2} style={{"display": (error ? "block": "none")}}>{error}</div>
        </div>
      );
    case 'textarea':
      return (
        <div className={styles.inputBlock}>
          <TextareaItem
            {...props}
            clear
            title={<span>{label}<span className={styles.required} style={{display: options.required ? 'inline': 'none'}}>*</span></span>}
            count={options.count}
            autoFocus={options.autoFocus}
            autoHeight
            disabled={options.disabled}
            rows={options.rows}
            error={error ? true: false} />
          <div className={styles.tips} style={{display: (error ? "block": "none")}}>{error}</div>
        </div>
      );
    case 'image':
      return (
        <div className={styles.inputBlock}>
          {getImageUploader(label, props, size, options)}
          <div className={styles.tips} style={{display: (error ? "block": "none")}}>{error}</div>
        </div>
      );
    case 'file':
      return (
        <div className={styles.inputBlock}>
          <FileUploader 
            count={options.count}
            title={<span>{label}<span className={styles.required} style={{display: options.required ? 'inline': 'none'}}>*</span></span>}
            {...props}
            size={size} />
          <div className={styles.tips} style={{display: (error ? "block": "none")}}>{error}</div>
        </div>

      );
    case 'tags':
      return (
        <div className={styles.inputBlock}>
          <Tags 
            data={options.options}
            title={<span>{label}<span className={styles.required} style={{display: options.required ? 'inline': 'none'}}>*</span></span>}
            {...props}
            />
          <div className={styles.tips} style={{display: (error ? "block": "none")}}>{error}</div>
        </div>
      );
    default:
      return null;
  }
}

export default FormItem;