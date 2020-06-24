
import axios from 'axios';

class UserServiceController {
  loggedInUser;
  loginUrl = '/api/login';
  userUrl = '/api/v1/user';

  constructor() {
    this.setUpInterceptor();
  }

  getToken() {
    return localStorage.getItem('TOKEN');
  }

  setToken(token) {
    localStorage.setItem('TOKEN', token);
  }

  logIn(username, password) {
    return axios.post(this.loginUrl, {
      username: username,
      password: password
    }).then(token => {
      this.setToken(token);
      return this.getUserInfo();
    });
  }

  getUserInfo() {
    if (this.loggedInUser) {
      return Promise.resolve(this.loggedInUser);
    } else {
      return axios.get(this.userUrl).then(newUser => {
        this.loggedInUser = newUser;
        return this.loggedInUser;
      });
    }
  }

  setUpInterceptor() {
    // set up axios bearer token header
    axios.interceptors.request.use(function (config) {
      const token = this.getToken();
      config.headers.Authorization =  token ? `Bearer ${token}` : '';
      return config;
    }, function (error) {
      // Do something with request error
      return Promise.reject(error);
    });
  }
}

export const UserService = new UserServiceController();