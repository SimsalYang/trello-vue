import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 将消息提示挂在到全局
import VMessage from './components/VMessage/VMessage';
import '@/assets/css/css.css'

Vue.config.productionTip = false

// 创建一个全局的属性
Vue.prototype.$message = VMessage;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
