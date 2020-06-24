import React, { Component } from 'react';
import { UserService } from '../utils/user-service';
// import { UserService } from '../utils/user-service';
// import { Form, Input, Button } from 'antd';

class Profile extends Component {

  loggedInUser;
  errors;

  async componentDidMount() {
    try {
      const user = await UserService.getUserInfo();
      if (user) {
        this.loggedInUser = user;
      } else {
        const token = await UserService.getToken();
        if (token) {
          this.loggedInUser = await UserService.getUserInfo();
        }
      }
    } catch (e) {
      this.errors = e;
    }
  }

  logIn() {
    // TODO get user / pw from form
    // UserService.logIn()
  }

  render() {
    return (
      <div>
        <h1>Profile page</h1>
      </div>
    );
  }
}

export default Profile;
