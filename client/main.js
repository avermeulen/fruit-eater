import './style.css'

import Alpine from 'alpinejs'
import axios from 'axios';
 
window.Alpine = Alpine

const URL_BASE = import.meta.env.VITE_SERVER_URL;

Alpine.data('fruitEater', function() {
  return {
    init() {

      const url = `${URL_BASE}/api/fruits`

      axios
        .get(url)
        .then((result) => {
          console.log(result.data)
          this.fruits = {...result.data.fruits}
        })
    },

    fruits : {
      apple: 0,
      pear : 0,
      banana : 0
    },
    eat(fruit) {

      const url = `${URL_BASE}/api/fruits/${fruit}`
      axios
        .post(url)
        .then(() => this.fruits[fruit]++)
    }
  }
});

Alpine.start()
