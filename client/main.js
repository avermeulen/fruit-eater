import './style.css'

import Alpine from 'alpinejs';
import axios from 'axios';
import FruitStore from './fruit-store';

const URL_BASE = import.meta.env.VITE_SERVER_URL;

function updateAxiosJWToken() {
  const token = localStorage.getItem('token')
  axios.defaults.headers.common = { 'Authorization': `bearer ${token}` }
}

updateAxiosJWToken();

window.Alpine = Alpine

Alpine.store('fruitStore', FruitStore);

Alpine.data('fruitEater', function () {
  return {

    init() {
      this.tryLogin()
    },
    tryLogin() {
      if (localStorage.getItem('token')) {

          const fruitStore = Alpine.store('fruitStore');

          fruitStore.loadFruits()
          .then(() => {
            if (Object.keys(fruitStore.fruits).length > 0) {
                this.logged_in = true;
            } else {
              this.logged_in = false;
            }
          })
      }
    },
    register: false,
    logged_in: false,
    registration_message: '',
    login_message: '',
    username: '',
    password: '',
    login() {

      if (!this.username && !this.password) {
        this.tryLogin()
      } else if (this.username && this.password) {
        const url = `${URL_BASE}/api/login`
        axios.post(url, {
          username: this.username,
          password: this.password
        }).then((result) => {

            // this.registration_message = "New user created!"
            const { data } = result.data;
            if (data && data.token) {
              localStorage.setItem('token', data.token);
              updateAxiosJWToken();
              const fruitStore = Alpine.store('fruitStore');
              fruitStore
                .loadFruits()
                .then(() => {
                  this.logged_in = true;
                  this.clearCredentials();
                })
            }
          })
          .catch(err => alert(err))
      }
    },

    logout(){
      this.logged_in=false;
      localStorage.removeItem('token');
    },

    clearCredentials() {
      this.username = '';
      this.password = '';
    },


    registerUser() {

      if (this.username && this.password) {

        const url = `${URL_BASE}/api/user`

        axios.post(url, {
          username: this.username,
          password: this.password
        })
          .then(() => {
            this.registration_message = "New user created!"

            setTimeout(() => {
              this.registration_message = "New user created!";
              this.register = false;
            }, 3000);
          })
          .catch(err => alert(err))
      }
    }
  }
});

Alpine.start()
