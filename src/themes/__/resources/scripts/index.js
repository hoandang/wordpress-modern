import './foo.js';

import Vue from 'vue';
import Foo from './components/Foo.vue';

Vue.config.productionTip = false;

new Vue({
  el: '#app',
  components: { Foo }
});
