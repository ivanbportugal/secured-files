import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { UnorderedListOutlined, UserOutlined, FileDoneOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';

import Profile from './pages/profile';
import Files from './pages/files';
import File from './pages/file';

const { Header, Content, Footer, Sider } = Layout;

class RouterApp extends Component {

  state = {
    collapsed: false,
  };

  onCollapse = (collapsed) => {
    this.setState({ collapsed });
  }
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  render() {

    let menuIcon;
    if (this.state.collapsed) {
      menuIcon = <MenuUnfoldOutlined onClick={this.toggle} />;
    } else {
      menuIcon = <MenuFoldOutlined onClick={this.toggle} />;
    }

    return (
      <Router>
        <Layout style={{ minHeight: '100vh' }}>

          <Sider
            collapsible
            collapsed={this.state.collapsed}
            onCollapse={this.onCollapse}>
            <div className="logo" />
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
              <Menu.Item key="1">
                <UnorderedListOutlined />
                <span>Files</span>
                <Link to="/" />
              </Menu.Item>
              <Menu.Item key="2">
                <UserOutlined />
                <span>Profile</span>
                <Link to="/profile" />
              </Menu.Item>
              <Menu.Item key="3">
                <FileDoneOutlined />
                <span>File</span>
                <Link to="/file" />
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout>
            <Header style={{ background: '#fff', padding: 0, paddingLeft: 16 }}>
              {menuIcon}
              &nbsp; Fileicious
            </Header>
            <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
              <Route exact path="/" component={Files} />
              <Route path="/profile" component={Profile} />
              <Route path="/file" component={File} />
            </Content>
            <Footer style={{ textAlign: 'center' }}>
              Ant Design ©2016 Created by Ant UED
            </Footer>
          </Layout>

        </Layout>
      </Router>
    );
  }
}

export default RouterApp;