import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import router from './router'
import uweb from 'vue-uweb'

import VueKonva from 'vue-konva';

Vue.use(VueKonva)

Vue.config.productionTip = false

Vue.use(uweb, '1278161794')

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
