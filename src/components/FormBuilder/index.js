import { List } from 'antd-mobile';
import FormInput from '../FormInput';
import { createForm } from 'rc-form';
import styles from './styles.css';

const buildForm = (blocks, propsValue = "value") => 
  createForm({mapPropsToFields: function(props){
    const valueMap = props[propsValue];
    if(!valueMap)
    {
      return {};
    }

    const result = {};

    blocks.forEach((block) => {
      block.fields.forEach((field) => {
        result[field.name] = {value: valueMap[field.name]};
      });
    });
    
    return result;
  }})(
    ({form}) => {
      return (
        <div>
        {
          blocks.map(block => 
            <List key={block.section} renderHeader={() => <div><span className={styles.title}>{block.section}</span><span className={styles.subTitle}>{block.subTitle}</span></div>}>
              {(block.fields && (block.fields.length > 0)) ? block.fields.map(field => <FormInput key={`${block.section}_${field.name}`} form={form} {...field} />) : null}
            </List>
          )
        }
      </div>
    )}
      
  )

export default buildForm;