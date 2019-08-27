import Vue from 'vue'
import App from './App.vue'
import write from 'O_PATH/test-path-replace-loader'

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')

write()
