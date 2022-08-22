import axios from 'axios';

const URL_BASE = import.meta.env.VITE_SERVER_URL;

export default {
	loadFruits() {

	  const url = `${URL_BASE}/api/fruits`
  
	  return axios
		.get(url)
		.then((result) => {
  
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