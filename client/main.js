import './style.css'

import Alpine from 'alpinejs'
 
window.Alpine = Alpine

Alpine.data('fruitEater', function() {
  return {
    fruits : {
      apple: 0,
      pear : 0,
      banana : 0
    },
    eat(fruit) {
      this.fruits[fruit]++;
    }
  }
});

Alpine.start()
