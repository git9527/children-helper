import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import router from './router'
import ba from 'vue-ba'

import VueKonva from 'vue-konva';

Vue.use(VueKonva)

Vue.config.productionTip = false

Vue.use(ba, 'd230bcea17546ecfcacf1b56c51cc8d8')

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
