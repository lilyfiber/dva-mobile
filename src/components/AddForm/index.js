import styles from './addForm.css';

let data = {};
export default class AddForm extends React.Component {

  constructor(props) {
    super(props);
    // console.log(props);
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
    // console.log(this.props.form,'a')
    const { getFieldProps, getFieldError } = this.props.form;

    function errorPass(key,state){
      checkPass[key] = false;
      if(state.isLoading){
        state.isLoading = true;
        return (<span style={{color:"red"}}>{state.props.message}</span>)
      }else{
        state.isLoading = true;
      }
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
      data[key] = result.value;

      message = message ? message: description;
      placeholder = placeholder ? placeholder: '请在此填写' + description;

      // return (<InputItem
      //   clear
      //   message={description}
      //   autoFocus
      //   error={getFieldError(key) ? true: false}
      //   extra={getFieldError(key) ? getFieldError(key).join(","): ''}
      //   {...getFieldProps(key, {rules: [rule]})}
      // >{description}<span style={{color:"red"}}>*</span></InputItem>);

      return (
        <div style={{width:"100%"}}>
          <div style={{height:'0.9rem'}}>
            <span style={{height:'0.4rem', lineHeight:'0.9rem', color:"red", fontSize: ".34rem"}}>*</span>
            <span style={{height:'0.4rem', lineHeight:'0.9rem', width:'30%', display:'inline-block', fontSize: ".34rem"}}>{description}</span>
            <input style={{height:'0.4rem', lineHeight:'0.9rem', border:'0', width: '58%', fontSize: ".34rem"}} placeholder={placeholder} {...getFieldProps(key, {
              rules: rule,
            })}/>
          </div>
          {(errors = getFieldError(key)) ? errorPass(key,state) : (data[key] ? checkPass[key] = true : errorPass(key,state))}
        </div>
      )
    }

    return (
      <div>
        {getInputItem(this.state)}
      </div>
    )
  }
}