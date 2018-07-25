import styles from './tags.css';
import { Tag } from 'antd-mobile';

export default class Tags extends React.Component {
  propTypes: {
    onChange: PropTypes.func,
    value: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.state = {
      selecteds: props.value ? props.value: []
    };

    this.getValue = this.getValue.bind(this);
  }

  componentWillUpdate(nextProps) {
    const oldValue = this.state.selecteds;
    if(nextProps.value && nextProps.value != oldValue)
    {
      this.setState({selecteds: nextProps.value ? nextProps.value: []});
    }
  }

  getValue() {
    const {selecteds} = this.state;
    return selecteds;
  }

  render() {
    const {data, title, onChange} = this.props;
    const {selecteds} = this.state;

    const onChangeTag = (option, selected) => {
      if(selected)
      {
        selecteds.push(option)
      }
      else
      {
        selecteds.splice(selecteds.indexOf(option), 1);
      }

      onChange(selecteds);
    }

    return (
      <div className={styles.choice}>
        <h4 className={styles.titleExplain}>{title}</h4>
        {
          data.map((option) => 
            <Tag key={option} selected={selecteds.indexOf(option)!==-1} onChange={(selected) => {onChangeTag(option, selected)}} className={styles.individual}>{option}</Tag>
          )
        }
      </div>
    )
  }
}