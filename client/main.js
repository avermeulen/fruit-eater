import './style.css'

import Alpine from 'alpinejs'
import axios from 'axios';

// axios.defaults.baseURL = 'http://localhost:1010/

function updateAxiosJWToken() {
  const token = localStorage.getItem('token')
  axios.defaults.headers.common = { 'Authorization': `bearer ${token}` }
}

updateAxiosJWToken();


window.Alpine = Alpine

const URL_BASE = import.meta.env.VITE_SERVER_URL;

Alpine.data('fruitEater', function () {
  return {

    init() {
      this.tryLogin()
    },
    tryLogin() {
      if (localStorage.getItem('token')) {
        this
          .loadFruits()
          .then(() => {
            if (Object.keys(this.fruits).length > 0) {
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
        // this.logged_in = true;
        const url = `${URL_BASE}/api/login`

        axios.post(url, {
          username: this.username,
          password: this.password
        })
          .then((result) => {

            // this.registration_message = "New user created!"
            const { data } = result.data;
            if (data && data.token) {
              localStorage.setItem('token', data.token);
              updateAxiosJWToken();
              this.loadFruits()
              this.logged_in = true;
              this.clearCredentials();
            }
          })
          .catch(err => alert(err))

      }
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

    },

    loadFruits() {

      const url = `${URL_BASE}/api/fruits`

      return axios
        .get(url)
        .then((result) => {
          console.log(result.data)

          const fruits = result.data.fruits.reduce((obj, fruit) => {
            obj[fruit.fruit_name] = fruit.counter;
            return obj;
          }, {})

          this.fruits = { ...fruits }
        })
    },

    fruits: {
      apple: 0,
      pear: 0,
      banana: 0
    },
    eat(fruit) {

      const url = `${URL_BASE}/api/eat/`
      axios
        .post(url, { fruit })
        .then(() => this.fruits[fruit]++)
    }
  }
});

Alpine.start()
