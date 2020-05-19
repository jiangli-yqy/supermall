import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 导入toast插件
import toast from 'components/common/toast'

Vue.config.productionTip = false

// 添加时间总线原型
Vue.prototype.$bus = new Vue()

// 安装toast插件
Vue.use(toast)
// 相当于执行了obj的install函数

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
