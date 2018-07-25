import React, { PropTypes } from 'react';
import { connect } from 'dva';
import { TabBar, Icon, ListView, Flex } from 'antd-mobile';
import styles from './menu.css';

class Menu extends React.Component
{
  constructor(props) {
    super(props);
    this.handleScroll = this.handleScroll.bind(this);
    this.state = {
      showMenu: true
    }
  }

  handleScroll(e){
    if(!e || !e.target || !e.target.scrollingElement)
    {
      return;
    }

    const element = e.target.scrollingElement;
    if(element.scrollHeight == 0)
    {
      return;
    }

    const topRate = (element.scrollTop) / element.scrollHeight;
    const bottomRate = (element.scrollTop + element.offsetHeight) / element.scrollHeight;

    if(topRate == 0.0 || bottomRate == 1.0)
    {
      this.setState({showMenu: true});
    }
    else
    {
      this.setState({showMenu: false});
    }
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  render() {
    const {dispatch, menu, children} = this.props;
    const {showMenu} = this.state;

    const menuItems = [
      {icon: String.fromCharCode(0xe904), label: "首页", url: "/"},
      {icon: String.fromCharCode(0xe902), label: "找空间", url: "/space"},
      {icon: String.fromCharCode(0xe903), label: "找活动", url: "/activity"},
      {icon: String.fromCharCode(0xe901), label: "找投资", url: "/investor"},
      {icon: String.fromCharCode(0xe900), label: "找项目", url: "/project"},
    ];

    const url = (menu.selectedTab.indexOf('/') === 0) ? menu.selectedTab: '/' + menu.selectedTab;
    const selectedMenuItem = menuItems.find(menuItem => menuItem.url == url);
    menuItems.splice(menuItems.indexOf(selectedMenuItem), 1);
    
    const jump = (place) => {
      dispatch({type: "menu/goto", payload: place});
    }

    return (
      <div className={styles.page}>
        <div className={styles.pageContent}>
          {children}
        </div>
        {
          showMenu ?
            <div className={styles.menuContainer}>
              <div className={styles.menuButtons}>
                <div className={styles.menuButton} style={{left: '0'}} onClick={() => jump(menuItems[0].url)}>
                  <div className={styles.menuItem}>
                    <span className={styles.icon}>
                      {menuItems[0].icon}
                    </span>
                    <span className={styles.label}>
                      {menuItems[0].label}
                    </span>
                  </div>
                </div>
                <div className={styles.menuButton} style={{left: '22%'}} onClick={() => jump(menuItems[1].url)}>
                  <div className={styles.menuItem}>
                    <span className={styles.icon}>
                      {menuItems[1].icon}
                    </span>
                    <span className={styles.label}>
                      {menuItems[1].label}
                    </span>
                  </div>
                </div>
                <div className={styles.menuButton} style={{right: '22%'}} onClick={() => jump(menuItems[2].url)}>
                  <div className={styles.menuItem}>
                    <span className={styles.icon}>
                      {menuItems[2].icon}
                    </span>
                    <span className={styles.label}>
                      {menuItems[2].label}
                    </span>
                  </div>
                </div>
                <div className={styles.menuButton} style={{right: "0"}} onClick={() => jump(menuItems[3].url)}>
                  <div className={styles.menuItem}>
                    <span className={styles.icon}>
                      {menuItems[3].icon}
                    </span>
                    <span className={styles.label}>
                      {menuItems[3].label}
                    </span>
                  </div>
                </div>
                <div className={styles.currentButton}>
                  <div className={styles.menuCircle}>
                  </div>
                  <div className={styles.menuCircleMask}>
                      <div className={styles.menuItemMain} style={{color: "#00c2ff"}} onClick={() => jump(selectedMenuItem.url)}>
                        <span className={styles.iconMain}>
                          {selectedMenuItem.icon}
                        </span>
                        <span className={styles.labelMain}>
                          {selectedMenuItem.label}
                        </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          :null
        }
      </div>
    );
  }
}

Menu.propTypes = {
  dispatch: PropTypes.func,
  menu: PropTypes.object,
};

export default connect(({menu}) => ({menu}))(Menu);