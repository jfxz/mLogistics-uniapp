import Vue from 'vue'
import App from './App'
import store from './store'
Vue.config.productionTip = false
Vue.prototype.$store = store
App.mpType = 'app'
export const AUTH_CLIENT_ID = 'toc'
export const AUTH_CLIENT_SECRET = 'toc'
import base64 from '@/common/crypto-js/base64.js'

Vue.prototype.$message = (message) => {
  uni.showToast({
  	title: message,
  	duration: 2000,
  	icon:'none'
  })
}

// Vue.prototype.$loginOut = () => {
// 	uni.request({
// 		 url: 'http://10.1.16.24:8080/sso/oauth/token',
// 		method: 'DELETE',
// 		header: {
// 			'Authorization': 'Bearer ' + uni.getStorageSync('access_token')
// 		},
// 	})
// }
Vue.prototype.$loading = (title) => {
  uni.showLoading({
  	title: title || '加载中',
		mask: true
  })
}
const app = new Vue({
    ...App
})
app.$mount()
