import Vue from 'vue'
import App from './App'
import Mutils from './utils'

Vue.config.productionTip = false;
Vue.prototype.$mutils = Mutils;
App.mpType = 'app'

const app = new Vue(App)
app.$mount()
