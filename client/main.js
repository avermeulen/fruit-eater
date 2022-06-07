import './style.css'

import Alpine from 'alpinejs'
 
window.Alpine = Alpine

Alpine.data('fruitEater', function() {
  return {
    fruits : {
      apple: 19,
      pear : 7,
      banana : 4
    },
    eat(fruit) {
      this.fruits[fruit]++;
    }
  }
});

Alpine.start()
