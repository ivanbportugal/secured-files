
import axios from 'axios';

class UserServiceController {
  loggedInUser;
  userUrl = '/api/login';

  // TODO check session storage

  

  logIn(username, password) {
    return axios.post(this.userUrl, {
      username: username,
      password: password
    }).then(newUser => {
      this.loggedInUser = newUser;
      this.setUpInterceptor();
    });
  }

  setUpInterceptor() {
    // TODO set up axios bearer token header
    axios.interceptors.request.use(function (config) {
      // Do something before request is sent
      return config;
    }, function (error) {
      // Do something with request error
      return Promise.reject(error);
    });
  }
}

export const UserService = new UserServiceController();